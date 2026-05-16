import puppeteer from 'puppeteer';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
await page.goto(`file://${ROOT}/playbook.preview.html`, { waitUntil: 'networkidle0' });

const targets = [
  { sel: '#tools-pubcrawl', name: 'tools-pubcrawl' },
  { sel: '#workflows-summarise-source-paper', name: 'summarise' },
  { sel: '#templates-mlr-ai-review-checklist', name: 'mlr-checklist' },
];

for (const t of targets) {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y + window.scrollY, w: r.width, h: Math.min(r.height, 1800) };
  }, t.sel);
  if (!box) { console.log('MISS', t.sel); continue; }
  await page.screenshot({
    path: `/tmp/pdf-${t.name}.png`,
    clip: { x: box.x, y: box.y, width: box.w, height: box.h },
  });
  console.log('OK', t.name);
}

await browser.close();
