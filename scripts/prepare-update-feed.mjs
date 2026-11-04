#!/usr/bin/env node
/**
 * Turn the electron-builder feed files attached to a public GitHub release into the three static feed files the app
 * requests:
 *
 *   /updates/mac/arm64/latest-mac.yml  (or beta-mac.yml)
 *   /updates/mac/x64/latest-mac.yml    (or beta-mac.yml)
 *   /updates/win/x64/latest.yml         (or beta.yml)
 *
 * The archives stay on GitHub; the feed files are small and are deployed with the download page. Each `url` in a feed
 * is rewritten to the release's absolute asset URL, because electron-updater resolves relative URLs against the feed
 * itself.
 *
 *   node scripts/prepare-update-feed.mjs \
 *     --tag v0.3.1 --repository TryWorld2026/setpiece \
 *     --source .feed-source --output site/download/public/updates --channel stable \
 *     --assets .feed-source/assets.txt
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i];
  const value = process.argv[i + 1];
  if (!key?.startsWith('--') || value == null) throw new Error(`expected --name value, got ${key ?? 'nothing'}`);
  args.set(key.slice(2), value);
}

const tag = args.get('tag')?.trim() || '';
const repository = args.get('repository')?.trim() || '';
const source = resolve(args.get('source')?.trim() || '.feed-source');
const output = resolve(args.get('output')?.trim() || 'site/download/public/updates');
const channel = args.get('channel')?.trim() || '';

if (!/^v?[0-9A-Za-z][0-9A-Za-z._-]*$/.test(tag)) throw new Error('--tag must be a release tag such as v0.3.1');
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('--repository must be owner/name');
if (channel !== 'stable' && channel !== 'beta') throw new Error('--channel must be stable or beta');

const assetsFile = args.get('assets')?.trim();
const assets = assetsFile && existsSync(resolve(assetsFile))
  ? new Set(readFileSync(resolve(assetsFile), 'utf8').split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
  : null;
const releaseBase = `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/`;

const targets = [
  { source: 'latest-mac-arm64.yml', output: `mac/arm64/${channel === 'beta' ? 'beta-mac.yml' : 'latest-mac.yml'}` },
  { source: 'latest-mac-x64.yml', output: `mac/x64/${channel === 'beta' ? 'beta-mac.yml' : 'latest-mac.yml'}` },
  { source: 'latest.yml', output: `win/x64/${channel === 'beta' ? 'beta.yml' : 'latest.yml'}` },
];

for (const target of targets) {
  const input = join(source, target.source);
  if (!existsSync(input)) throw new Error(`${input} is missing: upload the architecture-specific feed from the release build`);
  const text = readFileSync(input, 'utf8');
  if (!/^version:\s*\S+/m.test(text)) throw new Error(`${target.source} has no version`);
  if (!/^\s*-\s*url:\s*\S+/m.test(text) && !/^\s+url:\s*\S+/m.test(text)) throw new Error(`${target.source} has no file url`);
  if (!/sha512:\s*\S+/m.test(text) || !/size:\s*\d+/m.test(text)) throw new Error(`${target.source} has no checksum and size`);

  let rewritten = text.replace(/^(\s*-\s*url:\s*)(.*?)(\s*)$/gm, (line, prefix, raw, suffix) => {
    const value = unquote(raw.trim());
    if (!value) throw new Error(`${target.source} has an empty url`);
    const name = value.startsWith('http://') || value.startsWith('https://') ? value : `${releaseBase}${encodeURIComponent(value)}`;
    if (assets && !value.startsWith('http://') && !value.startsWith('https://') && !assets.has(value)) {
      throw new Error(`${target.source} names ${value}, which is not an uploaded release asset`);
    }
    return `${prefix}${name}${suffix}`;
  });
  rewritten = rewritten.replace(/^(path:\s*)(.*?)(\s*)$/m, (line, prefix, raw, suffix) => {
    const value = unquote(raw.trim());
    if (!value || value.startsWith('http://') || value.startsWith('https://')) return line;
    if (assets && !assets.has(value)) throw new Error(`${target.source} names ${value}, which is not an uploaded release asset`);
    return `${prefix}${releaseBase}${encodeURIComponent(value)}${suffix}`;
  });
  if (!rewritten.includes(releaseBase)) throw new Error(`${target.source} did not name any release asset`);

  const destination = join(output, target.output);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, rewritten);
  console.log(`${input} -> ${destination}`);
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}
