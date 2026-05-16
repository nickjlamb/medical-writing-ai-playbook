# Playbook download counter (Cloudflare Worker)

Tiny worker + KV namespace that tracks PDF downloads. The homepage button hits this worker, which increments a counter and redirects to the GitHub Release URL.

## One-time deploy

```bash
cd counter-worker
npx wrangler login                                  # opens browser, authorises this machine
npx wrangler kv namespace create COUNTER            # prints an `id = "..."` line
# → paste that id into wrangler.toml under [[kv_namespaces]]
npx wrangler deploy                                 # prints the worker URL
```

The deploy command prints something like:
```
Published playbook-counter (1.2 sec)
  https://playbook-counter.<your-account>.workers.dev
```

Save that URL — it's what the site will call.

## Verify

```bash
# Should return {"downloads":0}
curl https://playbook-counter.<your-account>.workers.dev/

# Hit /download with a fake referer; check count incremented
curl -H "Referer: https://playbook.pharmatools.ai/" \
  -I https://playbook-counter.<your-account>.workers.dev/download
curl https://playbook-counter.<your-account>.workers.dev/
```

## Future tweaks

- **Reset / seed the counter**: `npx wrangler kv key put --binding=COUNTER downloads 100`
- **Read the counter from CLI**: `npx wrangler kv key get --binding=COUNTER downloads`
- **Change the PDF URL or referer**: edit `src/index.js` and `npx wrangler deploy`
