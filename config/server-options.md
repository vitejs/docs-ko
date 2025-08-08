# 서버 옵션 {#server-options}

별도로 명시되지 않은 한, 이 섹션의 옵션들은 개발 환경에만 적용됩니다.

## server.host {#server-host}

- **타입:** `string | boolean`
- **기본값:** `'localhost'`

서버가 수신할 IP 주소를 지정합니다.
LAN와 공용 주소를 포함한 모든 주소를 수신하려면 이 값을 `0.0.0.0` 또는 `true`로 설정하세요.

CLI에서는 `--host 0.0.0.0` or `--host`로 설정될 수 있습니다.

::: tip 참고

Vite 대신 다른 서버가 응답하는 경우가 있습니다.

첫 번째 경우는 `localhost`를 사용하는 경우입니다. Node.js 버전이 v17 미만이라면 기본적으로 DNS로 확인된 주소의 결과를 재정렬합니다. `localhost`에 접근할 때 브라우저는 DNS를 사용해 주소를 확인하며, 해당 주소는 Vite가 수신하고 있는 주소와 다를 수 있습니다.

이 재정렬 동작을 비활성화하려면 [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order)으로 설정해주세요. 이 때 Vite는 주소를 `localhost`로 표기합니다.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // 생략
})
```

두 번째 경우는 와일드카드 호스트(예: `0.0.0.0`)가 사용되는 경우입니다. 와일드카드 호스트는 명시적으로 지정된 호스트보다 우선 순위가 낮기 때문에 이러한 상황이 발생될 수 있습니다.

:::

::: tip LAN에서 WSL2의 서버에 액세스하기

WSL2에서 Vite를 실행할 때, `host: true`를 설정하는 것만으로는 LAN에서 서버에 접근할 수 없습니다.
[WSL 문서](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan)를 참고하세요.

:::

## server.allowedHosts {#server-allowedhosts}

- **타입:** `string[] | true`
- **기본값:** `[]`

Vite가 응답할 수 있는 호스트 이름 목록입니다.
기본적으로 `localhost`와 `.localhost` 하위 도메인, 그리고 모든 IP 주소가 허용됩니다.
HTTPS를 사용하는 경우 이 검사는 건너뜁니다.

문자열이 `.`으로 시작하는 경우, `.`이 제외된 호스트 이름과 모든 서브도메인을 허용합니다. 예를 들어, `.example.com`은 `example.com`, `foo.example.com`, `foo.bar.example.com`을 허용합니다. `true`로 설정하면 서버가 모든 호스트에 대한 요청에 응답할 수 있게 됩니다.

::: details 어떤 호스트가 안전한가요?

직접 IP 주소를 관리할 수 있는 호스트만 허용된 호스트 목록에 추가하는 것이 안전합니다.

예를 들어, `vite.dev` 도메인을 소유하고 있다면 `vite.dev` 및 `.vite.dev`를 목록에 추가해도 좋습니다. 해당 도메인을 소유하고 있지 않고 도메인 소유자를 신뢰할 수 없다면, 추가하지 말아야 합니다.

특히 `.com`과 같은 최상위 도메인은 절대로 목록에 추가하지 마세요. 누구나 `example.com`과 같은 도메인을 구매해 원하는 IP 주소로 연결할 수 있습니다.

:::

::: danger

`server.allowedHosts`를 `true`로 설정하면 DNS 리바인딩 공격을 통해 어떤 웹사이트에서든 개발 서버에 요청을 보낼 수 있게 되며, 소스 코드와 콘텐츠가 유출될 수 있습니다. 따라서 항상 명시적으로 호스트 목록을 지정할 것을 강력히 권장합니다. 자세한 내용은 [GHSA-vg6x-rcgg-rjx6](https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6)를 참고해 주세요.

:::

::: details 환경 변수를 통해 설정하기
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` 환경 변수를 통해 허용할 호스트를 추가로 지정할 수 있습니다.
:::

## server.port {#server-port}

- **타입:** `number`
- **기본값:** `5173`

