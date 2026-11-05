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
- `public/guide/` — first-party quick-start and installation guide
- `public/support/` — first-party email support and troubleshooting
- `public/styles.css` — Setpiece visual system and responsive layout
- `public/script.js` — header state, reveal, copy command
- `public/assets/brand/` — Setpiece icon
- `public/assets/product/` — confirmed interface screenshots as WebP
- `public/assets/fonts/` — bundled Inter Variable with its OFL notice
- `public/assets/share/og.png` — 1200×630 social share image

## Release state

- The npm package is `@tryworld/setpiece` at `0.3.2`; the page shows the npx quick start.
- The redesigned desktop UI is available for all three platforms from the unsigned `v0.3.2-preview.5` build:
  Apple Silicon DMG/ZIP, Intel Mac DMG/ZIP, Windows x64 EXE and `SHA256SUMS.txt`.
- All three installers are built from the same source revision. Signed and notarized desktop builds still require the
  release credentials.
- The public site exposes `/downloads/<filename>` and `/checksums`; the Worker maps them to immutable release
  artifacts while ordinary users stay on the official domain.
