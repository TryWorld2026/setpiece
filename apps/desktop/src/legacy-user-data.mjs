/**
 * First-run migration for the desktop app's own data folder. Setpiece and its former TryWorld Set builds use a new
 * Chromium userData folder; the person's window, agent choices and browser preferences are copied there once, without
 * moving or deleting the old folder. Caches, locks and browser databases are deliberately left behind.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LEGACY_NAMES = Object.freeze({
  Setpiece: ['TryWorld Set', 'OpenFilm'],
  'Setpiece Dev': ['TryWorld Set Dev', 'OpenFilm Dev', 'OpenFilm'],
  'Setpiece Preview': ['TryWorld Set Preview', 'OpenFilm Preview', 'OpenFilm'],
});

const SETTINGS_DIRECTORIES = ['Local Storage'];

/** Copy files that do not exist in `to`, recursively, never overwriting what is already there. */
function copyMissing(from, to) {
  if (!existsSync(from)) return 0;
  const stat = statSync(from);
  if (!stat.isDirectory()) {
    if (existsSync(to)) return 0;
    mkdirSync(join(to, '..'), { recursive: true });
    copyFileSync(from, to);
    return 1;
  }
  mkdirSync(to, { recursive: true });
  let copied = 0;
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    copied += copyMissing(join(from, entry.name), join(to, entry.name));
  }
  return copied;
}

/**
 * Copy the old builds' small settings files into `appData/productName`, if they are not there yet.
 * @param {string} appData
 * @param {string} productName
 * @returns {{ from: string | null, files: number }}
 */
export function migrateLegacyUserData(appData, productName) {
  const destination = join(appData, productName);
  let files = 0;
  let from = null;
  for (const name of LEGACY_NAMES[productName] ?? []) {
    const source = join(appData, name);
    if (!existsSync(source) || source === destination) continue;
    const entries = readdirSync(source, { withFileTypes: true });
    let copied = 0;
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) copied += copyMissing(join(source, entry.name), join(destination, entry.name));
      else if (entry.isDirectory() && SETTINGS_DIRECTORIES.includes(entry.name)) copied += copyMissing(join(source, entry.name), join(destination, entry.name));
    }
    if (copied) {
      files += copied;
      from ??= source;
    }
  }
  return { from, files };
}