서버 포트를 지정합니다. 포트가 이미 사용 중이라면, Vite는 자동으로 사용 가능한 다음 포트를 시도할 것이므로, 결과적으로 이 포트 번호가 서버의 수신 포트가 되지 않을 수도 있습니다.

## server.strictPort {#server-strictport}

- **타입:** `boolean`

포트가 이미 사용 중일 경우, 사용 가능한 다음 포트를 자동으로 시도하지 않도록 하려면 `true`로 설정하세요.

## server.https {#server-https}

- **타입:** `https.ServerOptions`

TLS + HTTP/2를 사용합니다. 값은 `https.createServer()`로 전달되는 [옵션 객체](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)입니다.

이 설정은 [`server.proxy` 옵션](#server-proxy)이 사용된다면 TLS만 사용하도록 다운그레이드된다는 점에 유의하세요.

인증서는 유효한 것이 필요합니다. 기본적으로 프로젝트에 [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) 플러그인을 추가하면 자체 서명된 인증서가 자동으로 생성되고 캐시됩니다. 다만 직접 생성한 인증서를 사용하는 것이 좋습니다.

## server.open {#server-open}

- **타입:** `boolean | string`

서버가 시작될 때 자동으로 브라우저에서 앱을 보여줍니다. 값이 문자열이면 URL의 경로명으로 사용됩니다. 원하는 특정 브라우저에서 열기를 원한다면, `process.env.BROWSER` (예: `firefox`) 환경 변수를 설정할 수 있습니다. `process.env.BROWSER_ARGS` 환경 변수를 통해 추가적인 인자를 전달할 수도 있습니다. (예: `--incognito`)

추가로 이 `BROWSER`와 `BROWSER_ARGS`는 `.env` 파일에서 설정이 가능합니다. 자세한 내용은 [`open` 패키지 문서](https://github.com/sindresorhus/open#app)를 참고해주세요.

**예제:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html'
  }
})
```

## server.proxy {#server-proxy}

- **타입:** `Record<string, string | ProxyOptions>`

개발 서버에 대한 커스텀 프록시 규칙을 구성합니다. `{ key: options }` 쌍의 객체를 전달할 수 있습니다. 경로가 해당 키로 시작하는 모든 요청은 지정된 대상으로 프록시됩니다. 키가 `^`로 시작하면 `RegExp`로 해석됩니다. `configure` 옵션은 프록시 인스턴스에 액세스하는 데 사용할 수 있습니다. 또한 프록시 규칙 중 하나라도 요청과 일치한다면, 해당 요청은 Vite에 의해 변환되지 않습니다.

참고로 [`base`](/config/shared-options.md#base)가 비상대적(Non-relative)인 경우, 각 키에 `base`를 접두사로 붙여야 합니다.

또한 [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3#options)를 확장합니다. 추가 옵션은 [여기](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13)에서 확인할 수 있습니다.

특정 상황(예: 서버 내부에서 사용되는 [connect](https://github.com/senchalabs/connect) 앱에 커스텀 미들웨어 추가)에서는 개발 서버를 직접 구성해야 할 수도 있습니다. 이를 위해서는 [플러그인](/guide/using-plugins.html)을 작성하고, [configureServer](/guide/api-plugin.html#configureserver) 훅을 이용해야 합니다. 자세한 것은 각 문서를 참고해주세요.

**예제:**

```js
export default defineConfig({
  server: {
    proxy: {
      // 문자열만:
      // http://localhost:5173/foo
      //   -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 옵션과 함께:
      // http://localhost:5173/api/bar
      //   -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 정규식(RegExp)과 함께:
      // http://localhost:5173/fallback/
      //   -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      },
      // 프록시 인스턴스 사용
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 변수에는 'http-proxy'의 인스턴스가 전달됩니다
        }
      },
      // 웹소켓 또는 socket.io 프록시:
      // ws://localhost:5173/socket.io
      //   -> ws://localhost:5174/socket.io
      // `rewriteWsOrigin`을 사용할 때는 주의하세요.
      // CSRF 공격에 노출될 수 있습니다.
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true,
      }
    }
  }
})
```

## server.cors {#server-cors}

- **타입:** `boolean | CorsOptions`
- **기본값:** `{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }` (`127.0.0.1` 및 `::1` 같은 localhost 허용)

개발 서버 CORS를 설정합니다.  [옵션 객체](https://github.com/expressjs/cors#configuration-options)를 전달해 상세한 동작을 설정하거나, 모든 출처를 허용하기 위해 `true`로 설정할 수 있습니다.

::: danger

`server.cors`를 `true`로 설정하면 모든 웹사이트에서 개발 서버에 요청을 보내고 소스 코드와 콘텐츠를 다운로드할 수 있게 됩니다. 따라서 항상 명시적으로 허용할 출처(origin) 목록을 사용할 것을 권장합니다.

:::

## server.headers {#server-headers}

- **타입:** `OutgoingHttpHeaders`

서버 응답 헤더를 지정합니다.

## server.hmr {#server-hmr}

- **타입:** `boolean | { protocol?: string, host?: string, port?: number | false, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

HMR 연결을 설정하거나 사용하지 않을 수 있습니다. (HMR 웹 소켓이 http 서버와 다른 주소를 사용해야 하는 경우)

서버 오류 오버레이를 사용하지 않으려면 `server.hmr.overlay`를 `false`로 설정하세요.

`protocol`은 HMR 연결에 사용되는 웹소켓 프로토콜을 설정합니다: `ws` (웹소켓) 또는 `wss` (보안 웹소켓) 값을 갖습니다.

`clientPort`는 클라이언트 측의 포트만 재정의하는 고급 옵션으로, 클라이언트 코드에서 찾는 것과 다른 포트에서 웹 소켓을 제공할 수 있습니다.

`server.hmr.server` 옵션이 정의되면 Vite는 제공된 서버를 통해 HMR 연결 요청을 처리합니다. 미들웨어 모드가 아니라면, Vite는 기존 서버를 통해 HMR 연결 요청을 처리합니다. 이는 자체적으로 서명된 인증서를 사용하거나 단일 포트의 네트워크를 통해 Vite를 제공하려는 경우 유용합니다.

예제는 [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue)를 참고해주세요.

::: tip 참고

기본적으로 Vite는 리버스 프록시가 WebSocket 프록시를 지원한다고 가정하고 동작합니다. 만약 Vite HMR 클라이언트가 WebSocket 연결에 실패하게 되면, 클라이언트는 리버스 프록시 대신 WebSocket을 Vite HMR 서버에 직접 연결합니다:

```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.
```

위와 같은 상황이 발생될 때 브라우저에 나타나는 이 오류는 무시해도 됩니다. 다만 아래의 작업들 중 하나를 통해 직접 리버스 프록시를 우회해서 오류를 나타나지 않게끔 할 수도 있습니다:

- WebSocket도 프록시하도록 리버스 프록시를 구성
- [`server.strictPort` 옵션의 값을 `true`로](#server-strictport), 그리고 `server.hmr.clientPort`를 `server.port`와 동일한 값으로 설정
- `server.hmr.port`를 [`server.port`](#server-port)와 다른 값으로 설정

:::

## server.warmup {#server-warmup}

- **타입:** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **관련 항목:** [Warm Up Frequently Used Files](/guide/performance.html#warm-up-frequently-used-files)

미리 변환하고 그 결과물을 캐시할 파일 목록입니다. 서버 시작 시 초기 페이지 로드를 개선하고 변환 워터폴(변환이 순차적으로 이루어지는 현상 - 옮긴이)을 방지합니다.

옵션의 `clientFiles`는 클라이언트에서만, `ssrFiles`는 SSR에서만 사용되는 파일 목록입니다. `root`를 기준으로 하는 파일 경로 또는 [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) 패턴의 배열을 받습니다.

Vite 개발 서버 시작 시 과부하가 걸리지 않도록 자주 사용되는 파일만 추가해주세요.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch {#server-watch}

- **타입:** `object | null`

[chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api)에 전달할 파일 시스템 감시자(Watcher) 옵션입니다.

Vite 서버 감시자는 기본적으로 `root`를 감시하며, `.git/`, `node_modules/`, `test-results/`, 그리고 Vite의 `cacheDir` 및 `build.outDir` 디렉터리는 건너뜁니다. 감시하는 파일이 업데이트되면, Vite는 필요한 경우에만 HMR을 적용하고 페이지를 업데이트합니다.

`null`로 설정하면 파일을 감시하지 않습니다. `server.watcher`는 (Node.js `EventEmitter`과)호환되는 이벤트 객체(Emitter)를 제공하지만, `add` 또는 `unwatch`를 호출해도 아무런 효과가 없습니다.

::: warning `node_modules` 디렉터리에서 파일 감시하기

현재 `node_modules` 디렉터리의 파일과 패키지는 감시할 수 없습니다. 더 많은 진행 상황과 해결 방법은 [#8619 이슈](https://github.com/vitejs/vite/issues/8619)를 참고해 주세요.

:::

::: warning Windows Subsystem for Linux (WSL) 2 에서 Vite 사용하기

WSL2에서 Vite를 실행할 때, WSL2가 아닌 타 Windows 응용 프로그램에서 파일을 편집하면 파일 시스템 변경사항 감시 기능이 정상적으로 동작하지 않습니다. 이는 [WSL2 제한사항](https://github.com/microsoft/WSL/issues/4739)으로 인한 것이며, WSL2 백엔드가 존재하는 Docker에서 실행하는 경우에도 동일합니다.

이를 해결하기 위해 아래 중 하나를 시도할 수 있습니다:

- **권고 사항:** WSL2 응용 프로그램을 사용해 파일을 편집
  - 또한 WSL2에서 Windows 파일 시스템에 접근하는 것은 느리기 때문에 프로젝트 폴더를 Windows 파일 시스템 외부로 이동시키는 것이 좋습니다. 이러한 오버헤드를 제거하면 성능이 향상됩니다.
- `{ usePolling: true }` 로 설정
  - 참고로 [`usePolling`은 CPU 사용률을 높입니다](https://github.com/paulmillr/chokidar/tree/3.6.0#performance).

:::

## server.middlewareMode {#server-middlewaremode}

- **타입:** `boolean`
- **기본값:** `false`

미들웨어 모드로 Vite 서버를 생성합니다.

- **관련 항목:** [appType](./shared-options.md#apptype), [SSR - 개발 서버 구성하기](/guide/ssr#setting-up-the-dev-server)

- **예제:**

```js twoslash
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 미들웨어 모드에서 Vite 서버를 생성합니다
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' },
    // Vite의 기본 HTML 처리 미들웨어를 포함하지 않음
    appType: 'custom'
  })
  // Vite의 연결(Connect) 인스턴스를 미들웨어로 사용
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // `appType`은 `'custom'`이므로, 여기에서 응답을 전달해야 합니다.
    // 참고: `appType`이 `'spa'` 또는 `'mpa'`인 경우,
    // Vite는 HTML 요청과 404를 처리하는 미들웨어를 포함하므로
    // Vite의 미들웨어가 적용되기 전에 사용자 미들웨어를 추가해야 합니다.
  })
}

createServer()
```

## server.fs.strict {#server-fs-strict}

- **타입:** `boolean`
- **기본값:** `true` (Vite 2.7에서 기본적으로 활성화되도록 변경되었습니다.)

작업영역 루트 외부에 있는 파일 제공을 제한합니다.

## server.fs.allow {#server-fs-allow}

- **타입:** `string[]`

`/@fs/`를 통해 제공될 수 있는 파일을 제한합니다. `server.fs.strict`가 `true`로 설정된 경우, 이 목록에 포함되지 않았으며 허용된 파일에서 `import` 되는 것도 아닌 외부 파일에 접근하면 403 결과를 반환합니다.

디렉터리와 파일 모두 제공될 수 있습니다.

Vite는 잠재적인 작업 공간의 루트를 검색하여 기본값으로 사용합니다. 유효한 작업 공간은 다음 조건을 충족합니다. 그렇지 않으면 [프로젝트 루트](/guide/#index-html-and-project-root)로 대체됩니다.

- `package.json`에 `workspaces` 필드가 포함됨
- 다음 파일 중 하나를 포함함
  - `lerna.json`
  - `pnpm-workspace.yaml`

커스텀 작업 공간 루트를 지정하는 경로를 허용합니다. 절대 경로 또는 [프로젝트 루트](/guide/#index-html-and-project-root)에 대한 상대 경로일 수 있습니다. 다음은 하나의 예입니다:

```js
export default defineConfig({
  server: {
    fs: {
      // 프로젝트 루트 바로 위 까지의 파일만 접근 가능
      allow: ['..']
    }
  }
})
```

만약 `server.fs.allow` 옵션이 지정되면, 자동으로 작업 영역의 루트를 감지하는 기능이 비활성화됩니다. 이후 기존의 동작을 확장하기 위해 `searchForWorkspaceRoot` 유틸리티가 노출됩니다:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // 작업 공간(Workspace)의 루트를 지정
        searchForWorkspaceRoot(process.cwd()),
        // 커스텀 allow 옵션 규칙
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ]
    }
  }
})
```

## server.fs.deny {#server-fs-deny}

- **타입:** `string[]`
- **기본값:** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

Vite dev 서버에서 제공되지 않기를 원하는 민감한 파일들에 대한 차단 목록입니다. 이 옵션은 [`server.fs.allow`](#server-fs-allow)보다 높은 우선 순위를 가지며, [피코매치 패턴](https://github.com/micromatch/picomatch#globbing-features)을 사용할 수 있습니다.

::: tip 참고

이 차단 목록은 [Public 디렉터리](/guide/assets.md#the-public-directory)에 적용되지 않습니다. Public 디렉터리 내 모든 파일은 빌드 시 결과물 출력 디렉터리에 직접 복사되며, 어떠한 필터링도 거치지 않습니다.

:::

## server.origin {#server-origin}

- **타입:** `string`

에셋 URL에 대한 `origin` 헤더를 정의합니다.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080/'
  }
})
```

## server.sourcemapIgnoreList {#server-sourcemapignorelist}

- **타입:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **기본값:** `(sourcePath) => sourcePath.includes('node_modules')`

서버 소스맵에서 소스 파일을 무시할지 여부로, [`x_google_ignoreList` 소스 맵 확장](https://developer.chrome.com/articles/x-google-ignore-list/) 필드를 채워넣는 데 사용됩니다.

`server.sourcemapIgnoreList`는 개발 서버에 대한 [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist)와 동일합니다. 두 구성 옵션 사이의 차이점은 `sourcePath`에 대한 상대 경로로 rollup 함수가 호출되는 동안 `server.sourcemapIgnoreList`는 절대 경로로 호출된다는 것입니다. 개발 중에 대부분의 모듈은 맵과 소스가 동일한 폴더에 있으므로 `sourcePath`에 대한 상대 경로는 파일 이름 자체입니다. 이러한 경우 절대 경로를 사용하면 편리합니다.

기본적으로 `node_modules`가 포함된 경로를 모두 제외합니다. 이 동작을 비활성화하려면 `false`를 전달하거나, 함수를 전달해 소스와 소스맵 경로를 받아 소스 경로를 무시할지 여부를 반환할 수 있습니다.

```js twoslash
export default defineConfig({
  server: {
    // 이는 기본 값으로, node_modules가 경로에 포함된 모든 파일의 경로를
    // 무시할 목록에 추가합니다.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      sourcePath.includes('node_modules')
    },
  },
})
```

::: tip 참고
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist)와 [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist)는 독립적으로 설정해야 합니다. `server.sourcemapIgnoreList`는 서버 전용 구성이며 정의된 rollup 옵션에서 기본값을 가져오지 않습니다.
:::