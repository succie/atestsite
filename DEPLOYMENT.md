# Netlify Deployment Configuration (SSR)

このプロジェクトは Nuxt 2 + Vue 2 + TypeScript で構築されており、NetlifyでのSSR（Server-Side Rendering）に対応しています。

## 設定

### 1. Nuxt設定 (`nuxt.config.js`)

```js
export default {
  // Server-side rendering configuration  
  ssr: true,
  target: 'server'
}
```

### 2. Netlify設定 (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  functions = ".netlify/functions"
  publish = ".nuxt/dist/client"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/nuxt"
  status = 200
```

### 3. Netlify Function (`.netlify/functions/nuxt.js`)

```js
const { Nuxt } = require('nuxt')
const config = require('../../nuxt.config.js')

const nuxt = new Nuxt({ ...config, dev: false })

module.exports.handler = async (event, context) => {
  const result = await nuxt.renderRoute(event.path, { req: event, res: context })
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    },
    body: result.html
  }
}
```

## Netlifyでの設定手順

### 新規サイトの場合:
1. Netlifyにログイン
2. "New site from Git" を選択
3. GitHubリポジトリを選択
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.nuxt/dist/client`
   - **Functions directory**: `.netlify/functions`
   - **Node version**: 18

### 既存サイトの設定変更:
1. Netlify Dashboard → サイト選択
2. Site settings → Build & deploy → Build settings
3. Build command を `npm run build` に変更
4. Publish directory を `.nuxt/dist/client` に変更
5. Functions directory を `.netlify/functions` に設定
6. Environment variables → NODE_VERSION = 18 を追加

## ローカルでの確認

```bash
# ビルド
npm run build

# 本番モードで起動
npm run start
```

## 機能

- **SSR**: すべてのページがサーバーサイドでレンダリングされます
- **SEO最適化**: 初期HTMLに完全なコンテンツが含まれます
- **Analytics**: Microsoft Clarity、PT Engine、Mouseflowが正常に動作します
- **TypeScript**: 完全な型安全性