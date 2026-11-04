const PRIMARY_HOST = 'setpiece.tryworld.com.cn';
const LEGACY_HOST = 'set.tryworld.com.cn';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === LEGACY_HOST) {
      url.hostname = PRIMARY_HOST;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
