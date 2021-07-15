# 👷 Elytra Worker | URL Shortener with CloudFlare Workers

A URL Shortener running on CloudFlare Workers.

### Demo

##### BuiltIn
- [Repository (/)](https://elytra.cn)
- [Mappings (/mappings)](https://elytra.cn/mappings)

##### Mappings
- [Mappings (/source)](https://elytra.cn/source)
- [CurseForge Stoneblock 2 (/mc/modpack/stoneblock2)](https://elytra.cn/mc/modpack/stoneblock2)

### 配置与部署

##### 配置
1. 先把本项目 clone 到你本地。
1. 在 `index.js` 中找到 `mappingsUrl`，把他改成你的短网址映射表的地址。映射表应该是一个 JSON，其中 key 为路径（pathname），value 为目标网址。
1. 在 `index.js` 中找到 `builtIn`，把一些奇奇怪怪的内建映射表改掉。不想要可以直接留空。
1. 配置结束，后面是部署。

##### 用 Wrangler 部署
1. 确保你本地有 CloudFlare 的 `wrangler`，或者选择手动部署。[安装教程](https://developers.cloudflare.com/workers/get-started/guide#2-install-the-workers-cli)
1. 打开 `wrangler.toml`，把其中的 `route` 和 `zone_id` 改成你 `域名` 和 `区域ID`。详见[这里](https://developers.cloudflare.com/workers/get-started/guide#7-configure-your-project-for-deployment)
1. 然后目录中运行 `wrangler publish --env production`，wrangler 就会自动帮你部署了。

##### 用 Hand 部署
1. 打开你的 CloudFlare 面板，找到你要绑的域名，打开 `Workers`。
1. 点击 `管理 Workers`，`创建 Worker`，在 `脚本` 框里把 `index.js` 的内容丢进去，点 `保存并部署`。
1. 然后回到 CloudFlare 面板，找到您要绑的域名，打开 `Workers`。
1. 点击`添加路由`，把对应的路由路径填进去，`Worker`选你刚才创建的。
1. 完事。