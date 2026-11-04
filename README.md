# Setpiece / 造境

> Bring ideas to the set.
>
> 把想法，造成现场。

**Setpiece · 造境** is an AI film workspace: an Apple-inspired desktop editor and command line for making
editable, exportable films as web pages. It keeps the complete editing, timeline, media, agent and export toolchain,
with a new identity and interface.

[简体中文](README.zh-CN.md)

## Status

`@tryworld/setpiece@0.3.2` is the current CLI and npm release. The public desktop Alpha remains `v0.3.0`, with
unsigned macOS and Windows installers; the `v0.3.1` and `v0.3.2` desktop binaries are waiting on the release signing
and notarization secrets and have not been published. The source preserves the upstream Git history and required MIT
attribution.

## Product

- Product: Setpiece / 造境
- Category: AI Film Workspace / AI 片场
- Desktop app: `setpiece-desktop`
- CLI and npm package: `@tryworld/setpiece` (command: `setpiece`)
- Shared package: `setpiece-shared`
- Repository: https://github.com/TryWorld2026/setpiece
- CLI and npm version: `0.3.2`
- Public desktop Alpha: `0.3.0` (unsigned)

The command is `setpiece`. Legacy command aliases are no longer installed. The previous `@tryworld/set` npm package
is superseded by `@tryworld/setpiece`.

## Install

Requires Node.js `>=22.18`:

```sh
npx -y @tryworld/setpiece@latest open
```

Unsigned desktop Alpha installers for macOS (Apple Silicon / Intel) and Windows x64 are attached to the
[`v0.3.0` pre-release](https://github.com/TryWorld2026/setpiece/releases/tag/v0.3.0). On macOS, right-click the app
to open it, or run `xattr -cr /Applications/Setpiece.app` if Gatekeeper blocks the first launch.

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

## Required open-source attribution

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
