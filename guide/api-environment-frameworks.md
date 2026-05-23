# 프레임워크를 위한 환경 API {#environment-api-for-frameworks}

:::info 릴리즈 후보
환경 API는 현재 릴리즈 후보 단계에 있습니다. 생태계가 실험하고 이를 기반으로 구축할 수 있도록 주요 릴리즈 간 API의 안정성을 유지할 계획입니다. 다만 [일부 특정 API](/changes/#considering)는 여전히 실험적인 기능으로 간주됩니다.

다운스트림 프로젝트들이 새로운 기능을 실험하고 검증할 시간을 가진 후, 향후 메이저 릴리즈에서 (잠재적인 주요 변경 사항과 함께) 이러한 새로운 API를 안정화할 계획입니다.

리소스:

- [피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 새로운 API에 대한 피드백을 모으고 있습니다.
- 새 API가 구현되고 검토된 [Environment API PR](https://github.com/vitejs/vite/pull/16471)

여러분의 피드백을 공유해주세요.
:::

## DevEnvironment 통신 레벨 {#devenvironment-communication-levels}

환경은 다양한 런타임에서 실행될 수 있기 때문에, 환경과의 통신은 런타임에 따라 제약이 있을 수 있습니다. 프레임워크가 런타임에 구애받지 않는 코드를 쉽게 작성할 수 있도록, 환경 API는 세 종류의 통신 레벨을 제공합니다.

### `RunnableDevEnvironment` {#runnabledevenvironment}

`RunnableDevEnvironment`는 임의의 값을 주고받을 수 있는 환경입니다. 암시적인 `ssr` 환경을 포함해, 클라이언트가 아닌 환경은 개발 중 기본적으로 `RunnableDevEnvironment`를 사용합니다. 이 경우 Vite 서버가 실행되는 런타임과 동일해야 하지만, `ssrLoadModule`과 유사하게 작동하여 프레임워크가 SSR 개발 환경에서 HMR을 활성화하고 마이그레이션할 수 있도록 만듭니다. 또한 `isRunnableDevEnvironment` 함수를 사용하여 실행 가능한 환경인지 확인할 수 있습니다.

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * 실행할 URL입니다.
   * 파일 경로, 서버 경로, 또는 루트 기준 상대 id를 받습니다.
   * 인스턴스화된 모듈을 반환합니다(ssrLoadModule과 동일).
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * 기타 ModuleRunner 메서드...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
`runner`는 처음 접근할 때만 지연 평가됩니다. Vite는 `runner`가 생성될 때 `process.setSourceMapsEnabled`를 호출하거나, 이를 사용할 수 없는 경우 `Error.prepareStackTrace`를 오버라이드해 소스 맵 지원을 활성화한다는 점을 유의하세요.
:::

[SSR 설정 가이드](/guide/ssr#setting-up-the-dev-server)에서 설명한 대로 미들웨어 모드로 구성된 Vite 서버가 있다고 가정하고, 환경 API를 사용하여 SSR 미들웨어를 구현해보겠습니다. 환경 이름이 반드시 `ssr`일 필요는 없으므로, 이 예제에서는 `server`로 명명하겠습니다. 오류 처리는 생략했습니다.

```js
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // 기본적으로 모듈은 Vite 서버와 같은 프로세스에서 실행됩니다.
    },
  },
})

// TypeScript에서는 이를 RunnableDevEnvironment로 캐스팅하거나
// isRunnableDevEnvironment를 사용해 runner 접근을 보호해야 할 수 있습니다.
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. index.html을 읽습니다.
  const indexHtmlPath = path.resolve(import.meta.dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Vite HTML 변환을 적용합니다. 이 과정에서 Vite HMR 클라이언트를 주입하고,
  //    Vite 플러그인의 HTML 변환도 적용합니다. 예를 들어 @vitejs/plugin-react의
  //    전역 프리앰블이 여기에 포함됩니다.
  template = await viteServer.transformIndexHtml(url, template)

  // 3. 서버 엔트리를 로드합니다. import(url)은 ESM 소스 코드를
  //    Node.js에서 사용할 수 있도록 자동 변환합니다.
  //    번들링은 필요 없으며, 완전한 HMR 지원을 제공합니다.
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. 앱 HTML을 렌더링합니다. entry-server.js에서 export한 `render` 함수가
  //    적절한 프레임워크 SSR API를 호출한다고 가정합니다.
  //    예: ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. 앱이 렌더링한 HTML을 템플릿에 주입합니다.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. 렌더링된 HTML을 반환합니다.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

HMR을 지원하는 환경(예: `RunnableDevEnvironment`)을 사용할 때는 최적의 동작을 위해 서버 엔트리 파일에 `import.meta.hot.accept()`를 추가해야 합니다. 이것이 없으면 서버 파일 변경 시 전체 서버 모듈 그래프가 무효화됩니다:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment` {#fetchabledevenvironment}

:::info

[`FetchableDevEnvironment` 제안](https://github.com/vitejs/vite/discussions/18191)에 대한 피드백을 모으고 있습니다.

:::

`FetchableDevEnvironment`는 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) 인터페이스를 통해 런타임과 통신할 수 있는 환경입니다. `RunnableDevEnvironment`는 제한된 런타임에서만 구현이 가능하기 때문에, `RunnableDevEnvironment` 대신 `FetchableDevEnvironment`를 사용하는 것을 권장합니다.

이 환경은 `handleRequest` 메서드를 통해 요청을 처리하는 표준화된 방법을 제공합니다:

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
              // Request를 처리하고 Response를 반환합니다.
            },
          })
        },
      },
    },
  },
})

