/**
 * The `setpiece` command the chat's agents run: this app's copy of the package, so the Studio it finds is the one in
 * the window, at the version the window runs. A small script in the app's data folder, put first on the agents' PATH;
 * it runs the package's CLI with the app's own Node (Electron as Node). Reads no Electron module.
 *
 * SETPIECE_NO_UPDATE_CHECK (or the older OPENFILM_NO_UPDATE_CHECK): the CLI's "a newer Setpiece is out" notice is not
 * for this copy. The
 * app updates itself, and with it this command and the window's Studio: there is nothing for an agent to run.
 *
 * What the command alone needs from the app is set in it, not given to the agent: the app's ffmpeg first on its PATH
 * (`ffmpeg`) and the headless browser it draws pages in (`env`, PLAYWRIGHT_BROWSERS_PATH). The agent's own commands run
 * with the person's ffmpeg and their own browsers, as in their terminal.
 */
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { nodeBinary } from './node-runtime.mjs';

const require = createRequire(import.meta.url);

/** The package's CLI. */
export function setpieceCli() {
  const manifest = require.resolve('@tryworld/setpiece/package.json');
  const bin = JSON.parse(readFileSync(manifest, 'utf8')).bin.setpiece;
  return join(dirname(manifest), bin);
}

const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

/** The script's text: Electron as Node, running the CLI with whatever it was given, with the app's ffmpeg and `env`. */
export function commandScript(node, cli, { ffmpeg = null, env = {} } = {}) {
  const set = [...Object.entries(env).map(([k, v]) => `${k}=${sq(v)}`), ...(ffmpeg ? [`PATH=${sq(ffmpeg)}:"$PATH"`] : [])];
  return `#!/bin/sh\n# Setpiece's own copy of the setpiece command (written by the app; changes are lost)\n${set.map((s) => `${s} `).join('')}ELECTRON_RUN_AS_NODE=1 SETPIECE_NO_UPDATE_CHECK=1 exec ${sq(node)} ${sq(cli)} "$@"\n`;
}

/** The same for Windows: a `.cmd` (what a command line there finds as `setpiece`). */
export function commandScriptWindows(node, cli, { ffmpeg = null, env = {} } = {}) {
  const set = [...Object.entries(env).map(([k, v]) => `set "${k}=${v}"\r\n`), ...(ffmpeg ? [`set "PATH=${ffmpeg};%PATH%"\r\n`] : [])];
  return `@echo off\r\nrem Setpiece's own copy of the setpiece command (written by the app; changes are lost)\r\nsetlocal\r\n${set.join('')}set ELECTRON_RUN_AS_NODE=1\r\nset SETPIECE_NO_UPDATE_CHECK=1\r\n"${node}" "${cli}" %*\r\n`;
}

/**
 * Write the command into `<dir>/bin` and answer that folder, for PATH. `ffmpeg`: the app's ffmpeg folder, first on the
 * command's PATH; `env`: what else it runs with.
 */
export function installSetpieceCommand(dir, { node = nodeBinary(), platform = process.platform, ffmpeg = null, env = {} } = {}) {
  const bin = join(dir, 'bin');
  mkdirSync(bin, { recursive: true });
  if (platform === 'win32') {
    writeFileSync(join(bin, 'setpiece.cmd'), commandScriptWindows(node, setpieceCli(), { ffmpeg, env }));
    return bin;
  }
  const file = join(bin, 'setpiece');
  writeFileSync(file, commandScript(node, setpieceCli(), { ffmpeg, env }));
  chmodSync(file, 0o755);
  return bin;
}
