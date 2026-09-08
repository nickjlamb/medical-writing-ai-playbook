// Build the playbook into a single PDF.
// Reads docs.json for navigation order, transforms MDX components to HTML,
// then renders the assembled document with Puppeteer.

import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
// Filename deliberately carries no version number: the download URL
// (releases/download/latest/...) must stay stable across releases.
// The version appears on the cover and in the PDF title metadata.

// ---------- 0. PDF plan ----------
//
// The PDF is built from the same MDX as the site, but it is a different
// artefact: linear, printed, read offline. These rules describe where the
// PDF deliberately diverges from docs.json navigation. The site is untouched.

// Two editions are built from the same source:
//   playbook  — the download (default): principles in brief, one-page
//               workflow cards, the checklists and the tool guide (~40 pages)
//   complete  — the complete reference: every page of the site (~170 pages)
// Usage: node scripts/build-pdf.mjs [--edition playbook|complete]

const EDITION = (() => {
  const i = process.argv.indexOf('--edition');
  const e = i === -1 ? 'playbook' : process.argv[i + 1];
  if (!['playbook', 'complete'].includes(e)) throw new Error(`Unknown edition "${e}" (use playbook or complete)`);
  return e;
})();

// Complete reference: the site's navigation, minus a few print adjustments.
const PDF_PLAN = {
  // Pages left out of the PDF entirely. Internal links to them are rewritten
  // (see redirectForSlug) so nothing dangles.
  exclude: new Set([
    'changelog', // version history lives on the site; the cover carries the version
  ]),
  // Individual PharmaTools tool pages are collapsed into one at-a-glance table
  // (see buildToolsAtAGlance). The ecosystem and decision-tree pages are kept.
  collapseTools: new Set([
    'tools/pubcrawl',
    'tools/refcheckr',
    'tools/medcheckr',
    'tools/patiently-ai',
    'tools/llmentor',
    'tools/pls-generator',
    'tools/posterlens',
  ]),
  // Pages moved out of the Overview group into a closing Appendix.
  appendix: ['glossary', 'about'],
  // PDF-only title overrides (the site title "Home" reads oddly in print).
  titles: { index: 'Introduction' },
};

// The playbook edition is a curated subset. Each entry names a page and,
// optionally, the `## ` sections of it to keep (`keep`); everything else on
// that page is dropped. Workflow pages are listed by reading docs.json so a
// new workflow joins the cards automatically.
const PLAYBOOK_PLAN = {
  inside: 'The principles in brief · 18 one-page workflow cards · disclosure snippets · MLR and pre-submission checklists · which tool when',
  principles: [
    { slug: 'principles/human-in-the-loop', keep: ['Core principle', 'Decision points in every workflow'] },
    { slug: 'principles/source-grounding', keep: ['Core principle', 'How to implement source grounding'] },
    { slug: 'principles/risk-levels', keep: ['Core principle', 'How review intensity follows risk'] },
    { slug: 'principles/ai-risk-framework', keep: ['The framework', 'Workflow mapping'] },
    { slug: 'principles/ai-failure-modes', keep: ['Summary table'] },
    { slug: 'principles/review-and-accountability', keep: ['Core principle', 'Review process framework'] },
    { slug: 'principles/declaring-ai-use', keep: ['Core principle', 'What to declare, where, and how'] },
  ],
  // Workflow cards: the sections kept, and which of them sit in the side
  // column of the card layout (the rest run down the main column).
  workflowKeep: ['Best for', 'Steps', 'Review checklist'],
  workflowKeepOverrides: {
    // No numbered steps on this page; its guidance lives in these sections.
    'workflows/generate-concept-visuals': ['Best for', 'Reality check', 'Review checklist'],
    // The longest checklist in the playbook; "Best for" is self-evident here.
    'workflows/final-human-review': ['Steps', 'Review checklist'],
  },
  cardSide: ['Best for', 'Review checklist'],
  // Cards whose checklist is too long for a side column: run everything at
  // full width, with the checklist set in three columns.
  cardSingleColumn: ['workflows/final-human-review'],
  templates: [
    {
      slug: 'templates/disclosure-language',
      keep: [
        'How to use this page',
        'Manuscript — AI drafted a section',
        'Manuscript — AI used for editing or proofing only',
        'Conference abstract or poster',
        'Plain language summary',
        'Regulatory document (CSR section, IB, Module 2 summary, etc.)',
        'Promotional or MLR-bound material',
        'Internal client deliverable (briefing doc, internal report, leave-piece copy)',
        'Where no snippet exists — because the use is not permitted',
      ],
    },
    { slug: 'templates/mlr-ai-review-checklist', keep: ['Before the review', 'AI-specific checks', 'Standard MLR checks (with an AI lens)', 'Sign-off block'] },
    { slug: 'templates/pre-submission-qc-checklist', keep: ['Reference integrity', 'Data and statistical accuracy', 'Image and figure integrity', 'AI use and disclosure', 'Sign-off block'] },
  ],
  tools: [
    { slug: 'tools/at-a-glance', synthetic: true },
    { slug: 'tools/decision-tree' },
  ],
};

// The playbook edition keeps the original filename so the stable download
// URL (releases/download/latest/Medical-Writing-AI-Playbook.pdf), the site
// button and the download counter all keep working unchanged.
const OUTPUT_PDF = path.join(ROOT, EDITION === 'complete' ? 'Medical-Writing-AI-Playbook-Complete-Reference.pdf' : 'Medical-Writing-AI-Playbook.pdf');
const OUTPUT_HTML = path.join(ROOT, EDITION === 'complete' ? 'playbook-complete.preview.html' : 'playbook.preview.html');

const SITE_URL = 'https://playbook.pharmatools.ai';
const COMPLETE_PDF_URL = 'https://github.com/nickjlamb/medical-writing-ai-playbook/releases/download/latest/Medical-Writing-AI-Playbook-Complete-Reference.pdf';
const TOOLS_GLANCE_SLUG = 'tools/at-a-glance';

// Slugs present in the edition being built; set once navigation is loaded.
let INCLUDED = new Set();

