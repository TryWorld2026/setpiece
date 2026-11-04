#!/usr/bin/env node
/**
 * `pnpm release:preflight`: catch release metadata and compliance mistakes before a build is uploaded.
 *
 *   node scripts/release-preflight.mjs
 *   node scripts/release-preflight.mjs --require-updates
 *   node scripts/release-preflight.mjs --require-signing
 *
 * The default run is suitable for CI: it checks version alignment, required attribution files and the shape of the
 * official update feed, but only warns about unfinished commercial-release work. The two `--require-*` flags turn those
 * warnings into release blockers.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const problems = [];
const warnings = [];

const fail = (text) => problems.push(text);
const warn = (text) => warnings.push(text);
const readJson = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const exists = (path) => existsSync(join(ROOT, path));
const sameText = (a, b) => readFileSync(join(ROOT, a)).equals(readFileSync(join(ROOT, b)));

const requireUpdates = process.argv.includes('--require-updates');
const requireSigning = process.argv.includes('--require-signing');

const openfilm = readJson('packages/openfilm/package.json');
const desktop = readJson('apps/desktop/package.json');
const shared = readJson('packages/shared/package.json');
const versions = new Map([
  ['packages/openfilm', openfilm.version],
  ['apps/desktop', desktop.version],
  ['packages/shared', shared.version],
]);
if (new Set(versions.values()).size !== 1) {
  fail(`package versions differ: ${[...versions].map(([pkg, version]) => `${pkg}=${version}`).join(', ')}`);
}

for (const path of [
  'LICENSE',
  'NOTICE.md',
  'THIRD_PARTY_NOTICES.md',
  'LICENSES/OpenFilm-MIT.txt',
  'legal/EULA.md',
  'legal/PRIVACY.md',
  'packages/openfilm/LICENSE',
  'packages/openfilm/NOTICE.md',
  'packages/openfilm/LICENSES/OpenFilm-MIT.txt',
  'packages/openfilm/THIRD_PARTY_NOTICES.md',
  'site/download/public/legal/eula/index.html',
  'site/download/public/legal/privacy/index.html',
  '.github/workflows/release.yml',
]) {
  if (!exists(path)) fail(`${path} is missing`);
}

if (exists('apps/desktop/scripts/release.mjs')) {
  const release = readFileSync(join(ROOT, 'apps/desktop/scripts/release.mjs'), 'utf8');
  if (!/from:\s*join\(desktop,\s*'\.\.\/\.\.\/legal'\)/.test(release)) {
    fail('apps/desktop/scripts/release.mjs does not copy legal documents into the installer');
  }
}

if (exists('LICENSES/OpenFilm-MIT.txt') && exists('packages/openfilm/LICENSES/OpenFilm-MIT.txt')) {
  if (!sameText('LICENSES/OpenFilm-MIT.txt', 'packages/openfilm/LICENSES/OpenFilm-MIT.txt')) {
    fail('packages/openfilm/LICENSES/OpenFilm-MIT.txt differs from the root upstream license');
  }
}

const packaged = new Set(openfilm.files ?? []);
for (const path of ['NOTICE.md', 'LICENSES', 'THIRD_PARTY_NOTICES.md']) {
  if (!packaged.has(path)) fail(`packages/openfilm/package.json files does not include ${path}`);
}

const product = readJson('packages/openfilm/product.official.json');
const updates = typeof product.desktop?.updates === 'string' ? product.desktop.updates.trim() : '';
if (!updates) {
  const text = 'product.official.json has no desktop.updates feed';
  if (requireUpdates) fail(text); else warn(text);
} else if (!/^https:\/\//i.test(updates)) {
  fail(`product.official.json desktop.updates must be HTTPS: ${updates}`);
}

if (exists('.github/workflows/release.yml')) {
  const workflow = readFileSync(join(ROOT, '.github/workflows/release.yml'), 'utf8');
  if (/--unsigned/.test(workflow)) {
    const text = 'release.yml still builds unsigned installers';
    if (requireSigning) fail(text); else warn(text);
  }
  if (!/SETPIECE_SIGN_IDENTITY/.test(workflow) || !/APPLE_CERTIFICATE_P12/.test(workflow) || !/APPLE_NOTARY_APPLE_ID/.test(workflow)) {
    const text = 'release.yml has no macOS signing/notarization setup';
    if (requireSigning) fail(text); else warn(text);
  }
  if (!/WIN_CSC_LINK/.test(workflow) || !/WIN_CSC_KEY_PASSWORD/.test(workflow)) {
    const text = 'release.yml has no Windows code-signing setup';
    if (requireSigning) fail(text); else warn(text);
  }
  if (!/runs-on:\s*windows-latest/.test(workflow) || !/Get-AuthenticodeSignature/.test(workflow)) {
    const text = 'release.yml does not build and verify the Windows installer on Windows';
    if (requireSigning) fail(text); else warn(text);
  }
  if (!/codesign --verify --deep --strict/.test(workflow)) {
    const text = 'release.yml does not verify the macOS signature';
    if (requireSigning) fail(text); else warn(text);
  }
}

if (requireSigning) {
  for (const name of [
    'SETPIECE_SIGN_IDENTITY',
    'APPLE_TEAM_ID',
    'APPLE_CERTIFICATE_P12',
    'APPLE_CERTIFICATE_PASSWORD',
    'APPLE_NOTARY_APPLE_ID',
    'APPLE_NOTARY_PASSWORD',
    'WIN_CSC_LINK',
    'WIN_CSC_KEY_PASSWORD',
  ]) {
    if (!process.env[name]) fail(`${name} is not set`);
  }
}

console.log(`release preflight: ${openfilm.version}`);
console.log(`  packages: ${[...versions].map(([pkg, version]) => `${pkg}@${version}`).join(', ')}`);
console.log(`  update feed: ${updates || 'disabled'}`);
console.log(`  signing: ${requireSigning ? 'required' : 'not required'}`);
for (const text of warnings) console.log(`  warning: ${text}`);
for (const text of problems) console.log(`  problem: ${text}`);
if (problems.length) {
  console.error(`\n${problems.length} release blocker${problems.length === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(warnings.length ? '\nRelease metadata is valid; warnings above are still open release work.' : '\nRelease metadata is valid.');
