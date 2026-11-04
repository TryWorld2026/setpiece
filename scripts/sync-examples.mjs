#!/usr/bin/env node
/**
 * `pnpm examples:sync`: the examples index and the posters it names, copied from this repository's examples folder
 * into packages/openfilm/examples-index, which the npm package and the desktop app take with them. Studio shows
 * these at once, before the index on GitHub is read (studio/server/examples.mjs): the films themselves are fetched
 * when one is opened. This folder is replaced whole.
 *
 *   pnpm examples:sync            from this repository's examples folder
 *   pnpm examples:sync <folder>   from another checkout
 *   pnpm examples:sync --check    exit 1 when the copy here differs
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TO = join(ROOT, 'packages', 'openfilm', 'examples-index');
const REPO = 'https://github.com/TryWorld2026/setpiece';

const args = process.argv.slice(2);
const check = args.includes('--check');
const from = resolve(args.find((a) => !a.startsWith('--')) ?? join(ROOT, 'examples'));
const checkout = dirname(from);
const fail = (/** @type {string} */ why) => { console.error(`examples:sync: ${why}`); process.exit(1); };

if (!existsSync(join(from, 'examples.json'))) fail(`${from} is not a checkout of ${REPO}: clone it beside this repository, or name one`);
const git = (/** @type {string[]} */ a) => execFileSync('git', ['-C', from, ...a], { encoding: 'utf8' }).trim();
if (git(['status', '--porcelain', '--', 'examples.json'])) fail(`${from}/examples.json has changes not committed: commit them first`);

const index = JSON.parse(readFileSync(join(from, 'examples.json'), 'utf8'));
/* the posters it names, as paths in the repository (an address stays an address) */
const posters = (Array.isArray(index.examples) ? index.examples : [])
  .map((e) => e?.poster).filter((p) => typeof p === 'string' && !/^https?:\/\//.test(p) && !p.split('/').includes('..'));
const wanted = ['examples.json', ...posters];
/** The index is in `examples/`; posters are paths from the repository root, as the index writes them. */
const sourceOf = (/** @type {string} */ f) => (f === 'examples.json' ? join(from, f) : join(checkout, f));

if (check) {
  const differ = wanted.filter((f) => !existsSync(join(TO, f)) || !readFileSync(sourceOf(f)).equals(readFileSync(join(TO, f))));
  if (differ.length) fail(`the copy differs in ${differ.join(', ')}: run pnpm examples:sync`);
  console.log(`examples:sync: packages/openfilm/examples-index matches ${REPO}/examples`);
  process.exit(0);
}

for (const f of posters) if (!existsSync(sourceOf(f))) fail(`${f}, a poster examples.json names, is not in ${checkout}`);
rmSync(TO, { recursive: true, force: true });
for (const f of wanted) {
  mkdirSync(dirname(join(TO, f)), { recursive: true });
  copyFileSync(sourceOf(f), join(TO, f));
}
console.log(`examples:sync: the index and ${posters.length} posters from ${from} → ${relative(ROOT, TO)}`);
