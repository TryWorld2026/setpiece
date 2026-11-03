# Setpiece · 造境 download page

Static site for `set.tryworld.com.cn`. The domain is technical infrastructure only; the page uses the
Setpiece identity, not the TryWorld brand.

## Deploy

```powershell
cd "path\to\setpiece\site\download"
npx -y wrangler@4.155.0 deploy --config wrangler.jsonc
```

The Worker is `tryworld-set-download`; `wrangler.jsonc` binds the custom domain
`set.tryworld.com.cn`.

## Structure

- `public/index.html` — landing page
- `public/styles.css` — Setpiece visual system and responsive layout
- `public/script.js` — header state, reveal, copy command
- `public/assets/brand/` — Setpiece icon
- `public/assets/product/` — confirmed interface screenshots as WebP
- `public/assets/fonts/` — bundled Inter Variable with its OFL notice
- `public/assets/share/og.png` — 1200×630 social share image

## Release state

- There is no public installer yet: the page says Private Alpha and links GitHub Releases.
- `setpiece` is not on npm yet: the page shows source-build instructions only.
- Release assets: https://github.com/TryWorld2026/setpiece/releases
- Upstream: https://github.com/openfilm/openfilm
