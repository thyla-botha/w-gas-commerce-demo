# weGAS Commerce Intelligence — demo

A self-contained static SPA (plain HTML/CSS/vanilla JS, Chart.js from CDN).
No build step, no app server.

**Live:** https://hub.w-gas.co.za/commerce-demo/

---

## Layout

| Path | Purpose |
|---|---|
| `index.html` | **Production entry** (lean — no dev tooling). This is what gets served. |
| `weGAS Intelligence.html` | Dev entry, includes the React/Babel "tweaks" design overlay. **Not deployed.** |
| `app/*.js`, `app/*.css`, `app/wegas-logo.png` | The app. |
| `app/tweaks-*.jsx` | Dev-only tweaks overlay. **Not deployed.** |
| `deploy.sh` | rsync the build to the VPS + reset ownership. |
| `nginx-commerce-demo.conf` | nginx `location` block for the `/commerce-demo/` subpath. |

The app is **fully relocatable** — all asset paths are relative, routing is hash-based
(`#home`, `#bi`, …) — so it works under any subpath without edits.

---

## First-time server setup (once)

1. Create the served directory:
   ```bash
   sudo mkdir -p /var/www/wgas-commerce-demo
   ```
2. Add the location block from `nginx-commerce-demo.conf` inside the
   `hub.w-gas.co.za` TLS `server { }` block, then:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

## Deploy (every release)

From this directory:
```bash
./deploy.sh
```
This rsyncs the static files to `hub.w-gas.co.za:/var/www/wgas-commerce-demo/`
(excluding git, dev entry, tweaks, and repo meta) and resets ownership to `www-data`.

Override host/user/path with env vars:
```bash
REMOTE_USER=deploy DEST=/var/www/wgas-commerce-demo ./deploy.sh
```

## Source of truth

GitHub `main`: https://github.com/thyla-botha/w-gas-commerce-demo

```bash
git add -A
git commit -m "..."
git push           # main
./deploy.sh        # then ship to the VPS
```

---

## Notes

- **"Back to weGAS" / cover logo** link to `https://w-gas.co.za` (the main marketing
  site), using `target="_top"` so they break cleanly out of an iframe if embedded.
  Since this demo is served from the `hub.` subdomain, those links cross from hub →
  main site by design.
- To serve under the **same** domain instead (`w-gas.co.za/commerce-demo/`), point the
  same `location` block at the `w-gas.co.za` server block rather than `hub.`.