// Where a link to a page that is not in this PDF should go instead.
function redirectForSlug(slug) {
  if (INCLUDED.has(slug)) return null;
  if (PDF_PLAN.collapseTools.has(slug) && INCLUDED.has(TOOLS_GLANCE_SLUG)) return `#${slugFromPath(TOOLS_GLANCE_SLUG)}`;
  return `${SITE_URL}/${slug}`;
}

// ---------- 1. Read navigation ----------

async function loadNavigation() {
  const raw = await fs.readFile(path.join(ROOT, 'docs.json'), 'utf8');
  const docs = JSON.parse(raw);
  const groups = docs.navigation.tabs[0].groups;
  const sections = EDITION === 'playbook' ? playbookSections(groups) : completeSections(groups);
  INCLUDED = new Set(sections.flatMap((s) => s.pages.map((p) => p.slug)));
  return sections;
}

function completeSections(groups) {
  const sections = [];
  const appendixPages = [];
  for (const group of groups) {
    const pages = [];
    for (const page of flattenPages(group.pages)) {
      if (PDF_PLAN.exclude.has(page.slug)) continue;
      if (PDF_PLAN.appendix.includes(page.slug)) { appendixPages.push(page); continue; }
      if (PDF_PLAN.collapseTools.has(page.slug)) {
        // Insert the synthetic at-a-glance page where the first tool page sat.
        if (!pages.some((p) => p.slug === TOOLS_GLANCE_SLUG)) {
          pages.push({ slug: TOOLS_GLANCE_SLUG, subgroup: null, synthetic: true });
        }
        continue;
      }
      pages.push(page);
    }
    if (pages.length) sections.push({ title: group.group, pages });
  }
  // Appendix keeps docs.json order for its members.
  appendixPages.sort((a, b) => PDF_PLAN.appendix.indexOf(a.slug) - PDF_PLAN.appendix.indexOf(b.slug));
  if (appendixPages.length) sections.push({ title: 'Appendix', pages: appendixPages });
  return sections;
}

function playbookSections(groups) {
  const workflowGroup = groups.find((g) => g.group === 'AI Workflow');
  const workflows = flattenPages(workflowGroup.pages).map((p) => ({
    ...p,
    keep: PLAYBOOK_PLAN.workflowKeepOverrides[p.slug] || PLAYBOOK_PLAN.workflowKeep,
    card: true,
  }));
  return [
    { title: 'Overview', pages: [{ slug: 'index', playbook: true }] },
    { title: 'Principles in brief', pages: PLAYBOOK_PLAN.principles },
    { title: 'Workflow cards', pages: workflows, pageBreaks: true },
    { title: 'Checklists and templates', pages: PLAYBOOK_PLAN.templates },
    { title: 'Tools', pages: PLAYBOOK_PLAN.tools },
  ];
}

function flattenPages(pages) {
  const out = [];
  for (const p of pages) {
    if (typeof p === 'string') {
      out.push({ slug: p, subgroup: null });
    } else if (p.group && Array.isArray(p.pages)) {
      for (const child of flattenPages(p.pages)) {
        out.push({ ...child, subgroup: child.subgroup || p.group });
      }
    }
  }
  return out;
}

// ---------- 2. MDX → HTML transformation ----------

function stripFrontmatter(raw) {
  const parsed = matter(raw);
  return { content: parsed.content, frontmatter: parsed.data };
}

function stripImports(content) {
  return content.replace(/^import\s+.+?from\s+['"][^'"]+['"];?\s*$/gm, '');
}

// Strip the entire export/JSX block used in snippets/risk-badge.mdx that may leak in via inline JSX.
function stripExports(content) {
  return content.replace(/^export\s+const\s+\w+\s*=[\s\S]*?^};?\s*$/gm, '');
}

// Strip React-only JSX attributes (style={{...}} and className) from any tag so the
// remaining markup is valid HTML that marked won't escape. Used on the index page's
// hero/decorative blocks.
function stripJsxAttrs(content) {
  // Remove style={{ ... }} attributes (single-line or multi-line)
  content = content.replace(/\s+style=\{\{[\s\S]*?\}\}/g, '');
  // Remove className="..." attributes
  content = content.replace(/\s+className=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, '');
  // Drop now-empty wrapper <div> / </div> lines that previously held only JSX styling
  content = content.replace(/^\s*<\/?div>\s*$/gm, '');
  // Dedent lines that start with HTML tags so marked doesn't mistake them for indented code
  content = content.replace(/^[ \t]+(<[A-Za-z\/])/gm, '$1');
  return content;
}

// Convert <RiskBadge level="..." /> to an HTML pill
const RISK_BADGE_STYLES = {
  low: { bg: '#D1FAE5', fg: '#065F46', label: 'Low' },
  'low-medium': { bg: '#ECFCCB', fg: '#365314', label: 'Low–Medium' },
  medium: { bg: '#FEF3C7', fg: '#854D0E', label: 'Medium' },
  'medium-high': { bg: '#FFEDD5', fg: '#9A3412', label: 'Medium–High' },
  high: { bg: '#FECACA', fg: '#991B1B', label: 'High' },
  critical: { bg: '#DC2626', fg: '#FFFFFF', label: 'Critical' },
};

function transformRiskBadge(content) {
  return content.replace(/<RiskBadge\s+level=["']([^"']+)["']\s*\/>/g, (_, level) => {
    const s = RISK_BADGE_STYLES[level] || RISK_BADGE_STYLES.low;
    return `<span class="risk-badge" style="background:${s.bg};color:${s.fg};">Risk tier · ${s.label}</span>`;
  });
}

// Generic block-component transform: replace <Foo ...attrs>inner</Foo> with HTML wrappers,
// leaving inner content unchanged (with blank lines so marked still parses it as markdown).
function wrapComponent(content, tagName, openHtml, closeHtml = '</div>') {
  const re = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'g');
  return content.replace(re, (_, attrs, inner) => {
    const open = typeof openHtml === 'function' ? openHtml(parseAttrs(attrs)) : openHtml;
    return `\n\n${open}\n\n${dedent(inner)}\n\n${closeHtml}\n\n`;
  });
}

// MDX component bodies are usually indented for readability. Left as-is,
// marked treats four-space-indented lines as code blocks, so strip the
// common indent before the inner markdown is parsed.
function dedent(text) {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join('\n');
}

