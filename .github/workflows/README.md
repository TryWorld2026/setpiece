# Workflows

| Workflow | When | What it does |
| --- | --- | --- |
| `ci.yml` | every pull request and push to `main` | typecheck, build, tests, public audit and package check on Linux, macOS and Windows |
| `version.yml` | push to `main` | opens or updates the changesets "Version packages" pull request; once it is merged, publishes `setpiece` and pushes the `v<version>` tag |
| `release.yml` | `v*` tag, or run by hand | builds the arm64 and x64 macOS `.dmg` / `.zip` files plus the Windows installer, then opens a draft GitHub release with checksums |

## Secrets

`version.yml` needs one repository secret:

- `NPM_TOKEN`: an npm automation token with publish access to the `@tryworld` scope. Without it the version pull request still opens, but merging it cannot publish.

The desktop build is unsigned unless the macOS signing values are present:

- `OPENFILM_SIGN_IDENTITY`: `Developer ID Application: Name (TEAMID)`
- `APPLE_TEAM_ID`
- `OPENFILM_NOTARY_PROFILE`: a `notarytool` keychain profile already installed on the runner

Unsigned macOS and Windows builds install with the usual system warning. The release is created as a draft: review it, then publish it.

## Running a release by hand

```sh
gh workflow run release.yml -f tag=v0.2.8
```

The tag must already exist and point at the commit to build.
