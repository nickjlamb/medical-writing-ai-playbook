// Playbook download counter — Cloudflare Worker.
//
// Routes:
//   GET /          → { downloads: <n> }                (read)
//   GET /download  → 302 redirect to PDF, +1 on count  (click)
//
// Counter only increments when the request looks like a real click from
// the live site (referer check). Cross-origin or scripted hits to the
// /download URL still receive the PDF redirect but don't bump the count.

// Points at the LITERAL tag named 'latest' (releases/download/latest/...),
// not GitHub's /releases/latest/ alias. The alias resolves to the newest
// release by date, so cutting a version release (v2.8, etc.) would steal it
// and 404 — the version releases don't carry the PDF.
const PDF_URL =
  'https://github.com/nickjlamb/medical-writing-ai-playbook/releases/download/latest/Medical-Writing-AI-Playbook.pdf';

const ALLOWED_REFERER_PREFIX = 'https://playbook.pharmatools.ai/';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/download') {
      const referer = request.headers.get('referer') || '';
      if (referer.startsWith(ALLOWED_REFERER_PREFIX)) {
        const current = parseInt((await env.COUNTER.get('downloads')) || '0', 10);
        await env.COUNTER.put('downloads', String(current + 1));
      }
      return Response.redirect(PDF_URL, 302);
    }

    // Default: return the current count.
    //
    // no-store, not max-age: KV is eventually consistent and already caches
    // reads at the edge for ~60s, so an HTTP cache on top stacked a second
    // minute of staleness. The page increments optimistically on click, so
    // this endpoint only needs to be as fresh as KV allows.
    const count = parseInt((await env.COUNTER.get('downloads')) || '0', 10);
    return new Response(JSON.stringify({ downloads: count }), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
        ...CORS,
      },
    });
  },
};
