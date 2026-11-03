#!/usr/bin/env node
// @ts-check
/**
 * `npm run dev`: Studio from this checkout, beside an installed Setpiece. Its state and exports are in .dev/
 * (git-ignored), its projects in the same library as every Setpiece's (the one ~/.openfilm says, by default
 * ~/Movies/OpenFilm/Projects on macOS), and it listens on port 4848 (SETPIECE_STUDIO_PORT for another). The editor is rebuilt when
 * studio/ui changes (reload the page); Studio restarts when studio/server or src change. It opens a sample project in
 * your browser (SETPIECE_NO_BROWSER=1: it only prints the address). Ctrl+C stops it all.
 *
 * It also writes .dev/bin/setpiece (and .cmd on Windows), with twset as a compatibility alias: this checkout's command
 * on this Studio, for your own agent to try your changes with.
 */
import { spawn } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, watch, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEV = join(ROOT, '.dev');
/* the official skills from a checkout of openfilm/skills beside this repository, when there is one, so a change to a
   skill shows at once; without one, the copy this package releases */
const SKILLS = join(ROOT, '..', '..', '..', 'skills', 'skills');
const env = {
  ...process.env,
  ...(existsSync(SKILLS) && !process.env.SETPIECE_OFFICIAL_SKILLS && !process.env.OPENFILM_OFFICIAL_SKILLS
    ? { SETPIECE_OFFICIAL_SKILLS: SKILLS } : {}),
  SETPIECE_HOME: join(DEV, 'home'),
  SETPIECE_EXPORTS: join(DEV, 'exports'),
  /* the person's library, wherever they chose to keep it (src/locations.mjs) */
  SETPIECE_SHARED_HOME: process.env.SETPIECE_SHARED_HOME || process.env.OPENFILM_SHARED_HOME || join(homedir(), '.openfilm'),
  SETPIECE_STUDIO_PORT: process.env.SETPIECE_STUDIO_PORT || process.env.OPENFILM_STUDIO_PORT || '4848',
  SETPIECE_NO_UPDATE_CHECK: '1',
  /* Studio itself, without the supervisor `openfilm open` gives it: this script starts it again when its code changes */
  SETPIECE_STUDIO_WORKER: '1',
};

/* one `pnpm dev` per checkout: two would share .dev/home and fight over the port, the loser taking another one and
   writing it into run.json, so the agent's `openfilm` (and its browser) would point at a Studio that moves on every
   restart and is refused in between */
