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

`RunnableDevEnvironment`는 애플리케이션 코드와 임의의 JavaScript 값을 주고받을 수 있는 환경입니다. 모듈을 임포트하면 함수, 클래스 인스턴스 등 실제 익스포트 값을 그대로 반환하므로, 프레임워크는 서버 진입점을 직접 실행할 수 있습니다. 암시적인 `ssr` 환경과 그 밖의 비클라이언트 환경은 개발 중 기본적으로 `RunnableDevEnvironment`를 사용합니다. `isRunnableDevEnvironment` 함수로 러너에 대한 접근을 보호할 수 있습니다.

`runner`는 `ModuleRunner`입니다. `runner.import(url)`로 모듈을 임포트하면 Vite 모듈 그래프에서 모듈을 가져와 변환하고 평가합니다(`url`은 파일 경로, 서버 경로 또는 루트 기준 상대 id를 받습니다). 그 결과 완전한 HMR 지원과 함께 인스턴스화된 모듈을 반환합니다. 이는 `server.ssrLoadModule`을 대체하는 현대적인 방식이며, 프레임워크가 SSR 개발 흐름에서 HMR을 활성화하도록 마이그레이션할 수 있습니다.

:::info 임의의 값을 주고받을 수 있는 이유
`RunnableDevEnvironment`는 Vite 서버와 같은 런타임에서 모듈을 평가하므로, 값이 직렬화되지 않고 프로세스 안에서 경계를 넘습니다. 이 점이 Fetch API를 통해 직렬화된 `Request`/`Response` 객체만 주고받을 수 있는 [`FetchableDevEnvironment`](#fetchabledevenvironment)와 다릅니다. 따라서 `RunnableDevEnvironment`를 사용하려면 러너의 런타임이 Vite 서버의 런타임과 같아야 합니다.
:::

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

프레임워크에서 Vite를 직접 실행할 수 없는 런타임(예: Cloudflare Workers)을 지원할 때 주로 사용합니다. `RunnableDevEnvironment`는 값이 프로세스 안에서 경계를 넘도록 러너가 Vite 서버와 같은 런타임을 사용해야 하므로 이런 환경에서는 사용할 수 없습니다. Fetch API를 표준으로 삼으면 프레임워크는 모든 대상 런타임에서 하나의 요청 처리 경로를 유지할 수 있습니다. 개발 미들웨어는 브라우저의 각 요청을 `Request`로 전달하고 반환된 `Response`를 다시 브라우저로 보내, 프로덕션에서 앱이 요청을 처리하는 방식을 그대로 재현합니다.

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

`builder` 옵션을 설정하면(`vite build --app`이 설정하는 빈 객체 `{}`도 포함), `vite build`는 전체 앱을 빌드합니다. 이는 향후 메이저 버전에서 기본값이 될 예정입니다. 이 모드에서 Vite는 빌드 시점의 `ViteDevServer`에 해당하는 `ViteBuilder` 인스턴스를 생성하고, 이를 사용해 구성된 모든 환경을 프로덕션용으로 빌드합니다. 기본적으로 환경은 `environments` 레코드의 순서에 따라 순차적으로 빌드됩니다.

### `builder.buildApp`으로 앱 빌드 구성하기 {#configuring-the-app-build-with-builder-buildapp}

프레임워크나 사용자는 `builder.buildApp` 옵션으로 환경을 빌드하는 방식을 제어할 수 있습니다. 이 옵션은 `ViteBuilder` 인스턴스(아래 예제에서는 `builder`)를 받고 각 환경을 빌드합니다. 예를 들어 다음과 같이 일부 환경을 병렬로 빌드할 수 있습니다:

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

### `buildApp` 플러그인 훅 {#the-buildapp-plugin-hook}

플러그인은 `builder.buildApp` 설정 옵션 외에도 `buildApp` 훅을 정의해 앱 빌드에 참여할 수 있습니다. 설정 옵션과 플러그인 훅은 정해진 순서로 실행됩니다. 먼저 순서가 `'pre'` 또는 `null`인 훅을 실행하고, 구성된 `builder.buildApp`을 실행한 뒤, 순서가 `'post'`인 훅을 실행합니다. 훅에서는 `environment.isBuilt`로 환경이 이미 빌드되었는지 확인하여 중복 빌드를 피할 수 있습니다.

### `createBuilder`로 프로그래밍 방식 빌드하기 {#building-programmatically-with-createbuilder}

코드에서 앱 빌드를 실행하려면 독립형 `build` 함수 대신 `createBuilder`를 사용하세요. `createBuilder`는 빌드 시점의 `createServer`에 해당합니다. 설정을 해석하고 `ViteBuilder`를 반환하며, 이 객체의 `buildApp` 메서드는 구성된 모든 환경을 빌드합니다. `builder.build(environment)`로 환경 하나만 빌드할 수도 있습니다.

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

환경을 인식하는 빌드에서는 `createBuilder`가 독립형 `build` 함수를 대체합니다. `build`는 위에서 설명한 레거시 클라이언트 전용 및 SSR 전용 빌드의 단순 진입점으로 계속 사용할 수 있지만, 임의의 환경을 빌드할 수는 없습니다. `builder.buildApp()` 실행은 프로그래밍 방식의 `vite build --app`과 같습니다.

## 환경에 구애받지 않는 코드 {#environment-agnostic-code}

대부분의 경우 `environment` 인스턴스는 컨텍스트에 이미 존재하기에, `server.environments`로 직접 접근할 필요가 없습니다. 예를 들어, 플러그인 훅 내부에서는 `this.environment`로 환경에 접근할 수 있습니다. 환경을 인식하는 플러그인을 만드는 방법은 [플러그인을 위한 환경 API](./api-environment-plugins.md) 섹션을 참조하세요.
