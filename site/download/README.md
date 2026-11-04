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

- The npm package is `@tryworld/setpiece` at `0.3.2`; the page shows the npx quick start.
- The redesigned desktop UI is available as the unsigned Windows x64 pre-release `v0.3.2-preview.1`, with the
  `Setpiece-Preview-Setup-x64.exe` installer and `SHA256SUMS.txt`.
- Unsigned macOS arm64/x64 DMG and ZIP installers remain available in the `v0.3.0` pre-release. Signed and notarized
  desktop builds still require the release credentials.
- Desktop Preview: https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.2-preview.1
- macOS Alpha: https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.0
- Upstream: https://github.com/openfilm/openfilm
