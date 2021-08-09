# Vite 설정하기 {#configuring-vite}

## 설정 파일 {#config-file}

### Config File Resolving

명령줄에서 `vite`를 실행시킬 때, Vite는 자동으로 [프로젝트 루트](/guide/#index-html-and-project-root)의 `vite.config.js` 파일을 처리하기 위해 시도합니다.

가장 기본적인 설정 파일의 내용은 다음과 같습니다:

```js
// vite.config.js
export default {
  // config options
}
```

비록 프로젝트에서 `type: "module"`을 통한 네이티브 노드 ESM을 사용하지 않더라도 Vite는 설정 파일에서 ES 모듈 구문 사용을 지원함을 참고해주세요. 이 경우에 설정 파일은 로드되기 전에 자동으로 미리 처리됩니다.

또한 `--config` CLI 옵션을 사용하여 명시적으로 특정 설정 파일을 지정할 수도 있습니다. (경로는 `cwd`를 기준으로 하여 상대적으로 처리됩니다.)

```bash
vite --config my-config.js
```

### 인텔리센스 설정 {#config-intellisense}

Vite는 TypeScript 형식을 포함하고 있기 때문에, jsdoc 형식의 힌트를 통해 사용자 IDE의 인텔리센스를 활용할 수 있습니다:

```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

대안으로 jsdoc 주석이 없어도 인텔리센스가 제공되는 `defineConfig` 도우미 함수를 사용할 수도 있습니다:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite는 또한 TS 설정 파일을 직접 지원합니다. `defineConfig` 도우미 함수와 함께 `vite.config.ts` 를 사용할 수 있습니다.

### 조건부 설정 {#conditional-config}

만약 설정에서 명령 (`serve` 또는 `build`) 또는 사용중인 [모드](/guide/env-and-mode)에 따라 조건부로 옵션을 결정해야 하는 경우, 아래와 같이 함수를 내보낼 수 있습니다:

```js
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // serve specific config
    }
  } else {
    return {
      // build specific config
    }
  }
})
```

### 비동기 설정 {#async-config}

만약 설정에서 비동기(async) 함수를 호출해야 한다면, async 함수를 내보낼 수 있습니다:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // build specific config
  }
})
```

## 공용 옵션 {#shared-options}

### root

