# TryWorld Set download page

Static download page for `set.tryworld.com.cn`.

## Deploy

```powershell
cd "D:\codingXM\TryWorld Set\site\download"
npx -y wrangler@4.155.0 deploy --config wrangler.jsonc
```

The Worker is `tryworld-set-download`; `wrangler.jsonc` binds the custom domain
`set.tryworld.com.cn`.

## Structure

- `public/index.html` — landing page
- `public/styles.css` — layout and brand styles
- `public/script.js` — header state, reveal, copy command
- `public/assets/fonts/` — Noto Sans SC + Fraunces, with OFL notices
- `public/assets/logos/` — TryWorld marks from the brand skill
- `public/assets/share/og.png` — 1200×630 social share image

## Links

- Release assets: https://github.com/TryWorld2026/tryworld-set/releases/tag/v0.2.8
- npm package: https://www.npmjs.com/package/@tryworld/set
- Upstream: https://github.com/openfilm/openfilm
