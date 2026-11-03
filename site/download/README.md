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

- The npm package is `@tryworld/setpiece` at `0.3.0`; the page shows the npx quick start.
- Unsigned desktop Alpha installers are published as the `v0.3.0` pre-release: macOS arm64/x64 DMG and ZIP,
  Windows x64 EXE, plus `SHA256SUMS.txt`. Signed and notarized builds remain a later milestone.
- Release assets: https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.0
- Upstream: https://github.com/openfilm/openfilm
