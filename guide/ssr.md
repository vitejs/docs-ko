# 서버 측 렌더링 (SSR) {#server-side-rendering-ssr}

:::tip 참고
SSR은 동일한 애플리케이션을 Node.js에서 실행하고, 이를 HTML로 사전 렌더링한 뒤, 마지막으로 클라이언트에서 하이드레이션하는 것을 지원하는 프런트엔드 프레임워크(예: React, Preact, Vue 및 Svelte)를 구체적으로 가리킵니다. 기존 서버 사이드 프레임워크와의 연동을 찾고 있다면, 대신 [백엔드 연동 가이드](./backend-integration)를 확인하세요.

또한 아래의 가이드는 선택한 프레임워크에서 SSR을 사용해 본 경험이 있다고 가정하며, Vite에 특화된 연동 세부 사항에만 초점을 맞춥니다.
:::

:::warning 저수준 API
이 내용은 라이브러리 및 프레임워크 개발자들을 위한 저수준 API 입니다. 만약 일반적인 애플리케이션을 만드는 것이 목적이라면, 먼저 [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr)에서 SSR 플러그인과 관련 툴을 확인해주세요. Vite의 저수준의 네이티브 API 기반으로 많은 수의 프로젝트들이 성공적으로 구축되어 있습니다.

현재 Vite는 [환경 API](https://github.com/vitejs/vite/discussions/16358)를 통해 개선된 SSR API를 개발 중입니다. 자세한 내용은 링크를 확인해 주세요.
:::

## 예제 프로젝트 {#example-projects}

Vite는 서버 측 렌더링(SSR, Server-side Rendering)을 기본적으로 지원합니다. [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) 리포지토리에서 이 가이드의 참고 자료로 사용할 수 있는 SSR 설정에 대한 예제를 볼 수 있습니다:

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

[create-vite를 실행하고](./index.md#scaffolding-your-first-vite-project) 프레임워크 옵션에서 `Others > create-vite-extra`를 선택하면 이 프로젝트들을 로컬에서도 생성할 수 있습니다.

## 프로젝트 구조 {#source-structure}

일반적으로 SSR 애플리케이션의 프로젝트 구조는 다음과 같습니다:

```
- index.html
- server.js # main application server
- src/
  - main.js          # 환경에 구애받지 않는(범용) 앱 코드를 내보냅니다
  - entry-client.js  # 앱을 DOM 엘리먼트에 마운트합니다
  - entry-server.js  # 프레임워크의 SSR API를 사용해 앱을 렌더링합니다
```

`index.html`은 `entry-client.js`를 반드시 참조해야 하며, 서버에서 렌더링된 마크업을 삽입해야 하는 자리 표시자를 포함해야 합니다:

```html [index.html]
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

정확하게 바꿀 수 있다고 판단된다면, `<!--ssr-outlet-->` 대신 원하는 자리 표시자를 사용할 수도 있습니다.

## 조건부 논리 {#conditional-logic}

SSR과 클라이언트 중 어느 쪽인지에 따라 조건부 논리를 수행해야 한다면, 다음을 사용할 수 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... 서버에서만 실행되는 로직
}
```

이러한 코드는 빌드 중에 정적으로 대체되기에, 사용하지 않는 분기문에 대해서는 트리 셰이킹을 적용합니다.

## 개발 서버 구성하기 {#setting-up-the-dev-server}

SSR 앱을 빌드할 때, 메인 서버를 완전히 제어하고 Vite를 프로덕션 환경에서 분리하고자 하는 경우가 많습니다. 따라서 Vite를 미들웨어 모드로 사용하는 것을 권장합니다. [express](https://expressjs.com/)를 사용한 예시는 다음과 같습니다:

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 미들웨어 모드로 Vite 서버를 생성하고 앱 타입을
  // 'custom'으로 설정하여, Vite의 자체 HTML 제공 로직을 비활성화하고
  // 상위 서버가 제어할 수 있도록 합니다.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // vite의 connect 인스턴스를 미들웨어로 사용합니다. 자체
  // express 라우터(express.Router())를 사용하는 경우 router.use를 사용해야 합니다.
  // 서버가 다시 시작되어도(예: 사용자가 vite.config.js를 수정한 후)
  // `vite.middlewares`는 여전히 동일한 참조를 유지합니다.
  // (새 내부 스택의 Vite 및 플러그인이 주입한 미들웨어와 함께)
  // 다음은 재시작 후에도 유효합니다.
  app.use(vite.middlewares)

  app.use('*all', async (req, res) => {
    // index.html을 제공합니다 - 다음에서 이를 다룰 예정입니다.
  })

  app.listen(5173)
}

createServer()
```

여기서 `vite`는 [ViteDevServer](./api-javascript#vitedevserver)의 인스턴스입니다. `vite.middlewares`는 connect와 호환되는 모든 Node.js 프레임워크에서 미들웨어로 사용할 수 있는 [Connect](https://github.com/senchalabs/connect) 인스턴스입니다.

다음 단계는 서버에서 렌더링된 HTML을 제공하기 위해 `*` 핸들러를 구현하는 것입니다:

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*all', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. index.html을 읽어들입니다.
    let template = fs.readFileSync(
      path.resolve(import.meta.dirname, 'index.html'),
      'utf-8',
    )

    // 2. Vite HTML 변환을 적용합니다. 이는 Vite HMR 클라이언트를 주입하고,
    //    Vite 플러그인의 HTML 변환도 적용합니다. 예를 들어
    //    @vitejs/plugin-react의 전역 preamble이 있습니다.
    template = await vite.transformIndexHtml(url, template)

    // 3. 서버 진입점을 로드합니다. ssrLoadModule은 Node.js에서 사용할 수 있도록
    //    ESM 소스 코드를 자동으로 변환합니다! 번들링이 필요하지 않으며,
    //    HMR과 유사한 효율적인 무효화를 제공합니다.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. 앱 HTML을 렌더링합니다. 이는 entry-server.js에서 익스포트한
    //     `render` 함수가 적절한 프레임워크 SSR API를 호출한다고 가정합니다.
    //    예: ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. 앱에서 렌더링한 HTML을 템플릿에 주입합니다.
    const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

    // 6. 렌더링된 HTML을 다시 전송합니다.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // 오류가 포착되면, Vite가 스택 트레이스를 실제 소스 코드에
    // 매핑되도록 수정하게 합니다.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

`package.json`의 `dev` 스크립트도 서버 스크립트를 사용하도록 변경해줍니다:

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## 프로덕션 빌드 {#building-for-production}

SSR 프로젝트를 프로덕션으로 제공하기 위해서는 다음이 필요합니다:

1. 클라이언트 빌드를 정상적으로 생성합니다;
2. Vite의 `ssrLoadModule`을 거칠 필요가 없도록 `import()` 함수를 통해 직접 로드할 수 있는 SSR 빌드를 생성합니다;

이를 위한 `package.json`의 스크립트는 다음과 같습니다:

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

`--ssr` 플래그는 SSR 빌드임을 의미합니다. SSR 진입점도 지정해야 합니다.

그 다음, `server.js`에서 `process.env.NODE_ENV` 값을 확인하여 일부 프로덕션에 대한 특정 로직을 추가해줘야 합니다:

- 프로젝트 루트의 `index.html` 파일이 아닌, `dist/client/index.html`를 템플릿으로 사용하도록 합니다. 이 파일에 클라이언트 빌드에 대한 올바른 에셋 링크가 포함되어 있기 때문입니다.

- `await vite.ssrLoadModule('/src/entry-server.js')` 대신, `import('./dist/server/entry-server.js')`를 사용하여 스크립트를 로드하도록 합니다. (이 파일은 SSR 빌드 결과물 입니다.)

- `vite` 개발 서버의 생성과 모든 사용은 개발 전용으로 구분된 조건문 아래로 이동한 다음, `dist/client`를 통해 파일을 제공할 수 있도록 정적 파일 제공 미들웨어를 추가해줍니다.

자세한 프로젝트 구성은 [예제 프로젝트](#example-projects)를 참고해주세요.

## 사전 로드 지시문 생성하기 {#generating-preload-directives}

`vite build`는 빌드 출력 디렉터리에 `.vite/ssr-manifest.json` 파일을 생성하도록 하는 `--ssrManifest` 플래그를 지원합니다:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

위와 같이 구성된 스크립트는 이제 클라이언트 빌드에 대해 `dist/client/.vite/ssr-manifest.json`을 생성합니다. (그렇습니다. SSR 매니페스트는 모듈 ID를 클라이언트 파일에 매핑하려는 것이기 때문에 클라이언트 빌드에서 생성됩니다). 매니페스트에는 모듈 ID와 관련된 청크 및 에셋 파일의 매핑이 포함되어 있습니다.

매니페스트를 활용하려면, 프레임워크는 서버 렌더링 호출 중 사용된 컴포넌트의 모듈 ID를 수집하는 방법을 제공해야 합니다.

`@vitejs/plugin-vue`는 이를 기본적으로 지원하며, 사용된 컴포넌트의 모듈 ID를 연결된 Vue SSR 컨텍스트에 자동으로 등록합니다:

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules는 이제 렌더링 중에 사용된 모듈 ID의 Set입니다.
```

`server.js`의 프로덕션 분기문에서는 매니페스트를 읽고, `src/entry-server.js`에서 익스포트한 `render` 함수에 전달해야 합니다. 이는 비동기 라우트에서 사용되는 파일의 사전 로드 지시문을 렌더링하기에 충분한 정보를 제공합니다! 전체 예제는 [데모 소스 코드](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js)를 참고해주세요. 추가로 이 정보를 이용해 [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)를 사용할 수도 있습니다.

## 사전 렌더링 / SSG {#pre-rendering-ssg}

만약 어떤 라우트에 필요한 경로와 데이터를 미리 알고 있는 경우, 프로덕션 SSR과 동일한 로직을 사용하여 이를 정적 HTML 파일로 미리 렌더링할 수 있습니다. 이는 SSG(정적 사이트 생성, Static-Site Generation)의 한 형태로 생각할 수 있습니다. 동작하는 예제는 [사전 렌더링 데모 스크립트](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js)를 참고해주세요.

## SSR 외부화 {#ssr-externals}

SSR을 실행할 때 디펜던시는 기본적으로 Vite의 SSR 변환 모듈 시스템에서 "외부화(Externalized)"됩니다. 이는 개발 및 빌드 속도를 모두 향상시킵니다.

디펜던시를 Vite의 파이프라인에서 변환해야 한다면, 예를 들어 Vite 기능이 트랜스파일되지 않은 상태로 사용되기 때문이라면, 해당 디펜던시를 [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal)에 추가할 수 있습니다.

연결된 디펜던시의 경우, 기본적으로 Vite의 HMR을 활용하기 위해 외부화되지 않습니다. 예를 들어 디펜던시가 연결되지 않은 것처럼 테스트하기 위해 이를 원하지 않는다면, 해당 디펜던시를 [`ssr.external`](../config/ssr-options.md#ssr-external)에 추가할 수 있습니다.

:::warning 별칭을 사용하는 경우
만약 어떤 하나의 패키지를 다른 패키지를 리다이렉트하는 별칭을 사용하는 경우, 외부화된 SSR 디펜던시에서도 사용할 수 있도록 `node_modules` 패키지에 별칭을 지정할 수 있습니다. [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias)과 [pnpm](https://pnpm.io/aliases/) 모두 `npm:` 접두사를 사용하여 별칭을 지정할 수 있습니다.
:::

## SSR 전용 플러그인 로직 {#ssr-specific-plugin-logic}

Vue 또는 Svelte와 같은 일부 프레임워크는 클라이언트 또는 SSR에 따라 컴포넌트를 다른 형식으로 컴파일합니다. 이 조건부 변환을 지원하기 위해, Vite는 `options` 객체에 존재하는 `ssr` 이라는 추가적인 프로퍼티를 아래의 플러그인 훅에 전달합니다:

- `resolveId`
- `load`
- `transform`

**예제:**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // ssr 전용 변환을 수행합니다...
      }
    },
  }
}
```

`load`와 `transform`의 옵션 객체는 선택 사항입니다. Rollup은 현재 이 객체를 사용하지 않지만, 향후 추가 메타데이터로 이 훅들을 확장할 수 있습니다.

:::tip 참고
Vite 2.7 이전에는 `options` 객체를 사용하는 대신 위치 기반 `ssr` 매개변수를 통해 플러그인 훅에 이 정보가 전달되었습니다. 주요 프레임워크와 플러그인은 모두 업데이트되었지만, 이전 API를 사용하는 오래된 게시물을 볼 수도 있습니다.
:::

## SSR 타겟 {#ssr-target}

SSR 빌드의 기본 타겟은 node 환경이지만, Web Worker에서 서버를 실행할 수도 있습니다. 패키지 진입점 해석은 플랫폼마다 다릅니다. `ssr.target`를 `'webworker'`로 설정하여 타겟을 Web Worker로 구성할 수 있습니다.

## SSR 번들 {#ssr-bundle}

`webworker` 런타임과 같은 일부 경우에는 SSR 빌드를 단일 JavaScript 파일로 번들링하고 싶을 수 있습니다. `ssr.noExternal`을 `true`로 설정하여 이 동작을 활성화할 수 있습니다. 이는 다음 두 가지 작업을 수행합니다:

- 모든 디펜던시를 `noExternal`로 처리합니다
- Node.js 내장 기능이 임포트되면 오류를 발생시킵니다

## SSR Resolve 조건 {#ssr-resolve-conditions}

기본적으로 패키지 진입점 해석은 SSR 빌드에 대해 [`resolve.conditions`](../config/shared-options.md#resolve-conditions)에 설정된 조건을 사용합니다. [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) 및 [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions)를 사용하여 이 동작을 커스터마이징할 수 있습니다.

## Vite CLI {#vite-cli}

`$ vite dev` 및 `$ vite preview` CLI 명령도 SSR 애플리케이션에 대해 사용할 수 있습니다. [`configureServer`](/guide/api-plugin#configureserver)를 사용해 개발 서버에, [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver)를 사용해 프리뷰 서버에 SSR 미들웨어를 추가할 수 있습니다.

:::tip 참고
SSR 미들웨어가 Vite 미들웨어 _이후에_ 실행되도록 포스트 훅을 사용하세요.
:::
