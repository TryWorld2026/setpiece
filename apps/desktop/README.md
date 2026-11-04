# Setpiece for desktop

Studio, with a chat beside it for Claude Code, Codex and the other agents, as an Electron app.

## Run from source

```sh
npm start            # builds the window's page, then runs the app as "Setpiece Dev"
npm test
npm run typecheck
```

`node bench/media-menu.test.mjs` builds and checks empty and populated media-pane menus in an isolated Electron app, with file pickers cancelled.

Run from source, the app is its own "Setpiece Dev": its own name, data folder, Studio home and port, so it never
shares anything with an installed Setpiece. Its renamed copy of Electron lives in `.dev/` (git-ignored).

Codex, Claude Code, the other agents, your own key, and Studio with your own media keys all work.

## Builds

`npm run release` builds the app into `.release/` (git-ignored). A local macOS build is unsigned unless
`SETPIECE_SIGN_IDENTITY` and `APPLE_TEAM_ID` are set. On Windows, `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD` sign both
the executable and the NSIS installer; a signed Windows build must run on Windows, while `--unsigned` remains available
for a local cross-build on macOS. A build of this source uses the empty `product.json` and never looks for updates.
Official builds use `product.official.json`, must be signed and notarized by the release workflow, and point at the
update feed `https://setpiece.tryworld.com.cn/updates`. The legacy `set.tryworld.com.cn` host redirects permanently for
installs that shipped before the rename. The feed route is wired; it becomes live after a published release
successfully runs `update-feed.yml`.

The release pipeline verifies `codesign` / `spctl` on macOS and `Get-AuthenticodeSignature` on Windows before uploading
anything. See [docs/releases/v0.3.1.md](../../docs/releases/v0.3.1.md) for the required secrets and
[TRADEMARK.md](../../TRADEMARK.md) before distributing a build of your own. The EULA and privacy draft are copied into
the app as `legal/EULA.md` and `legal/PRIVACY.md`.
