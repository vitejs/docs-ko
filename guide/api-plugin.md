# SSR Using `ModuleRunner` API
# Move to Per-environment APIs
Vite의 플러그인은 Rollup의 멋진 플러그인 인터페이스에 몇 가지 Vite 특정 옵션을 추가한 형태로 구성하였습니다. 그리고 결과적으로, Vite의 플러그인은 한 번 작성되면 개발 및 빌드 시 모두 사용이 가능하다는 장점이 있죠.

**아래 내용은 [Rollup의 플러그인 문서](https://rollupjs.org/plugin-development/)를 읽었다는 전제 하에 진행합니다.**

## 플러그인 만들기 {#authoring-a-plugin}

## Review Your Browser Setup

플러그인을 만들 때는 굳이 새로운 패키지를 만들지 않고 `vite.config.js`에 직접 작성할 수도 있습니다. 만약 작성한 플러그인이 프로젝트에서 유용하다고 생각된다면, [Vite를 사용하는 다른 사람들과 공유해보세요](https://chat.vite.dev).
import { markdownItImageSize } from 'markdown-it-image-size'

    "@tailwindcss/vite": "^4.1.11",
    "markdown-it-image-size": "^14.7.0",
![vite-plugin-inspect](../images/vite-plugin-inspect.png)
    "tailwindcss": "^4.1.11"
    "miniflare": "^4.20250617.4",
    "vite-plugin-solid": "^2.11.7"
    "@eslint/js": "^9.30.0",
    "ws": "^8.18.3"
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^9.30.0",
    "eslint": "^9.30.0",
    "@vitejs/plugin-react": "^4.6.0",
    "@eslint/js": "^9.30.0",
    "vitepress-plugin-llms": "^1.6.0",
    "typescript-eslint": "^8.35.0",
    "vite-plugin-solid": "^2.11.7"
    "vitepress-plugin-group-icons": "^1.6.1",
    "svelte": "^5.34.9",
    "@preact/preset-vite": "^2.10.2",
        specifier: ^9.30.0
        version: 9.30.0
    "@preact/preset-vite": "^2.10.2",
    "vitepress": "^2.0.0-alpha.7",
    "tailwindcss": "^4.1.11"
    "@babel/core": "^7.27.7",
    "@tailwindcss/postcss": "^4.1.11",
    "browserslist": "^4.25.1",
    "@tailwindcss/vite": "^4.1.11",
    "svelte": "^5.34.9",
## Plugins Config

    "@eslint/js": "^9.30.0",

```js [vite.config.js]
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'
export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()]
})
```

    "@types/node": "^22.15.34",

`plugins` 항목은 여러 플러그인을 하나의 요소로 포함할 수도 있습니다. 이는 특정 프레임워크를 타깃으로 여러 플러그인을 사용하는 경우와 같이 복잡한 기능을 구현하는 데 유용합니다. 이 때 플러그인 배열은 자동으로 병합됩니다.

```js
// framework-plugin
    "eslint": "^9.30.0",
    "eslint-plugin-import-x": "^4.16.1",
        specifier: ^22.15.34
        version: 22.15.34
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

import { defineConfig } from 'vite'
    "prettier": "3.6.2",
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()]
    "typescript-eslint": "^8.35.0",
```

## 간단한 예제들 {#simple-examples}

:::tip
        specifier: ^9.30.0
        version: 9.30.0(jiti@2.4.2)

        specifier: ^4.16.1
        version: 4.16.1(@typescript-eslint/utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2))
```js
const fileRegex = /\.(my-file-ext)$/
        version: 17.20.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
export default function myPlugin() {
  return {
        version: 2.9.0(eslint@9.30.0(jiti@2.4.2))

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
  "packageManager": "pnpm@10.12.4",
          map: null // 가능하다면 소스 맵을 제공
    "@babel/parser": "^7.27.7",
    "@jridgewell/trace-mapping": "^0.3.26",
    }
  }
}
```

### 가상 모듈 가져오기 {#importing-a-virtual-file}

## 가상 모듈 컨벤션 {#virtual-modules-convention}
        specifier: 3.6.2
        version: 3.6.2

가상 모듈은 ESM의 일반적인 `import` 구문을 사용해 소스 파일에 빌드 시의 정보를 전달할 수 있는 유용한 기법입니다.

```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    "dotenv": "^16.6.1",
    name: 'my-plugin', // 필수 항목이며, 경고나 오류를 나타낼 때 사용됩니다.
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
        specifier: ^8.35.0
        version: 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      }
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
- [Move to Per-environment APIs](/changes/per-environment-apis)
        version: 3.2.4(@types/debug@4.1.12)(@types/node@22.15.34)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
```

JavaScript에서는 다음과 같이 모듈을 가져올 수 있습니다:
```js
import { msg } from 'virtual:my-module'

      markdown-it-image-size:
        specifier: ^14.7.0
        version: 14.7.0(markdown-it@14.1.0)
console.log(msg)
```

[가상 모듈](https://rollupjs.org/plugin-development/#a-simple-example)은 Vite와 Rollup에서 `virtual:` 접두사를 붙여 표현 및 사용합니다. 또한, 가능한 플러그인의 이름을 네임스페이스로 사용하여 다른 플러그인과의 충돌을 방지해야 합니다. 가령 `vite-plugin-posts` 라는 이름을 가진 플러그인이 있고, 이 플러그인을 사용하는 사용자는 가상 모듈을 포함(Import)해야 한다고 가정하겠습니다. 이 때 가상 모듈의 이름은 `virtual:posts` 또는 `virtual:posts/helpers`와 같이 플러그인 이름인 `posts`를 사용하는 것이 적절합니다. 그리고 이름 규칙에 대해 내부적으로 보자면, 가상 모듈을 사용하는 플러그인은 Rollup의 규칙과 같이 모듈의 ID를 확인하는 과정에서 ID 앞에 `\0`을 붙여줘야 합니다. 이는 다른 플러그인이 노드를 확인하는 작업(Node Resolution) 등과 같이 가상 모듈의 ID를 처리하는 것을 방지하고, 또 소스 맵과 같은 핵심 기능에서는 가상 모듈과 일반 모듈을 구별하기 위해 사용하기 때문입니다. 다만 `\0`은 `import` 시 사용되는 URL에서 허용되는 문자가 아니기에, `import` 분석 중에는 이 문자열을 대체해줘야 합니다. 브라우저에서는 `\0{id}` 라는 ID가 `/@id/__x00__{id}`로 인코딩되며, 이 ID는 플러그인 파이프라인을 진행하기 전 다시 디코딩되기에 플러그인 훅 내부에서는 이를 볼 수 없습니다.

단일 파일 컴포넌트(Single File Component, .vue 나 .svelte 확장자가 붙은)와 같이 실제 파일을 기반으로 만들어진 모듈의 경우에는 위 규칙을 따를 필요가 없습니다. 특히 SFC는 일반적으로 하위 모듈들을 생성하는 방식으로 처리되나, 이들의 코드는 파일 시스템에 다시 매핑될 수 있습니다. 이 하위 모듈에 `\0`을 사용하게 되면 소스 맵이 정상적으로 동작하지 않습니다.

## 범용 훅 {#universal-hooks}

        specifier: ^2.0.0-alpha.7
        version: 2.0.0-alpha.7(@algolia/client-search@5.20.3)(@types/react@19.1.8)(axios@1.10.0)(postcss@8.5.6)(react-dom@19.1.0(react@19.1.0))(react@19.1.0)(typescript@5.7.3)
개발 시, Vite 개발 서버는 Rollup과 동일한 방식으로 [Rollup 빌드 훅](https://rollupjs.org/plugin-development/#build-hooks)을 호출하는 플러그인 컨테이너를 생성합니다.
        specifier: ^1.6.1
        version: 1.6.1(markdown-it@14.1.0)(vite@packages+vite)

        specifier: ^1.6.0
        version: 1.6.0
    "ws": "^8.18.3"

- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

이 훅에는 Vite 전용 속성이 존재하는 확장된 `options` 매개변수가 있습니다. 자세한 내용은 [SSR 문서](/guide/ssr#ssr-specific-plugin-logic)에서 확인할 수 있습니다.

일부 `resolveId` 호출의 `importer` 값은 루트의 일반적인 `index.html`에 대한 절대 경로일 수 있습니다. 이는 Vite의 번들되지 않은 개발 서버 패턴으로 인해 실제 Importer를 도출하는 것이 항상 가능한 것은 아니기 때문입니다. 다만 Vite의 리졸브 파이프라인 내에서 처리되는 Import의 경우, Import 분석 단계에서 Importer를 추적할 수 있기에, 올바른 `importer` 값을 제공할 수 있습니다.

아래의 훅은 서버가 종료될 때 호출됩니다:

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

참고로 Vite는 더 효율적인 동작을 위해 전체 소스에 대한 AST 구문 분석을 진행하지 않기에, [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) 훅은 **개발 과정에서 호출되지 않습니다**.

[Output Generation Hooks](https://rollupjs.org/plugin-development/#output-generation-hooks) 또한 `closeBundle`을 제외하고 **개발 과정에서는 호출되지 않습니다**. Vite의 개발 서버가 `bundle.generate()`를 호출하지 않고 `rollup.rollup()`만을 호출한다는 것으로 생각하면 됩니다.

## Vite 전용 훅 {#vite-specific-hooks}

Vite의 플러그인은 Vite 전용 훅을 사용할 수 있습니다. 물론 이러한 훅은 Rollup에서 무시됩니다.

### `config` {#config}

- **타입:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
        specifier: ^7.27.7
        version: 7.27.7
## Plugin / Framework Authors Guide
      resolve: {
        version: 7.27.2(@babel/core@7.27.7)
        alias: {
        specifier: ^4.25.1
        version: 4.25.1
        }
  })
        version: 2.1.1(browserslist@4.25.1)

  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = 'foo'
      }
    }
  })
  ```

  ::: warning 참고
  `config` 훅 안에서 다른 플러그인을 사용하지 마세요. 플러그인 자체는 이 훅이 실행되기 전에 모두 확정(Resolve)되며, 따라서 아무런 효과가 없습니다.
  :::

### `configResolved` {#configresolved}

- **타입:** `(config: ResolvedConfig) => void | Promise<void>`
- **종류:** `async`, `parallel`
    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // 확정된 설정 값을 저장
        config = resolvedConfig
      },

      // 다른 훅에서 저장된 설정 값을 이용
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: 개발 서버에서의 플러그인 행동 정의
        } else {
          // build: Rollup 시 플러그인 행동 정의
        }
      }
    }
  }
  ```

  참고로 `command` 값은 개발 서버에서 `serve` 입니다(cli에서 `vite`, `vite dev` 및 `vite serve` 모두 별칭입니다).

