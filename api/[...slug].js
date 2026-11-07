// T-020 飞书 API 转发（Vercel Serverless，CORS 代理）
// 路由：/api/*  →  https://open.feishu.cn/*
// 注意：Vercel 在非 Next.js 项目里 [...slug] 只匹配单段路径，
//       因此 vercel.json 用 rewrites 把原始路径以 __p 参数传入本函数。
const ALLOW = ['https://ningnl.github.io', 'http://localhost:8787', 'http://127.0.0.1:8787'];

// 允许：线上 Pages、任意端口本地调试、以及 file:// 打开时的 null origin
function isAllowed(origin) {
  if (!origin) return false;
  if (origin === 'null') return true;
  if (origin === 'https://ningnl.github.io') return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowOrigin = isAllowed(origin) ? origin : ALLOW[0];
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const q = Object.assign({}, req.query || {});
  let upstreamPath = q.__p;
  delete q.__p;
  if (Array.isArray(upstreamPath)) upstreamPath = upstreamPath.join('/');
  if (!upstreamPath) upstreamPath = (req.url || '/').replace(/^\/api/, '');
  upstreamPath = String(upstreamPath);
  if (upstreamPath.charAt(0) !== '/') upstreamPath = '/' + upstreamPath;

  const qs = new URLSearchParams(q).toString();
  const target = 'https://open.feishu.cn' + upstreamPath + (qs ? '?' + qs : '');

  const headers = { 'Content-Type': req.headers['content-type'] || 'application/json' };
  if (req.headers.authorization) headers.Authorization = req.headers.authorization;

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  }

  try {
    const upstream = await fetch(target, { method: req.method, headers, body });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (err) {
    res.status(502).json({ code: -1, msg: 'proxy error: ' + String((err && err.message) || err) });
  }
};
