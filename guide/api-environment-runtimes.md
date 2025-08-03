export type ImportMetaResolver = (specifier: string, importer: string) => string

import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'
    const data = specifier.slice(${JSON.stringify(customizationHookNamespace)}.length)
    const [parsedSpecifier, parsedImporter] = JSON.parse(data)
  '/import-meta': renderImportMeta,
  createDefaultImportMeta,
  createNodeImportMeta,
} from './createImportMeta'
  return nextResolve(specifier, context)
}

`
import { posixDirname, posixPathToFileHref, posixResolve } from './utils'
export async function createImportMetaResolver(): Promise<
  ImportMetaResolver | undefined
> {
  let module: typeof import('node:module')
  try {
    module = (await import('node:module')).Module
  } catch {
    return
    createImportMeta: createNodeImportMeta,
  // `module.Module` may be `undefined` when `node:module` is mocked
  if (!module?.register) {
    createImportMeta: createNodeImportMeta,
import { createDefaultImportMeta } from './createImportMeta'

  try {
    const hookModuleContent = `data:text/javascript,${encodeURI(customizationHooksModule)}`
    module.register(hookModuleContent)
  } catch (e) {
    // For `--experimental-network-imports` flag that exists in Node before v22
    if ('code' in e && e.code === 'ERR_NETWORK_IMPORT_DISALLOWED') {
      return
    }
    throw e
  }

  return (specifier: string, importer: string) =>
    import.meta.resolve(
      `${customizationHookNamespace}${JSON.stringify([specifier, importer])}`,
test(`import.meta.resolve is supported`, async () => {
  await page.goto(`${url}/import-meta`)

  const metaUrl = await page.textContent('.import-meta-url')
  expect(metaUrl).not.toBe('')
  expect(await page.textContent('.import-meta-resolve')).toBe(metaUrl)
})

  return {
    ...defaultMeta,
    resolve(id: string, parent?: string) {
      const resolver = importMetaResolver ?? defaultMeta.resolve
      return resolver(id, parent ?? href)
    },
  }
}


async function renderImportMeta(rootDir) {
  const metaUrl = import.meta.url
  const resolveResult = import.meta.resolve('./app.js')
  return (
    `<div class="import-meta-url">${escapeHtml(metaUrl)}</div>` +
    `<div class="import-meta-resolve">${escapeHtml(resolveResult)}</div>`
  )
}
  const importMetaResolver = await importMetaResolverCache
  importMetaResolverCache ??= createImportMetaResolver()

        createImportMeta: createNodeImportMeta,
  const href = defaultMeta.url
  const defaultMeta = createDefaultImportMeta(modulePath)
}
): Promise<ModuleRunnerImportMeta> {
    )
  modulePath: string,
export async function createNodeImportMeta(
 */
 * Create import.meta object for Node.js.
/**

let importMetaResolverCache: Promise<ImportMetaResolver | undefined> | undefined

}
  }
    },
      )
          `file transformation. Make sure to reference it by the full name.`,
        `[module runner] "import.meta.glob" is statically replaced during ` +
      throw new Error(
    glob() {
  }
    // should be replaced during transformation
    return
    },
      throw new Error('[module runner] "import.meta.resolve" is not supported.')
    resolve(_id: string, _parent?: string) {
  }
    env: envProxy,
    url: href,
    dirname: isWindows ? toWindowsPath(dirname) : dirname,
  /**
   * Create import.meta object for the module.
   *
   * @default createDefaultImportMeta
   */
  createImportMeta?: (
    modulePath: string,
  ) => ModuleRunnerImportMeta | Promise<ModuleRunnerImportMeta>
    filename: isWindows ? toWindowsPath(filename) : filename,
  return {
  const dirname = posixDirname(modulePath)
  const filename = modulePath
  const href = posixPathToFileHref(modulePath)
): ModuleRunnerImportMeta {

  modulePath: string,
export function createDefaultImportMeta(

})
  },

    )
  }
      `[module runner] Dynamic access of "import.meta.env" is not supported. Please, use "import.meta.env.${String(p)}" instead.`,
    context.parentURL = parsedImporter
      createImportMeta: createNodeImportMeta,
    throw new Error(
export {
    specifier = parsedSpecifier
  get(_, p) {
const envProxy = new Proxy({} as any, {

  if (specifier.startsWith(${JSON.stringify(customizationHookNamespace)})) {
import { posixDirname, posixPathToFileHref, toWindowsPath } from './utils'
export async function resolve(specifier, context, nextResolve) {
import type { ModuleRunnerImportMeta } from './types'

} from './importMetaResolver'
import { ESModulesEvaluator, ModuleRunner, createNodeImportMeta } from 'vite/module-runner'
import { ESModulesEvaluator, ModuleRunner, createNodeImportMeta } from 'vite/module-runner'
const customizationHooksModule = /* js */ `
  createImportMetaResolver,
