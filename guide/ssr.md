# 서버 측 렌더링 (SSR) {#server-side-rendering}

:::tip 참고
SSR은 동일한 전체 사이트를 Node.js에서 동작시키고, 이를 HTML로 사전 렌더링 한 후, 마지막으로 이를 클라이언트의 프런트엔드 프레임워크(가령 React, Preact, Vue 및 Svelte와 같은)에서 가져오도록 하는 기능입니다. 만약 기존에 사용하고 있었던 서버 사이드 프레임워크와의 연동을 원한다면 [백엔드 프레임워크와 함께 사용하기](./backend-integration)를 참고하시기 바랍니다.

또한, 아래의 가이드는 선택한 프레임워크에서 SSR을 적용해 보았다고 가정하며, Vite에서는 이를 어떻게 적용할 수 있는지에 대한 세부 정보에만 초점을 맞추었습니다.
:::

:::warning 저수준 API
이 내용은 라이브러리 및 프레임워크 개발자들을 위한 저수준 API 입니다. 만약 일반적인 애플리케이션을 만드는 것이 목적이라면, 먼저 [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr)에서 SSR 플러그인과 관련 툴을 확인해주세요. Vite의 저수준의 네이티브 API 기반으로 많은 수의 프로젝트들이 성공적으로 구축되어 있습니다.
:::

