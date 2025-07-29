# 프레임워크를 위한 환경 API {#environment-api-for-frameworks}

:::info Release Candidate
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.

리소스:

- [피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 새로운 API에 대한 피드백을 모으고 있습니다.
- [환경 API PR](https://github.com/vitejs/vite/pull/16471)에서 새로운 API를 구현하고 검토했습니다.

여러분의 피드백을 공유해주세요.
:::

## DevEnvironment Communication Levels

Since environments may run in different runtimes, communication against the environment may have constraints depending on the runtime. To allow frameworks to write runtime agnostic code easily, the Environment API provides three kinds of communication levels.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` is an environment that can communicate arbitrary values. The implicit `ssr` environment and other non-client environments use a `RunnableDevEnvironment` by default during dev. While this requires the runtime to be the same with the one the Vite server is running in, this works similarly with `ssrLoadModule` and allows frameworks to migrate and enable HMR for their SSR dev story. You can guard any runnable environment with an `isRunnableDevEnvironment` function.

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * 실행할 URL.
   * 파일 경로, 서버 경로, 또는 루트를 기준으로 한 ID를 허용합니다.
   * 인스턴스화된 모듈을 반환합니다(ssrLoadModule과 동일).
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * 다른 ModuleRunner 메서드들...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
`runner`는 처음 접근할 때만 지연 평가됩니다. Vite는 `runner`가 생성될 때 `process.setSourceMapsEnabled`를 호출하거나, 이를 사용할 수 없는 경우 `Error.prepareStackTrace`를 오버라이드해 소스 맵 지원을 활성화한다는 점을 유의하세요.
:::

Given a Vite server configured in middleware mode as described by the [SSR setup guide](/guide/ssr#setting-up-the-dev-server), let's implement the SSR middleware using the environment API. Remember that it doesn't have to be called `ssr`, so we'll name it `server` in this example. Error handling is omitted.

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // 기본적으로 모듈은 vite 서버와 같은 프로세스에서 실행됩니다
    },
  },
})

// TypeScript에서는 RunnableDevEnvironment로 캐스팅하거나
// isRunnableDevEnvironment를 사용해 runner에 대한 접근을 보호해야 할 수 있습니다
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. index.html 읽기
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Vite HTML 변환 적용. Vite HMR 클라이언트를 주입하고,
  //    @vitejs/plugin-react의 전역 초기화 코드와 같은
  //    Vite 플러그인을 통한 HTML 변환도 적용합니다
  template = await viteServer.transformIndexHtml(url, template)

  // 3. 서버 진입점 불러오기. import(url)은 자동으로 ESM 소스 코드를
  //    Node.js에서 사용할 수 있도록 변환합니다! 번들링이 필요하지 않으며,
  //    HMR 지원을 완벽히 제공합니다.
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. 앱 HTML 렌더링. entry-server.js에서 제공하는 `render` 함수가
  //    ReactDOMServer.renderToString()과 같은 적절한 프레임워크 SSR API를
  //    호출한다고 가정합니다
  const appHtml = await render(url)

  // 5. 앱에서 렌더링된 HTML을 템플릿에 주입합니다.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. 렌더링된 HTML을 반환합니다.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

When using environments that support HMR (such as `RunnableDevEnvironment`), you should add `import.meta.hot.accept()` in your server entry file for optimal behavior. Without this, server file changes will invalidate the entire server module graph:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment`

:::info

We are looking for feedback on [the `FetchableDevEnvironment` proposal](https://github.com/vitejs/vite/discussions/18191).

:::

`FetchableDevEnvironment` is an environment that can communicate with its runtime via the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) interface. Since the `RunnableDevEnvironment` is only possible to implement in a limited set of runtimes, we recommend to use the `FetchableDevEnvironment` instead of the `RunnableDevEnvironment`.

This environment provides a standardized way of handling requests via the `handleRequest` method:

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // handle Request and return a Response
            },
          })
        },
      },
    },
  },
})

// Any consumer of the environment API can now call `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

:::warning
Vite validates the input and output of the `dispatchFetch` method: the request must be an instance of the global `Request` class and the response must be the instance of the global `Response` class. Vite will throw a `TypeError` if this is not the case.

Note that although the `FetchableDevEnvironment` is implemented as a class, it is considered an implementation detail by the Vite team and might change at any moment.
:::

### raw `DevEnvironment`

If the environment does not implement the `RunnableDevEnvironment` or `FetchableDevEnvironment` interfaces, you need to set up the communication manually.

또한 작성한 코드가 사용자 모듈과 동일한 런타임에서 실행될 수 있다면(즉, Node.js 특정 API에 의존하지 않는다면), 가상 모듈을 사용할 수도 있습니다. 이 방식은 Vite API를 사용하는 측에서 모듈 값에 접근하는 코드를 생략할 수 있습니다.

```ts
// Vite API를 사용하는 코드
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // `virtual:entrypoint`를 처리하는 플러그인
    {
      name: 'virtual-module',
      /* 플러그인 구현 */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// 코드를 실행하는 각 환경 팩토리가 제공하는 함수 사용
// 각 환경 팩토리가 제공하는 함수를 확인하세요
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

가상 모듈을 사용하는 예시 중 하나로, 사용자 모듈에서 Vite API 중 하나인 `transformIndexHtml`을 사용하고자 한다면, 다음과 같은 플러그인을 구성할 수 있습니다:

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

만약 작성한 코드가 Node.js API를 필요로 한다면, `hot.send`를 사용해 사용자 모듈에서 Vite API를 사용하는 코드와 통신할 수 있습니다. 하지만 이 방식은 빌드 이후 동일하게 작동하지 않을 수 있다는 점에 유의하세요.

```ts
// Vite API를 사용하는 코드
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // `virtual:entrypoint`를 처리하는 플러그인
    {
      name: 'virtual-module',
      /* 플러그인 구현 */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// 코드를 실행하는 각 환경 팩토리가 제공하는 함수 사용
// 각 환경 팩토리가 제공하는 함수를 확인하세요
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## 빌드 단계에서의 환경 {#environments-during-build}

하위 호환성을 위해, CLI에서 `vite build`와 `vite build --ssr`을 실행하면, 동일하게 클라이언트 또는 SSR 전용 환경만을 빌드합니다.

`builder`가 `undefined`가 아닐 때(또는 `vite build --app`을 호출할 때), `vite build`는 전체 앱을 빌드하도록 설정됩니다. 이는 향후 메이저 버전에서 기본 동작이 될 예정입니다. 빌드 시에는 `ViteDevServer`와 대응되는 역할을 하는 `ViteBuilder` 인스턴스가 생성되어 프로덕션을 위해 구성된 모든 환경을 빌드합니다. 기본적으로 환경에 대한 빌드는 `environments` 레코드 순서를 따라 순차적으로 수행됩니다. 프레임워크나 사용자는 다음과 같이 환경 빌드 방식을 추가로 구성할 수 있습니다:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

Plugins can also define a `buildApp` hook. Order `'pre'` and `null` are executed before the configured `builder.buildApp`, and order `'post'` hooks are executed after it. `environment.isBuilt` can be used to check if an environment has already being build.

## 환경에 구애받지 않는 코드 {#environment-agnostic-code}

대부분의 경우 `environment` 인스턴스는 컨텍스트에 이미 존재하기에, `server.environments`로 직접 접근할 필요가 없습니다. 예를 들어, 플러그인 훅 내부에서는 `this.environment`로 환경에 접근할 수 있습니다. 환경을 인식하는 플러그인을 만드는 방법은 [플러그인을 위한 환경 API](./api-environment-plugins.md) 섹션을 참조하세요.