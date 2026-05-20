# 런타임을 위한 환경 API {#environment-api-for-runtimes}

:::info 릴리즈 후보
환경 API는 현재 릴리즈 후보 단계에 있습니다. 생태계가 실험하고 이를 기반으로 구축할 수 있도록 주요 릴리즈 간 API의 안정성을 유지할 계획입니다. 다만 [일부 특정 API](/changes/#considering)는 여전히 실험적인 기능으로 간주됩니다.

다운스트림 프로젝트들이 새로운 기능을 실험하고 검증할 시간을 가진 후, 향후 메이저 릴리즈에서 (잠재적인 주요 변경 사항과 함께) 이러한 새로운 API를 안정화할 계획입니다.

리소스:

- [피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 새로운 API에 대한 피드백을 모으고 있습니다.
- 새 API가 구현되고 검토된 [Environment API PR](https://github.com/vitejs/vite/pull/16471)

여러분의 피드백을 공유해주세요.
:::

## 환경 팩토리 {#environment-factories}

환경 팩토리는 일반적으로 Cloudflare와 같은 환경을 제공하는 쪽에서 구현하며, 이를 최종 사용자가 직접 작성하지는 않습니다. 환경 팩토리는 개발과 빌드 환경에서 사용할 런타임에 대한 일반적인 설정을 `EnvironmentOptions`로 반환합니다. 사용자가 직접 설정할 필요가 없도록 기본 환경 옵션도 구성할 수도 있습니다.

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions,
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: true,
            transport: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig,
  )
}
```

그러면 설정 파일은 다음과 같이 작성할 수 있습니다:

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

그리고 프레임워크는 다음과 같이 workerd 런타임을 사용하는 환경에서 SSR을 수행할 수 있습니다:

```js
const ssrEnvironment = server.environments.ssr
```

## 새로운 환경 팩토리 만들기 {#creating-a-new-environment-factory}

Vite 개발 서버는 기본적으로 두 가지 환경을 제공합니다: `client` 환경과 `ssr` 환경입니다. 클라이언트 환경은 기본적으로 브라우저 환경이며, 이 때 모듈 실행기는 클라이언트 앱에 `/@vite/client` 가상 모듈을 가져와 구현됩니다. SSR 환경은 기본적으로 Vite 서버와 동일한 Node 런타임에서 실행되며, 개발 단계에서 완전한 HMR 지원과 함께 애플리케이션 서버를 사용해 요청을 렌더링할 수 있습니다.

소스 코드가 변환된 결과물을 모듈이라고 하며, 각 환경에서 처리된 모듈 사이의 디펜던시 관계는 모듈 그래프에 저장됩니다. 이러한 모듈은 각 환경과 연결된 런타임으로 전송되어 실행됩니다. 그리고 런타임에서 모듈이 분석되면서 다른 모듈을 불러오는 요청이 발생하고, 이에 따라 모듈 그래프에서 관련 부분이 처리됩니다.

Vite 모듈 러너는 먼저 Vite 플러그인으로 코드를 처리한 뒤 어떤 코드든 실행합니다. 러너 구현이 서버와 분리되어 있다는 점에서 `server.ssrLoadModule`과 다릅니다. 이를 통해 라이브러리와 프레임워크 작성자는 Vite 서버와 러너 사이의 통신 레이어를 직접 구현할 수 있습니다. 브라우저는 서버 WebSocket과 HTTP 요청을 사용해 해당 환경과 통신합니다. Node 모듈 러너는 같은 프로세스에서 실행되므로 모듈 처리를 위해 직접 함수 호출을 할 수 있습니다. 다른 환경은 workerd 같은 JS 런타임이나 Vitest처럼 Worker Thread에 연결해 모듈을 실행할 수 있습니다.

```dot
digraph module_runner {
  rankdir=LR
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"
  compound=true

  subgraph cluster_server {
    label="Vite Dev Server (Node.js)" labeljust=l fontname="Arial" fontsize=12
    style="rounded,filled" fillcolor="${#f6f6f7|#1a1a1f}" color="${#c2c2c4|#3c3f44}"
    fontcolor="${#3c3c43|#ffffff}"

    subgraph cluster_env {
      label="DevEnvironment" labeljust=l fontname="Arial" fontsize=11
      style="rounded,filled" fillcolor="${#f2ecfc|#2c273e}" color="${#c2c2c4|#3c3f44}"
      fontcolor="${#3c3c43|#ffffff}"

      plugins [label="Plugin\nPipeline" fillcolor="${#e9eaff|#222541}"]
      mg [label="Module\nGraph" fillcolor="${#e9eaff|#222541}"]
      hot [label="HotChannel" fillcolor="${#fcf4dc|#38301a}"]

      plugins -> mg [dir=both]
      mg -> hot [style=invis]
    }
  }

  subgraph cluster_runtime {
    label="Target Runtime" labeljust=l fontname="Arial" fontsize=12
    style="rounded,filled" fillcolor="${#f0fdf4|#131b15}" color="${#c2c2c4|#3c3f44}"
    fontcolor="${#3c3c43|#ffffff}"

    subgraph cluster_runner {
      label="ModuleRunner" labeljust=l fontname="Arial" fontsize=11
      style="rounded,filled" fillcolor="${#def5ed|#15312d}" color="${#c2c2c4|#3c3f44}"
      fontcolor="${#3c3c43|#ffffff}"

      evaluator [label="Module\nEvaluator" fillcolor="${#def5ed|#15312d}"]
      transport [label="Transport" fillcolor="${#fcf4dc|#38301a}"]
    }
  }

  hot -> transport [label="HMR / Module\nfetch & invoke" dir=both style=bold color="${#6f42c1|#c8abfa}"]
}
```

이 기능의 목표 중 하나는 코드를 처리하고 실행하는 API를 사용자가 커스터마이즈할 수 있도록 하는 것입니다. 사용자는 Vite에서 제공하는 기본 구성 요소를 활용해 새로운 환경 팩토리를 만들 수 있습니다.

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

기본적으로 `HotChannel` 전송에는 `server.fs` 제한이 적용되며, 허용된 디렉터리 안의 파일만 제공될 수 있습니다. 전송이 네트워크에 노출되지 않는다면(예: 워커 스레드나 프로세스 내부 호출로 통신하는 경우), `HotChannel`에 `skipFsCheck: true`를 설정해 이러한 제한을 우회할 수 있습니다.

[`DevEnvironment`를 위한 여러 통신 레벨](/guide/api-environment-frameworks#devenvironment-communication-levels)이 있습니다. 프레임워크가 런타임에 무관한 코드를 작성하기 쉽도록, 가능한 한 가장 유연한 통신 수준을 구현하는 것을 권장합니다.

## `ModuleRunner` {#modulerunner}

모듈 실행기는 실행될 특정 런타임에서 인스턴스화됩니다. 다음 섹션의 모든 API는 별도의 언급이 없는 한 `vite/module-runner`에서 가져옵니다. 이 진입점은 모듈 실행기를 만드는 데 필요한 핵심 기능만 제공하며, 최대한 경량화되어 있습니다.

**타입 시그니처:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * 실행할 URL입니다.
   * 파일 경로, 서버 경로, 또는 루트 기준 상대 id를 받습니다.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * HMR 리스너를 포함한 모든 캐시를 지웁니다.
   */
  public clearCache(): void
  /**
   * 모든 캐시를 지우고, HMR 리스너를 제거하며, 소스맵 지원을 재설정합니다.
   * 이 메서드는 HMR 연결을 중지하지 않습니다.
   */
  public async close(): Promise<void>
  /**
   * `close()` 호출로 러너가 닫혔다면 `true`를 반환합니다.
   */
  public isClosed(): boolean
}
```

`ModuleRunner`의 모듈 분석기는 코드를 실행하는 역할을 합니다. Vite는 기본적으로 `ESModulesEvaluator`를 제공하며, 이는 `new AsyncFunction`을 사용해 코드를 실행합니다. JavaScript 런타임이 안전하지 않은 실행을 지원하지 않는다면 직접 구현할 수도 있습니다.

모듈 실행기는 `import` 메서드를 제공합니다. Vite 서버가 `full-reload` HMR 이벤트를 발생시키면 영향을 받는 모든 모듈이 다시 실행됩니다. 이때 모듈 실행기는 `exports` 객체를 업데이트하지 않고 덮어쓰므로, 최신 `exports` 객체가 필요한 경우 `import`를 다시 호출하거나 `evaluatedModules`에서 모듈을 다시 가져와야 합니다.

**사용 예시:**

```js
import {
  ModuleRunner,
  ESModulesEvaluator,
  createNodeImportMeta,
} from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta, // if the module runner runs in Node.js
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions` {#modulerunneroptions}

```ts twoslash
import type {
  InterceptorOptions as InterceptorOptionsRaw,
  ModuleRunnerHmr as ModuleRunnerHmrRaw,
  EvaluatedModules,
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type InterceptorOptions = Debug<InterceptorOptionsRaw>
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** see below */
type ModuleRunnerTransport = unknown

// ---cut---
interface ModuleRunnerOptions {
  /**
   * 서버와 통신하는 메서드 집합입니다.
   */
  transport: ModuleRunnerTransport
  /**
   * 소스맵 해석 방식을 설정합니다.
   * `process.setSourceMapsEnabled`를 사용할 수 있으면 `node`를 우선합니다.
   * 그렇지 않으면 기본적으로 `Error.prepareStackTrace` 메서드를 오버라이드하는
   * `prepareStackTrace`를 사용합니다.
   * Vite가 처리하지 않은 파일의 파일 내용과 소스맵 해석 방식을 설정하는 객체를
   * 제공할 수도 있습니다.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * HMR을 비활성화하거나 HMR 옵션을 설정합니다.
   *
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr
  /**
   * 커스텀 모듈 캐시입니다. 제공하지 않으면 각 모듈 러너 인스턴스마다
   * 별도 모듈 캐시를 생성합니다.
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator` {#moduleevaluator}

**타입 시그니처:**

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
export interface ModuleEvaluator {
  /**
   * 변환된 코드 앞에 붙은 줄 수입니다.
   */
  startOffset?: number
  /**
   * Vite가 변환한 코드를 평가합니다.
   * @param context 함수 컨텍스트
   * @param code 변환된 코드
   * @param id 모듈을 가져오는 데 사용된 ID
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * 외부화된 모듈을 평가합니다.
   * @param file 외부 모듈의 파일 URL
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite는 기본적으로 이 인터페이스를 구현하는 `ESModulesEvaluator`를 제공합니다. 이는 `new AsyncFunction`을 사용해 코드를 실행하므로, 만약 코드에 인라인 소스맵이 있다면 `AsyncFunction`이 추가하는 코드로 인해 [2 줄의 오프셋](https://tc39.es/ecma262/#sec-createdynamicfunction)이 있어야 합니다. 참고로 이는 `ESModulesEvaluator`에서 자동으로 처리됩니다. 커스텀 분석기는 새로운 코드를 추가하지 않습니다.

## `ModuleRunnerTransport` {#modulerunnertransport}

**타입 시그니처:**

```ts twoslash
import type { ModuleRunnerTransportHandlers } from 'vite/module-runner'
/** an object */
type HotPayload = unknown
// ---cut---
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

RPC를 이용하거나 직접 함수를 호출해 환경과 통신하는 전송 객체입니다. `invoke` 메서드가 구현되지 않은 경우 `send`와 `connect` 메서드를 구현해야 합니다. `invoke`는 Vite 내부적으로 구성됩니다.

아래는 워커 스레드에서 모듈 실행기를 생성하는 예시입니다. 이와 같이 서버의 `HotChannel` 인스턴스와 결합해야 합니다:

::: code-group

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}

const runner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta,
  },
  new ESModulesEvaluator(),
)
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const handlerToWorkerListener = new WeakMap()
  const client = {
    send(payload: HotPayload) {
      worker.postMessage(payload)
    },
  }

  const workerHotChannel = {
    // Worker thread의 postMessage는 네트워크에 노출되지 않으므로 server.fs 검사를 건너뜁니다.
    skipFsCheck: true,
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      // 클라이언트는 이미 연결되어 있습니다.
      if (event === 'vite:client:connect') return
      if (event === 'vite:client:disconnect') {
        const listener = () => {
          handler(undefined, client)
        }
        handlerToWorkerListener.set(handler, listener)
        worker.on('exit', listener)
        return
      }

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'vite:client:connect') return
      if (event === 'vite:client:disconnect') {
        const listener = handlerToWorkerListener.get(handler)
        if (listener) {
          worker.off('exit', listener)
          handlerToWorkerListener.delete(handler)
        }
        return
      }

      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        worker.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    },
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
})
```

:::

`on` / `off` 메서드가 존재한다면, 해당 메서드에서 `vite:client:connect` / `vite:client:disconnect` 이벤트를 구현해야 합니다. 연결이 설정되면 `vite:client:connect` 이벤트를 발생시켜야 하며, 연결이 닫히면 `vite:client:disconnect` 이벤트를 발생시켜야 합니다. 이벤트 핸들러에 전달되는 `HotChannelClient` 객체는 같은 연결에 대해 동일한 참조를 가져야 합니다.

다음은 HTTP 요청을 통해 실행기와 서버 간 통신하는 다른 예시입니다:

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
    hmr: false, // disable HMR as HMR requires transport.connect
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

이 경우 `NormalizedHotChannel`의 `handleInvoke` 메서드를 사용할 수 있습니다:

```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

단, HMR을 지원하려면 `send`와 `connect` 메서드가 필요합니다. `send` 메서드는 일반적으로 커스텀 이벤트가 발생할 때 호출됩니다(예: `import.meta.hot.send("my-event")`).

Vite는 Vite SSR에서 HMR을 지원하기 위해 메인 진입점에서 `createServerHotChannel`을 제공합니다.