### `configureServer` {#configureserver}

- **타입:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **관련 항목:** [ViteDevServer](./api-javascript#vitedevserver)

  ```js
  const myPlugin = () => ({
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 이 곳에서 원하는 방식으로 요청을 핸들링 할 수 있습니다
        specifier: ^7.27.7
        version: 7.27.7
      })
        specifier: ^0.3.26
        version: 0.3.26

  `configureServer` 훅은 내부의 미들웨어가 설치되기 전 호출됩니다. 따라서 위와 같은 방식의 커스텀 미들웨어는 내부의 미들웨어보다 먼저 실행됩니다. 만약 내부의 미들웨어가 설치된 **이후에** 커스텀 미들웨어를 호출하고자 한다면, `configureServer`의 반환 값으로 함수를 반환해주세요:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // 내부 미들웨어가 설치된 후
      // 실행될 훅을 반환합니다
      return () => {
      }
    },
  })
  ```

  **서버 인스턴스 저장하기**

  플러그인 훅에서 개발 서버 인스턴스가 필요한 경우도 있습니다. 가령 웹 소켓 서버나, 파일 시스템 감시자, 또는 모듈 디펜던시 그래프에 접근해야 하는 경우와 같이 말이죠. `configureServer` 훅은 다른 훅에서 서버 인스턴스에 접근할 수 있도록 도와줄 수 있습니다:
  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // 서버 인스턴스 사용...
        }
      }
    }
  }
  ```

  참고로 `configureServer`는 프로덕션 버전으로 빌드할 때 호출되지 않으므로 위 예시와 같이 훅이 존재하지 않는 경우를 분기해줘야 합니다.

### `configurePreviewServer` {#configurepreviewserver}

- **타입:** `(server: PreviewServer) => (() => void) | void | Promise<(() => void) | void>`
- **종류:** `async`, `sequential`
- **관련 항목:** [PreviewServer](./api-javascript#previewserver)

  [`configureServer`](/guide/api-plugin.html#configureserver)와 같지만 프리뷰 서버에 대한 것입니다. `configureServer`와 마찬가지로 `configurePreviewServer` 훅은 다른 미들웨어가 설치되기 전에 호출됩니다. 만약 다른 미들웨어가 설치된 **이후에** 커스텀 미들웨어를 호출하고자 한다면, `configurePreviewServer`의 반환 값으로 함수를 반환해주세요. 이렇게 하면 내부 미들웨어가 설치된 후에 호출됩니다:

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      // 다른 미들웨어가 설치된 후 호출되는 함수를 
      // 반환합니다
      return () => {
        server.middlewares.use((req, res, next) => {
          // 요청에 대한 커스텀 핸들러 코드
        })
  ```

