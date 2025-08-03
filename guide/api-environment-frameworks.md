# SSR Using `ModuleRunner` API
# Move to Per-environment APIs
:::info Release Candidate
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
- [`this.environment` in Hooks](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` Plugin Hook](/changes/hotupdate-hook)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.


## DevEnvironment Communication Levels

Since environments may run in different runtimes, communication against the environment may have constraints depending on the runtime. To allow frameworks to write runtime agnostic code easily, the Environment API provides three kinds of communication levels.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` is an environment that can communicate arbitrary values. The implicit `ssr` environment and other non-client environments use a `RunnableDevEnvironment` by default during dev. While this requires the runtime to be the same with the one the Vite server is running in, this works similarly with `ssrLoadModule` and allows frameworks to migrate and enable HMR for their SSR dev story. You can guard any runnable environment with an `isRunnableDevEnvironment` function.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
암시적인 `ssr` 환경을 포함해, 클라이언트가 아닌 환경은 개발 중 기본적으로 `RunnableDevEnvironment`를 사용합니다. 이 경우 런타임이 Vite 서버가 실행되는 런타임과 동일해야 하지만, `ssrLoadModule`과 유사하게 작동하여 프레임워크가 SSR 개발 환경에서 HMR을 활성화하고 마이그레이션할 수 있도록 만듭니다. `isRunnableDevEnvironment` 함수를 사용하여 실행 가능한 환경을 확인할 수 있습니다.
Note Vite supports using ES modules syntax in the config file even if the project is not using native Node ESM, e.g. `"type": "module"` in `package.json`. In this case, the config file is auto pre-processed before load.
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
clientEnvironment.transformRequest(url)
      name: 'build-client',
- `ssr`: runs the app in node (or other server runtimes) which renders pages before sending them to the browser.
    },

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
```

:::warning

또한 `FetchableDevEnvironment`가 클래스로 구현되어 있기는 하지만, Vite 팀은 이를 내부 구현 중 하나로 취급하기에 언제든지 변경될 수 있습니다.
Given a Vite server configured in middleware mode as described by the [SSR setup guide](/guide/ssr#setting-up-the-dev-server), let's implement the SSR middleware using the environment API. Remember that it doesn't have to be called `ssr`, so we'll name it `server` in this example. Error handling is omitted.
  BuildAppHook,
:::

## 기본 `RunnableDevEnvironment` {#default-runnabledevenvironment}

[SSR 설정 가이드](/guide/ssr#setting-up-the-dev-server)에서 설명한 대로 미들웨어 모드로 구성된 Vite 서버가 있다고 가정하고, 환경 API를 사용하여 SSR 미들웨어를 구현해보겠습니다. 오류 처리는 생략했습니다.

import fs from 'node:fs'
import path from 'node:path'
const viteServer = await createServer({
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = await createServer({
  server: { middlewareMode: true },
      // 기본적으로 모듈은 vite 서버와 같은 프로세스에서 실행됩니다
    },
const serverEnvironment = viteServer.environments.server
  },
})

// TypeScript에서는 RunnableDevEnvironment로 캐스팅하거나
// isRunnableDevEnvironment를 사용해 runner에 대한 접근을 보호해야 할 수 있습니다
The current Vite server API is not yet deprecated and is backward compatible with Vite 5.
const environment = server.environments.node

app.use('*', async (req, res, next) => {
  const url = req.originalUrl
  // 1. index.html 읽기
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  template = await viteServer.transformIndexHtml(url, template)
  //    Vite 플러그인을 통한 HTML 변환도 적용합니다
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )
  template = await server.transformIndexHtml(url, template)

  // 3. 서버 진입점 불러오기. import(url)은 자동으로 ESM 소스 코드를
  //    Node.js에서 사용할 수 있도록 변환합니다! 번들링이 필요하지 않으며,
  //    HMR 지원을 완벽히 제공합니다.
  const { render } = await environment.runner.import('/src/entry-server.js')

- [Move to Per-environment APIs](/changes/per-environment-apis)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared Plugins During Build](/changes/shared-plugins-during-build)
  const appHtml = await render(url)

```
When using environments that support HMR (such as `RunnableDevEnvironment`), you should add `import.meta.hot.accept()` in your server entry file for optimal behavior. Without this, server file changes will invalidate the entire server module graph:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

:::info

