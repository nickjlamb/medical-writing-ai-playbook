// Build the playbook into a single PDF.
// Reads docs.json for navigation order, transforms MDX components to HTML,
// then renders the assembled document with Puppeteer.

import fs from 'node:fs/promises';
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
const OUTPUT_PDF = path.join(ROOT, 'Medical-Writing-AI-Playbook.pdf');
const OUTPUT_HTML = path.join(ROOT, 'playbook.preview.html');

// ---------- 1. Read navigation ----------

async function loadNavigation() {
  const raw = await fs.readFile(path.join(ROOT, 'docs.json'), 'utf8');
  const docs = JSON.parse(raw);
  const groups = docs.navigation.tabs[0].groups;
  const sections = [];
  for (const group of groups) {
    const pages = flattenPages(group.pages);
    sections.push({ title: group.group, pages });
  }
  return sections;
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
    return `\n\n${open}\n\n${inner.trim()}\n\n${closeHtml}\n\n`;
  });
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
      return `\n\n<li class="step"><div class="step-title">${escapeHtml(title)}</div>\n\n${inner.trim()}\n\n</li>\n\n`;
    }
  );
  // Then wrap <Steps> in <ol>
  content = content.replace(
    /<Steps\b[^>]*>([\s\S]*?)<\/Steps>/g,
    (_, inner) => `\n\n<ol class="steps">\n\n${inner.trim()}\n\n</ol>\n\n`
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
      return `\n\n<div class="accordion-item"><div class="accordion-title">${escapeHtml(title)}</div>\n\n${inner.trim()}\n\n</div>\n\n`;
    }
  );
  // AccordionGroup is just a wrapper
  content = content.replace(
    /<AccordionGroup\b[^>]*>([\s\S]*?)<\/AccordionGroup>/g,
    (_, inner) => `\n\n<div class="accordion-group">\n\n${inner.trim()}\n\n</div>\n\n`
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
      return `\n\n<div class="card">${titleHtml}\n\n${inner.trim()}\n\n</div>\n\n`;
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
    (_, inner) => `\n\n<div class="card-group">\n\n${inner.trim()}\n\n</div>\n\n`
  );
  return content;
}

function transformTabs(content) {
  content = content.replace(
    /<Tab\b([^>]*)>([\s\S]*?)<\/Tab>/g,
    (_, attrs, inner) => {
      const a = parseAttrs(attrs);
      const title = a.title || '';
      return `\n\n<div class="tab"><div class="tab-title">${escapeHtml(title)}</div>\n\n${inner.trim()}\n\n</div>\n\n`;
    }
  );
  content = content.replace(
    /<Tabs\b[^>]*>([\s\S]*?)<\/Tabs>/g,
    (_, inner) => `\n\n<div class="tabs">\n\n${inner.trim()}\n\n</div>\n\n`
  );
  return content;
}

function transformFrames(content) {
  return content.replace(
    /<Frame\b[^>]*>([\s\S]*?)<\/Frame>/g,
    (_, inner) => `\n\n<div class="frame">\n\n${inner.trim()}\n\n</div>\n\n`
  );
}

// Rewrite image src and href paths to be absolute for puppeteer (file://)
function rewriteAssetPaths(content) {
  // Markdown images: ![alt](/path)
  content = content.replace(/!\[([^\]]*)\]\(\/([^)]+)\)/g, (_, alt, p) => {
    return `![${alt}](file://${path.join(ROOT, p)})`;
  });
  // HTML images: src="/path"
  content = content.replace(/src=["']\/([^"']+)["']/g, (_, p) => {
    return `src="file://${path.join(ROOT, p)}"`;
  });
  return content;
}

