# Releases

## Current state

- `v0.3.0` is the current public Alpha. It is published on npm as `@tryworld/setpiece@0.3.0` and as a GitHub
  pre-release with unsigned macOS and Windows installers.
- GitHub still marks `v0.2.8` as the latest stable release because `v0.3.0` is a pre-release. The download page must
  continue to link the current Alpha explicitly rather than the repository's "Latest" badge.
- The `v0.3.0` installers remain unsigned. The release workflow now refuses to build without the macOS and Windows
  signing secrets, but that gate has not yet produced a signed release.
- `product.official.json` points at `https://set.tryworld.com.cn/updates`. The feed generator and deployment workflow
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

