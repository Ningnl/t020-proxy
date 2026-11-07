# t020-proxy · 飞书 API CORS 转发

给 https://ningnl.github.io/haowu-suansuan/ 用的极简转发层（Vercel Serverless）。

## 部署状态
- 路由：`/api/*` → `https://open.feishu.cn/*`
- 健康页：`/`（应显示「t020-proxy 运行中」）
- 前端「设置 → 代理基址」填：`https://<你的域名>/api`

## 重新部署
Vercel 项目 t020-proxy → Deployments → 最新 → Redeploy；
或本地：`npx vercel --prod`（需登录）。

## 说明
- 只转发到 open.feishu.cn，不存任何密钥
- 允许来源：https://ningnl.github.io、本地预览地址
