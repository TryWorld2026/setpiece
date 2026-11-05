import assert from 'node:assert/strict';
import test from 'node:test';

import worker, { DOWNLOAD_FILES } from './index.js';

const makeAsset = (response) => ({ fetch: async () => response });

test('the legacy host redirects to the primary host', async () => {
  const response = await worker.fetch(
    new Request('https://set.tryworld.com.cn/?x=1'),
    { ASSETS: makeAsset(new Response('not used')) },
  );

  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://setpiece.tryworld.com.cn/?x=1');
});

test('unknown download files are not forwarded to a release host', async () => {
  const response = await worker.fetch(
    new Request('https://setpiece.tryworld.com.cn/downloads/private-key.txt'),
    { ASSETS: makeAsset(new Response('not found', { status: 404 })) },
  );

  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'not found');
});

test('known download files proxy through the official site and preserve a range request', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (request) => {
    calls.push(request);
    return new Response('installer', {
      status: 206,
      headers: {
        'content-type': 'application/octet-stream',
        'content-range': 'bytes 0-8/9',
      },
    });
  };

  try {
    const response = await worker.fetch(
      new Request(`https://setpiece.tryworld.com.cn/downloads/${DOWNLOAD_FILES[0]}`, {
        headers: { range: 'bytes=0-9' },
      }),
      { ASSETS: makeAsset(new Response('not used')) },
    );

    assert.equal(response.status, 206);
    assert.equal(await response.text(), 'installer');
    assert.equal(response.headers.get('content-disposition'), `attachment; filename="${DOWNLOAD_FILES[0]}"`);
    assert.equal(response.headers.get('content-range'), 'bytes 0-8/9');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].headers.get('range'), 'bytes=0-9');
    assert.equal(calls[0].url, `https://github.com/TryWorld2026/setpiece/releases/download/v0.3.2-preview.4/${DOWNLOAD_FILES[0]}`);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('the download proxy follows release redirects without exposing them to the browser', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (request, options) => {
    calls.push({ request, options });
    if (calls.length === 1) {
      return new Response(null, {
        status: 302,
        headers: { location: 'https://release-assets.example.test/installer?token=once' },
      });
    }
    return new Response('installer bytes', {
      status: 200,
      headers: {
        'content-type': 'application/octet-stream',
        'content-length': '15',
        'etag': '"installer"',
      },
    });
  };

  try {
    const response = await worker.fetch(
      new Request(`https://setpiece.tryworld.com.cn/downloads/${DOWNLOAD_FILES[4]}`, {
        headers: { range: 'bytes=0-14' },
      }),
      { ASSETS: makeAsset(new Response('not used')) },
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('content-disposition'), `attachment; filename="${DOWNLOAD_FILES[4]}"`);
    assert.equal(await response.text(), 'installer bytes');
    assert.equal(calls.length, 2);
    assert.equal(calls[0].options.redirect, 'manual');
    assert.equal(calls[1].request.url, 'https://release-assets.example.test/installer?token=once');
    assert.equal(calls[1].request.headers.get('range'), 'bytes=0-14');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('a HEAD download has no response body', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('ignored', {
    status: 200,
    headers: { 'content-length': '274540447', 'content-type': 'application/octet-stream' },
  });

  try {
    const response = await worker.fetch(
      new Request(`https://setpiece.tryworld.com.cn/downloads/${DOWNLOAD_FILES[4]}`, { method: 'HEAD' }),
      { ASSETS: makeAsset(new Response('not used')) },
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-length'), '274540447');
    assert.equal(await response.text(), '');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('the checksum document is served from the official site', async () => {
  const response = await worker.fetch(
    new Request('https://setpiece.tryworld.com.cn/checksums'),
    { ASSETS: makeAsset(new Response('not found', { status: 404 })) },
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/plain/);
  assert.match(await response.text(), /Setpiece-Preview-Setup-x64\.exe/);
});

test('ordinary pages still come from static assets', async () => {
  const response = await worker.fetch(
    new Request('https://setpiece.tryworld.com.cn/guide/'),
    { ASSETS: makeAsset(new Response('guide', { status: 200 })) },
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'guide');
});
