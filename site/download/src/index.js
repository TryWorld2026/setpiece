const PRIMARY_HOST = 'setpiece.tryworld.com.cn';
const LEGACY_HOST = 'set.tryworld.com.cn';
const RELEASE_TAG = 'v0.3.2-preview.5';
const RELEASE_BASE = `https://github.com/TryWorld2026/setpiece/releases/download/${RELEASE_TAG}`;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 3;

export const DOWNLOAD_FILES = [
  'Setpiece-Preview-arm64.dmg',
  'Setpiece-Preview-0.3.2-arm64-mac.zip',
  'Setpiece-Preview-x64.dmg',
  'Setpiece-Preview-0.3.2-x64-mac.zip',
  'Setpiece-Preview-Setup-x64.exe',
  'SHA256SUMS.txt',
];

const CHECKSUMS = `420d9e94dca251f50f8961851070a994325b3e5e7c777c38bb3cbf172135ee15  macos-arm64/Setpiece-Preview-0.3.2-arm64-mac.zip
f2f145a4c291d5307c74c065fac7bc952a04f0120401ae28093a266c50e34ab4  macos-arm64/Setpiece-Preview-arm64.dmg
027f14852b885c6c5a4c5a7e14e4e6cc5f5011a11f96d381078febbd929bde8f  macos-x64/Setpiece-Preview-0.3.2-x64-mac.zip
50a43ce3697a17020fe2b5d90a8d008f8c2cab97495ea11cc718268474a9f22d  macos-x64/Setpiece-Preview-x64.dmg
a09d7aa4a1110b4a0ac3cd39674e8b05b3cfeb13b598ee928dd9916075f9010c  windows-x64/Setpiece-Preview-Setup-x64.exe
`;

const passthroughHeaders = (headers) => {
  const forwarded = new Headers();
  for (const name of ['content-type', 'content-length', 'content-disposition', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
    const value = headers.get(name);
    if (value) forwarded.set(name, value);
  }
  return forwarded;
};

const fetchInstaller = async (request, url) => {
  let next = url;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await fetch(new Request(next, request), { redirect: 'manual' });
    if (!REDIRECT_STATUSES.has(response.status)) return response;
    const location = response.headers.get('location');
    if (!location || redirects === MAX_REDIRECTS) return response;
    next = new URL(location, next).toString();
  }
  throw new Error('Too many redirects');
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === LEGACY_HOST) {
      url.hostname = PRIMARY_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/checksums' || url.pathname === '/checksums/') {
      return new Response(CHECKSUMS, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'public, max-age=300, must-revalidate',
        },
      });
    }

    const downloadPrefix = '/downloads/';
    if (url.pathname.startsWith(downloadPrefix)) {
      let filename;
      try {
        filename = decodeURIComponent(url.pathname.slice(downloadPrefix.length));
      } catch {
        return env.ASSETS.fetch(new Request(new URL('/404', url), request));
      }
      if (!DOWNLOAD_FILES.includes(filename)) return env.ASSETS.fetch(new Request(new URL('/404', url), request));

      try {
        const upstream = `${RELEASE_BASE}/${encodeURIComponent(filename)}`;
        const response = await fetchInstaller(request, upstream);
        if (REDIRECT_STATUSES.has(response.status)) return new Response('Download temporarily unavailable.', { status: 502 });
        const headers = passthroughHeaders(response.headers);
        headers.set('content-disposition', `attachment; filename="${filename}"`);
        return new Response(request.method === 'HEAD' ? null : response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch {
        return new Response('Download temporarily unavailable.', { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