- **타입:** `string`
- **기본값:** `process.cwd()`

  프로젝트 루트 디렉터리 (`index.html` 파일이 있는 곳) 입니다. 이는 절대 경로 또는 설정 파일 위치로부터의 상대적인 경로가 될 수도 있습니다.

  [프로젝트 루트](/guide/#index-html-and-project-root)에서 더 자세한 점을 볼 수 있습니다.

### base

- **타입:** `string`
- **기본값:** `/`

  개발 또는 프로덕션 모드에서 사용되는 Public Base Path 입니다. 유효한 값은 다음과 같습니다:

  - 절대 URL 경로명, 예) `/foo/`
  - 전체 URL, 예) `https://foo.com/`
  - 빈 문자열 또는 `./` (내장된 배포를 위한)

  [Public Base Path](/guide/build#public-base-path)에서 더 자세한 점을 볼 수 있습니다.

### mode

- **타입:** `string`
- **기본값:** `serve` 에서는 `'development'`, `build` 에서는 `'production'`

  설정에서 이것을 지정하면 **serve와 build 모두**에서 기본 모드를 오버라이드 합니다. 또한 이 값은 명령줄 `--mode` 옵션으로도 오버라이드 될 수 있습니다.

  [환경 변수와 모드](/guide/env-and-mode)에서 더 자세한 점을 볼 수 있습니다.

### define

- **타입:** `Record<string, string>`

  전역 상수 대체를 정의합니다. 진입점은 개발 중에는 전역으로 정의될 것이며, 빌드 시에는 정적으로 대체될 것입니다.

  - `2.0.0-beta.70` 부터는, 문자열 값이 raw 표현으로 사용될 것이므로, 만약 문자열 상수를 정의한다면, 명시적으로 인용될 필요가 있습니다. (예: `JSON.stringify` 사용)

  - 매치되는 부분이 단어 경계 (`\b`)로 둘러쌓인 경우에만 대체가 수행됩니다.

  이것은 아무런 구문 분석 없이 간단한 텍스트 대체로 구현되므로, 상수에만 `define` 을 사용하는 것을 추천합니다.

  예를 들어, `process.env.FOO` 와 `__APP_VERSION__` 는 서로 잘 맞습니다. 하지만 `process` 또는 `global` 을 이 옵션에 넣어서는 안됩니다. 대신에 변수를 끼워넣거나 폴리필로 사용할 수 있습니다.

### plugins

- **타입:** ` (Plugin | Plugin[])[]`

  사용할 플러그인의 배열입니다. 잘못된 플러그인은 무시되고 플러그인의 배열은 평탄화됩니다. [플러그인 API](/guide/api-plugin)에서 Vite 플러그인에 대한 더 자세한 점을 볼 수 있습니다.

### publicDir

- **타입:** `string | false`
- **기본값:** `"public"`

  정적 에셋들을 제공하는 디렉터리 입니다. 이 디렉터리의 파일들은 개발 중에는 `/` 에서 제공되고 빌드 시에는 `outDir`의 루트로 복사되며, 변형 없이 언제나 있는 그대로 제공되거나 복사됩니다. 값은 절대 파일 시스템 경로 또는 프로젝트 루트의 상대적인 경로중 하나가 될 수 있습니다.

  `publicDir`를 `false`로 정의하면 이 기능이 비활성화됩니다.
  
  [`public` 디렉터리](/guide/assets#the-public-directory)에서 더 자세한 점을 볼 수 있습니다.

### cacheDir

- **타입:** `string`
- **기본값:** `"node_modules/.vite"`

  캐시 파일을 저장할 디렉터리 입니다. 이 디렉터리의 파일들은 미리 번들된 의존 파일이거나 Vite에 의해 생성된 어떤 다른 캐시 파일로서, 성능을 향상시킬 수 있습니다. 캐시 파일을 다시 생성하기 위해 `--force` 플래그를 사용하거나 또는 직접 디렉터리를 삭제할 수 있습니다. 값은 절대 파일 시스템 경로 또는 프로젝트 루트의 상대적인 경로중 하나가 될 수 있습니다.

### resolve.alias

- **타입:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

  이 옵션의 값은 `@rollup/plugin-alias` 의 [entries 옵션](https://github.com/rollup/plugins/tree/master/packages/alias#entries)으로 전달됩니다. 객체나 `{ find, replacement }` 페어 배열이 될 수 있습니다.

  파일 시스템 경로에 별칭을 만들 때에는, 반드시 절대 경로를 사용하세요. 상대 경로 별칭은 있는 그대로 사용되며, 파일 시스템 경로로 적절하게 해석되지 않습니다.

  더 자세한 해결책은 [플러그인](/guide/api-plugin)에서 찾아볼 수 있습니다.

### resolve.dedupe

- **타입:** `string[]`

  만약 앱 내에서 (호이스팅 또는 모노리포 안의 연결된 패키지로 인해 발생할 수 있는) 동일한 디펜던시의 중복된 복사본을 갖고 있다면, 이 옵션을 사용해서 무조건 Vite가 나열된 디펜던시를 항상 (프로젝트 루트의) 동일한 복사본으로 사용하게 할 수 있습니다.

### resolve.conditions

- **타입:** `string[]`

  패키지로부터 [조건부 내보내기](https://nodejs.org/api/packages.html#packages_conditional_exports)를 할 때, 추가적으로 허용되는 조건입니다.

  조건부 내보내기를 동반한 패키지는 `package.json`내에 다음의 `exports` 필드를 가질 수 있습니다:

  ```json
  {
    "exports": {
      ".": {
        "import": "./index.esm.js",
        "require": "./index.cjs.js"
      }
    }
  }
  ```

  여기에, `import`와 `require`는 "조건"입니다. 조건은 중첩될 수 있으며 구체적인 조건부터 덜 구체적인 조건까지 다양하게 지정될 수 있습니다.

  Vite 는 "허용되는 조건들"의 목록을 가지며 이것은 허용되는 목록안의 첫번째 조건과 매치됩니다. 기본적으로 허용되는 조건들은 `import`, `module`, `browser`, `default`, 그리고 현재 모드를 기반으로 한 `production/development` 입니다. `resolve.conditions` 설정 옵션은 추가적으로 허용되는 조건들을 지정하는 것을 허용합니다.

### resolve.mainFields

- **타입:** `string[]`
- **기본값:** `['module', 'jsnext:main', 'jsnext']`

  패키지의 진입점을 확인할 때 시도할 `package.json`안의 필드 목록입니다. 이것은 `exports` 필드에서 처리되는 조건부 내보내기보다 우선 순위가 낮습니다: 만약 진입점이 `exports`로부터 성공적으로 확인되면, 메인 필드는 무시될 것입니다.

### resolve.extensions

- **타입:** `string[]`
- **기본값:** `['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`

  확장자를 생략한 가져오기를 위해 시도할 파일 확장자 목록입니다. IDE 와 타입 지원을 방해할 수 있으므로 (`.vue`와 같은) 사용자 지정 가져오기 형식에 대해서는 확장자를 생략하지 **않는** 것을 추천합니다.

### css.modules

- **타입:**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: 'camelCaseOnly'
     */
    localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
  }
  ```

  CSS 모듈 행동을 구성합니다. 옵션들은 [postcss-modules](https://github.com/css-modules/postcss-modules)로 전달됩니다.

### css.postcss

- **타입:** `string | (postcss.ProcessOptions & { plugins?: postcss.Plugin[] })`

  (`postcss.config.js` 와 동일한 형식으로 기대되는) 인라인 PostCSS 설정, 또는 PostCSS 설정을 검색할 사용자 지정 경로 (기본값은 프로젝트 루트) 입니다. 검색은 [postcss-load-config](https://github.com/postcss/postcss-load-config)를 사용하여 수행됩니다.

  인라인 설정이 제공되는 경우, Vite는 다른 PostCSS 설정 소스를 찾지 않을 것입니다.

### css.preprocessorOptions

- **타입:** `Record<string, object>`

  CSS 전처리기로 전달할 옵션을 지정합니다. 예제:

  ```js
  export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`
        }
      }
    }
  })
  ```

### json.namedExports

- **타입:** `boolean`
- **기본값:** `true`

  `.json` 파일에서 명명된 가져오기를 지원하는지 여부입니다.

### json.stringify

- **타입:** `boolean`
- **기본값:** `false`

  `true`로 지정한다면, 가져온 JSON 은 특히 JSON 파일이 클 때 객체 리터럴보다 성능이 월등히 뛰어난 `export default JSON.parse("...")`으로 변환됩니다.

  이 옵션을 사용하면 명명된 가져오기가 비활성화됩니다.

### esbuild

- **타입:** `ESBuildOptions | false`

  `ESBuildOptions`는 [ESbuild 변환 옵션](https://esbuild.github.io/api/#transform-api)을 확장합니다. 가장 일반적인 사례는 JSX를 사용자 지정하는 것입니다:

  ```js
  export default defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  })
  ```

  기본적으로, ESBuild는 `ts`, `jsx`, `tsx` 파일들에 적용됩니다. `esbuild.include`와 `esbuild.exclude`를 사용하여 사용자 정의할 수 있으며, 둘 다 `string | RegExp | (string | RegExp)[]` 타입으로 예상합니다.

  추가적으로, ESBuild에 의해 변환된 모든 파일에 대해 JSX 헬퍼 import 들을 자동으로 주입하기 위해 `esbuild.jsxInject`도 사용할 수 있습니다:

  ```js
  export default defineConfig({
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  })
  ```

  ESBuild 변환을 사용하지 않으려면 `false`로 설정하세요.

### assetsInclude

- **타입:** `string | RegExp | (string | RegExp)[]`
- **참고:** [정적 에셋 가져오기](/guide/assets)

  정적 에셋으로 처리할 추가 파일 형식을 지정합니다:

  - HTML에서 참조되거나 `fetch` 또는 XHR을 통해 직접 요청될 때, 이것은 플러그인 변환 파이프라인에서 제외됩니다.

  - JS에서 그것을 가져오면 처리된 URL 문자열이 반환됩니다. (이것은 에셋 형식을 다르게 처리하기 위한 `enforce: 'pre'` 플러그인이 있다면 덮어쓰여질 수 있습니다.)

  이 빌트인 에셋 형식 목록은 [여기](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts)에서 확인할 수 있습니다.

### logLevel

- **타입:** `'info' | 'warn' | 'error' | 'silent'`

  콘솔 출력의 상세 정도를 조정합니다. 기본값은 `'info'` 입니다.

### clearScreen

- **타입:** `boolean`
- **기본값:** `true`

  특정 메시지를 로그로 남길 때, Vite가 터미널 화면을 지우지 않도록 하려면 `false`로 설정하세요. 명령줄에서는 `--clearScreen false`를 사용하세요.

### envDir

- **타입:** `string`
- **기본값:** `root`

  '.env' 파일이 로드되는 디렉터리입니다. 절대 경로 또는 프로젝트 루트에 상대적인 경로일 수 있습니다.

  환경 파일에 대한 더 자세한 점을 알려면, [여기](/guide/env-and-mode#env-files)를 확인하세요.

## 서버 옵션 {#server-options}

### server.host

- **타입:** `string`
- **기본값:** `'127.0.0.1'`

  서버가 수신할 IP 주소를 지정합니다.
  LAN와 공용 주소를 포함한 모든 주소를 수신하려면 이 값을 `0.0.0.0`으로 설정하세요.

  CLI에서는 `--host 0.0.0.0` or `--host`로 설정될 수 있습니다.

### server.port

- **타입:** `number`

  서버 포트를 지정합니다. 포트가 이미 사용 중이라면, Vite는 자동으로 사용 가능한 다음 포트를 시도할 것이므로, 결과적으로 이 포트 번호가 서버의 수신 포트가 되지 않을 수도 있습니다.

### server.strictPort

- **타입:** `boolean`

  포트가 이미 사용 중일 경우, 사용 가능한 다음 포트를 자동으로 시도하지 않도록 하려면 `true`로 로 설정하세요.

### server.https

- **타입:** `boolean | https.ServerOptions`

  TLS + HTTP/2를 사용합니다. [`server.proxy` 옵션](#server-proxy)이 사용된다면, 이것은 오직 TLS만 사용하는 것으로 다운그레이드됩니다.

  이 값은 또한 [옵션 객체](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)가 `https.createServer()`로 전달되는 값일 수도 있습니다.

### server.open

- **타입:** `boolean | string`

  서버가 시작될 때 자동으로 브라우저에서 앱을 보여줍니다. 값이 문자열이면 URL의 경로명으로 사용됩니다. 원하는 특정 브라우저에서 열기를 원한다면, `process.env.BROWSER` (예: `firefox`) 환경 변수를 설정할 수 있습니다. 더 자세한 점을 알려면 [`open` 패키지](https://github.com/sindresorhus/open#app)를 확인하세요.

  **Example:**

  ```js
  export default defineConfig({
    server: {
      open: '/docs/index.html'
    }
  })
  ```

### server.proxy

- **타입:** `Record<string, string | ProxyOptions>`

  개발 서버를 위한 사용자 지정 프록시 규칙을 설정합니다. `{ key: options }` 페어의 객체 형식입니다. 키가 `^`로 시작하면, `RegExp`로 해석됩니다. `configure` 옵션을 사용하여 프록시 인스턴스에 접근할 수 있습니다.

  [`http-proxy`](https://github.com/http-party/node-http-proxy)를 사용하세요. 전체 옵션은 [여기](https://github.com/http-party/node-http-proxy#options)에 있습니다.

  **Example:**

  ```js
  export default defineConfig({
    server: {
      proxy: {
        // string shorthand
        '/foo': 'http://localhost:4567/foo',
        // with options
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // with RegEx
        '^/fallback/.*': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, '')
        },
        // Using the proxy instance
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          configure: (proxy, options) => {
            // proxy will be an instance of 'http-proxy'
          }),
        }
      }
    }
  })
  ```

### server.cors

- **타입:** `boolean | CorsOptions`

  개발 서버를 위한 CORS를 설정합니다. 이것은 기본적으로 활성화되어 있으며 모든 오리진을 허용합니다. 동작을 상세하게 조절하기 위해 [옵션 객체](https://github.com/expressjs/cors)를 전달하거나, 사용하지 않기 위해 `false`를 전달하세요.

### server.force

- **타입:** `boolean`
- **참고:** [Pre-bundling 된 디펜던시](/guide/dep-pre-bundling)

  디펜던시의 사전 번들링을 강제하려면 `true`로 설정하세요.

### server.hmr

- **타입:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

  HMR 연결을 설정하거나 사용하지 않을 수 있습니다. (HMR 웹 소켓이 http 서버와 다른 주소를 사용해야 하는 경우)

  서버 오류 오버레이를 사용하지 않으려면 `server.hmr.overlay`를 `false`로 설정하세요.

  `clientPort`는 클라이언트측의 포트만 재정의하는 고급 옵션으로, 클라이언트 코드에서 찾는 것과 다른 포트에서 웹 소켓을 제공할 수 있습니다. 개발 서버의 앞단에서 SSL 프록시를 사용하는 경우에 유용합니다.

  `server.middlewareMode`와 `server.https`를 사용할 때, `server.hmr.server`를 HTTPS 서버로 설정하면 서버를 통해 HMR 보안 연결 요청이 처리됩니다. 이는 자체 서명된 인증서를 사용할 때 유용할 수 있습니다.

### server.watch

- **타입:** `object`

  [chokidar](https://github.com/paulmillr/chokidar#api)에 전달할 파일 시스템 감시자 옵션입니다.

### server.middlewareMode

- **타입:** `'ssr' | 'html'`

  미들웨어 모드로 Vite 서버를 생성합니다. (HTTP 서버 없이)

  - `'ssr'`은 Vite의 HTML 서비스 로직을 비활성화하므로, 수동으로 `index.html`을 제공해야 합니다.
  - `'html'`은 Vite의 HTML 서비스 로직을 활성화합니다.

- **참고:** [SSR - 개발 서버 설정하기](/guide/ssr#setting-up-the-dev-server)

- **Example:**

```js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // Create vite server in middleware mode.
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // If `middlewareMode` is `'ssr'`, should serve `index.html` here.
    // If `middlewareMode` is `'html'`, there is no need to serve `index.html`
    // because Vite will do that.
  })
}

createServer()
```

### server.fs.strict

- **Experimental**
- **타입:** `boolean`
- **기본값:** `false` (향후 버전에서는 `true`로 변경될 것입니다)

  작업영역 루트 외부에 있는 파일 제공을 제한합니다.

### server.fs.allow

- **Experimental**
- **타입:** `string[]`

  `/@fs/`를 통해 제공될 수 있는 파일을 제한합니다. `server.fs.strict`가 `true`로 설정된 경우, 이 디렉터리 목록 외부에 있는 파일에 접근하면 403 결과를 반환합니다.

  Vite는 잠재적인 작업 공간의 루트를 검색하여 기본값으로 사용합니다. 유효한 작업 공간은 다음 조건을 충족합니다. 그렇지 않으면 [프로젝트 루트](/guide/#index-html-and-project-root)로 대체됩니다.

  - `package.json`에 `workspaces` 필드가 포함됨
  - 다음 파일 중 하나를 포함함
    - `pnpm-workspace.yaml`

  사용자 지정 작업 공간 루트를 지정하는 경로를 허용합니다. 절대 경로 또는 [프로젝트 루트](/guide/#index-html-and-project-root)에 대한 상대 경로일 수 있습니다. 다음은 하나의 예입니다.

  ```js
  export default defineConfig({
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
      }
    }
  })
  ```

## 빌드 옵션 {#build-options}

### build.target

- **타입:** `string`
- **기본값:** `'modules'`
- **참고:** [브라우저 지원 현황](/guide/build#browser-compatibility)

  최종 번들을 위한 브라우저 호환성 타깃입니다. 기본값은 Vite 특수 값으로, [네이티브 ES 모듈을 지원하는 브라우저](https://caniuse.com/es6-module)를 타깃으로 하는 `'module'` 입니다.

  또 다른 특수 값은 `'esnext'`입니다. 이는 네이티브 동적 가져오기가 지원되는 것으로 가정하고 가능한 한 적게 트랜스파일됩니다:

  - [`build.minify`](#build-minify) 옵션이 `'terser'` (기본값) 이라면, `'esnext'`는 `'es2019'`로 다운 설정됩니다.
  - 다른 경우에는, 전혀 트랜스파일이 수행되지 않습니다.

  변환은 esbuild로 수행되며, 값은 유효한 [esbuild 타깃 옵션](https://esbuild.github.io/api/#target)이어야 합니다. 사용자 지정 타깃은 ES 버전 (예: `es2015`)이나 버전이 있는 브라우저 (예: `chrome58`) 또는 다중 타깃 문자열의 배열이 될 수 있습니다.

  코드안에 esbuild로 안전하게 트랜스파일할 수 없는 기능이 포함된 경우 빌드는 실패할 것입니다. 자세한 점은 [esbuild 문서](https://esbuild.github.io/content-types/#javascript)를 확인하세요.

### build.polyfillModulePreload

- **타입:** `boolean`
- **기본값:** `true`

  [모듈 미리로드 폴리필](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)을 자동으로 주입할지 여부입니다.

  true로 설정하면 폴리필이 각 `index.html` 항목의 프록시 모듈에 자동으로 주입됩니다. 빌드가 `build.rollupOptions.input`을 통해 비 html 사용자 지정 진입점을 사용하도록 구성된 경우, 사용자 지정 진입점에 폴리필을 수동으로 import 해야 합니다:

  ```js
  import 'vite/modulepreload-polyfill'
  ```

  참고: 폴리필은 [Library 모드](/guide/build#library-mode)에 적용되지 **않습니다**. 네이티브 동적 가져오기 없이 브라우저를 지원해야 한다면, 아마도 라이브러리에서 이것을 사용하지 않는 것이 좋습니다.

### build.outDir

- **타입:** `string`
- **기본값:** `dist`

  ([프로젝트 루트](/guide/#index-html-and-project-root)에 상대적인) 출력 디렉터리를 지정합니다.

### build.assetsDir

- **타입:** `string`
- **기본값:** `assets`

  생성된 에셋을 (`build.outDir`에 상대적으로) 저장할 디렉터리를 지정합니다.

### build.assetsInlineLimit

- **타입:** `number`
- **기본값:** `4096` (4kb)

  이 값보다 작은 크기의 import 되거나 참조된 에셋은 부가적인 http 요청을 피하기 위해 base64 URL로 인라인 처리됩니다. 만일 인라인 변환을 사용하지 않으려면 `0`으로 설정하세요.

  ::: tip 참고
  `build.lib`를 지정하면, `build.assetsInlineLimit`는 무시되며 파일 크기에 관계없이 에셋이 항상 인라인 처리됩니다.
  :::

### build.cssCodeSplit

- **타입:** `boolean`
- **기본값:** `true`

  CSS 코드 분할을 활성화/비활성화합니다. 활성화된 경우 비동기 청크로 가져온 CSS가 비동기 청크 안으로 인라인 처리되고 청크가 로드될 때 삽입됩니다.

  비활성화된 경우, 전체 프로젝트의 모든 CSS가 단일 CSS 파일로 추출됩니다.

### build.sourcemap

- **타입:** `boolean | 'inline' | 'hidden'`
- **기본값:** `false`

  프로덕션에서 소스 맵을 생성합니다. `true`인 경우 별도의 소스 맵 파일이 생성됩니다. `'inline'`인 경우 소스 맵이 결과 출력 파일에 데이터 URI로 추가됩니다. `'hidden'`은 번들 파일의 해당 소스 맵 설명이 표시되지 않는 경우를 제외하고 `true`와 같이 작동합니다.

### build.rollupOptions

- **타입:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  기본 Rollup 번들을 직접 사용자 지정합니다. 이는 Rollup 설정 파일에서 내보낼 수 있는 옵션과 동일하며 Vite의 내부 Rollup 옵션과 병합됩니다. 더 자세한 점은 [Rollup 옵션 문서](https://rollupjs.org/guide/en/#big-list-of-options)를 참고하세요.

### build.commonjsOptions

- **타입:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs)에 전달할 옵션입니다.

### build.dynamicImportVarsOptions

- **타입:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)

  [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars)에 전달할 옵션입니다.

### build.lib

- **타입:** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat) => string) }`
- **참고:** [Library 모드](/guide/build#library-mode)

  라이브러리로 빌드합니다. 라이브러리에서 HTML을 진입점으로 사용할 수 없으므로, `entry`가 필요합니다. `name`은 노출된 전역 변수이며 `formats`이 `'umd'` 또는 `'iife'`를 포함할 때 필요합니다. 기본 `formats`은 `['es', 'umd']` 입니다. `fileName`은 패키지 파일 출력의 이름이며, 기본값은 package.json 파일의 name 옵션입니다. 또한 `format`을 인수로 취하는 함수로도 정의될 수 있습니다.

### build.manifest

- **타입:** `boolean`
- **기본값:** `false`
- **참고:** [백엔드 프레임워크와 함께 사용하기](/guide/backend-integration)

  `true`로 설정하면, 빌드는 해시되지 않은 에셋 파일 이름을 해시된 버전으로의 매핑이 포함된 `manifest.json` 파일도 생성합니다. 이 파일은 서버 프레임워크에서 올바른 에셋 링크를 렌더링하는 데 사용할 수 있습니다.

### build.minify

- **타입:** `boolean | 'terser' | 'esbuild'`
- **기본값:** `'terser'`

  코드 경량화를 사용하지 않으려면 `false`로 설정하고, 또는 사용할 코드 경량화 도구를 지정하세요. 기본값은 [Terser](https://github.com/terser/terser)로, 속도는 느리지만 대부분의 경우 더 작은 번들을 생성합니다. Esbuild 경량화는 훨씬 빠르긴 하지만, 번들의 크기가 약간 더 큽니다.

### build.terserOptions

- **타입:** `TerserOptions`

  Terser로 전달할 추가적인 [경량화 옵션](https://terser.org/docs/api-reference#minify-options)입니다.

### build.cleanCssOptions

- **타입:** `CleanCSS.Options`

  [clean-css](https://github.com/jakubpawlowicz/clean-css#constructor-options)로 전달할 생성자 옵션입니다.

### build.write

- **타입:** `boolean`
- **기본값:** `true`

  번들을 생성할 때 디스크에 기록하지 않으려면 `false`로 설정하세요. 이것은 디스크에 쓰기 전에 번들의 추가 후처리가 필요한 [프로그래밍 방식 `build()` 호출](/guide/api-javascript#build)에서 주로 사용됩니다.

### build.emptyOutDir

- **타입:** `boolean`
- **기본값:** `outDir`이 `root` 안에 있다면 `true`

  기본적으로 Vite는 `outDir`이 프로젝트 루트 내부에 있는 경우 빌드할 때 이 곳을 비웁니다. `outDir`가 루트 외부에 있으면 실수로 중요한 파일을 제거하지 않도록 경고 메시지가 표시됩니다. 경고를 표시하지 않도록 이 옵션을 명시적으로 설정할 수 있습니다. 명령줄에서는 `--emptyOutDir`로 이를 사용할 수 있습니다.

### build.brotliSize

- **타입:** `boolean`
- **기본값:** `true`

  brotli 압축 크기 보고를 활성화/비활성화합니다. 큰 출력 파일을 압축하는 경우 속도가 느릴 수 있으므로, 이를 사용하지 않도록 설정하면 대규모 프로젝트의 빌드 성능이 향상될 수 있습니다.

### build.chunkSizeWarningLimit

- **타입:** `number`
- **기본값:** `500`

  청크 크기 경고를 위한 제한값 입니다. (단위: KB)

### build.watch

- **타입:** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **기본값:** `null`

  Rollup 감시자를 사용하려면 `{}`로 설정하세요. 이는 대부분 빌드 전용 플러그인 또는 통합 프로세스를 포함하는 경우에 사용됩니다.

## Dep Optimization Options

- **참고:** [사전 번들링된 디펜던시](/guide/dep-pre-bundling)

### optimizeDeps.entries

- **타입:** `string | string[]`

  기본적으로 Vite는 index.html을 탐색하여 사전 번들링이 필요한 디펜던시를 탐지합니다. `build.rollupOptions.input`이 지정된 경우 Vite가 대신 해당 진입점을 탐색합니다.

  둘 다 필요에 맞지 않는 경우, 이 옵션을 사용하여 사용자 지정 진입점들을 지정할 수 있습니다. 값은 [fast-glob 패턴](https://github.com/mrmlnc/fast-glob#basic-syntax) 또는 Vite 프로젝트 루트에서 상대적인 경로 패턴 배열이어야 합니다. 이는 기본 진입점 추론을 덮어씁니다.

### optimizeDeps.exclude

- **타입:** `string[]`

  사전 번들링에서 제외할 디펜던시 목록입니다.

  :::warning CommonJS
  CommonJS 디펜던시는 최적화에서 제외되서는 안 됩니다. ESM 디펜던시에 중첩된 CommonJS 디펜던시가 있는 경우, 이 또한 제외되서는 안 됩니다.
  :::

### optimizeDeps.include

- **타입:** `string[]`

  기본적으로 `node_modules` 내부에 없는 연결된 패키지들은 미리 번들로 제공되지 않습니다. 이 옵션을 사용하여 연결된 패키지를 미리 번들로 묶을 수 있습니다.

### optimizeDeps.keepNames

- **타입:** `boolean`
- **기본값:** `false`

  번들러는 충돌을 방지하기 위해 때때로 기호 이름을 변경해야 하는 경우가 있습니다.
  함수 및 클래스의 `name` 속성을 유지하려면 이 값을 `true`로 설정하세요.
  [`keepNames`](https://esbuild.github.io/api/#keep-names)를 확인하세요.

## SSR 옵션 {#ssr-options}

:::warning 실험중입니다
SSR 옵션은 마이너 릴리즈에서 조정될 수 있습니다.
:::

- **참고:** [SSR Externals](/guide/ssr#ssr-externals)

### ssr.external

- **타입:** `string[]`

  SSR을 위한 디펜던시를 강제로 외부화 합니다.

### ssr.noExternal

- **타입:** `string | RegExp | (string | RegExp)[]`

  SSR을 위한 디펜던시 중에 이 목록에 있는 디펜던시는 외부화 되는 것이 방지됩니다.

### ssr.target

- **타입:** `'node' | 'webworker'`
- **기본값:** `node`

  SSR 서버를 위한 빌드 타겟입니다.