function parseAttrs(attrString) {
  const attrs = {};
  const re = /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;
  let m;
  while ((m = re.exec(attrString)) !== null) {
    attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

function transformCallouts(content) {
  const map = [
    ['Tip', 'tip'],
    ['Warning', 'warning'],
    ['Info', 'info'],
    ['Note', 'note'],
    ['Check', 'check'],
  ];
  for (const [tag, cls] of map) {
    content = wrapComponent(content, tag, `<div class="callout callout-${cls}">`);
  }
  return content;
}

function transformUpdate(content) {
  return wrapComponent(content, 'Update', (attrs) => {
    const label = attrs.label || 'Update';
    const desc = attrs.description ? ` — <span class="update-desc">${attrs.description}</span>` : '';
    return `<div class="callout callout-update"><div class="update-header"><strong>${label}</strong>${desc}</div>`;
  });
}

function transformSteps(content) {
  // First, transform each <Step title="X">...</Step> into a list item
  content = content.replace(
    /<Step\b([^>]*)>([\s\S]*?)<\/Step>/g,
    (_, attrs, inner) => {
      const a = parseAttrs(attrs);
      const title = a.title || '';
      return `\n\n<li class="step"><div class="step-title">${escapeHtml(title)}</div>\n\n${dedent(inner)}\n\n</li>\n\n`;
    }
  );
  // Then wrap <Steps> in <ol>
  content = content.replace(
    /<Steps\b[^>]*>([\s\S]*?)<\/Steps>/g,
    (_, inner) => `\n\n<ol class="steps">\n\n${dedent(inner)}\n\n</ol>\n\n`
  );
  return content;
}

function transformAccordions(content) {
  // Accordion → expanded section with title in bold
  content = content.replace(
    /<Accordion\b([^>]*)>([\s\S]*?)<\/Accordion>/g,
    (_, attrs, inner) => {
      const a = parseAttrs(attrs);
      const title = a.title || '';
      return `\n\n<div class="accordion-item"><div class="accordion-title">${escapeHtml(title)}</div>\n\n${dedent(inner)}\n\n</div>\n\n`;
    }
  );
  // AccordionGroup is just a wrapper
  content = content.replace(
    /<AccordionGroup\b[^>]*>([\s\S]*?)<\/AccordionGroup>/g,
    (_, inner) => `\n\n<div class="accordion-group">\n\n${dedent(inner)}\n\n</div>\n\n`
  );
  return content;
}

function transformCards(content) {
  content = content.replace(
    /<Card\b([^>]*)>([\s\S]*?)<\/Card>/g,
    (_, attrs, inner) => {
      const a = parseAttrs(attrs);
      const title = a.title || '';
      const titleHtml = `<div class="card-title">${escapeHtml(title)}</div>`;
      return `\n\n<div class="card">${titleHtml}\n\n${dedent(inner)}\n\n</div>\n\n`;
    }
  );
  // Self-closing <Card ... />
  content = content.replace(
    /<Card\b([^>]*)\/>/g,
    (_, attrs) => {
      const a = parseAttrs(attrs);
      const title = a.title || '';
      return `\n\n<div class="card"><div class="card-title">${escapeHtml(title)}</div></div>\n\n`;
    }
  );
  content = content.replace(
    /<CardGroup\b[^>]*>([\s\S]*?)<\/CardGroup>/g,
    (_, inner) => `\n\n<div class="card-group">\n\n${dedent(inner)}\n\n</div>\n\n`
  );
  return content;
}

function transformTabs(content) {
  content = content.replace(
    /<Tab\b([^>]*)>([\s\S]*?)<\/Tab>/g,
    (_, attrs, inner) => {
      const a = parseAttrs(attrs);
      const title = a.title || '';
      return `\n\n<div class="tab"><div class="tab-title">${escapeHtml(title)}</div>\n\n${dedent(inner)}\n\n</div>\n\n`;
    }
  );
  content = content.replace(
    /<Tabs\b[^>]*>([\s\S]*?)<\/Tabs>/g,
    (_, inner) => `\n\n<div class="tabs">\n\n${dedent(inner)}\n\n</div>\n\n`
  );
  return content;
}

function transformFrames(content) {
  return content.replace(
    /<Frame\b[^>]*>([\s\S]*?)<\/Frame>/g,
    (_, inner) => `\n\n<div class="frame">\n\n${dedent(inner)}\n\n</div>\n\n`
  );
}

// Inline site-relative images as data URIs. Headless Chrome will not load
// file:// resources into a page set via setContent, and this keeps the
// preview HTML self-contained too.
const MIME = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
function assetDataUri(p) {
  const file = path.join(ROOT, p);
  try {
    const ext = path.extname(file).slice(1).toLowerCase();
    return `data:${MIME[ext] || 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`;
  } catch (err) {
    console.warn(`  ! Missing asset: ${p}`);
    return `file://${file}`;
  }
}
function rewriteAssetPaths(content) {
  // Markdown images: ![alt](/path)
  content = content.replace(/!\[([^\]]*)\]\(\/([^)]+)\)/g, (_, alt, p) => `![${alt}](${assetDataUri(p)})`);
  // HTML images: src="/path"
  content = content.replace(/src=["']\/([^"']+)["']/g, (_, p) => `src="${assetDataUri(p)}"`);
  return content;
}

// Convert internal links like /workflows/foo to anchors #workflows-foo.
// Skip links to static files (e.g. /playbook.pdf) — those don't resolve inside the PDF anyway.
function rewriteInternalLinks(content) {
  content = content.replace(/\]\(\/([^)#\s]+)(#[^)]*)?\)/g, (match, p, hash) => {
    if (/\.[a-z0-9]+$/i.test(p)) return match;
    const redirect = redirectForSlug(p);
    if (redirect) return `](${redirect})`;
    return `](#${slugFromPath(p)})`;
  });
  // Same for raw HTML hrefs (used in the index hero and JSX blocks)
  content = content.replace(/href=["']\/([^"'#]+)(#[^"']*)?["']/g, (match, p) => {
    if (/\.[a-z0-9]+$/i.test(p)) return match;
    const redirect = redirectForSlug(p);
    return `href="${redirect || `#${slugFromPath(p)}`}"`;
  });
  return content;
}

// ---------- 2b. PDF-specific page trims ----------

