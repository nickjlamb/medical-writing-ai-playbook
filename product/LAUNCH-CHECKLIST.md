# Launch Checklist — Medical Writing AI Playbook

## Pre-launch validation

- [x] All 26 navigation pages exist and resolve
- [x] All internal links verified (no broken links)
- [x] All frontmatter complete (title, description, icon on every page)
- [x] No stray `.md` extension links
- [x] No unescaped `<` characters that break MDX parsing
- [x] Risk tier framework consistent across all pages (4 tiers: Low, Medium, High, Critical)
- [x] All 10 workflow cards have "Next steps" cross-linking sections
- [x] All 6 tool pages have "Try [Tool] →" CTAs linking to pharmatools.ai
- [x] `docs.json` navigation uses correct object format
- [x] `mint dev` runs without errors

## Deployment

- [ ] Set up Mintlify project at [dashboard.mintlify.com](https://dashboard.mintlify.com)
- [ ] Connect GitHub repo to Mintlify
- [ ] Configure custom domain: `pharmatools.ai/playbook`
- [ ] Verify DNS / subdirectory proxy configuration
- [ ] Confirm site builds successfully on Mintlify hosting
- [ ] Test all pages render correctly on live site
- [ ] Test internal links on live site
- [ ] Test tool page external links to pharmatools.ai
- [ ] Verify favicon displays correctly
- [ ] Verify Open Graph / social sharing metadata

## Custom domain setup

Mintlify supports two approaches for hosting under `pharmatools.ai/playbook`:

**Option A — Subdirectory proxy (recommended)**
Configure your web server or CDN (Cloudflare, Vercel, Netlify) to proxy `/playbook/*` requests to Mintlify's hosted site. This keeps the playbook under your main domain.

- Add a rewrite/proxy rule: `pharmatools.ai/playbook/*` → Mintlify hosted URL
- Set `basePath` in `docs.json` if Mintlify supports it, or configure via Mintlify dashboard
- Verify all asset paths resolve correctly under the `/playbook` prefix

**Option B — Subdomain**
Host at `playbook.pharmatools.ai` instead. Simpler DNS setup (CNAME record) but loses the `/playbook` URL structure.

- Add CNAME record: `playbook.pharmatools.ai` → Mintlify's hosting endpoint
- Configure custom domain in Mintlify dashboard

**Recommendation:** Option A if pharmatools.ai is already on Cloudflare or a CDN that supports path-based proxying. Option B if you want the simplest setup.

## Content QA

- [ ] Read every page on live site — check for formatting issues
- [ ] Verify tables render correctly (especially risk tier tables)
- [ ] Verify code blocks in prompt pages render with syntax highlighting
- [ ] Check mobile responsiveness on phone and tablet
- [ ] Verify sidebar navigation works on mobile
- [ ] Test search functionality
- [ ] Verify breadcrumbs display correctly

## SEO

- [ ] Confirm page titles render correctly in browser tabs
- [ ] Confirm meta descriptions appear in page source
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Open Graph tags for social sharing (test with LinkedIn post inspector)
- [ ] Add site to Google Search Console and request indexing
- [ ] Confirm no `noindex` tags on public pages

## Launch comms

- [ ] Publish LinkedIn launch announcement
- [ ] Share on relevant medical writing communities / forums
- [ ] Add playbook link to pharmatools.ai main navigation or footer
- [ ] Add playbook link to pharmatools.ai tool pages where relevant
- [ ] Update any existing email signatures, bios, or profiles

## Post-launch (first 2 weeks)

- [ ] Monitor Google Search Console for indexing status
- [ ] Check Mintlify analytics for page views and popular pages
- [ ] Collect feedback from 3–5 medical writers or agency contacts
- [ ] Identify the most-visited workflow cards and prioritise improvements
- [ ] Plan first content update (next 5 workflow cards)
