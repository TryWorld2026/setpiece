# Setpiece · 造境 download page

Static site for `setpiece.tryworld.com.cn`. The domain is technical infrastructure only; the page uses the
Setpiece identity, not the TryWorld brand.

## Deploy

```powershell
cd "path\to\setpiece\site\download"
npx -y wrangler@4.157.0 deploy --config wrangler.jsonc
```

The Worker is `setpiece-download`; `wrangler.jsonc` binds the custom domain
`setpiece.tryworld.com.cn`. The legacy `set.tryworld.com.cn` hostname returns a 301 redirect to the primary domain,
so old links keep working without serving a second copy of the site.

## Structure

- `public/index.html` — landing page
- `public/styles.css` — Setpiece visual system and responsive layout
- `public/script.js` — header state, reveal, copy command
- `public/assets/brand/` — Setpiece icon
- `public/assets/product/` — confirmed interface screenshots as WebP
- `public/assets/fonts/` — bundled Inter Variable with its OFL notice
- `public/assets/share/og.png` — 1200×630 social share image

## Release state

- The npm package is `@tryworld/setpiece` at `0.3.1`; the page shows the npx quick start.
- Unsigned desktop Alpha installers remain available as the `v0.3.0` pre-release: macOS arm64/x64 DMG and ZIP,
  Windows x64 EXE, plus `SHA256SUMS.txt`. The `v0.3.1` desktop release is blocked on signing and notarization
  credentials.
- Release assets: https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.0
- Upstream: https://github.com/openfilm/openfilm