// 이제 환경 API 소비자는 `dispatchFetch`를 호출할 수 있습니다.
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('http://example.com/request-to-handle'),
  )
}
```

:::warning
Vite는 `dispatchFetch` 메서드의 입력과 출력을 검증합니다: 요청은 전역 `Request` 클래스의 인스턴스여야 하고, 응답은 전역 `Response` 클래스의 인스턴스여야 합니다. 이를 만족하지 않으면 Vite는 `TypeError`를 발생시킵니다.

`FetchableDevEnvironment`가 클래스로 구현되어 있지만, Vite 팀은 이를 구현 세부사항으로 간주하며 언제든지 변경될 수 있습니다.
:::

### 기본 `DevEnvironment` {#raw-devenvironment}

환경이 `RunnableDevEnvironment` 또는 `FetchableDevEnvironment` 인터페이스를 구현하지 않는 경우, 통신을 수동으로 설정해야 합니다.

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

// 코드를 실행하는 각 환경 팩토리가 노출한 함수를 사용합니다.
// 각 환경 팩토리가 무엇을 제공하는지 확인하세요.
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('http://example.com/'))

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

// 코드를 실행하는 각 환경 팩토리가 노출한 함수를 사용합니다.
// 각 환경 팩토리가 무엇을 제공하는지 확인하세요.
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('http://example.com/')

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

const response = handler(new Request('http://example.com/'))

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

`builder` 옵션이 `undefined`가 아니거나 `vite build --app`을 호출하면, `vite build`는 전체 앱을 빌드하도록 동작합니다. 이는 향후 메이저 버전에서 기본값이 될 예정입니다. 구성된 모든 환경을 프로덕션용으로 빌드하기 위해 빌드 시점의 `ViteDevServer`에 해당하는 `ViteBuilder` 인스턴스가 생성됩니다. 기본적으로 환경 빌드는 `environments` 레코드의 순서를 존중해 순차적으로 실행됩니다. 프레임워크나 사용자는 `builder.buildApp` 옵션을 사용해 환경이 빌드되는 방식을 추가로 구성할 수 있습니다:

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
})
```

플러그인도 `buildApp` 훅을 정의할 수 있습니다. `'pre'` 및 `null` 순서는 구성된 `builder.buildApp` 이전에 실행되고, `'post'` 순서의 훅은 그 이후에 실행됩니다. `environment.isBuilt`를 사용해 환경이 이미 빌드되었는지 확인할 수 있습니다.

## 환경에 구애받지 않는 코드 {#environment-agnostic-code}

대부분의 경우 `environment` 인스턴스는 컨텍스트에 이미 존재하기에, `server.environments`로 직접 접근할 필요가 없습니다. 예를 들어, 플러그인 훅 내부에서는 `this.environment`로 환경에 접근할 수 있습니다. 환경을 인식하는 플러그인을 만드는 방법은 [플러그인을 위한 환경 API](./api-environment-plugins.md) 섹션을 참조하세요.