// Convert internal links like /workflows/foo to anchors #workflows-foo.
// Skip links to static files (e.g. /playbook.pdf) — those don't resolve inside the PDF anyway.
function rewriteInternalLinks(content) {
  content = content.replace(/\]\(\/([^)#\s]+)(#[^)]*)?\)/g, (match, p, hash) => {
    if (/\.[a-z0-9]+$/i.test(p)) return match;
    return `](#${slugFromPath(p)})`;
  });
  return content;
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

function transformMdx(raw) {
  const { content, frontmatter } = stripFrontmatter(raw);
  let c = content;
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

async function renderPage(page) {
  const filePath = path.join(ROOT, `${page.slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { content, frontmatter } = transformMdx(raw);
  const title = frontmatter.title || page.slug;
  const description = frontmatter.description || '';
  const anchorId = slugFromPath(page.slug);

  const bodyHtml = marked.parse(content, { renderer: configureMarkedRenderer() });

  return `
<section class="page" id="${anchorId}">
  <header class="page-header">
    <h1>${escapeHtml(title)}</h1>
    ${description ? `<p class="page-description">${escapeHtml(description)}</p>` : ''}
  </header>
  ${bodyHtml}
</section>
`;
}

async function renderSection(section) {
  const pagesHtml = [];
  for (const page of section.pages) {
    try {
      pagesHtml.push(await renderPage(page));
    } catch (err) {
      console.error(`Failed to render ${page.slug}:`, err.message);
    }
  }
  const anchorId = `section-${section.title.toLowerCase().replace(/\s+/g, '-')}`;
  return `
<section class="section-divider" id="${anchorId}">
  <div class="section-divider-inner">
    <div class="section-eyebrow">Section</div>
    <h1 class="section-title">${escapeHtml(section.title)}</h1>
  </div>
</section>
${pagesHtml.join('\n')}
`;
}

function buildTOC(sections) {
  const items = [];
  for (const section of sections) {
    items.push(`<li class="toc-section"><a href="#section-${section.title.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(section.title)}</a></li>`);
    for (const page of section.pages) {
      items.push(`<li class="toc-page"><a href="#${slugFromPath(page.slug)}">${escapeHtml(prettifySlug(page.slug))}</a></li>`);
    }
  }
  return `<nav class="toc"><h2>Contents</h2><ol>${items.join('\n')}</ol></nav>`;
}

function prettifySlug(slug) {
  const last = slug.split('/').pop();
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildCover(version, dateString) {
  // Inline white SVG mark (PharmaTools.AI emblem, no text — title below carries the wordmark)
  const logoSvg = `<svg class="cover-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 36" fill="#ffffff">
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
  return `
<section class="cover">
  <div class="cover-inner">
    ${logoSvg}
    <div class="cover-eyebrow">A free resource by PharmaTools.AI</div>
    <h1 class="cover-title">Medical Writing<br/><span class="cover-title-accent">AI Playbook.</span></h1>
    <p class="cover-subtitle">You&rsquo;re expected to use AI. You&rsquo;re still accountable for every claim. Here&rsquo;s how to do both.</p>
    <div class="cover-meta">
      <div><span class="meta-label">Version</span><span class="meta-value">${version}</span></div>
      <div><span class="meta-label">Updated</span><span class="meta-value">${dateString}</span></div>
      <div><span class="meta-label">Web</span><span class="meta-value">playbook.pharmatools.ai</span></div>
    </div>
  </div>
</section>
`;
}

// ---------- 4. CSS ----------

const CSS = `
@page {
  size: A4;
  margin: 18mm 16mm 22mm;
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

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

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
  font-size: 10.5pt;
  line-height: 1.55;
  color: var(--text);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 600;
  color: #111827;
  line-height: 1.25;
  margin-top: 1.4em;
  margin-bottom: 0.5em;
}

h1 { font-size: 22pt; }
h2 { font-size: 16pt; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
h3 { font-size: 13pt; }
h4 { font-size: 11.5pt; }

p { margin: 0.7em 0; }

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
  padding: 1em 1.2em;
  border-radius: 6px;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 9pt;
  line-height: 1.5;
  page-break-inside: avoid;
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
  margin: 1em 0;
  font-size: 9.5pt;
  page-break-inside: avoid;
}
th, td {
  border: 1px solid var(--border);
  padding: 6pt 8pt;
  text-align: left;
  vertical-align: top;
}
th {
  background: var(--bg-subtle);
  font-weight: 600;
}

ul, ol { margin: 0.7em 0; padding-left: 1.4em; }
li { margin: 0.3em 0; }

img { max-width: 100%; height: auto; }

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2em 0;
}

/* Cover page */
.cover {
  page-break-after: always;
  width: 210mm;
  height: 297mm;
  background: linear-gradient(135deg, #0c1442 0%, #0F6B5E 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 28mm;
  position: relative;
}
.cover-inner { width: 100%; }
.cover-logo { display: block; height: 28px; width: auto; margin-bottom: 60mm; }
.cover-eyebrow {
  font-size: 9pt;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  margin-bottom: 16mm;
}
.cover-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 56pt;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 12mm 0;
  color: white;
  letter-spacing: -0.02em;
}
.cover-title-accent { color: #a78bfa; }
.cover-subtitle {
  font-size: 13pt;
  line-height: 1.5;
  color: rgba(255,255,255,0.85);
  max-width: 140mm;
  margin: 0 0 24mm 0;
}
.cover-meta {
  display: flex;
  gap: 18mm;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 10mm;
  font-size: 9.5pt;
}
.cover-meta > div { display: flex; flex-direction: column; gap: 2mm; }
.meta-label {
  font-size: 8pt;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.meta-value { font-weight: 600; color: white; }

/* TOC */
.toc {
  page-break-after: always;
  padding: 12mm 0;
}
.toc h2 {
  font-size: 20pt;
  margin-top: 0;
  border: none;
  padding: 0;
}
.toc ol { list-style: none; padding-left: 0; }
.toc li { margin: 4pt 0; }
.toc .toc-section {
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 600;
  font-size: 12.5pt;
  color: var(--primary-dark);
  margin-top: 12pt;
  padding-bottom: 4pt;
  border-bottom: 1px solid var(--border);
}
.toc .toc-page { padding-left: 8mm; font-size: 10pt; }
.toc a { color: var(--text); }

/* Section divider */
.section-divider {
  page-break-before: always;
  height: 260mm;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.section-divider-inner { padding-left: 4mm; border-left: 4px solid var(--primary); }
.section-eyebrow {
  font-size: 9pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 4mm;
}
.section-title {
  font-size: 36pt;
  margin: 0;
  color: var(--text);
}

/* Page */
.page {
  page-break-before: always;
}
.page-header { margin-bottom: 1em; }
.page-header h1 { margin: 0; font-size: 22pt; }
.page-description {
  color: var(--text-muted);
  font-size: 11pt;
  margin: 0.4em 0 0 0;
  font-style: italic;
}

/* Callouts */
.callout {
  margin: 1em 0;
  padding: 0.9em 1.1em;
  border-radius: 6px;
  border-left: 3px solid;
  font-size: 10pt;
  page-break-inside: avoid;
}
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
  margin: 0.9em 0;
  page-break-inside: avoid;
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
.step-title { font-weight: 600; margin-bottom: 0.2em; color: var(--primary-dark); }

/* Accordions (rendered expanded) */
.accordion-group { margin: 1em 0; }
.accordion-item {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.8em 1em;
  margin: 0.6em 0;
  page-break-inside: avoid;
}
.accordion-title {
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.4em;
  font-size: 10.5pt;
}

/* Cards */
.card-group { margin: 1em 0; display: block; }
.card {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.7em 1em;
  margin: 0.5em 0;
  background: var(--bg-subtle);
  page-break-inside: avoid;
}
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
  console.log('→ Reading navigation...');
  const sections = await loadNavigation();
  const totalPages = sections.reduce((n, s) => n + s.pages.length, 0);
  console.log(`  Found ${sections.length} sections, ${totalPages} pages`);

  console.log('→ Rendering pages...');
  const sectionsHtml = [];
  for (const section of sections) {
    sectionsHtml.push(await renderSection(section));
  }

  const version = await readVersion();
  const dateString = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const cover = buildCover(version, dateString);
  const toc = buildTOC(sections);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Medical Writing AI Playbook ${version}</title>
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
  });
  await browser.close();

  const stats = await fs.stat(OUTPUT_PDF);
  console.log(`✓ PDF written: ${path.relative(ROOT, OUTPUT_PDF)} (${(stats.size / 1024).toFixed(0)} KB)`);
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