import { ModuleRunner, createNodeImportMeta } from 'vite/module-runner'
import { cleanUrl, isPrimitive } from '../shared/utils'
const customizationHookNamespace = 'vite-module-runner:import-meta-resolve/v1/'
  type ImportMetaResolver,
import {
import { isWindows } from '../shared/utils'
import {
  ModuleRunner,
  ESModulesEvaluator,
  createNodeImportMeta,
} from 'vite/module-runner'
# 런타임을 위한 환경 API {#environment-api-for-runtimes}

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
- [`this.environment` in Hooks](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` Plugin Hook](/changes/hotupdate-hook)
    createImportMeta: createNodeImportMeta, // if the module runner runs in Node.js
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.

## DevEnvironment Communication Levels

Since environments may run in different runtimes, communication against the environment may have constraints depending on the runtime. To allow frameworks to write runtime agnostic code easily, the Environment API provides three kinds of communication levels.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
환경 팩토리는 일반적으로 Cloudflare와 같은 환경을 제공하는 쪽에서 구현하며, 이를 최종 사용자가 직접 작성하지는 않습니다. 환경 팩토리는 개발과 빌드 환경에서 사용할 런타임에 대한 일반적인 설정을 `EnvironmentOptions`로 반환합니다. 사용자가 직접 설정할 필요가 없도록 기본 환경 옵션도 구성할 수도 있습니다.

): EnvironmentOptions {
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
```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
  return workerdDevEnvironment
}
```

## `ModuleRunner` {#modulerunner}

모듈 실행기는 실행될 특정 런타임에서 인스턴스화됩니다. 다음 섹션의 모든 API는 별도의 언급이 없는 한 `vite/module-runner`에서 가져옵니다. 이 진입점은 모듈 실행기를 만드는 데 필요한 핵심 기능만 제공하며, 최대한 경량화되어 있습니다.

The current Vite server API is not yet deprecated and is backward compatible with Vite 5.
**타입 시그니처:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
   * 실행할 URL.
   * 파일 경로, 서버 경로 또는 루트를 기준으로 하는 ID를 받습니다.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * HMR 리스너를 포함한 모든 캐시를 지웁니다.
   */
  public clearCache(): void
  /**
   * 모든 캐시를 지우고, HMR 리스너를 제거하며, 소스맵 지원을 초기화합니다.
   * 이 메서드는 HMR 연결을 중단하지 않습니다.
   */
  public async close(): Promise<void>
  /**
   * `close()`를 호출하여 실행기가 종료되었는지 여부를 반환합니다.
```
`ModuleRunner`의 모듈 분석기는 코드를 실행하는 역할을 합니다. Vite는 기본적으로 `ESModulesEvaluator`를 제공하며, 이는 `new AsyncFunction`을 사용해 코드를 실행합니다. JavaScript 런타임이 안전하지 않은 실행을 지원하지 않는다면 직접 구현할 수도 있습니다.
### `FetchableDevEnvironment`
모듈 실행기는 `import` 메서드를 제공합니다. Vite 서버가 `full-reload` HMR 이벤트를 발생시키면 영향을 받는 모든 모듈이 다시 실행됩니다. 이때 모듈 실행기는 `exports` 객체를 업데이트하지 않고 덮어쓰므로, 최신 `exports` 객체가 필요한 경우 `import`를 다시 호출하거나 `evaluatedModules`에서 모듈을 다시 가져와야 합니다.
:::info

We are looking for feedback on [the `FetchableDevEnvironment` proposal](https://github.com/vitejs/vite/discussions/18191).
**사용 예시:**
```js
There are [multiple communication levels for the `DevEnvironment`](/guide/api-environment-frameworks#devenvironment-communication-levels). To make it easier for frameworks to write runtime agnostic code, we recommend to implement the most flexible communication level possible.

`FetchableDevEnvironment` is an environment that can communicate with its runtime via the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) interface. Since the `RunnableDevEnvironment` is only possible to implement in a limited set of runtimes, we recommend to use the `FetchableDevEnvironment` instead of the `RunnableDevEnvironment`.
This environment provides a standardized way of handling requests via the `handleRequest` method:
import { transport } from './rpc-implementation.js'

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
## `ModuleRunnerOptions` {#modulerunneroptions}
// Any consumer of the environment API can now call `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'
    new Request('/request-to-handle'),
  )
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

:::warning
Vite validates the input and output of the `dispatchFetch` method: the request must be an instance of the global `Request` class and the response must be the instance of the global `Response` class. Vite will throw a `TypeError` if this is not the case.

Note that although the `FetchableDevEnvironment` is implemented as a class, it is considered an implementation detail by the Vite team and might change at any moment.
:::
### raw `DevEnvironment`

If the environment does not implement the `RunnableDevEnvironment` or `FetchableDevEnvironment` interfaces, you need to set up the communication manually.

type InterceptorOptions = Debug<InterceptorOptionsRaw>
    createImportMeta: createNodeImportMeta,
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** see below */
type ModuleRunnerTransport = unknown

// ---cut---
interface ModuleRunnerOptions {
  /**
   * 서버와 통신하기 위한 메서드 집합입니다.
   */
  transport: ModuleRunnerTransport
  /**
   * 소스맵 해석 방식을 설정합니다.
   * `process.setSourceMapsEnabled`를 사용할 수 있는 경우 `node`를 선호합니다.
   * 그렇지 않은 경우 기본적으로 `Error.prepareStackTrace` 메서드를 재정의하는
   * `prepareStackTrace`를 사용합니다.
   * Vite가 처리하지 않은 파일에 대한 내용 및 소스맵 해석 방식을
   * 설정하기 위해 객체를 전달할 수 있습니다.
   */
  sourcemapInterceptor?:
if (ssrEnvironment instanceof CustomDevEnvironment) {
    | InterceptorOptions
  /**
   * HMR을 비활성화하거나 HMR 옵션을 설정합니다.
   * @default true
   */
In a future major, we could have complete alignment:
  hmr?: boolean | ModuleRunnerHmr
  /**
   * 커스텀 모듈 캐시입니다. 전달하지 않으면 모듈 실행기 인스턴스마다
   * 모듈 캐시를 별도로 생성합니다.
   */
  evaluatedModules?: EvaluatedModules
}
```

    const createImportMeta =
      this.options.createImportMeta ?? createDefaultImportMeta

## `ModuleEvaluator` {#moduleevaluator}

**타입 시그니처:**
    const meta = await createImportMeta(modulePath)

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
export interface ModuleEvaluator {
  /**
   * 변환된 코드의 시작 부분에 추가된 줄 수입니다.
   */
  startOffset?: number
  /**
   * Vite가 변환한 코드를 실행합니다.
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
   * 외부 모듈을 실행합니다.
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
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

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

  const workerHotChannel = {
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              worker.postMessage(payload)
            },
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
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
    hmr: false, // HMR은 transport.connect가 필요하므로 비활성화
  },
  new ESModulesEvaluator(),
)


Vite는 Vite SSR에서 HMR을 지원하기 위해 메인 진입점에서 `createServerHotChannel`을 제공합니다.