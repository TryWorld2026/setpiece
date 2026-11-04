# Releases

## Current state

- `@tryworld/setpiece@0.3.2` is the current npm release. A fresh install exposes only the `setpiece` command;
  the interim `twset` and `openfilm` aliases are no longer installed.
- `v0.3.2` remains the GitHub Latest release. The redesigned desktop UI is published as the unsigned all-platform
  pre-release `v0.3.2-preview.4`, with Apple Silicon, Intel Mac and Windows x64 installers built from the same source
  revision; it does not replace Latest. The older `v0.3.0` and `v0.3.2-preview.1`–`preview.3` downloads remain as
  release history only and are no longer linked from the download page.
- The `v0.3.1` and `v0.3.2` tags have no signed desktop installer set. The desktop release workflow skips signed builds
  when the macOS or Windows signing credentials are absent, rather than failing the run.
- The former `v0.2.8` GitHub releases were removed. The old `@tryworld/set` npm package is deprecated and points users
  to `@tryworld/setpiece`; its published metadata remains immutable npm release history.
- All current and historical preview installers remain unsigned. The release workflow skips signed desktop jobs when
  the macOS or Windows signing secrets are absent; it does not publish a signed build in their place.
- `product.official.json` points at `https://setpiece.tryworld.com.cn/updates`. The feed generator and deployment workflow
  exist, but the route is not live until a published release runs `update-feed.yml` with `CLOUDFLARE_API_TOKEN`.
- The public repository is MIT-licensed. A future closed-source commercial build needs a separate private repository
  and distribution plan; changing repository visibility does not revoke rights already granted for published code.

## Release gates

Every release must pass:

1. `pnpm typecheck`
2. `pnpm build`
3. `pnpm test`
4. `pnpm audit:public`
5. `pnpm check:pack`
6. `pnpm release:preflight`

Before a build reaches users, also complete the applicable checklist in [v0.3.1.md](v0.3.1.md).

The commercial release blockers are tracked with:

```sh
pnpm release:preflight --require-signing --require-updates
```

`--require-updates` should pass now that the feed URL is configured. `--require-signing` is expected to fail locally
until all eight signing/notarization environment variables are set. The workflow reads them from GitHub Actions
secrets, not from the repository.

## Channels

| Channel | Audience | GitHub release | Update feed |
| --- | --- | --- | --- |
| Alpha | internal and invited testers | pre-release | optional until the feed is live |
| Beta | early users | pre-release | `beta-mac.yml` / `beta.yml` |
| Stable | everyone | latest release | `latest-mac.yml` / `latest.yml` |

Never move a build from Alpha to Stable without rerunning the clean-install checks against the exact uploaded bytes.

## Update feed deployment

`release.yml` names the two macOS feed files `latest-mac-arm64.yml` and `latest-mac-x64.yml` so they cannot overwrite
each other in one release. `update-feed.yml` runs after a release is published, rewrites every archive URL to the
immutable GitHub asset URL, writes the three public feed paths, and deploys the download Worker:

```text
/updates/mac/arm64/latest-mac.yml
/updates/mac/x64/latest-mac.yml
/updates/win/x64/latest.yml
```

Prereleases write `beta-mac.yml` / `beta.yml` instead. A failed feed deployment leaves the previous feed untouched, but
the release itself is already public; run the workflow again after fixing the deployment rather than hand-editing a
checksum.