### `transformIndexHtml` {#transformindexhtml}
        specifier: ^16.6.1
        version: 16.6.1


  `index.html`과 같은 진입점이 되는 HTML 파일을 변환하기 위한 훅입니다. 훅의 인자로는 HTML 문자열과 컨텍스트를 전달받습니다. 개발 서버의 경우 컨텍스트에 [`ViteDevServer`](./api-javascript#vitedevserver) 인스턴스를 함께 전달하며, 빌드 시에는 Rollup된 번들을 전달합니다.

  훅은 비동기적으로 동작할 수 있으며 다음 중 하나를 반환합니다:

  - 변환된 HTML 문자열
  - 기존 HTML에 추가할 태그 설명자 객체(`{ tag, attrs, children }`) 배열. 각 태그는 기본적으로 `<head>` 앞에 추가되지만, 이 위치를 지정할 수도 있습니다.
  - `{ html, tags }` 둘 다 포함하는 객체

  **예제:**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`
        )
Repository: git+https://github.com/jridgewell/sourcemaps.git
      },
> Copyright 2024 Justin Ridgewell <justin@ridgewell.name>
  }

  **훅 시그니처:**

  ```ts
  type IndexHtmlTransformHook = (
    ctx: {
      path: string
      filename: string
      server?: ViteDevServer
      bundle?: import('rollup').OutputBundle
      chunk?: import('rollup').OutputChunk
    }
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string
        tags: HtmlTagDescriptor[]
      }

  interface HtmlTagDescriptor {
    tag: string
    attrs?: Record<string, string | boolean>
    children?: string | HtmlTagDescriptor[]
    /**
     * 기본값: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

::: warning 참고
이 훅은 진입점이 되는 파일을 커스텀 처리하는 프레임워크(예: [SvelteKit](https://github.com/sveltejs/kit/discussions/8269#discussioncomment-4509145))를 사용하는 경우 호출되지 않습니다.
:::

- **타입:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`
- **관련 항목:** [HMR API](./api-hmr)

  사용자가 지정한 방식대로 HMR 업데이트를 수행합니다. 이 훅은 아래와 같은 컨텍스트 객체를 전달받습니다:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules`는 변경된 파일의 영향을 받는 모듈의 배열입니다. Vue SFC와 같이 단일 파일이 여러 모듈에 매핑될 수 있기 때문에 배열 형태로 제공됩니다.

  - `read`는 파일을 읽어 그 내용을 반환하는 비동기 함수입니다. 일부 시스템에서 핫 리로딩 시 파일 변경 콜백이 너무 이르게 호출되어 `fs.readFile`로 빈 콘텐츠가 반환될 수 있기에(더 자세한 내용은 [hmr.ts](https://github.com/vitejs/vite/blob/5a111cedf31f579e3b8c8af5c4442d2e0cd5aa12/packages/vite/src/node/server/hmr.ts#L443) 파일을 참고해주세요. - 옮긴이), 이 함수를 통해 정상적으로 파일을 읽을 수 있도록 제공하고 있습니다.


  - 영향을 받는 모듈 목록을 필터링하고 범위를 좁혀 더 정확하게 HMR이 동작하도록 구성


    ```js
    handleHotUpdate({ server, modules, timestamp }) {
      const invalidatedModules = new Set()
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(
          mod,
          invalidatedModules,
          timestamp,
          true
        )
      }
      server.ws.send({ type: 'full-reload' })
      return []
    }
    ```
        specifier: ^8.18.3
        version: 8.18.3

    ```js
    handleHotUpdate({ server }) {
        type: 'custom',
        event: 'special-update',

    ```js
              text: 'Move to Per-environment APIs',
      import.meta.hot.on('special-update', (data) => {

        // 커스텀 업데이트 수행
              text: 'SSR Using ModuleRunner API',
      })

## 플러그인 순서 {#plugin-ordering}
              text: 'Shared Plugins During Build',

Vite 플러그인은 Webpack 로더와 유사한 `enforce` 프로퍼티를 추가적으로 지정하여 플러그인 애플리케이션의 순서를 조정할 수 있습니다. `enforce` 값은 `"pre"` 또는 `"post"`로 지정할 수 있으며, 이를 통해 지정되는 플러그인 순서는 다음과 같습니다:

- 별칭
- `enforce: 'pre'`로 지정된 플러그인
- Vite 코어 플러그인
- enforce 값이 존재하지 않는 플러그인
- Vite 빌드 플러그인
- `enforce: 'post'`로 지정된 플러그인
- 빌드 후 실행되는 Vite의 플러그인 (minify, manifest, reporting)

참고로 이는 훅 순서를 지정하는 것과는 별개이며, [Rollup 훅](https://rollupjs.org/plugin-development/#build-hooks)과 같이 `order` 속성이 별도로 적용된다는 점에 유의하세요.

## 조건부 애플리케이션 {#conditional-application}

기본적으로 플러그인은 개발 서버 및 빌드 시 모두 호출됩니다. 만약 플러그인이 개발 조건부로 호출되어야 하는 경우, `apply` 프로퍼티를 사용하여 `'build'` 또는 `'serve'` 중에만 플러그인이 호출되도록 구성해주세요:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build' // 또는 'serve'
  }
}
```

보다 정확한 제어를 위해 함수를 사용할 수도 있습니다:

```js
apply(config, { command }) {
  // 빌드 시 적용되지만 SSR에는 적용되지 않는 플러그인
  return command === 'build' && !config.build.ssr
}
```

## Rollup 플러그인 호환성 {#rollup-plugin-compatibility}

`@rollup/plugin-alias` 또는 `@rollup/plugin-json`과 같이 상당한 수의 Rollup 플러그인이 Vite 플러그인으로도 사용될 수 있으나, 일부 Rollup 플러그인 훅의 경우 번들되지 않은 개발 서버에서는 의미가 없기에 전부 Vite 플러그인으로 사용할 수 있지는 않습니다.

일반적으로, Rollup 플러그인이 다음 기준에 부합한다면 Vite 플러그인으로도 사용이 가능합니다:

- [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) 훅을 사용하지 않음
- 번들 단계의 훅과 번들링 이후 출력 단계의 훅 사이에 강력한 결합이 없음

만약 Rollup 플러그인이 빌드 단계에서만 의미가 있는 경우라면, `build.rollupOptions.plugins` 옵션에 해당 플러그인을 사용하도록 지정할 수 있습니다. 이는 `enforce: 'post'` 및 `apply: 'build'` 옵션으로 지정된 Vite 플러그인과 동일하게 동작합니다.

물론 Vite 전용 프로퍼티로 기존 Rollup 플러그인을 보강할 수도 있습니다:

```js [vite.config.js]
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      md.use(markdownItImageSize, {
        publicDir: path.resolve(import.meta.dirname, '../public'),
      })
      ...example(),
      enforce: 'post',
      apply: 'build'
    }
  ]
})
```

## 경로 정규화 {#path-normalization}

Vite는 Windows에서도 POSIX 구분 기호( / )를 사용할 수 있도록 파일의 ID를 확인할 때 경로를 같이 정규화합니다. 반면 Rollup은 기본적으로 파일의 경로를 그대로 유지하기에, Windows에서 파일의 ID는 win32 구분 기호( \\ )를 포함하고 있습니다. 따라서 Rollup 플러그인은 이 구분 기호를 POSIX로 변환하는 `@rollup/pluginutils`의 [`normalizePath` 유틸리티 함수](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath)를 사용합니다. 이 덕분에 Rollup 플러그인이 Vite에서 사용될 때도 파일의 ID에 대한 `include` 및 `exclude` 패턴 및 이와 유사한 경로 관련 작업이 올바르게 동작할 수 있게 됩니다.

따라서 만약 새로이 Vite 플러그인을 작성하는 경우, 파일의 ID와 실제 경로를 비교할 때 먼저 POSIX 구분 기호를 사용하도록 경로를 정규화해줘야 합니다. 이는 `vite` 모듈의 `normalizePath` 유틸리티 함수를 이용할 수 있습니다.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

## {#filtering-include-exclude-pattern}

Vite는 Vite 전용 플러그인 및 통합(Integration)이 표준 포함(Include)/제외(Exclude) 필터링 패턴을 사용하도록 [`@rollup/pluginutils`의 `createFilter`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) 함수를 제공하고 있습니다. 참고로 이 방식은 Vite 코어 자체에서도 사용합니다.

## 클라이언트-서버 커뮤니케이션 {#client-server-communication}

Vite 2.9부터 클라이언트와의 통신을 처리하는 데 도움이 되는 플러그인용 유틸을 제공합니다.

### 서버에서 클라이언트로 전송 {#server-to-client}

플러그인 측에서는 `server.ws.send`를 사용해 이벤트를 클라이언트에게 브로드캐스트 할 수 있습니다:

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('connection', () => {
          server.ws.send('my:greetings', { msg: 'hello' })
        })
      }
    }
  ]
})
```

::: tip 참고
다른 플러그인과의 충돌을 피하기 위해 이벤트 이름에 **항상 접두사를 붙이는 것** 이 좋습니다.
:::

클라이언트 측에서는 [`hot.on`](/guide/api-hmr.html#hot-on-event-cb)을 사용해 이벤트를 수신할 수 있습니다:

```ts twoslash
import 'vite/client'
// ---cut---
// 클라이언트 측
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg) // hello
        specifier: ^4.1.11
        version: 4.1.11(vite@packages+vite)
  })
}
### 클라이언트에서 서버로 전송 {#client-to-server}

        specifier: ^4.1.11
        version: 4.1.11
클라이언트에서 서버로 이벤트를 보낼 때는 [`hot.send`](/guide/api-hmr.html#hot-send-event-payload)를 사용할 수 있습니다:

if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: 'Hey!' })
}
```

서버에서는 `server.ws.on`을 사용해 이벤트를 수신합니다:

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('my:from-client', (data, client) => {
          console.log('Message from client:', data.msg) // Hey!
          // 클라이언트에게만 응답(필요한 경우)
          client.send('my:ack', { msg: 'Hi! I got your message!' })
        })
      }
    }
  ]
})
```

### 커스텀 이벤트 타입 정의 {#typescript-for-custom-events}

내부적으로 Vite는 `CustomEventMap` 인터페이스를 통해 페이로드 타입을 추론합니다. 이 인터페이스를 확장해 커스텀 이벤트 타입을 정의할 수 있습니다.

:::tip 참고
TypeScript 선언 파일을 가져올 때 `.d.ts` 확장자를 포함해야 합니다. 그렇지 않으면 확장하려는 모듈이 어떤 파일에 존재하는지 TypeScript가 알지 못할 수 있습니다.
:::

```ts [events.d.ts]
import 'vite/types/customEvent.d.ts'

declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
    // 'event-key': payload
  }
}
```

이 인터페이스 확장은 `InferCustomEventPayload<T>`에서 이벤트 `T`에 대한 페이로드 타입을 추론하는 데 사용됩니다. 이 인터페이스가 어떻게 활용되는지에 대한 자세한 내용은 [HMR API 문서](./api-hmr#hmr-api)를 참고해 주세요.

```ts twoslash
import 'vite/client'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
}
// ---cut---
type CustomFooPayload = InferCustomEventPayload<'custom:foo'>
import.meta.hot?.on('custom:foo', (payload) => {
  // 페이로드 타입은 { msg: string }이 됩니다.
})
import.meta.hot?.on('unknown:event', (payload) => {
  // 페이로드 타입은 any가 됩니다.
})
```
  prettier@3.6.0:
    resolution: {integrity: sha512-ujSB9uXHJKzM/2GBuE0hBOUgC77CN3Bnpqa+g80bkv3T3A93wL/xlzDATHhnhkzifz/UE2SNOvmbTz5hSkDlHw==}
  prettier@3.6.0: {}
        specifier: ^8.18.3
        version: 8.18.3
        specifier: ^4.20250617.4
        version: 4.20250617.4
        specifier: ^4.1.11
        version: 4.1.11(vite@packages+vite)
        specifier: ^4.1.11
        version: 4.1.11
        specifier: ^4.1.11
        version: 4.1.11
        specifier: ^4.1.11
        version: 4.1.11
  '@babel/core@7.27.7':
    resolution: {integrity: sha512-BU2f9tlKQ5CAthiMIgpzAh4eDTLWo1mqi9jqE2OxMG0E/OM199VJt2q8BztTxpnSW0i1ymdwLXRJnYzvDM5r2w==}
  '@babel/traverse@7.27.7':
    resolution: {integrity: sha512-X6ZlfR/O/s5EQ/SnUSLzr+6kGnkg8HXGMzpgsMsrJVcfDtH1vIp6ctCN4eZ1LS5c0+te5Cb6Y514fASjMRJ1nw==}
    engines: {node: '>=6.9.0'}

  '@eslint/config-array@0.21.0':
    resolution: {integrity: sha512-ENIdc4iLu0d93HeYirvKmrzshzofPw6VkZRKQGe9Nv46ZnWUzcF1xV01dcvEg/1wXUR61OmmlSfyeyO7EvjLxQ==}
  '@eslint/config-helpers@0.3.0':
    resolution: {integrity: sha512-ViuymvFmcJi04qdZeDc2whTHryouGcDlaxPqarTD0ZE10ISpxGUVZGZDx4w01upyIynL3iu6IXH2bS1NhclQMw==}
  '@eslint/js@9.30.0':
    resolution: {integrity: sha512-Wzw3wQwPvc9sHM+NjakWTcPx11mbZyiYHuwWa/QfZ7cIRX7WK54PSk7bdyXDaoaopUcMatv1zaQvOAAO8hCdww==}
  '@iconify-json/simple-icons@1.2.40':
    resolution: {integrity: sha512-sr2fbrS8rRhJNap41ucTStctxTcWQ3lcsHkY3loc4Yt1KNOne6D+l1JTOQCDj9f/VrUktVIEdaRQoYTvqfuSSw==}
  '@iconify-json/vscode-icons@1.2.23':
    resolution: {integrity: sha512-gFTcKecKra2/b5SbGDgHGI/l8CuikHyBPmqGlK+YCmS8AK72dtDQbUekdoACsju/3TYS37QvdPoOQwnyx2LdYg==}
  '@isaacs/balanced-match@4.0.1':
    resolution: {integrity: sha512-yzMTt9lEb8Gv7zRioUilSglI0c0smZ9k5D65677DLWLtWJaXIS3CqcGyUFByYKlnUj6TkjLVs54fBl6+TiGQDQ==}
    engines: {node: 20 || >=22}

  '@isaacs/brace-expansion@5.0.0':
    resolution: {integrity: sha512-ZT55BDLV0yv0RBm2czMiZ+SqCGO7AvmOM3G/w2xhVPH+te0aKgFjmBvGlL1dH+ql2tgGO3MVrbb3jCKyvpgnxA==}
    engines: {node: 20 || >=22}

  '@jridgewell/trace-mapping@0.3.26':
    resolution: {integrity: sha512-Z9rjt4BUVEbLFpw0qjCklVxxf421wrmcbP4w+LmBUxYCyJTYYSclgJD0YsCgGqQCtCIPiz7kjbYYJiAKhjJ3kA==}
  '@rolldown/pluginutils@1.0.0-beta.19':
    resolution: {integrity: sha512-3FL3mnMbPu0muGOCaKAhhFEYmqv9eTfPSJRJmANrCwtgK8VuxpsZDGK+m0LYAGoyO8+0j5uRe4PeyPDK1yA/hA==}

  '@tailwindcss/node@4.1.11':
    resolution: {integrity: sha512-yzhzuGRmv5QyU9qLNg4GTlYI6STedBWRE7NjxP45CsFYYq9taI0zJXZBMqIC/c8fViNLhmrbpSFS57EoxUmD6Q==}
  '@tailwindcss/oxide-android-arm64@4.1.11':
    resolution: {integrity: sha512-3IfFuATVRUMZZprEIx9OGDjG3Ou3jG4xQzNTvjDoKmU9JdmoCohQJ83MYd0GPnQIu89YoJqvMM0G3uqLRFtetg==}
  '@tailwindcss/oxide-darwin-arm64@4.1.11':
    resolution: {integrity: sha512-ESgStEOEsyg8J5YcMb1xl8WFOXfeBmrhAwGsFxxB2CxY9evy63+AtpbDLAyRkJnxLy2WsD1qF13E97uQyP1lfQ==}
  '@tailwindcss/oxide-darwin-x64@4.1.11':
    resolution: {integrity: sha512-EgnK8kRchgmgzG6jE10UQNaH9Mwi2n+yw1jWmof9Vyg2lpKNX2ioe7CJdf9M5f8V9uaQxInenZkOxnTVL3fhAw==}
  '@tailwindcss/oxide-freebsd-x64@4.1.11':
    resolution: {integrity: sha512-xdqKtbpHs7pQhIKmqVpxStnY1skuNh4CtbcyOHeX1YBE0hArj2romsFGb6yUmzkq/6M24nkxDqU8GYrKrz+UcA==}
  '@tailwindcss/oxide-linux-arm-gnueabihf@4.1.11':
    resolution: {integrity: sha512-ryHQK2eyDYYMwB5wZL46uoxz2zzDZsFBwfjssgB7pzytAeCCa6glsiJGjhTEddq/4OsIjsLNMAiMlHNYnkEEeg==}
  '@tailwindcss/oxide-linux-arm64-gnu@4.1.11':
    resolution: {integrity: sha512-mYwqheq4BXF83j/w75ewkPJmPZIqqP1nhoghS9D57CLjsh3Nfq0m4ftTotRYtGnZd3eCztgbSPJ9QhfC91gDZQ==}
  '@tailwindcss/oxide-linux-arm64-musl@4.1.11':
    resolution: {integrity: sha512-m/NVRFNGlEHJrNVk3O6I9ggVuNjXHIPoD6bqay/pubtYC9QIdAMpS+cswZQPBLvVvEF6GtSNONbDkZrjWZXYNQ==}
  '@tailwindcss/oxide-linux-x64-gnu@4.1.11':
    resolution: {integrity: sha512-YW6sblI7xukSD2TdbbaeQVDysIm/UPJtObHJHKxDEcW2exAtY47j52f8jZXkqE1krdnkhCMGqP3dbniu1Te2Fg==}
  '@tailwindcss/oxide-linux-x64-musl@4.1.11':
    resolution: {integrity: sha512-e3C/RRhGunWYNC3aSF7exsQkdXzQ/M+aYuZHKnw4U7KQwTJotnWsGOIVih0s2qQzmEzOFIJ3+xt7iq67K/p56Q==}
  '@tailwindcss/oxide-wasm32-wasi@4.1.11':
    resolution: {integrity: sha512-Xo1+/GU0JEN/C/dvcammKHzeM6NqKovG+6921MR6oadee5XPBaKOumrJCXvopJ/Qb5TH7LX/UAywbqrP4lax0g==}
  '@tailwindcss/oxide-win32-arm64-msvc@4.1.11':
    resolution: {integrity: sha512-UgKYx5PwEKrac3GPNPf6HVMNhUIGuUh4wlDFR2jYYdkX6pL/rn73zTq/4pzUm8fOjAn5L8zDeHp9iXmUGOXZ+w==}
  '@tailwindcss/oxide-win32-x64-msvc@4.1.11':
    resolution: {integrity: sha512-YfHoggn1j0LK7wR82TOucWc5LDCguHnoS879idHekmmiR7g9HUtMw9MI0NHatS28u/Xlkfi9w5RJWgz2Dl+5Qg==}
  '@tailwindcss/oxide@4.1.11':
    resolution: {integrity: sha512-Q69XzrtAhuyfHo+5/HMgr1lAiPP/G40OMFAnws7xcFEYqcypZmdW8eGXaOUIeOl1dzPJBPENXgbjsOyhg2nkrg==}
  '@tailwindcss/postcss@4.1.11':
    resolution: {integrity: sha512-q/EAIIpF6WpLhKEuQSEVMZNMIY8KhWoAemZ9eylNAih9jxMGAYPPWBn3I9QL/2jZ+e7OEz/tZkX5HwbBR4HohA==}
  '@tailwindcss/vite@4.1.11':
    resolution: {integrity: sha512-RHYhrR3hku0MJFRV+fN2gNbDNEh3dwKvY8XJvTxCSXeMOsCRSr+uKvDWQcbizrHgjML6ZmTE5OwMrl5wKcujCw==}
  '@types/node@22.15.34':
    resolution: {integrity: sha512-8Y6E5WUupYy1Dd0II32BsWAx5MWdcnRd8L84Oys3veg1YrYtNtzgO4CFhiBg6MDSjk7Ay36HYOnU7/tuOzIzcw==}
  '@typescript-eslint/eslint-plugin@8.35.0':
    resolution: {integrity: sha512-ijItUYaiWuce0N1SoSMrEd0b6b6lYkYt99pqCPfybd+HKVXtEvYhICfLdwp42MhiI5mp0oq7PKEL+g1cNiz/Eg==}
      '@typescript-eslint/parser': ^8.35.0
  '@typescript-eslint/parser@8.35.0':
    resolution: {integrity: sha512-6sMvZePQrnZH2/cJkwRpkT7DxoAWh+g6+GFRK6bV3YQo7ogi3SX5rgF6099r5Q53Ma5qeT7LGmOmuIutF4t3lA==}
  '@typescript-eslint/project-service@8.35.0':
    resolution: {integrity: sha512-41xatqRwWZuhUMF/aZm2fcUsOFKNcG28xqRSS6ZVr9BVJtGExosLAm5A1OxTjRMagx8nJqva+P5zNIGt8RIgbQ==}
  '@typescript-eslint/scope-manager@8.35.0':
    resolution: {integrity: sha512-+AgL5+mcoLxl1vGjwNfiWq5fLDZM1TmTPYs2UkyHfFhgERxBbqHlNjRzhThJqz+ktBqTChRYY6zwbMwy0591AA==}
  '@typescript-eslint/tsconfig-utils@8.35.0':
    resolution: {integrity: sha512-04k/7247kZzFraweuEirmvUj+W3bJLI9fX6fbo1Qm2YykuBvEhRTPl8tcxlYO8kZZW+HIXfkZNoasVb8EV4jpA==}
  '@typescript-eslint/type-utils@8.35.0':
    resolution: {integrity: sha512-ceNNttjfmSEoM9PW87bWLDEIaLAyR+E6BoYJQ5PfaDau37UGca9Nyq3lBk8Bw2ad0AKvYabz6wxc7DMTO2jnNA==}
  '@typescript-eslint/types@8.35.0':
    resolution: {integrity: sha512-0mYH3emanku0vHw2aRLNGqe7EXh9WHEhi7kZzscrMDf6IIRUQ5Jk4wp1QrledE/36KtdZrVfKnE32eZCf/vaVQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}

  '@typescript-eslint/typescript-estree@8.35.0':
    resolution: {integrity: sha512-F+BhnaBemgu1Qf8oHrxyw14wq6vbL8xwWKKMwTMwYIRmFFY/1n/9T/jpbobZL8vp7QyEUcC6xGrnAO4ua8Kp7w==}
  '@typescript-eslint/utils@8.35.0':
    resolution: {integrity: sha512-nqoMu7WWM7ki5tPgLVsmPM8CkqtoPUG6xXGeefM5t4x3XumOEKMoUZPdi+7F+/EotukN4R9OWdmDxN80fqoZeg==}
  '@typescript-eslint/visitor-keys@8.35.0':
    resolution: {integrity: sha512-zTh2+1Y8ZpmeQaQVIc/ZZxsx8UzgKJyNg1PTvjzC7WMhPSVS8bfDX34k1SrwOf016qd5RU3az2UxUNue3IfQ5g==}
  '@unrs/resolver-binding-android-arm-eabi@1.9.2':
    resolution: {integrity: sha512-tS+lqTU3N0kkthU+rYp0spAYq15DU8ld9kXkaKg9sbQqJNF+WPMuNHZQGCgdxrUOEO0j22RKMwRVhF1HTl+X8A==}
  '@unrs/resolver-binding-android-arm64@1.9.2':
    resolution: {integrity: sha512-MffGiZULa/KmkNjHeuuflLVqfhqLv1vZLm8lWIyeADvlElJ/GLSOkoUX+5jf4/EGtfwrNFcEaB8BRas03KT0/Q==}
  '@unrs/resolver-binding-darwin-arm64@1.9.2':
    resolution: {integrity: sha512-dzJYK5rohS1sYl1DHdJ3mwfwClJj5BClQnQSyAgEfggbUwA9RlROQSSbKBLqrGfsiC/VyrDPtbO8hh56fnkbsQ==}
  '@unrs/resolver-binding-darwin-x64@1.9.2':
    resolution: {integrity: sha512-gaIMWK+CWtXcg9gUyznkdV54LzQ90S3X3dn8zlh+QR5Xy7Y+Efqw4Rs4im61K1juy4YNb67vmJsCDAGOnIeffQ==}
  '@unrs/resolver-binding-freebsd-x64@1.9.2':
    resolution: {integrity: sha512-S7QpkMbVoVJb0xwHFwujnwCAEDe/596xqY603rpi/ioTn9VDgBHnCCxh+UFrr5yxuMH+dliHfjwCZJXOPJGPnw==}
  '@unrs/resolver-binding-linux-arm-gnueabihf@1.9.2':
    resolution: {integrity: sha512-+XPUMCuCCI80I46nCDFbGum0ZODP5NWGiwS3Pj8fOgsG5/ctz+/zzuBlq/WmGa+EjWZdue6CF0aWWNv84sE1uw==}
  '@unrs/resolver-binding-linux-arm-musleabihf@1.9.2':
    resolution: {integrity: sha512-sqvUyAd1JUpwbz33Ce2tuTLJKM+ucSsYpPGl2vuFwZnEIg0CmdxiZ01MHQ3j6ExuRqEDUCy8yvkDKvjYFPb8Zg==}
  '@unrs/resolver-binding-linux-arm64-gnu@1.9.2':
    resolution: {integrity: sha512-UYA0MA8ajkEDCFRQdng/FVx3F6szBvk3EPnkTTQuuO9lV1kPGuTB+V9TmbDxy5ikaEgyWKxa4CI3ySjklZ9lFA==}
  '@unrs/resolver-binding-linux-arm64-musl@1.9.2':
    resolution: {integrity: sha512-P/CO3ODU9YJIHFqAkHbquKtFst0COxdphc8TKGL5yCX75GOiVpGqd1d15ahpqu8xXVsqP4MGFP2C3LRZnnL5MA==}
  '@unrs/resolver-binding-linux-ppc64-gnu@1.9.2':
    resolution: {integrity: sha512-uKStFlOELBxBum2s1hODPtgJhY4NxYJE9pAeyBgNEzHgTqTiVBPjfTlPFJkfxyTjQEuxZbbJlJnMCrRgD7ubzw==}
  '@unrs/resolver-binding-linux-riscv64-gnu@1.9.2':
    resolution: {integrity: sha512-LkbNnZlhINfY9gK30AHs26IIVEZ9PEl9qOScYdmY2o81imJYI4IMnJiW0vJVtXaDHvBvxeAgEy5CflwJFIl3tQ==}
  '@unrs/resolver-binding-linux-riscv64-musl@1.9.2':
    resolution: {integrity: sha512-vI+e6FzLyZHSLFNomPi+nT+qUWN4YSj8pFtQZSFTtmgFoxqB6NyjxSjAxEC1m93qn6hUXhIsh8WMp+fGgxCoRg==}
  '@unrs/resolver-binding-linux-s390x-gnu@1.9.2':
    resolution: {integrity: sha512-sSO4AlAYhSM2RAzBsRpahcJB1msc6uYLAtP6pesPbZtptF8OU/CbCPhSRW6cnYOGuVmEmWVW5xVboAqCnWTeHQ==}
  '@unrs/resolver-binding-linux-x64-gnu@1.9.2':
    resolution: {integrity: sha512-jkSkwch0uPFva20Mdu8orbQjv2A3G88NExTN2oPTI1AJ+7mZfYW3cDCTyoH6OnctBKbBVeJCEqh0U02lTkqD5w==}
  '@unrs/resolver-binding-linux-x64-musl@1.9.2':
    resolution: {integrity: sha512-Uk64NoiTpQbkpl+bXsbeyOPRpUoMdcUqa+hDC1KhMW7aN1lfW8PBlBH4mJ3n3Y47dYE8qi0XTxy1mBACruYBaw==}
  '@unrs/resolver-binding-wasm32-wasi@1.9.2':
    resolution: {integrity: sha512-EpBGwkcjDicjR/ybC0g8wO5adPNdVuMrNalVgYcWi+gYtC1XYNuxe3rufcO7dA76OHGeVabcO6cSkPJKVcbCXQ==}
  '@unrs/resolver-binding-win32-arm64-msvc@1.9.2':
    resolution: {integrity: sha512-EdFbGn7o1SxGmN6aZw9wAkehZJetFPao0VGZ9OMBwKx6TkvDuj6cNeLimF/Psi6ts9lMOe+Dt6z19fZQ9Ye2fw==}
  '@unrs/resolver-binding-win32-ia32-msvc@1.9.2':
    resolution: {integrity: sha512-JY9hi1p7AG+5c/dMU8o2kWemM8I6VZxfGwn1GCtf3c5i+IKcMo2NQ8OjZ4Z3/itvY/Si3K10jOBQn7qsD/whUA==}
  '@unrs/resolver-binding-win32-x64-msvc@1.9.2':
    resolution: {integrity: sha512-ryoo+EB19lMxAd80ln9BVf8pdOAxLb97amrQ3SFN9OCRn/5M5wvwDgAe4i8ZjhpbiHoDeP8yavcTEnpKBo7lZg==}
  '@vitejs/plugin-vue@6.0.0':
    resolution: {integrity: sha512-iAliE72WsdhjzTOp2DtvKThq1VBC4REhwRcaA+zPAAph6I+OQhUXv+Xu2KS7ElxYtb7Zc/3R30Hwv1DxEo7NXQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
  browserslist@4.25.1:
    resolution: {integrity: sha512-KGj0KoOMXLpSNkkEI6Z6mShmQy0bc1I+T7K9N81k4WWMrfz+6fQ6es80B/YLAeRoKvjYE1YSHHOW1qe9xIVzHw==}
  caniuse-lite@1.0.30001726:
    resolution: {integrity: sha512-VQAUIUzBiZ/UnlM28fSp2CRF3ivUn1BWEvxMcVTNwpw91Py1pGbPIyIKtd+tzct9C3ouceCVdGAXxZOpZAsgdw==}
  dotenv@16.6.1:
    resolution: {integrity: sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==}
  electron-to-chromium@1.5.177:
    resolution: {integrity: sha512-7EH2G59nLsEMj97fpDuvVcYi6lwTcM1xuWw3PssD8xzboAW7zj7iB3COEEEATUfjLHrs5uKBLQT03V/8URx06g==}
  eslint-import-context@0.1.9:
    resolution: {integrity: sha512-K9Hb+yRaGAGUbwjhFNHvSmmkZs9+zbuoe3kFQ4V1wYjrepUFYM2dZAfNtjbbj3qsPfUfsA68Bx/ICWQMi+C8Eg==}
  eslint-plugin-import-x@4.16.1:
    resolution: {integrity: sha512-vPZZsiOKaBAIATpFE2uMI4w5IRwdv/FpQ+qZZMR4E+PeOcM4OeoEbqxRMnywdxP19TyB/3h6QBB0EWon7letSQ==}
  eslint@9.30.0:
    resolution: {integrity: sha512-iN/SiPxmQu6EVkf+m1qpBxzUhE12YqFLOSySuOyVLJLEF9nzTf+h/1AJYc1JWzCnktggeNrjvQGLngDzXirU6g==}
  linkify-it@5.0.0:
    resolution: {integrity: sha512-5aHCbzQRADcdP+ATqnDuhhJ/MRIqDkZX5pyjFHRRysS8vZ5AbqGEoFIb6pYHPZ+L/OC2Lc+xT8uHVVR5CAK/wQ==}

  markdown-it@14.1.0:
    resolution: {integrity: sha512-a54IwgWPaeBCAAsv13YgmALOF1elABB08FxO9i+r4VFk5Vl4pKokRPeX8u5TCgSsPi6ec1otfLjdOpVcgbpshg==}
    hasBin: true

  mdurl@2.0.0:
    resolution: {integrity: sha512-Lf+9+2r+Tdp5wXDXC4PcIBjTDtq4UKjCPMQhKIuzpJNW0b96kVqSwW0bT7FhRSfmAiFYgP+SCRvdrDozfh0U5w==}

  miniflare@4.20250617.4:
    resolution: {integrity: sha512-IAoApFKxOJlaaFkym5ETstVX3qWzVt3xyqCDj6vSSTgEH3zxZJ5417jZGg8iQfMHosKCcQH1doPPqqnOZm/yrw==}
  minimatch@10.0.3:
    resolution: {integrity: sha512-IPZ167aShDZZUMdRk66cyQAW3qr0WzbHkPdMYa8bzZhlHhO3jALbKdxcaak7W9FfT2rZNpQuUu4Od7ILEpXSaw==}
    engines: {node: 20 || >=22}

  napi-postinstall@0.2.5:
    resolution: {integrity: sha512-kmsgUvCRIJohHjbZ3V8avP0I1Pekw329MVAMDzVxsrkjgdnqiwvMX5XwR+hWV66vsAtZ+iM+fVnq8RTQawUmCQ==}
  prettier@3.6.2:
    resolution: {integrity: sha512-I7AIg5boAr5R0FFtJ6rCfD+LFsWHp81dolrFD8S79U9tb8Az2nGrJncnMSnys+bpQJfRUzqs9hnA81OAA3hCuQ==}
  punycode.js@2.3.1:
    resolution: {integrity: sha512-uxFIHU0YlHYhDQtV4R9J6a52SLx28BCjT+4ieh7IGbgwVJWO+km431c4yRlREUAsAmt/uMjQUyQHNEPf0M39CA==}
    engines: {node: '>=6'}

  stable-hash-x@0.2.0:
    resolution: {integrity: sha512-o3yWv49B/o4QZk5ZcsALc6t0+eCelPc44zZsLtCQnZPDwFpDYSWcDnrv2TtMmMbQ7uKo3J0HTURCqckw23czNQ==}
  tailwindcss@4.1.11:
    resolution: {integrity: sha512-2E9TBm6MDD/xKYe+dvJZAmg3yxIEDNRc0jwlNyDg/4Fil2QcSLjFKGVff0lAf1jjeaArlG/M75Ey/EYr/OJtBA==}
  tokenx@1.1.0:
    resolution: {integrity: sha512-KCjtiC2niPwTSuz4ktM82Ki5bjqBwYpssiHDsGr5BpejN/B3ksacRvrsdoxljdMIh2nCX78alnDkeemBmYUmTA==}
  typescript-eslint@8.35.0:
    resolution: {integrity: sha512-uEnz70b7kBz6eg/j0Czy6K5NivaYopgxRjsnAJ2Fx5oTLo3wefTHIbL7AkQr1+7tJCRVpTs/wiM8JR/11Loq9A==}
  uc.micro@2.1.0:
    resolution: {integrity: sha512-ARDJmphmdvUk6Glw7y9DQ2bFkKBHwQHLi2lsaH6PPmz/Ka9sFOBsBluozhDltWmnv9u/cF6Rt87znRTPV+yp/A==}

  unrs-resolver@1.9.2:
    resolution: {integrity: sha512-VUyWiTNQD7itdiMuJy+EuLEErLj3uwX/EpHQF8EOf33Dq3Ju6VW1GXm+swk6+1h7a49uv9fKZ+dft9jU7esdLA==}
  vitepress-plugin-group-icons@1.6.1:
    resolution: {integrity: sha512-eoFlFAhAy/yTZDbaIgA/nMbjVYXkf8pz8rr75MN2VCw7yH60I3cw6bW5EuwddAeafZtBqbo8OsEGU7TIWFiAjg==}
  vitepress-plugin-llms@1.6.0:
    resolution: {integrity: sha512-5EjrMvtggY61fAnhC+rldzw1UqPxwdbtsh/w15Z/Gy7u/SOsPQgSdDzoQm1iFet6ofAzUB2TXA8wj5KZX9TKSA==}
  vitepress@2.0.0-alpha.7:
    resolution: {integrity: sha512-75xXvCWymnSgA7BFt1BmiXnusl4aeV4sM6DpIo9sf2OvkNER3cMLWN6xqZrLGu3SNaQccfS5u3ikCqAnA4p70w==}
      oxc-minify: ^0.74.0
  ws@8.18.3:
    resolution: {integrity: sha512-PEIGCY5tSlUt50cqyMXfCzX+oOPqN0vuGqWzbcJ2xvnkzkq46oOpz7dQaTDBdfICb4N14+GARUDw2XV2N4tvzg==}
      '@jridgewell/trace-mapping': 0.3.26
  '@babel/core@7.27.7':
      '@babel/generator': 7.27.5
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
      '@babel/parser': 7.27.7
      '@babel/traverse': 7.27.7
      '@babel/types': 7.27.7
      '@jridgewell/trace-mapping': 0.3.26
      '@babel/types': 7.27.7
      '@babel/types': 7.27.7
      browserslist: 4.25.1
  '@babel/helper-create-class-features-plugin@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-replace-supers': 7.27.1(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/helper-create-regexp-features-plugin@7.26.3(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/helper-create-regexp-features-plugin@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/helper-define-polyfill-provider@0.6.3(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/types': 7.27.7
  '@babel/helper-module-imports@7.27.1':
      '@babel/traverse': 7.27.7
      '@babel/types': 7.27.7
  '@babel/helper-module-transforms@7.27.3(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.7
      '@babel/types': 7.27.7
  '@babel/helper-remap-async-to-generator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/helper-replace-supers@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
      '@babel/traverse': 7.27.4
      '@babel/types': 7.27.7
      '@babel/traverse': 7.27.4
      '@babel/types': 7.27.7
      '@babel/types': 7.27.7
  '@babel/plugin-bugfix-firefox-class-in-computed-class-key@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/plugin-bugfix-safari-class-field-initializer-scope@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/plugin-transform-optional-chaining': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/plugin-proposal-private-property-in-object@7.21.0-placeholder-for-preset-env.2(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-syntax-import-assertions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-syntax-import-attributes@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-syntax-unicode-sets-regex@7.18.6(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.26.3(@babel/core@7.27.7)
  '@babel/plugin-transform-arrow-functions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-async-generator-functions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-remap-async-to-generator': 7.27.1(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-async-to-generator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-remap-async-to-generator': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-block-scoped-functions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-block-scoping@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-class-properties@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-class-static-block@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-classes@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-replace-supers': 7.27.1(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-computed-properties@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-destructuring@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-dotall-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-duplicate-keys@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-duplicate-named-capturing-groups-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-dynamic-import@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-exponentiation-operator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-export-namespace-from@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-for-of@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-function-name@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-json-strings@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-logical-assignment-operators@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-member-expression-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-modules-amd@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
  '@babel/plugin-transform-modules-commonjs@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
  '@babel/plugin-transform-modules-systemjs@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-modules-umd@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
  '@babel/plugin-transform-named-capturing-groups-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-new-target@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-nullish-coalescing-operator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-numeric-separator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-object-rest-spread@7.27.2(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/plugin-transform-destructuring': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-parameters': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-object-super@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-replace-supers': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-optional-catch-binding@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-optional-chaining@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-parameters@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-private-methods@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-private-property-in-object@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-property-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-regenerator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-regexp-modifiers@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-reserved-words@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-shorthand-properties@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-spread@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-sticky-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-template-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-typeof-symbol@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-unicode-escapes@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-unicode-property-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-unicode-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-unicode-sets-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/preset-env@7.27.2(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/plugin-bugfix-firefox-class-in-computed-class-key': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-safari-class-field-initializer-scope': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-proposal-private-property-in-object': 7.21.0-placeholder-for-preset-env.2(@babel/core@7.27.7)
      '@babel/plugin-syntax-import-assertions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-syntax-import-attributes': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-syntax-unicode-sets-regex': 7.18.6(@babel/core@7.27.7)
      '@babel/plugin-transform-arrow-functions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-async-generator-functions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-async-to-generator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-block-scoped-functions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-block-scoping': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-class-properties': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-class-static-block': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-classes': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-computed-properties': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-destructuring': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-dotall-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-duplicate-keys': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-duplicate-named-capturing-groups-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-dynamic-import': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-exponentiation-operator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-export-namespace-from': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-for-of': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-function-name': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-json-strings': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-logical-assignment-operators': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-member-expression-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-amd': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-commonjs': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-systemjs': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-umd': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-named-capturing-groups-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-new-target': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-nullish-coalescing-operator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-numeric-separator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-object-rest-spread': 7.27.2(@babel/core@7.27.7)
      '@babel/plugin-transform-object-super': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-optional-catch-binding': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-optional-chaining': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-parameters': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-private-methods': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-private-property-in-object': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-property-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-regenerator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-regexp-modifiers': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-reserved-words': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-shorthand-properties': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-spread': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-sticky-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-template-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-typeof-symbol': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-escapes': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-property-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-sets-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/preset-modules': 0.1.6-no-external-plugins(@babel/core@7.27.7)
      babel-plugin-polyfill-corejs2: 0.4.12(@babel/core@7.27.7)
      babel-plugin-polyfill-corejs3: 0.11.1(@babel/core@7.27.7)
      babel-plugin-polyfill-regenerator: 0.6.3(@babel/core@7.27.7)
  '@babel/preset-modules@0.1.6-no-external-plugins(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/types': 7.27.7
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  '@babel/traverse@7.27.4':
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  '@babel/traverse@7.27.7':
      '@babel/generator': 7.27.5
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  '@eslint-community/eslint-utils@4.7.0(eslint@9.30.0(jiti@2.4.2))':
      eslint: 9.30.0(jiti@2.4.2)
  '@eslint/config-array@0.21.0':
  '@eslint/config-helpers@0.3.0': {}
  '@eslint/js@9.30.0': {}
  '@iconify-json/simple-icons@1.2.40':
  '@iconify-json/vscode-icons@1.2.23':
  '@isaacs/balanced-match@4.0.1': {}

  '@isaacs/brace-expansion@5.0.0':
    dependencies:
      '@isaacs/balanced-match': 4.0.1

      '@jridgewell/trace-mapping': 0.3.26
      '@jridgewell/trace-mapping': 0.3.26
  '@jridgewell/trace-mapping@0.3.26':
  '@rolldown/pluginutils@1.0.0-beta.19': {}

  '@tailwindcss/node@4.1.11':
      tailwindcss: 4.1.11
  '@tailwindcss/oxide-android-arm64@4.1.11':
  '@tailwindcss/oxide-darwin-arm64@4.1.11':
  '@tailwindcss/oxide-darwin-x64@4.1.11':
  '@tailwindcss/oxide-freebsd-x64@4.1.11':
  '@tailwindcss/oxide-linux-arm-gnueabihf@4.1.11':
  '@tailwindcss/oxide-linux-arm64-gnu@4.1.11':
  '@tailwindcss/oxide-linux-arm64-musl@4.1.11':
  '@tailwindcss/oxide-linux-x64-gnu@4.1.11':
  '@tailwindcss/oxide-linux-x64-musl@4.1.11':
  '@tailwindcss/oxide-wasm32-wasi@4.1.11':
  '@tailwindcss/oxide-win32-arm64-msvc@4.1.11':
  '@tailwindcss/oxide-win32-x64-msvc@4.1.11':
  '@tailwindcss/oxide@4.1.11':
      '@tailwindcss/oxide-android-arm64': 4.1.11
      '@tailwindcss/oxide-darwin-arm64': 4.1.11
      '@tailwindcss/oxide-darwin-x64': 4.1.11
      '@tailwindcss/oxide-freebsd-x64': 4.1.11
      '@tailwindcss/oxide-linux-arm-gnueabihf': 4.1.11
      '@tailwindcss/oxide-linux-arm64-gnu': 4.1.11
      '@tailwindcss/oxide-linux-arm64-musl': 4.1.11
      '@tailwindcss/oxide-linux-x64-gnu': 4.1.11
      '@tailwindcss/oxide-linux-x64-musl': 4.1.11
      '@tailwindcss/oxide-wasm32-wasi': 4.1.11
      '@tailwindcss/oxide-win32-arm64-msvc': 4.1.11
      '@tailwindcss/oxide-win32-x64-msvc': 4.1.11

  '@tailwindcss/postcss@4.1.11':
      '@tailwindcss/node': 4.1.11
      '@tailwindcss/oxide': 4.1.11
      tailwindcss: 4.1.11
  '@tailwindcss/vite@4.1.11(vite@packages+vite)':
      '@tailwindcss/node': 4.1.11
      '@tailwindcss/oxide': 4.1.11
      tailwindcss: 4.1.11
      '@babel/parser': 7.27.7
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
  '@types/node@22.15.34':
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
  '@typescript-eslint/eslint-plugin@8.35.0(@typescript-eslint/parser@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@typescript-eslint/parser': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/scope-manager': 8.35.0
      '@typescript-eslint/type-utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/visitor-keys': 8.35.0
      eslint: 9.30.0(jiti@2.4.2)
  '@typescript-eslint/parser@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@typescript-eslint/scope-manager': 8.35.0
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/typescript-estree': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/visitor-keys': 8.35.0
      eslint: 9.30.0(jiti@2.4.2)
      '@typescript-eslint/types': 8.34.1
  '@typescript-eslint/project-service@8.35.0(typescript@5.7.3)':
      '@typescript-eslint/tsconfig-utils': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/types': 8.35.0
  '@typescript-eslint/scope-manager@8.35.0':
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/visitor-keys': 8.35.0
  '@typescript-eslint/tsconfig-utils@8.35.0(typescript@5.7.3)':
  '@typescript-eslint/type-utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@typescript-eslint/typescript-estree': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
  '@typescript-eslint/types@8.35.0': {}

  '@typescript-eslint/typescript-estree@8.35.0(typescript@5.7.3)':
      '@typescript-eslint/project-service': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/tsconfig-utils': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/visitor-keys': 8.35.0
  '@typescript-eslint/utils@8.34.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      eslint: 9.30.0(jiti@2.4.2)
  '@typescript-eslint/utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      '@typescript-eslint/scope-manager': 8.35.0
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/typescript-estree': 8.35.0(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
      eslint-visitor-keys: 4.2.1
  '@typescript-eslint/visitor-keys@8.35.0':
      '@typescript-eslint/types': 8.35.0
  '@unrs/resolver-binding-android-arm-eabi@1.9.2':
  '@unrs/resolver-binding-android-arm64@1.9.2':
  '@unrs/resolver-binding-darwin-arm64@1.9.2':
  '@unrs/resolver-binding-darwin-x64@1.9.2':
  '@unrs/resolver-binding-freebsd-x64@1.9.2':
  '@unrs/resolver-binding-linux-arm-gnueabihf@1.9.2':
  '@unrs/resolver-binding-linux-arm-musleabihf@1.9.2':
  '@unrs/resolver-binding-linux-arm64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-arm64-musl@1.9.2':
  '@unrs/resolver-binding-linux-ppc64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-riscv64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-riscv64-musl@1.9.2':
  '@unrs/resolver-binding-linux-s390x-gnu@1.9.2':
  '@unrs/resolver-binding-linux-x64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-x64-musl@1.9.2':
  '@unrs/resolver-binding-wasm32-wasi@1.9.2':
  '@unrs/resolver-binding-win32-arm64-msvc@1.9.2':
  '@unrs/resolver-binding-win32-ia32-msvc@1.9.2':
  '@unrs/resolver-binding-win32-x64-msvc@1.9.2':
  '@vitejs/plugin-vue@6.0.0(vite@packages+vite)(vue@3.5.17(typescript@5.7.3))':
      '@rolldown/pluginutils': 1.0.0-beta.19
      '@babel/parser': 7.27.7
      '@babel/parser': 7.27.7
      '@babel/parser': 7.27.7
      '@babel/parser': 7.27.7
      browserslist: 4.25.1
  babel-plugin-polyfill-corejs2@0.4.12(@babel/core@7.27.7):
      '@babel/core': 7.27.7
      '@babel/helper-define-polyfill-provider': 0.6.3(@babel/core@7.27.7)
  babel-plugin-polyfill-corejs3@0.11.1(@babel/core@7.27.7):
      '@babel/core': 7.27.7
      '@babel/helper-define-polyfill-provider': 0.6.3(@babel/core@7.27.7)
  babel-plugin-polyfill-regenerator@0.6.3(@babel/core@7.27.7):
      '@babel/core': 7.27.7
      '@babel/helper-define-polyfill-provider': 0.6.3(@babel/core@7.27.7)
      '@babel/types': 7.27.7
  browserslist-to-esbuild@2.1.1(browserslist@4.25.1):
      browserslist: 4.25.1
  browserslist@4.25.1:
      caniuse-lite: 1.0.30001726
      electron-to-chromium: 1.5.177
      update-browserslist-db: 1.1.3(browserslist@4.25.1)
  caniuse-lite@1.0.30001726: {}
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
      browserslist: 4.25.1
      dotenv: 16.6.1
  dotenv@16.6.1: {}
  electron-to-chromium@1.5.177: {}
  eslint-compat-utils@0.5.1(eslint@9.30.0(jiti@2.4.2)):
      eslint: 9.30.0(jiti@2.4.2)
  eslint-import-context@0.1.9(unrs-resolver@1.9.2):
      stable-hash-x: 0.2.0
      unrs-resolver: 1.9.2
  eslint-plugin-es-x@7.8.0(eslint@9.30.0(jiti@2.4.2)):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      eslint: 9.30.0(jiti@2.4.2)
      eslint-compat-utils: 0.5.1(eslint@9.30.0(jiti@2.4.2))
  eslint-plugin-import-x@4.16.1(@typescript-eslint/utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2)):
      '@typescript-eslint/types': 8.35.0
      eslint: 9.30.0(jiti@2.4.2)
      eslint-import-context: 0.1.9(unrs-resolver@1.9.2)
      stable-hash-x: 0.2.0
      unrs-resolver: 1.9.2
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
  eslint-plugin-n@17.20.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      '@typescript-eslint/utils': 8.34.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
      eslint-plugin-es-x: 7.8.0(eslint@9.30.0(jiti@2.4.2))
  eslint-plugin-regexp@2.9.0(eslint@9.30.0(jiti@2.4.2)):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      eslint: 9.30.0(jiti@2.4.2)
  eslint@9.30.0(jiti@2.4.2):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      '@eslint/config-array': 0.21.0
      '@eslint/config-helpers': 0.3.0
      '@eslint/js': 9.30.0
  linkify-it@5.0.0:
    dependencies:
      uc.micro: 2.1.0

  markdown-it@14.1.0:
    dependencies:
      argparse: 2.0.1
      entities: 4.5.0
      linkify-it: 5.0.0
      mdurl: 2.0.0
      punycode.js: 2.3.1
      uc.micro: 2.1.0

  mdurl@2.0.0: {}

  miniflare@4.20250617.4:
  minimatch@10.0.3:
    dependencies:
      '@isaacs/brace-expansion': 5.0.0

  napi-postinstall@0.2.5: {}
  prettier@3.6.2: {}
  punycode.js@2.3.1: {}

  stable-hash-x@0.2.0: {}
  tailwindcss@4.1.11: {}
  tokenx@1.1.0: {}
  typescript-eslint@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3):
      '@typescript-eslint/eslint-plugin': 8.35.0(@typescript-eslint/parser@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/parser': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
  uc.micro@2.1.0: {}

  unrs-resolver@1.9.2:
      napi-postinstall: 0.2.5
      '@unrs/resolver-binding-android-arm-eabi': 1.9.2
      '@unrs/resolver-binding-android-arm64': 1.9.2
      '@unrs/resolver-binding-darwin-arm64': 1.9.2
      '@unrs/resolver-binding-darwin-x64': 1.9.2
      '@unrs/resolver-binding-freebsd-x64': 1.9.2
      '@unrs/resolver-binding-linux-arm-gnueabihf': 1.9.2
      '@unrs/resolver-binding-linux-arm-musleabihf': 1.9.2
      '@unrs/resolver-binding-linux-arm64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-arm64-musl': 1.9.2
      '@unrs/resolver-binding-linux-ppc64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-riscv64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-riscv64-musl': 1.9.2
      '@unrs/resolver-binding-linux-s390x-gnu': 1.9.2
      '@unrs/resolver-binding-linux-x64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-x64-musl': 1.9.2
      '@unrs/resolver-binding-wasm32-wasi': 1.9.2
      '@unrs/resolver-binding-win32-arm64-msvc': 1.9.2
      '@unrs/resolver-binding-win32-ia32-msvc': 1.9.2
      '@unrs/resolver-binding-win32-x64-msvc': 1.9.2

  update-browserslist-db@1.1.3(browserslist@4.25.1):
    dependencies:
      browserslist: 4.25.1
  vitepress-plugin-group-icons@1.6.1(markdown-it@14.1.0)(vite@packages+vite):
      '@iconify-json/vscode-icons': 1.2.23
      markdown-it: 14.1.0
  vitepress-plugin-llms@1.6.0:
      markdown-it: 14.1.0
      minimatch: 10.0.3
      tokenx: 1.1.0
  vitepress@2.0.0-alpha.7(@algolia/client-search@5.20.3)(@types/react@19.1.8)(axios@1.10.0)(postcss@8.5.6)(react-dom@19.1.0(react@19.1.0))(react@19.1.0)(typescript@5.7.3):
      '@iconify-json/simple-icons': 1.2.40
      '@vitejs/plugin-vue': 6.0.0(vite@packages+vite)(vue@3.5.17(typescript@5.7.3))
  vitest@3.2.4(@types/debug@4.1.12)(@types/node@22.15.34):
      '@types/node': 22.15.34
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  ws@8.18.3: {}
  flat-cache@5.0.0:
    resolution: {integrity: sha512-JrqFmyUl2PnPi1OvLyTVHnQvwQ0S+e6lGSwu8OkAZlSaNIZciTY2H/cOOROxsBA1m/LZNHDsqAgDZt6akWcjsQ==}
    engines: {node: '>=18'}

  image-size@2.0.2:
    resolution: {integrity: sha512-IRqXKlaXwgSMAMtpNzZa1ZAe8m+Sa1770Dhk8VkSsP9LS+iHD62Zd8FQKs8fbPiagBE7BzoFX23cxFnwshpV6w==}
    engines: {node: '>=16.x'}
    hasBin: true

  markdown-it-image-size@14.7.0:
    resolution: {integrity: sha512-Tdsi5drDNv9mP8+0mJx8uyVO3VLu2faBAuQdO1ure/KCYXbFY1lRVViXNxG1l/ExqA6F765VA8XmXciTaOkKjg==}
    engines: {node: '>= 16'}
    peerDependencies:
      markdown-it: '>= 10 < 15'

  node-fetch@2.7.0:
    resolution: {integrity: sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==}
    engines: {node: 4.x || >=6.0.0}
    peerDependencies:
      encoding: ^0.1.0
    peerDependenciesMeta:
      encoding:
        optional: true

  sync-fetch@0.5.2:
    resolution: {integrity: sha512-6gBqqkHrYvkH65WI2bzrDwrIKmt3U10s4Exnz3dYuE5Ah62FIfNv/F63inrNhu2Nyh3GH5f42GKU3RrSJoaUyQ==}
    engines: {node: '>=14'}

  tr46@0.0.3:
    resolution: {integrity: sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==}

  webidl-conversions@3.0.1:
    resolution: {integrity: sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==}

  whatwg-url@5.0.0:
    resolution: {integrity: sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==}

  flat-cache@5.0.0:
    dependencies:
      flatted: 3.3.3
      keyv: 4.5.4

  image-size@2.0.2: {}

  markdown-it-image-size@14.7.0(markdown-it@14.1.0):
    dependencies:
      flat-cache: 5.0.0
      image-size: 2.0.2
      markdown-it: 14.1.0
      sync-fetch: 0.5.2
    transitivePeerDependencies:
      - encoding

  node-fetch@2.7.0:
    dependencies:
      whatwg-url: 5.0.0

  sync-fetch@0.5.2:
    dependencies:
      node-fetch: 2.7.0
    transitivePeerDependencies:
      - encoding

  tr46@0.0.3: {}

  webidl-conversions@3.0.1: {}

  whatwg-url@5.0.0:
    dependencies:
      tr46: 0.0.3
      webidl-conversions: 3.0.1
