// T-020 飞书 API 转发（Vercel Serverless，CORS 代理）
// 路由：/api/*  →  https://open.feishu.cn/*
// 前端「代理基址」填：https://<你的域名>/api
const ALLOW = ['https://ningnl.github.io', 'http://localhost:8787', 'http://127.0.0.1:8787'];

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowOrigin = ALLOW.includes(origin) ? origin : ALLOW[0];
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const raw = req.url || '/';
  const pathWithQuery = raw.replace(/^\/api/, '');
  const target = 'https://open.feishu.cn' + pathWithQuery;

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
