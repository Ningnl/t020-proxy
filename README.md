# t020-proxy · 飞书 API CORS 转发

给 https://ningnl.github.io/haowu-suansuan/ 用的极简转发层（Vercel Serverless）。

## 部署
1. 打开 https://vercel.com/new ，用 GitHub 账号登录
2. Import 本仓库 `Ningnl/t020-proxy` → 直接 Deploy（无需环境变量）
3. 得到形如 `https://t020-proxy-xxxx.vercel.app` 的域名

## 使用
在应用「设置 → 代理基址」填：`https://<你的域名>/api`

## 说明
- 只转发到 `open.feishu.cn`，不存任何密钥
- 允许来源：`https://ningnl.github.io`、本地预览地址
