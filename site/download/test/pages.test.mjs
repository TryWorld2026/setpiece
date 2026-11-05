import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pages = [
  'index.html',
  'guide/index.html',
  'support/index.html',
  'legal/eula/index.html',
  'legal/privacy/index.html',
];

for (const page of pages) {
  test(`${page} keeps users on first-party pages`, async () => {
    const html = await readFile(new URL(`../public/${page}`, import.meta.url), 'utf8');

    assert.doesNotMatch(html, /https?:\/\/github\.com|https?:\/\/www\.github\.com/i);
    assert.doesNotMatch(html, /\bOpenFilm\b|\bMIT\b|开源|基于\s*OpenFilm/i);
    assert.doesNotMatch(html, /href="#"/);
    assert.doesNotMatch(html, /\{\{[A-Z_0-9]+\}\}/);
  });
}

test('all platform download links point to the official download route', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const downloads = hrefs.filter((href) => href.includes('Setpiece-Preview') || href.includes('SHA256SUMS'));

  assert.equal(downloads.length, 6);
  assert.ok(downloads.every((href) => href.startsWith('/downloads/')));
});

test('the guide and support pages are linked from the landing page', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

  assert.match(html, /href="\/guide\/"/);
  assert.match(html, /href="\/support\/"/);
  assert.match(html, /href="\/checksums"/);
});