mkdirSync(DEV, { recursive: true });
const LOCK = join(DEV, 'dev.pid');
const holder = (() => { try { return Number(readFileSync(LOCK, 'utf8').trim()) || null; } catch { return null; } })();
const alive = (/** @type {number} */ pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
if (holder && holder !== process.pid && alive(holder)) {
  console.error(`pnpm dev is already running for this checkout (pid ${holder}). Use that one, or stop it first: kill ${holder}`);
  process.exit(1);
}
writeFileSync(LOCK, `${process.pid}\n`);
process.on('exit', () => {
  try { if (Number(readFileSync(LOCK, 'utf8').trim()) === process.pid) rmSync(LOCK); } catch { /* gone already */ }
});

/* this checkout's `setpiece` on this Studio, for your agent: the same environment, and it names itself in the manual */
const BIN = join(DEV, 'bin');
mkdirSync(BIN, { recursive: true });
const CLI = join(ROOT, 'bin', 'twset.mjs');
const SHARED = ['SETPIECE_HOME', 'SETPIECE_LIBRARY', 'SETPIECE_SHARED_HOME', 'SETPIECE_EXPORTS', 'SETPIECE_STUDIO_PORT', 'SETPIECE_NO_UPDATE_CHECK', 'SETPIECE_OFFICIAL_SKILLS'].filter((k) => env[k]);
const sh = join(BIN, 'setpiece');
writeFileSync(sh, `#!/bin/sh\n${SHARED.map((k) => `export ${k}='${env[k]}'`).join('\n')}\nexec '${process.execPath}' '${CLI}' "$@"\n`);
chmodSync(sh, 0o755);
const alias = join(BIN, 'twset');
writeFileSync(alias, `#!/bin/sh\nexec "${sh}" "$@"\n`);
chmodSync(alias, 0o755);
if (process.platform === 'win32') {
  const cmd = `@echo off\r\n${SHARED.map((k) => `set "${k}=${env[k]}"`).join('\r\n')}\r\n"${process.execPath}" "${CLI}" %*\r\n`;
  writeFileSync(join(BIN, 'setpiece.cmd'), cmd);
  writeFileSync(join(BIN, 'twset.cmd'), cmd);
}

const command = process.platform === 'win32' ? join(BIN, 'setpiece.cmd') : sh;

/* a small film to open: one page, drawn by frame(t) */
const SAMPLE = join(DEV, 'sample');
if (!existsSync(join(SAMPLE, 'film.html'))) {
  mkdirSync(SAMPLE, { recursive: true });
  writeFileSync(join(SAMPLE, 'film.html'), `<meta name="viewport" content="width=1920, height=1080">
<section>
  <iframe src="title.html"></iframe>
</section>
`);
  writeFileSync(join(SAMPLE, 'title.html'), `<!doctype html>
<style>
  body { margin: 0; width: 1920px; height: 1080px; background: #0b0d12; display: grid; place-items: center; }
  h1 { font: 700 120px system-ui, sans-serif; color: #fff; }
</style>
<h1 id="title">Hello, Setpiece</h1>
<script type="module">
const title = document.getElementById('title');
window.film = {
  duration: 4,
  frame(t) {
    const k = Math.min(1, t / 1.2);
    title.style.opacity = String(k);
    title.style.transform = \`translateY(\${(1 - k) * 40}px)\`;
  },
};
</script>
`);
}

/** @type {import('node:child_process').ChildProcess[]} */
const children = [];
const run = (/** @type {string[]} */ args) => {
  const child = spawn(process.execPath, args, { cwd: ROOT, env, stdio: 'inherit' });
  children.push(child);
  child.once('exit', () => { const i = children.indexOf(child); if (i >= 0) children.splice(i, 1); });
  return child;
};

/* the editor: built again on every change to studio/ui; Studio serves the files from disk */
run([join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'build', '--watch', '--config', 'studio/ui/vite.config.ts']);

/* Studio, started again when its code changes (pages open on it reconnect by themselves) */
let server = run(['studio/server/main.mjs']);
let timer = /** @type {NodeJS.Timeout | undefined} */ (undefined);
const restart = (/** @type {string | null} */ file) => {
  if (!file || /\.test\.|\.d\.mts$/.test(file)) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`\n${file} changed: restarting Studio`);
    const old = server;
    /* one that stopped by itself (an error on load) is simply started again */
    if (old.exitCode != null || old.signalCode != null) server = run(['studio/server/main.mjs']);
    else { old.once('exit', () => { server = run(['studio/server/main.mjs']); }); old.kill(); }
  }, 200);
};
for (const dir of ['studio/server', 'src']) watch(join(ROOT, dir), { recursive: true }, (_, file) => restart(file && `${dir}/${file}`));

/* once Studio says where it listens (run.json), open the sample in it */
const runFile = join(env.SETPIECE_HOME, 'run.json');
for (const end = Date.now() + 30_000; Date.now() < end; await new Promise((r) => setTimeout(r, 250))) {
  let up;
  try { up = JSON.parse(readFileSync(runFile, 'utf8')); } catch { continue; }
  if (up.pid !== server.pid) continue;
  const quiet = Boolean(process.env.SETPIECE_NO_BROWSER ?? process.env.OPENFILM_NO_BROWSER);
  const res = await fetch(`${up.origin}/api/open`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-studio-key': up.key },
    body: JSON.stringify({ path: SAMPLE, now: !quiet, fallback: 0 }),
  }).catch((e) => ({ ok: false, json: async () => ({ error: e.message }) }));
  const said = await res.json();
  console.log(res.ok ? `\nStudio (dev)  ${said.url}\nhome          ${env.SETPIECE_HOME}\nyour agent    tell it to run ${command}: this checkout, on this Studio\n` : `\ncould not open the sample: ${said.error}\n`);
  break;
}

const stop = () => {
  for (const child of children) child.kill();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
