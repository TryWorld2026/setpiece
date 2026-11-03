# Setpiece / 造境

> Bring ideas to the set.
>
> 把想法，造成现场。

**Setpiece · 造境** is an AI film workspace: an Apple-inspired desktop editor and command line for making
editable, exportable films as web pages. It keeps the complete OpenFilm editing, timeline, media, agent and export
toolchain, with a new identity and interface.

[简体中文](README.zh-CN.md)

## Status

`0.3.0` is an active private-alpha build. The source is an independent commercial derivative of OpenFilm, with the
upstream Git history preserved.

## Product

- Product: Setpiece / 造境
- Category: AI Film Workspace / AI 片场
- Desktop app: `setpiece-desktop`
- CLI and npm package: `setpiece`
- Shared package: `setpiece-shared`
- Repository: https://github.com/TryWorld2026/setpiece
- Version: `0.3.0`

The `twset` and `openfilm` command names remain hidden compatibility aliases. The previous `@tryworld/set` npm
package is superseded by `setpiece`.

## Run from source

Requires Node.js `>=22.18` and pnpm.

```sh
pnpm install
pnpm dev
```

The desktop app:

```sh
pnpm dev:desktop
```

The CLI:

```sh
pnpm setpiece --help
```

## Verification

```sh
pnpm typecheck
pnpm build
pnpm test
```

## Open-source attribution

Setpiece is an independent derivative of [OpenFilm](https://github.com/openfilm/openfilm). OpenFilm's code is
MIT-licensed, and its copyright belongs to the OpenFilm contributors. We preserve the upstream copyright notices,
license and Git history.

Setpiece uses its own product name, logo and interface. It is not the OpenFilm project, is not affiliated with it, and
is not endorsed by it.

See [NOTICE.md](NOTICE.md), [LICENSES/OpenFilm-MIT.txt](LICENSES/OpenFilm-MIT.txt), and the upstream reference docs:
[English](README.upstream.md) / [简体中文](README.upstream.zh-CN.md).

## License

The repository is distributed under the MIT License. See [LICENSE](LICENSE). Upstream OpenFilm notices remain in
[LICENSES/OpenFilm-MIT.txt](LICENSES/OpenFilm-MIT.txt).
