// Playbook download counter — Cloudflare Worker.
//
// Routes:
//   GET /          → { downloads: <n> }                (read)
//   GET /download  → 302 redirect to PDF, +1 on count  (click)
//
// Counter only increments when the request looks like a real click from
// the live site (referer check). Cross-origin or scripted hits to the
// /download URL still receive the PDF redirect but don't bump the count.

const PDF_URL =
  'https://github.com/nickjlamb/medical-writing-ai-playbook/releases/latest/download/playbook.pdf';

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

    // Default: return the current count
    const count = parseInt((await env.COUNTER.get('downloads')) || '0', 10);
    return new Response(JSON.stringify({ downloads: count }), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=60',
        ...CORS,
      },
    });
  },
};