// The home page is a web landing page: a hero, several grids of navigation
// cards, and a footer. In print the cover, contents and Start Here already do
// that job, so keep only the substantive sections. Sections are separated by
// `---` rules in index.mdx; we keep the ones whose heading matches.
const INDEX_KEEP_HEADINGS = ['What\'s new', 'The workflow lifecycle', 'Risk tiers'];

function trimIndexForPdf(content) {
  const chunks = content.split(/^\s*---\s*$/m);
  const kept = [];
  chunks.forEach((chunk, i) => {
    if (i === 0) {
      // Preamble: drop the hero <div> and the DownloadCounter; keep the
      // "Each workflow explains…" bullets and the two rules.
      const idx = chunk.indexOf('Each workflow explains');
      if (idx !== -1) kept.push(chunk.slice(idx));
      return;
    }
    const m = chunk.match(/^\s*##\s+(.+?)\s*$/m);
    if (!m) return;
    if (!INDEX_KEEP_HEADINGS.includes(m[1].trim())) return;
    let c = chunk;
    // Drop the "Most explored workflows" panel — site analytics, not content.
    c = c.replace(/<div[^>]*>[\s\S]*?Most explored workflows[\s\S]*?<\/ul>\s*<\/div>/, '');
    // Drop trailing navigation cards inside kept sections (e.g. "Full risk framework →")
    c = c.replace(/<Card\b[^>]*>[\s\S]*?<\/Card>/g, '');
    kept.push(c);
  });
  return kept.join('\n\n---\n\n');
}

const PAGE_TRIMS = { index: trimIndexForPdf };

// Playbook-edition home page: the two rules and the risk tiers, plus a
// pointer to the complete reference.
function trimIndexForPlaybook(content) {
  const full = trimIndexForPdf(content);
  const chunks = full.split(/^\s*---\s*$/m);
  const kept = chunks.filter((c, i) => i === 0 || /^\s*##\s+Risk tiers\s*$/m.test(c));
  const note = `<Info>
**How to use this PDF.** It holds the principles in brief, a one-page card for each workflow, and the checklists — enough to run the workflows and review the output. The worked examples, prompt patterns, common mistakes and FAQs for every workflow are at [playbook.pharmatools.ai](${SITE_URL}), or in the [complete reference PDF](${COMPLETE_PDF_URL}).
</Info>`;
  return `${note}\n\n${kept.join('\n\n')}`;
}

// Keep only the named `## ` sections of a page (plus anything before the
// first heading, which carries the risk badge on workflow pages). Section
// names are matched on the heading text exactly as written in the MDX.
function keepSections(content, names, { card = false } = {}) {
  const parts = content.split(/^(?=## )/m);
  const headingOf = (part) => part.match(/^## (.+?)\s*$/m)?.[1].trim();
  const kept = parts.filter((part, i) => {
    if (i === 0 && !part.startsWith('## ')) return true; // preamble
    return names.includes(headingOf(part));
  });
  // Warn about names that matched nothing — usually a heading was renamed.
  for (const name of names) {
    if (!parts.some((p) => headingOf(p) === name)) console.warn(`  ! Section "${name}" not found`);
  }
  let out;
  if (card) {
    // Card layout: preamble across the top, then a main column and a side
    // column (see PLAYBOOK_PLAN.cardSide). Wrappers get blank lines around them
    // so marked still parses the markdown inside.
    const preamble = kept.filter((p) => !p.startsWith('## '));
    const single = PLAYBOOK_PLAN.cardSingleColumn.includes(card.slug);
    const side = single ? [] : kept.filter((p) => PLAYBOOK_PLAN.cardSide.includes(headingOf(p)));
    const main = kept.filter((p) => p.startsWith('## ') && !side.includes(p));
    out = [
      preamble.join('\n'),
      // Closing tags carry a comment so stripJsxAttrs (which drops bare
      // <div>/</div> lines) leaves them alone.
      `<div class="card-main${single ? ' card-single' : ''}">\n\n${main.join('\n')}\n\n</div><!-- /card-main -->`,
      single ? '' : `<div class="card-side">\n\n${side.join('\n')}\n\n</div><!-- /card-side -->`,
    ].join('\n\n');
  } else {
    out = kept.join('\n');
  }
  // In a trimmed page the horizontal rules and "Last reviewed" footers are
  // noise; drop them.
  out = out.replace(/^\s*---\s*$/gm, '');
  out = out.replace(/^\*Last reviewed:.*\*\s*$/gm, '');
  return out;
}

function slugFromPath(p) {
  return p.replace(/\//g, '-').toLowerCase();
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function transformMdx(raw, page = {}) {
  const { content, frontmatter } = stripFrontmatter(raw);
  let c = content;
  if (page.playbook && page.slug === 'index') c = trimIndexForPlaybook(c);
  else if (PAGE_TRIMS[page.slug]) c = PAGE_TRIMS[page.slug](c);
  if (page.keep) c = keepSections(c, page.keep, { card: page.card ? page : false });
  c = stripImports(c);
  c = stripExports(c);
  c = stripJsxAttrs(c);
  c = transformRiskBadge(c);
  c = transformCallouts(c);
  c = transformUpdate(c);
  c = transformSteps(c);
  c = transformAccordions(c);
  c = transformCards(c);
  c = transformTabs(c);
  c = transformFrames(c);
  c = rewriteAssetPaths(c);
  c = rewriteInternalLinks(c);
  return { content: c, frontmatter };
}

// ---------- 3. Page assembly ----------

marked.setOptions({ gfm: true, breaks: false });

function configureMarkedRenderer() {
  const renderer = new marked.Renderer();
  // Demote body headings one level so the PDF outline nests as
  // section (h1) → page (h2) → page headings (h3+). Visual size comes from
  // the .t1–.t6 classes, not the tag, so nothing changes on the page.
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const level = Math.min(depth + 1, 6);
    return `<h${level} class="t${depth}">${text}</h${level}>\n`;
  };
  // Render external links with target=_blank just for the preview html (no effect in PDF)
  const origLink = renderer.link.bind(renderer);
  renderer.link = ({ href, title, tokens }) => {
    const text = renderer.parser.parseInline(tokens);
    if (href && href.startsWith('http')) {
      return `<a href="${href}" class="ext">${text}</a>`;
    }
    return `<a href="${href || ''}">${text}</a>`;
  };
  return renderer;
}

async function readPageMeta(slug) {
  const raw = await fs.readFile(path.join(ROOT, `${slug}.mdx`), 'utf8');
  return { raw, ...stripFrontmatter(raw) };
}

function pageShell({ anchorId, title, description, bodyHtml }) {
  return `
<section class="page" id="${anchorId}">
  <header class="page-header">
    <h2 class="page-title">${escapeHtml(title)}</h2>
    ${description ? `<p class="page-description">${escapeHtml(description)}</p>` : ''}
  </header>
  <div class="page-body">${bodyHtml}</div>
</section>
`;
}

async function renderPage(page) {
  if (page.synthetic && page.slug === TOOLS_GLANCE_SLUG) return buildToolsAtAGlance();

  const { raw } = await readPageMeta(page.slug);
  const { content, frontmatter } = transformMdx(raw, page);
  const title = PDF_PLAN.titles[page.slug] || frontmatter.title || page.slug;
  const description = frontmatter.description || '';
  const anchorId = slugFromPath(page.slug);
  const bodyHtml = marked.parse(content, { renderer: configureMarkedRenderer() });
  return pageShell({ anchorId, title, description, bodyHtml });
}

// One-page summary standing in for the seven individual tool pages. Built from
// each tool page's frontmatter, its "Where it fits in the playbook" table and
// its "Risk tier" paragraph, so edits to the tool pages flow through.
async function buildToolsAtAGlance() {
  const rows = [];
  for (const slug of PDF_PLAN.collapseTools) {
    const { content, frontmatter: data } = await readPageMeta(slug);
    const url = (content.match(/https:\/\/www\.pharmatools\.ai\/[a-z0-9-]+/) || [''])[0];
    // "Where it fits" table: | [Workflow](/workflows/x) | Primary tool — … |
    const fits = [];
    const fitRe = /^\|\s*\[([^\]]+)\]\(\/([^)]+)\)\s*\|\s*(Primary|Supporting)/gm;
    let m;
    while ((m = fitRe.exec(content)) !== null) {
      fits.push(`<a href="#${slugFromPath(m[2])}">${escapeHtml(m[1])}</a>${m[3] === 'Primary' ? '' : ' <span class="muted">(supporting)</span>'}`);
    }
    const riskSection = content.split(/^## Risk tier\s*$/m)[1] || '';
    const risk = (riskSection.match(/\*\*([^*]+)\*\*/) || ['', '—'])[1];
    rows.push(`<tr>
      <td>${url ? `<a class="ext" href="${url}"><strong>${escapeHtml(data.title || slug)}</strong></a>` : `<strong>${escapeHtml(data.title || slug)}</strong>`}</td>
      <td>${escapeHtml(data.description || '')}</td>
      <td>${fits.join('<br>') || '—'}</td>
      <td>${escapeHtml(risk.charAt(0).toUpperCase() + risk.slice(1))}</td>
    </tr>`);
  }
  const bodyHtml = `
<p>Purpose-built tools from <a class="ext" href="https://pharmatools.ai">PharmaTools.AI</a> for the workflow steps where general-purpose LLMs fall short. Each has a full page on the site, with worked examples, limitations and complementary tools; this table is the short version.</p>
<table class="tools-glance">
  <thead><tr><th>Tool</th><th>What it does</th><th>Where it fits</th><th>Risk</th></tr></thead>
  <tbody>${rows.join('\n')}</tbody>
</table>
<p class="muted small">Tool names link to the product pages on pharmatools.ai. Every tool output is an input to human review, not a decision — see <a href="#principles-review-and-accountability">Review and Accountability</a>.</p>
`;
  return pageShell({
    anchorId: slugFromPath(TOOLS_GLANCE_SLUG),
    title: 'PharmaTools.AI tools at a glance',
    description: 'What each purpose-built tool does, which workflows it supports, and the risk tier it operates in.',
    bodyHtml,
  });
}

function sectionAnchor(title) {
  return `section-${title.toLowerCase().replace(/\s+/g, '-')}`;
}

async function renderSection(section, index) {
  const pagesHtml = [];
  for (const page of section.pages) {
    try {
      pagesHtml.push(await renderPage(page));
    } catch (err) {
      console.error(`Failed to render ${page.slug}:`, err.message);
    }
  }
  // A banner at the top of the section's first page, rather than a divider
  // page of its own. Pages within the section then flow continuously.
  return `
<section class="section-start${section.pageBreaks ? ' section-paged' : ''}">
  <header class="section-banner" id="${sectionAnchor(section.title)}">
    <div class="section-eyebrow">Section ${index + 1}</div>
    <h1 class="section-title">${escapeHtml(section.title)}</h1>
  </header>
${pagesHtml.join('\n')}
</section>
`;
}

async function buildTOC(sections) {
  const items = [];
  for (const section of sections) {
    items.push(`<li class="toc-section"><a href="#${sectionAnchor(section.title)}">${escapeHtml(section.title)}</a></li>`);
    for (const page of section.pages) {
      items.push(`<li class="toc-page"><a href="#${slugFromPath(page.slug)}">${escapeHtml(await pageTitle(page))}</a></li>`);
    }
  }
  return `<nav class="toc"><div class="toc-heading">Contents</div><ol>${items.join('\n')}</ol></nav>`;
}

async function pageTitle(page) {
  if (page.synthetic) return 'PharmaTools.AI tools at a glance';
  if (PDF_PLAN.titles[page.slug]) return PDF_PLAN.titles[page.slug];
  try {
    const { frontmatter } = await readPageMeta(page.slug);
    if (frontmatter.title) return frontmatter.title;
  } catch {}
  return prettifySlug(page.slug);
}

function prettifySlug(slug) {
  const last = slug.split('/').pop();
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildCover(version, dateString) {
  // PharmaTools.AI emblem, dark on the cream cover.
  const logoSvg = `<svg class="cover-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 36" fill="#14110D">
  <g transform="scale(0.1105)">
    <path d="M249.95,35.28H17.64C7.9,35.28,0,27.38,0,17.64S7.9,0,17.64,0h232.31c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M317.7,107.87H17.64C7.9,107.87,0,99.97,0,90.23s7.89-17.64,17.64-17.64h300.05c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M249.95,253.07H17.64c-9.74,0-17.64-7.9-17.64-17.64s7.9-17.64,17.64-17.64h232.31c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M317.7,180.47H17.64C7.9,180.47,0,172.56,0,162.83s7.89-17.64,17.64-17.64h300.05c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M144.68,325.66H17.64C7.9,325.66,0,317.75,0,308.02s7.89-17.64,17.64-17.64h127.04c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M531.25,325.66h-127.04c-9.75,0-17.64-7.9-17.64-17.64s7.89-17.64,17.64-17.64h127.04c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M531.25,253.07h-127.04c-9.75,0-17.64-7.9-17.64-17.64s7.89-17.64,17.64-17.64h127.04c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M531.25,180.47h-127.04c-9.75,0-17.64-7.9-17.64-17.64s7.89-17.64,17.64-17.64h127.04c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M617.76,107.87h-300.05c-9.75,0-17.64-7.9-17.64-17.64s7.89-17.64,17.64-17.64h300.05c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
    <path d="M617.76,35.28h-300.05c-9.75,0-17.64-7.9-17.64-17.64s7.89-17.64,17.64-17.64h300.05c9.74,0,17.64,7.9,17.64,17.64s-7.9,17.64-17.64,17.64"/>
  </g>
</svg>`;

  // Monoline mark: source documents, verified. Drawn inline so the PDF stays
  // self-contained — no external image fetch during the build.
  const artSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 215" fill="none" stroke="#14110D" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="52" y="26" width="132" height="168" rx="10" fill="#FBF6EC"/>
    <rect x="30" y="14" width="132" height="168" rx="10" fill="#FBF6EC"/>
    <path d="M52 46h64" stroke-width="7"/>
    <path d="M52 72h88M52 94h88M52 116h72M52 138h88M52 160h50"/>
    <circle cx="206" cy="140" r="46" fill="#FBF6EC"/>
    <path d="M239 173l30 28" stroke-width="8"/>
    <path d="M185 141l14 15 29-33"/>
    <path d="M231 40c1.2 8.4 3.6 10.8 12 12-8.4 1.2-10.8 3.6-12 12-1.2-8.4-3.6-10.8-12-12 8.4-1.2 10.8-3.6 12-12z" fill="#14110D" stroke-width="2"/>
    <path d="M266 78c.8 5.6 2.4 7.2 8 8-5.6.8-7.2 2.4-8 8-.8-5.6-2.4-7.2-8-8 5.6-.8 7.2-2.4 8-8z" fill="#14110D" stroke-width="2"/>
  </svg>`;

  return `
<section class="cover">
  <div class="cover-top">
    <div class="cover-brand">
      ${logoSvg}
      <span class="cover-wordmark">PharmaTools.AI</span>
    </div>
    <div class="cover-pill"><span class="dot"></span>${EDITION === 'complete' ? 'Complete reference' : 'Free &amp; open'}</div>
  </div>

  <div class="cover-head">
    <div class="cover-title">Medical Writing<br/>AI Playbook<span class="dot-accent">.</span></div>
    <p class="cover-subtitle">You&rsquo;re expected to use AI. You&rsquo;re still accountable for every claim. Here&rsquo;s how to do both.</p>
  </div>

  <div class="cover-foot">
    <div class="cover-inside">
      <div class="inside-label">Inside:</div>
      <p>${EDITION === 'complete' ? '12 principles &middot; 18 step-by-step workflows &middot; reusable prompt patterns &middot; disclosure language &middot; MLR and pre-submission checklists' : PLAYBOOK_PLAN.inside}</p>
    </div>
    <div class="cover-art">${artSvg}</div>
  </div>

  <div class="cover-rule"><span>${version} &middot; ${dateString}</span><span>playbook.pharmatools.ai</span></div>
</section>
`;
}

// ---------- 4. CSS ----------

const CSS = `
@page {
  size: A4;
  margin: 15mm 14mm 18mm;
  @bottom-left {
    content: "Medical Writing AI Playbook";
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 8pt;
    color: #888;
  }
  @bottom-right {
    content: counter(page) " / " counter(pages);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 8pt;
    color: #888;
  }
}
@page :first {
  margin: 0;
  @bottom-left { content: ""; }
  @bottom-right { content: ""; }
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

:root {
  --primary: #0F6B5E;
  --primary-light: #16A085;
  --primary-dark: #0A4F45;
  --text: #1f2937;
  --text-muted: #4b5563;
  --border: #e5e7eb;
  --bg-subtle: #f9fafb;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 10pt;
  line-height: 1.45;
  color: var(--text);
}

/* Pagination: let long blocks break across pages, keep headings with the
   text that follows them, and avoid stranded single lines. */
p, li, td, th { orphans: 3; widows: 3; }
h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }
h1, h2, h3, h4, h5, h6 {
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 600;
  color: #111827;
  line-height: 1.25;
  margin-top: 1.3em;
  margin-bottom: 0.45em;
}

/* Type scale is class-driven (see configureMarkedRenderer) */
.t1 { font-size: 20pt; }
.t2 { font-size: 15pt; border-bottom: 1px solid var(--border); padding-bottom: 0.25em; }
.t3 { font-size: 12.5pt; }
.t4 { font-size: 11pt; }
.t5, .t6 { font-size: 10pt; }

p { margin: 0.6em 0; }
.muted { color: var(--text-muted); }
.small { font-size: 9pt; }
.nowrap { white-space: nowrap; }

a {
  color: var(--primary);
  text-decoration: none;
}
a.ext::after { content: " ↗"; font-size: 0.85em; opacity: 0.6; }

code {
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  font-size: 0.9em;
  background: var(--bg-subtle);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  border: 1px solid var(--border);
}

pre {
  background: #0b1020;
  color: #e5e7eb;
  padding: 0.9em 1.1em;
  border-radius: 6px;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 8.5pt;
  line-height: 1.45;
  break-inside: auto;
}
pre code {
  background: transparent;
  border: none;
  color: inherit;
  padding: 0;
}

blockquote {
  border-left: 3px solid var(--primary);
  padding: 0.4em 1em;
  margin: 1em 0;
  color: var(--text-muted);
  background: var(--bg-subtle);
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.9em 0;
  font-size: 9pt;
  break-inside: auto;
}
thead { display: table-header-group; }   /* repeat header row after a page break */
tr { break-inside: avoid; }
th, td {
  border: 1px solid var(--border);
  padding: 4.5pt 7pt;
  text-align: left;
  vertical-align: top;
}
th {
  background: var(--bg-subtle);
  font-weight: 600;
}

ul, ol { margin: 0.6em 0; padding-left: 1.4em; }
li { margin: 0.2em 0; }

img { max-width: 100%; height: auto; }

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2em 0;
}

/* Cover page */
.cover {
  page-break-after: always;
  width: 210mm; height: 297mm;
  background: #FBF6EC;
  color: #14110D;
  display: flex; flex-direction: column;
  padding: 16mm 18mm 14mm;
  position: relative;
}
.cover-top { display: flex; align-items: center; justify-content: space-between; }
.cover-brand { display: flex; align-items: center; gap: 3.5mm; }
.cover-logo { display: block; height: 22px; width: auto; }
.cover-wordmark { font-size: 13.5pt; font-weight: 700; letter-spacing: -0.01em; }
.cover-pill {
  display: flex; align-items: center; gap: 2.5mm;
  background: #fff; border: 1px solid #E7DFCF; border-radius: 999px;
  padding: 2.6mm 5mm; font-size: 8pt; font-weight: 700;
  letter-spacing: 0.13em; text-transform: uppercase; color: #14110D;
}
.cover-pill .dot { width: 7px; height: 7px; border-radius: 50%; background: #0F6B5E; }
.cover-head { margin-top: 46mm; }
.cover-title {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 62pt; font-weight: 800; line-height: 0.94;
  letter-spacing: -0.035em; margin: 0; color: #14110D;
}
.cover-title .dot-accent { color: #0F6B5E; }
.cover-subtitle {
  font-size: 13pt; line-height: 1.5; color: #6B6154;
  max-width: 118mm; margin: 9mm 0 0;
}
.cover-foot { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 10mm; }
.cover-inside { max-width: 92mm; }
.inside-label { font-size: 9.5pt; font-weight: 700; margin-bottom: 2.5mm; color: #14110D; }
.cover-inside p { font-size: 9.5pt; line-height: 1.65; color: #6B6154; margin: 0; }
.cover-art { flex-shrink: 0; }
.cover-art svg { display: block; width: 68mm; height: auto; }
.cover-rule {
  display: flex; justify-content: space-between;
  margin-top: 12mm; padding-top: 5mm; border-top: 1px solid #E7DFCF;
  font-size: 8pt; font-weight: 600; letter-spacing: 0.13em;
  text-transform: uppercase; color: #9A9081;
}

/* TOC: two columns so it sits on a single page. The following section
   forces its own page break, so none is needed here. */
.toc { padding: 6mm 0 0; }
.toc-heading {
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 600;
  font-size: 20pt;
  margin: 0 0 4mm;
}
.toc ol { list-style: none; padding-left: 0; margin: 0; columns: 2; column-gap: 10mm; }
.toc li { margin: 2.5pt 0; break-inside: avoid; }
.toc .toc-section {
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 600;
  font-size: 11.5pt;
  color: var(--primary-dark);
  margin-top: 9pt;
  padding-bottom: 3pt;
  border-bottom: 1px solid var(--border);
  break-after: avoid;
}
.toc .toc-page { padding-left: 5mm; font-size: 9.5pt; }
.toc a { color: var(--text); }

/* Tools at-a-glance table */
.tools-glance { table-layout: fixed; }
.tools-glance th:nth-child(1) { width: 17%; }
.tools-glance th:nth-child(2) { width: 33%; }
.tools-glance th:nth-child(3) { width: 34%; }
.tools-glance th:nth-child(4) { width: 16%; }
.tools-glance td:first-child a::after { content: none; }

/* Section banner: sits at the top of the section's first page. Each section
   starts a new page; the pages inside it flow continuously. */
.section-start { break-before: page; page-break-before: always; }
.section-banner {
  padding: 2mm 0 4mm 5mm;
  margin: 0 0 8mm;
  border-left: 4px solid var(--primary);
  border-bottom: 1px solid var(--border);
  break-after: avoid;
}
.section-eyebrow {
  font-size: 8.5pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 1.5mm;
}
.section-title {
  font-size: 28pt;
  margin: 0;
  color: var(--text);
}

/* Page: no forced break. A rule and generous top margin mark the boundary,
   and the PDF outline (bookmarks) handles navigation. */
.page { margin-top: 9mm; }
.section-banner + .page { margin-top: 0; }
/* Sections whose pages are cards: one per PDF page, two columns */
.section-paged .page { break-before: page; margin-top: 0; font-size: 8.75pt; line-height: 1.38; }
.section-paged .page-header { margin-bottom: 0.6em; }
.section-paged .page-body ul, .section-paged .page-body ol:not(.steps) { padding-left: 1.15em; }
.section-paged .section-banner + .page { break-before: auto; }
.section-paged .page-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0 8mm; align-items: start; }
.section-paged .page-body > * { grid-column: 1 / -1; }
.section-paged .card-main { grid-column: 1; }
.section-paged .card-side { grid-column: 2; }
.section-paged .card-single { grid-column: 1 / -1; font-size: 8.25pt; line-height: 1.32; }
.section-paged .card-single .t3 { font-size: 10.5pt; margin-top: 0.6em; }
.section-paged .card-single ol.steps { columns: 2; column-gap: 8mm; margin: 0.6em 0; }
.section-paged .card-single .accordion-item { padding: 0.4em 0.8em 0.3em; margin: 0.4em 0; }
.section-paged .page-body > :last-child, .section-paged .card-main > :last-child { margin-bottom: 0; }
.section-paged .card-single ol.steps li.step { break-inside: avoid; margin-top: 0; }
.section-paged .card-single .accordion-item { columns: 3; column-gap: 7mm; }
.section-paged .card-single .accordion-title { column-span: all; }
.section-paged .card-single .t3 { break-after: avoid; margin-top: 0.8em; }
.section-paged .callout { break-inside: auto; }
.section-paged .page-body .t2 { font-size: 12pt; margin-top: 0.9em; }
.section-paged .card-main > .t2:first-child, .section-paged .card-side > .t2:first-child { margin-top: 0.4em; }
.section-paged .callout { font-size: 8.75pt; padding: 0.6em 0.9em; margin: 0.5em 0; }
.section-paged ol.steps li.step { margin: 0.55em 0; padding-left: 26pt; }
.section-paged ol.steps li.step::before { width: 18pt; height: 18pt; font-size: 9pt; }
.section-paged .accordion-item { padding: 0.5em 0.8em; }
.section-paged .accordion-title { font-size: 9.5pt; }
.section-paged li { margin: 0.15em 0; }
.section-paged p { margin: 0.45em 0; }
.page-header {
  margin-bottom: 0.9em;
  padding-top: 4mm;
  border-top: 2px solid var(--primary);
  break-after: avoid;
  break-inside: avoid;
}
.section-banner + .page .page-header { border-top: none; padding-top: 0; }
.page-header .page-title { margin: 0; font-size: 20pt; border: none; padding: 0; }
.page-description {
  color: var(--text-muted);
  font-size: 10.5pt;
  margin: 0.35em 0 0 0;
  font-style: italic;
}

/* Callouts */
.callout {
  margin: 1em 0;
  padding: 0.9em 1.1em;
  border-radius: 6px;
  border-left: 3px solid;
  font-size: 9.5pt;
  break-inside: avoid;
}
.callout-update { break-inside: auto; }
.callout p:first-child { margin-top: 0; }
.callout p:last-child { margin-bottom: 0; }
.callout-tip { background: #ecfdf5; border-color: #10b981; }
.callout-warning { background: #fffbeb; border-color: #f59e0b; }
.callout-info { background: #eff6ff; border-color: #3b82f6; }
.callout-note { background: #f5f3ff; border-color: #8b5cf6; }
.callout-check { background: #ecfdf5; border-color: #10b981; }
.callout-update { background: var(--bg-subtle); border-color: var(--primary); }
.update-header { margin-bottom: 0.4em; }
.update-desc { color: var(--text-muted); font-weight: 400; }

/* Risk badge */
.risk-badge {
  display: inline-block;
  padding: 1px 9px;
  border-radius: 999px;
  font-size: 8.5pt;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  vertical-align: middle;
  white-space: nowrap;
}

/* Steps */
ol.steps {
  list-style: none;
  counter-reset: step;
  padding-left: 0;
  margin: 1em 0;
}
ol.steps li.step {
  counter-increment: step;
  position: relative;
  padding-left: 32pt;
  margin: 0.8em 0;
  break-inside: auto;
}
ol.steps li.step::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 0;
  width: 22pt;
  height: 22pt;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 10pt;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-title { font-weight: 600; margin-bottom: 0.2em; color: var(--primary-dark); break-after: avoid; }

/* Accordions (rendered expanded) */
.accordion-group { margin: 1em 0; }
.accordion-item {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.7em 1em;
  margin: 0.5em 0;
  break-inside: auto;
}
.accordion-title {
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.4em;
  font-size: 10pt;
  break-after: avoid;
}

/* Cards: two columns in print (they are short navigation-style blocks) */
.card-group { margin: 0.8em 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5em 0.8em; }
.card {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.6em 0.9em;
  margin: 0;
  background: var(--bg-subtle);
  font-size: 9.5pt;
  break-inside: avoid;
}
.card > :last-child { margin-bottom: 0; }
.card-title { font-weight: 600; color: var(--primary-dark); margin-bottom: 0.3em; }

/* Tabs (rendered as sequential blocks) */
.tabs { margin: 1em 0; }
.tab { border-left: 2px solid var(--border); padding-left: 12pt; margin: 0.8em 0; }
.tab-title {
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.3em;
  font-size: 10pt;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Frame (image wrapper) */
.frame { margin: 1em 0; text-align: center; }
.frame img { max-width: 100%; }
`;

// ---------- 5. Main ----------

async function main() {
  console.log(`→ Building ${EDITION} edition`);
  console.log('→ Reading navigation...');
  const sections = await loadNavigation();
  const totalPages = sections.reduce((n, s) => n + s.pages.length, 0);
  console.log(`  Found ${sections.length} sections, ${totalPages} pages`);

  console.log('→ Rendering pages...');
  const sectionsHtml = [];
  for (const [i, section] of sections.entries()) {
    sectionsHtml.push(await renderSection(section, i));
  }

  const version = await readVersion();
  const dateString = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const cover = buildCover(version, dateString);
  const toc = await buildTOC(sections);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Medical Writing AI Playbook${EDITION === 'complete' ? ' — Complete Reference' : ''} ${version}</title>
  <style>${CSS}</style>
</head>
<body>
  ${cover}
  ${toc}
  ${sectionsHtml.join('\n')}
</body>
</html>`;

  await fs.writeFile(OUTPUT_HTML, html);
  console.log(`  Preview HTML written: ${path.relative(ROOT, OUTPUT_HTML)}`);

  console.log('→ Launching headless Chrome...');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  console.log('→ Rendering PDF...');
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    // Tagged PDF with a document outline (sidebar bookmarks) built from the
    // heading structure — the navigation aid for a continuously flowing document.
    tagged: true,
    outline: true,
  });
  await browser.close();

  const stats = await fs.stat(OUTPUT_PDF);
  const pageCount = await countPdfPages(OUTPUT_PDF);
  console.log(`✓ PDF written: ${path.relative(ROOT, OUTPUT_PDF)} (${(stats.size / 1024).toFixed(0)} KB, ${pageCount} pages)`);
}

// Cheap page count, no PDF library needed: the root of the page tree carries
// the largest /Count (intermediate nodes carry partial counts).
async function countPdfPages(file) {
  const buf = await fs.readFile(file, 'latin1');
  let max = 0;
  for (const m of buf.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/g)) max = Math.max(max, Number(m[1]));
  return max || '?';
}

async function readVersion() {
  // Pull "v2.X" out of index.mdx if present
  try {
    const idx = await fs.readFile(path.join(ROOT, 'index.mdx'), 'utf8');
    const m = idx.match(/v(\d+\.\d+)/);
    return m ? `v${m[1]}` : 'v1.0';
  } catch {
    return 'v1.0';
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
