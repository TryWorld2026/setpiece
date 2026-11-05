import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

test('Settings uses only official product and support links', async () => {
  const source = await read('./settings/SettingsModal.tsx');

  assert.doesNotMatch(source, /https:\/\/github\.com/);
  assert.doesNotMatch(source, /settings\.links\.github/);
  assert.match(source, /settings\.links\.guide/);
  assert.match(source, /settings\.links\.support/);
  assert.match(source, /https:\/\/setpiece\.tryworld\.com\.cn\/guide\//);
  assert.match(source, /https:\/\/setpiece\.tryworld\.com\.cn\/support\//);
});

test('What is New links to the official guide instead of a code host', async () => {
  const source = await read('./WhatsNew.tsx');

  assert.doesNotMatch(source, /https:\/\/github\.com/);
  assert.match(source, /https:\/\/setpiece\.tryworld\.com\.cn\/guide\//);
});
