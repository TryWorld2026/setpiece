# Workflows

| Workflow | When | What it does |
| --- | --- | --- |
| `ci.yml` | every pull request and push to `main` | typecheck, build, tests, public audit and package check on Linux, macOS and Windows |
| `version.yml` | push to `main` | opens or updates the changesets "Version packages" pull request; once it is merged, publishes `@tryworld/setpiece` and pushes the `v<version>` tag |
| `release.yml` | `v*` tag, or run by hand | signs and notarizes the arm64/x64 macOS `.dmg` and `.zip` files on macOS, signs the Windows installer on Windows, verifies both signatures, then opens a draft GitHub release with checksums |
| `update-feed.yml` | a release is published, or run by hand | rewrites the release's architecture-specific electron-builder feeds to immutable GitHub asset URLs and deploys them with the download page |

## Secrets

`version.yml` needs one repository secret:

- `NPM_TOKEN`: an npm automation token, or a granular access token with read and write access to all packages, that can create and publish the `@tryworld/setpiece` package. Without it the version pull request still opens, but merging it cannot publish.

The current public `v0.3.0` installers were built before the signing gate existed and remain unsigned. Release builds
now fail when signing secrets are absent; there is no unsigned fallback.

macOS signing and notarization:

- `SETPIECE_SIGN_IDENTITY`: `Developer ID Application: Name (TEAMID)`
- `APPLE_TEAM_ID`
- `APPLE_CERTIFICATE_P12`: base64-encoded Developer ID Application `.p12`
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_NOTARY_APPLE_ID`
- `APPLE_NOTARY_PASSWORD`: an app-specific password, not the Apple ID password

Windows signing runs on `windows-latest` and uses:

- `WIN_CSC_LINK`: base64 or URL for the code-signing certificate
- `WIN_CSC_KEY_PASSWORD`

The update feed deployment uses:

- `CLOUDFLARE_API_TOKEN`: a token allowed to deploy the `setpiece-download` Worker

The feed URL is `https://setpiece.tryworld.com.cn/updates`, configured in
`packages/openfilm/product.official.json`. Archives stay on GitHub Releases; only the small YAML files are served by
the Worker. See [docs/releases/v0.3.1.md](../../docs/releases/v0.3.1.md).

The release is created as a draft: review it, publish it, then let `update-feed.yml` deploy its feed.

## Running a release by hand

```sh
gh workflow run release.yml -f tag=v0.3.1
gh workflow run update-feed.yml -f tag=v0.3.1 -f channel=stable
```

The tag must already exist and point at the commit to build.