:::tip Help
만약 질문하고자 한다면, [Vite Discord의 #ssr 채널](https://discord.gg/PkbxgzPhJv)을 방문해주세요.
:::

## 예제 프로젝트 {#example-projects}

Vite는 서버 측 렌더링(SSR, Server-side Rendering)을 기본적으로 지원합니다. Vite 플레이그라운드에서는 SSR 설정에 대한 Vue 3 및 React 예제를 제공하고 있으며, 이를 참고할 수 있습니다.

- [Vue 3](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue)
- [React](https://github.com/vitejs/vite-plugin-react/tree/main/playground/ssr-react)

## 프로젝트 구조 {#source-structure}

일반적으로 SSR 애플리케이션의 프로젝트 구조는 다음과 같습니다:

```
- index.html
- server.js # main application server
- src/
  - main.js          # 환경에 구애받지 않는(Env-agnostic) 범용 앱 코드로 내보내는(Export) 스크립트
  - entry-client.js  # 앱을 DOM 엘리먼트에 마운트하는 스크립트
  - entry-server.js  # 프레임워크의 SSR API를 사용해 앱을 렌더링하는 스크립트
```

`index.html`은 `entry-client.js`를 반드시 참조해야 하며, 서버에서 렌더링된 페이지를 삽입해야 하는 자리 표시자(Placeholder)를 포함해야 합니다:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

정확하게 바꿀 수 있다고 판단된다면, `<!--ssr-outlet-->` 대신 원하는 자리 표시자를 사용할 수도 있습니다.

## 조건부 논리 {#conditional-logic}

만약 SSR 또는 CSR(클라이언트 측 렌더링, Client-side Rendering) 여부에 따라 다른 코드를 실행하고자 하는 경우, 아래와 같이 조건부 논리 코드를 사용할 수 있습니다:

```js
if (import.meta.env.SSR) {
  // ... SSR 에서만 작동하는 코드
}
```

이러한 코드는 빌드 중에 정적으로 대체되기에, 사용하지 않는 분기문에 대해서는 트리-쉐이킹\*을 적용합니다. (\* 트리 셰이킹: Tree-shaking, 사용하지 않는 코드를 제거하는 기법 / [참고](https://webpack.js.org/guides/tree-shaking/))

## 개발 서버 구성하기 {#setting-up-the-dev-server}

SSR 앱을 빌드할 때, 메인 서버를 완전히 제어하고 Vite를 프로덕션 환경에서 분리하고자 한다면 어떻게 해야 할까요? 가장 좋은 방법은, Vite를 미들웨어 모드로 사용하는 것입니다. 가령 [Express](https://expressjs.com/)를 예로 들자면:

**server.js**

```js{14-17}
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // 미들웨어 모드로 Vite 서버를 생성하고 애플리케이션의 타입을 'custom'으로 설정합니다.
  // 이는 Vite의 자체 HTML 제공 로직을 비활성화하고, 상위 서버에서 이를 제어할 수 있도록 합니다.
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' },
    appType: 'custom'
  })

  // Vite를 미들웨어로 사용합니다.
  // 만약 Express 라우터(express.Router())를 사용하는 경우, router.use를 사용해야 합니다.
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // index.html 파일을 제공합니다 - 아래에서 이를 다룰 예정입니다.
  })

  app.listen(5173)
}

createServer()
```

여기서의 `vite`는 [ViteDevServer](./api-javascript#vitedevserver)의 인스턴스입니다. `vite.middlewares`는 [Connect](https://github.com/senchalabs/connect) 인스턴스이며, `Connect`는 미들웨어로 알려진 플러그인을 사용하는 Node.js용 HTTP 서버 프레임워크입니다.

다음 단계는 서버에서 렌더링된 HTML을 제공하기 위해 `*` 핸들러를 구현하는 것입니다:

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. index.html 파일을 읽어들입니다.
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    )

    // 2. Vite의 HTML 변환 작업을 통해 Vite HMR 클라이언트를 주입하고,
    //    Vite 플러그인의 HTML 변환도 적용합니다.
    //    (예시: @vitejs/plugin-react의 Global Preambles)
    template = await vite.transformIndexHtml(url, template)

    // 3. 서버의 진입점(Entry)을 로드합니다.
    //    ssrLoadModule은 Node.js에서 사용할 수 있도록 ESM 소스 코드를 자동으로 변환합니다.
    //    추가적인 번들링이 필요하지 않으며, HMR과 유사한 동작을 수행합니다.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. 앱의 HTML을 렌더링합니다.
    //    이는 entry-server.js에서 내보낸(Export) `render` 함수가
    //    ReactDOMServer.renderToString()과 같은 적절한 프레임워크의 SSR API를 호출한다고 가정합니다.
    const appHtml = await render(url)

    // 5. 렌더링된 HTML을 템플릿에 주입합니다.
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. 렌더링된 HTML을 응답으로 전송합니다.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // 만약 오류가 발생된다면, Vite는 스택트레이스(Stacktrace)를 수정하여
    // 오류가 실제 코드에 매핑되도록 재구성합니다.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

`package.json`의 `dev` 스크립트도 서버 스크립트를 사용하도록 변경해줍니다:

```diff
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## 프로덕션 빌드 {#building-for-production}

SSR 프로젝트를 프로덕션으로 제공하기 위해서는 다음이 필요합니다:

1. 클라이언트 빌드를 정상적으로 생성합니다.
2. Vite의 `ssrLoadModule`을 거칠 필요가 없도록 `import()` 함수를 통해 직접 로드할 수 있는 SSR 빌드를 생성합니다.

이를 위한 `package.json`의 스크립트는 다음과 같습니다:

```json
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

`--ssr` 플래그는 SSR 빌드임을 의미하며, SSR의 진입점(Entry)이 될 스크립트를 명시해줘야 합니다.

그 다음, `server.js`에서 `process.env.`<wbr>`NODE_ENV` 값을 확인하여 일부 프로덕션에 대한 특정 로직을 추가해줘야 합니다:

- 프로젝트 루트의 `index.html` 파일이 아닌, `dist/client/index.html`를 템플릿으로 사용하도록 합니다. 이 파일에 클라이언트 빌드에 대한 올바른 참조가 포함되어 있기 때문입니다.

- `await vite.ssrLoadModule('/src/entry-server.js')` 대신, `import('./dist/server/entry-server.js')`를 사용하여 스크립트를 로드하도록 합니다. (이 파일은 SSR 빌드 결과물 입니다.)

- `vite` 개발 서버의 생성과 모든 사용은 개발 전용으로 구분된 조건문 아래로 이동한 다음, `dist/client`를 통해 파일을 제공할 수 있도록 미들웨어를 추가해줍니다.

이 [Vue](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue) 및 [React](https://github.com/vitejs/vite-plugin-react/tree/main/playground/ssr-react) 데모를 참조해 자세한 프로젝트 구성을 확인할 수 있습니다.

## 사전 로드될 지시문 생성하기 {#generating-preload-directives}

`vite build`는 빌드 시 `ssr-manifest.json` 파일을 생성하도록 하는 `--ssrManifest` 플래그를 지원합니다.

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

위와 같이 구성된 스크립트는 클라이언트 빌드 시 `dist/client/ssr-manifest.json`을 생성합니다. 참고로 SSR 매니페스트 파일은 모듈 ID를 클라이언트 파일에 대해 매핑하고자 하기 때문에, 클라이언트 빌드에서 생성됩니다. 이 매니페스트 파일에는 모듈 ID와 관련된 청크 파일이나 에셋 파일에 대한 매핑이 포함되어 있습니다.

매니페스트 파일을 활용하고자 한다면, 프레임워크는 서버 렌더링 호출에서 사용된 컴포넌트의 모듈 ID를 수집하는 방법을 제공해야 합니다.

`@vitejs/plugin-vue`는 이를 이미 지원하고 있으며, 사용된 컴포넌트의 모듈 ID를 연결된 Vue SSR 컨텍스트에 자동으로 등록하도록 합니다:

```js
// src/entry-server.js
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules는 이제 렌더링 중에 사용된 모듈 ID의 집합(Set)입니다.
```

`server.js`의 프로덕션 분기문에서는 매니페스트 파일을 읽고, `src/entry-server.js`에서 내보낸(Export) `render` 함수에 전달해야 합니다. 이는 비동기 라우팅에서 사용되는 파일에 대한 사전 로드 지시문(Directives)을 렌더링하기에 충분한 정보를 제공합니다. 전체 예제는 [데모 소스 코드](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js)를 참고해주세요. 추가로 이 정보를 이용해 [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)를 사용할 수도 있습니다.

## 사전 렌더링 / SSG {#pre-rendering-ssg}

만약 어떤 라우트에 필요한 경로와 데이터를 미리 알고 있는 경우, 프로덕션 SSR과 동일한 로직을 사용하여 이를 정적 HTML 파일로 미리 렌더링할 수 있습니다. 이는 SSG(정적 사이트 생성, Static-Site Generation)의 한 형태로 생각할 수 있습니다. 동작하는 예제는 [사전 렌더링 데모 스크립트](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js)를 참고해주세요.

## SSR 외부화 {#ssr-externals}

SSR을 실행할 때 디펜던시는 기본적으로 Vite의 SSR 변환 모듈 시스템에서 "외부화(Externalized)"됩니다. 이는 개발 및 빌드 속도를 모두 향상시킵니다.

만약 특정 디펜던시가 외부화를 수행하지 않기를 원한다면 [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) 목록에 추가해주세요.

연결된 디펜던시의 경우, 기본적으로 Vite의 HMR을 활용하기 위해 외부화되지 않습니다. 만약 테스트를 위해 디펜던시가 연결되지 않은 것처럼 구성하고자 한다면 [`ssr.external`](../config/ssr-options.md#ssr-external)에 디펜던시를 추가해주세요.

:::warning 별칭을 사용하는 경우
만약 어떤 하나의 패키지를 다른 패키지를 리다이렉트하는 별칭을 사용하는 경우, 외부화된 SSR 디펜던시에서도 사용할 수 있도록 `node_modules` 패키지에 별칭을 지정할 수 있습니다. [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias)과 [pnpm](https://pnpm.js.org/en/aliases) 모두 `npm:` 접두사를 사용하여 별칭을 지정할 수 있습니다.
:::

## SSR 전용 플러그인 로직 {#ssr-specific-plugin-logic}

Vue 또는 Svelte와 같은 일부 프레임워크는 클라이언트 또는 SSR에 따라 컴포넌트를 다른 형식으로 컴파일합니다. 이 조건부 변환을 지원하기 위해, Vite는 `options` 객체에 존재하는 `ssr` 이라는 추가적인 인수를 아래의 플러그인 훅(Hook)에 전달합니다:

- `resolveId`
- `load`
- `transform`

**예제:**

```js
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // SSR인 경우에만 수행될 변환 작업 관련 코드들...
      }
    }
  }
}
```

`load`와 `transform` 메서드의 옵션 객체는 어디까지나 선택 사항일 뿐입니다. 현재 Rollup에서 이 객체를 사용하지는 않으나, 향후 메타데이터로 이를 확장할 수 있습니다.

:::tip 참고
Vite 2.7 이전에는 `options` 객체를 사용하는 대신 `ssr` 매개변수를 이용했습니다. 따라서 이와 관련된 모든 프레임워크와 플러그인이 업데이트 될 것이지만, 간혹 이전 API를 이용하는 경우를 마주할 수도 있습니다.
:::

## SSR 타겟 {#ssr-target}

기본적으로 SSR 빌드 타겟은 Node 환경이지만, 웹 워커를 통해 서버를 실행할 수도 있습니다. 패키지들의 진입점(Entry)은 플랫폼 별 다릅니다. `ssr.target`를 `'webworker'`로 설정하면 Web Worker를 통해 서버를 실행할 수 있습니다.

## SSR 번들 {#ssr-bundle}

특정 `webworker`와 같은 런타임에서, 하나의 JavaScript 파일로 SSR 빌드를 번들링하고자 할 수 있습니다. 이는 `ssr.noExternal`을 `true`로 설정해 가능하며, 아래의 두 가지 동작을 수행합니다.

- 모든 디펜던시를 `noExternal`로 처리합니다.
- Node.js 내장(Built-ins) 기능을 가져오면 오류가 발생됩니다.

## Vite CLI {#vite-cli}

`$ vite dev` 및 `$ vite preview` CLI 명령도 SSR 애플리케이션에 대해 사용할 수 있습니다. SSR 미들웨어는 [`configureServer`](/guide/api-plugin#configureserver)를 사용해 개발 서버에, 그리고 [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver)를 사용해 프리뷰 서버에 추가할 수 있습니다.

:::tip 참고
SSR 미들웨어가 Vite 미들웨어 _이후에_ 실행되기를 원한다면 포스트 훅을 사용하세요.
:::

## SSR Format {#ssr-format}

By default, Vite generates the SSR bundle in ESM. There is experimental support for configuring `ssr.format`, but it isn't recommended. Future efforts around SSR development will be based on ESM, and CommonJS remain available for backward compatibility. If using ESM for SSR isn't possible in your project, you can set `legacy.buildSsrCjsExternalHeuristics: true` to generate a CJS bundle using the same [externalization heuristics of Vite v2](https://v2.vitejs.dev/guide/ssr.html#ssr-externals).