We are looking for feedback on [the `FetchableDevEnvironment` proposal](https://github.com/vitejs/vite/discussions/18191).
## 런타임에 구애받지 않는 SSR {#runtime-agnostic-ssr}
`RunnableDevEnvironment`는 Vite 서버와 동일한 런타임에서만 코드를 실행할 수 있기 때문에, Vite 서버를 실행할 수 있는 런타임(Node.js와 호환되는 런타임)이 필요합니다. 다른 말로는, 런타임에 구애받지 않으려면 확장되지 않은 원시 `DevEnvironment`를 사용해야 함을 의미합니다.
There are [multiple communication levels for the `DevEnvironment`](/guide/api-environment-frameworks#devenvironment-communication-levels). To make it easier for frameworks to write runtime agnostic code, we recommend to implement the most flexible communication level possible.

`FetchableDevEnvironment` is an environment that can communicate with its runtime via the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) interface. Since the `RunnableDevEnvironment` is only possible to implement in a limited set of runtimes, we recommend to use the `FetchableDevEnvironment` instead of the `RunnableDevEnvironment`.
This environment provides a standardized way of handling requests via the `handleRequest` method:
:::info `FetchableDevEnvironment` 제안

import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'
다음은 Vite API를 사용하는 코드에서 분리된 사용자 모듈을 실행하고, 그 값을 가져오는 예제입니다:
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
import { createServer } from 'vite'
// Any consumer of the environment API can now call `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
const handler = createHandler(input)
const response = handler(new Request('/'))

:::warning
Vite validates the input and output of the `dispatchFetch` method: the request must be an instance of the global `Request` class and the response must be the instance of the global `Response` class. Vite will throw a `TypeError` if this is not the case.

Note that although the `FetchableDevEnvironment` is implemented as a class, it is considered an implementation detail by the Vite team and might change at any moment.
:::

### raw `DevEnvironment`

If the environment does not implement the `RunnableDevEnvironment` or `FetchableDevEnvironment` interfaces, you need to set up the communication manually.

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

또한 작성한 코드가 사용자 모듈과 동일한 런타임에서 실행될 수 있다면(즉, Node.js 특정 API에 의존하지 않는다면), 가상 모듈을 사용할 수도 있습니다. 이 방식은 Vite API를 사용하는 측에서 모듈 값에 접근하는 코드를 생략할 수 있습니다.

```ts
// Vite API를 사용하는 코드
## Plugin / Framework Authors Guide
  plugins: [
    // `virtual:entrypoint`를 처리하는 플러그인
    {
      name: 'virtual-module',
      /* 플러그인 구현 */
    },
if (ssrEnvironment instanceof CustomDevEnvironment) {
const input = {}

// 코드를 실행하는 각 환경 팩토리가 제공하는 함수 사용
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
In a future major, we could have complete alignment:
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
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
  /**
   * Build Environments
   *
   * @experimental
   */
  buildApp?: ObjectHook<BuildAppHook>
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

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
Plugins can also define a `buildApp` hook. Order `'pre'` and `null` are executed before the configured `builder.buildApp`, and order `'post'` hooks are executed after it. `environment.isBuilt` can be used to check if an environment has already being build.
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

## 환경에 구애받지 않는 코드 {#environment-agnostic-code}

대부분의 경우 `environment` 인스턴스는 컨텍스트에 이미 존재하기에, `server.environments`로 직접 접근할 필요가 없습니다. 예를 들어, 플러그인 훅 내부에서는 `this.environment`로 환경에 접근할 수 있습니다. 환경을 인식하는 플러그인을 만드는 방법은 [플러그인을 위한 환경 API](./api-environment-plugins.md) 섹션을 참조하세요.
              text: 'Move to Per-environment APIs',
              text: 'SSR Using ModuleRunner API',
              text: 'Shared Plugins During Build',
  isBuilt = false
    { ...builderOptionsDefaults, buildApp: async () => {} },
      // order 'pre' and 'normal' hooks are run first, then config.builder.buildApp, then 'post' hooks
      let configBuilderBuildAppCalled = false
      for (const p of config.getSortedPlugins('buildApp')) {
        const hook = p.buildApp
        if (
          !configBuilderBuildAppCalled &&
          typeof hook === 'object' &&
          hook.order === 'post'
        ) {
          configBuilderBuildAppCalled = true
          await configBuilder.buildApp(builder)
        }
        const handler = getHookHandler(hook)
        await handler(builder)
      }
      if (!configBuilderBuildAppCalled) {
        await configBuilder.buildApp(builder)
      }
      // fallback to building all environments if no environments have been built
      if (
        Object.values(builder.environments).every(
          (environment) => !environment.isBuilt,
        )
      ) {
        for (const environment of Object.values(builder.environments)) {
          await builder.build(environment)
        }
      }
    async build(
      environment: BuildEnvironment,
    ): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
      const output = await buildEnvironment(environment)
      environment.isBuilt = true
      return output

export type BuildAppHook = (this: void, builder: ViteBuilder) => Promise<void>