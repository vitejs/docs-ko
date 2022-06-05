# 서버 옵션 {#server-options}

## server.host {#server-host}

- **타입:** `string | boolean`
- **기본값:** `'127.0.0.1'`

서버가 수신할 IP 주소를 지정합니다.
LAN와 공용 주소를 포함한 모든 주소를 수신하려면 이 값을 `0.0.0.0` 또는 `true`로 설정하세요.

CLI에서는 `--host 0.0.0.0` or `--host`로 설정될 수 있습니다.

## server.port {#server-port}

- **타입:** `number`
- **기본값**: `5173`

서버 포트를 지정합니다. 포트가 이미 사용 중이라면, Vite는 자동으로 사용 가능한 다음 포트를 시도할 것이므로, 결과적으로 이 포트 번호가 서버의 수신 포트가 되지 않을 수도 있습니다.

## server.strictPort {#server-strictport}

- **타입:** `boolean`

포트가 이미 사용 중일 경우, 사용 가능한 다음 포트를 자동으로 시도하지 않도록 하려면 `true`로 설정하세요.

## server.https {#server-https}

- **타입:** `boolean | https.ServerOptions`

TLS + HTTP/2를 사용합니다. [`server.proxy` 옵션](#server-proxy)이 사용된다면, 이것은 오직 TLS만 사용하는 것으로 다운그레이드됩니다.

이 값은 또한 [옵션 객체](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)가 `https.createServer()`로 전달되는 값일 수도 있습니다.

## server.open {#server-open}

- **타입:** `boolean | string`

서버가 시작될 때 자동으로 브라우저에서 앱을 보여줍니다. 값이 문자열이면 URL의 경로명으로 사용됩니다. 원하는 특정 브라우저에서 열기를 원한다면, `process.env.BROWSER` (예: `firefox`) 환경 변수를 설정할 수 있습니다. 더 자세한 점을 알려면 [`open` 패키지](https://github.com/sindresorhus/open#app)를 확인하세요.

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

개발 서버를 위한 사용자 지정 프록시 규칙을 설정합니다. `{ key: options }` 페어의 객체 형식입니다. 키가 `^`로 시작하면, `RegExp`로 해석됩니다. `configure` 옵션을 사용하여 프록시 인스턴스에 접근할 수 있습니다.

[`http-proxy`](https://github.com/http-party/node-http-proxy)를 사용하며, 전체 옵션은 [여기](https://github.com/http-party/node-http-proxy#options)를 확인해주세요.

특정 상황(예: 서버 내부에서 사용되는 [connect](https://github.com/senchalabs/connect) 앱에 커스텀 미들웨어 추가)에서는 개발 서버를 직접 구성해야 할 수도 있습니다. 이를 위해서는 [플러그인](/guide/using-plugins.html)을 작성하고, [configureServer](/guide/api-plugin.html#configureserver) 훅을 이용해야 합니다. 자세한 것은 각 문서를 참고해주세요.

**예제:**

```js
export default defineConfig({
  server: {
    proxy: {
      // 문자열만
      '/foo': 'http://localhost:4567',
      // 옵션과 함께
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 정규식(RegEx)과 함께
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
      // 웹소켓 또는 socket.io 프록시
      '/socket.io': {
        target: 'ws://localhost:5173',
        ws: true
      }
    }
  }
})
```

## server.cors {#server-cors}

- **타입:** `boolean | CorsOptions`

개발 서버를 위한 CORS를 설정합니다. 이것은 기본적으로 활성화되어 있으며 모든 오리진을 허용합니다. 동작을 상세하게 조절하기 위해 [옵션 객체](https://github.com/expressjs/cors)를 전달하거나, 사용하지 않기 위해 `false`를 전달하세요.

## server.headers {#server-headers}

- **타입:** `OutgoingHttpHeaders`

서버 응답 헤더를 지정합니다.

## server.force {#server-force}

- **타입:** `boolean`
- **참고:** [사전 번들링 된 디펜던시](/guide/dep-pre-bundling)

디펜던시의 사전 번들링을 강제하려면 `true`로 설정하세요.

## server.hmr {#server-hmr}

- **타입:** `boolean | { protocol?: string, host?: string, port?: number | false, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

HMR 연결을 설정하거나 사용하지 않을 수 있습니다. (HMR 웹 소켓이 http 서버와 다른 주소를 사용해야 하는 경우)

서버 오류 오버레이를 사용하지 않으려면 `server.hmr.overlay`를 `false`로 설정하세요.

포트가 없는 도메인에 연결하고자 한다면 `server.hmr.port`를 `false`로 설정해주세요.

`clientPort`는 클라이언트 측의 포트만 재정의하는 고급 옵션으로, 클라이언트 코드에서 찾는 것과 다른 포트에서 웹 소켓을 제공할 수 있습니다. 개발 서버의 앞단에서 SSL 프록시를 사용하는 경우에 유용합니다.

`server.middlewareMode` 또는 `server.https`를 사용할 때, `server.hmr.server`를 HTTP(S) 서버로 설정하면 서버를 통해 HMR 연결 요청이 처리됩니다. 이는 자체 서명된 인증서를 사용하거나, 또는 단을 포트 네트워크를 통해 Vite에 접근이 가능하게 구성하는 경우 유용할 수 있습니다.

## server.watch {#server-watch}

- **타입:** `object`

[chokidar](https://github.com/paulmillr/chokidar#api)에 전달할 파일 시스템 감시자(Watcher) 옵션입니다.

Windows Subsystem for Linux(WSL) 2에서 Vite를 실행하고, 그리고 프로젝트 폴더가 Windows 파일 시스템에 존재하는 경우, `{ usePolling: true }` 옵션을 설정해줘야 합니다. 이는 Windows 파일 시스템의 [WSL2 제한사항](https://github.com/microsoft/WSL/issues/4739)으로 인한 것입니다.

Vite의 서버 감시자는 기본적으로 `.git/` 및 `node_modules/` 디렉터리를 건너뜁니다. 만약 `node_modules/` 내부의 패키지를 감시하고자 한다면, 다음과 같은 Glob 패턴을 `server.watch.ignored`에 전달하면 됩니다:

```js
export default defineConfig({
  server: {
    watch: {
      ignored: ['!**/node_modules/your-package-name/**']
    }
  },
  // 감시 중인 패키지는 최적화에서 제외되어야,
  // 디펜던시 그래프에 나타나고 핫 리로드를 트리거 할 수 있게 됩니다.
  optimizeDeps: {
    exclude: ['your-package-name']
  }
})
```

## server.middlewareMode {#server-middlewaremode}

- **타입:** `'ssr' | 'html'`

미들웨어 모드로 Vite 서버를 생성합니다. (HTTP 서버 없이)

- `'ssr'`은 Vite의 HTML 서비스 로직을 비활성화하므로, 수동으로 `index.html`을 제공해야 합니다.
- `'html'`은 Vite의 HTML 서비스 로직을 활성화합니다.

- **참고:** [SSR - 개발 서버 설정하기](/guide/ssr#setting-up-the-dev-server)

- **예제:**

```js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // 미들웨어 모드에서 Vite 서버를 생성합니다.
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // Vite의 연결(Connect) 인스턴스를 미들웨어로 사용
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // 만약 `middlewareMode`가 `'ssr'`이면, 이곳에서 `index.html`를 제공(Serve)합니다.
    // 만약 `middlewareMode`가 `'html'`이면, Vite가 이를 처리하기에
    // `index.html`을 제공할 필요가 없습니다.
  })
}

createServer()
```

## server.base {#server-base}

- **타입:** `string | undefined`

Vite를 하위 디렉터리로 프록시하기 위해 이 디렉터리를 http 요청 앞에 추가합니다. 시작과 끝이 모두 `/` 문자여야 합니다.

## server.fs.strict {#server-fs-strict}

- **실험적 기능**
- **타입:** `boolean`
- **기본값:** `true` (Vite 2.7에서 기본적으로 활성화되도록 변경되었습니다.)

작업영역 루트 외부에 있는 파일 제공을 제한합니다.

## server.fs.allow {#server-fs-allow}

- **실험적 기능**
- **타입:** `string[]`

`/@fs/`를 통해 제공될 수 있는 파일을 제한합니다. `server.fs.strict`가 `true`로 설정된 경우, 이 목록에 포함되지 않았으며 허용된 파일에서 `import` 되는 것도 아닌 외부 파일에 접근하면 403 결과를 반환합니다.

Vite는 잠재적인 작업 공간의 루트를 검색하여 기본값으로 사용합니다. 유효한 작업 공간은 다음 조건을 충족합니다. 그렇지 않으면 [프로젝트 루트](/guide/#index-html-and-project-root)로 대체됩니다.

- `package.json`에 `workspaces` 필드가 포함됨
- 다음 파일 중 하나를 포함함
  - `lerna.json`
  - `pnpm-workspace.yaml`

사용자 지정 작업 공간 루트를 지정하는 경로를 허용합니다. 절대 경로 또는 [프로젝트 루트](/guide/#index-html-and-project-root)에 대한 상대 경로일 수 있습니다. 다음은 하나의 예입니다:

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
        '/path/to/custom/allow'
      ]
    }
  }
})
```

## server.fs.deny {#server-fs-deny}

- **타입**: `string[]`

Vite dev 서버에서 제공되지 않기를 원하는 민감한 파일들에 대한 차단 목록입니다.

기본적으로 `['.env', '.env.*', '*.{pem,crt}']` 파일들이 들어가 있습니다.

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