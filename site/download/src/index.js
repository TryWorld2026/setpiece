const PRIMARY_HOST = 'setpiece.tryworld.com.cn';
const LEGACY_HOST = 'set.tryworld.com.cn';
const RELEASE_TAG = 'v0.3.2-preview.4';
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

const CHECKSUMS = `8f51db7d7431e9a5a2676ab15a4dd37ad27990482c45a2e8f417164f5d440cf9  macos-arm64/Setpiece-Preview-0.3.2-arm64-mac.zip
f102afe399fbdb41ad91a9e4b0d1aba4b4dd2bbe12eaed82c8ae4d238daed77a  macos-arm64/Setpiece-Preview-arm64.dmg
e77710b6e51f01fb3c730f2b5a92efae28445910a6f980dedac5fbade31be0eb  macos-x64/Setpiece-Preview-0.3.2-x64-mac.zip
da302c692fea5f3b25b42df7daf0670d0a23f5c53bebf827e1ae2ae581095693  macos-x64/Setpiece-Preview-x64.dmg
7f3c4093828514f4382fce8c38e81262b1debfb24ba1dfcfc8104cb11d5e8c68  windows-x64/Setpiece-Preview-Setup-x64.exe
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
