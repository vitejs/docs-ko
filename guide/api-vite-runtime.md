# Vite 런타임 API {#vite-runtime-api}

:::warning 저수준 API
이 API는 [피드백 수집을 위해](https://github.com/vitejs/vite/discussions/15774) Vite 5.1에서 실험적으로 추가되었습니다. Vite 5.2에서는 변경될 가능성이 있으므로, 사용 시 Vite 버전을 `~5.1.0`으로 고정해 주세요. 이 API는 라이브러리 및 프레임워크 작성을 위한 저수준 API입니다. 애플리케이션을 만들고자 한다면, [Awesome Vite SSR 섹션](https://github.com/vitejs/awesome-vite#ssr)에서 더 높은 수준을 가진 SSR 플러그인 및 도구를 먼저 확인해 주세요.
:::

"Vite 런타임"은 어떤 코드든 Vite 플러그인을 통해 먼저 처리한 후 실행할 수 있게 해주는 도구입니다. 런타임 구현이 서버와 분리되어 있다는 점에서 `server.ssrLoadModule`과는 다릅니다. 이를 통해 라이브러리 및 프레임워크 개발자는 서버와 런타임 사이에서 자체적인 통신 계층을 구현할 수 있습니다.

그 목표 중 하나는 코드를 처리하고 실행할 수 있는 커스터마이징 가능한 API를 제공하는 것입니다. Vite는 Vite 런타임을 바로 사용할 수 있도록 다양한 도구를 제공하지만, 사용자 요구 사항이 Vite 내장 구현과 일치하지 않는 경우에는 이를 기반으로 더 많은 기능을 구현할 수 있습니다.

모든 API는 달리 명시하지 않는 한 `vite/runtime`에서 가져올 수 있습니다.

## `ViteRuntime` {#viteruntime}

**타입 시그니처:**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * 실행할 URL. 루트를 기준으로 파일 경로, 서버 경로, 또는 ID를 전달받습니다.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * 실행할 엔트리 포인트 URL. 루트를 기준으로 파일 경로, 서버 경로, 또는 ID를 전달받습니다.
   * HMR에 의해 전체 리로드가 트리거되는 경우, 이 메서드로 실행된 모듈은 다시 로드됩니다.
   * 이 메서드가 여러 번 호출되면 모든 엔트리 포인트가 하나씩 다시 로드됩니다.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * HMR 리스너를 포함한 모든 캐시를 지웁니다.
   */
  public clearCache(): void
  /**
   * 모든 캐시를 지우고, 모든 HMR 리스너를 제거하며, 소스 맵 지원을 재설정합니다.
   * 이 메서드는 HMR 커넥션을 중지하지 않습니다.
   */
  public async destroy(): Promise<void>
  /**
   * 런타임이 `destroy()` 메서드를 호출하여 종료된 경우 `true`를 반환합니다.
   */
  public isDestroyed(): boolean
}
```

::: tip 고급
`server.ssrLoadModule`에서 HMR을 지원하는 방향으로 마이그레이션 하는 경우, [`createViteRuntime`](#createviteruntime) 사용을 고려해 보세요.
:::

`ViteRuntime` 클래스는 초기화될 때 `root`와 `fetchModule` 옵션이 필요합니다. `fetchModule`에 대해, Vite는 Vite SSR과 쉽게 통합할 수 있도록 [`server`](/guide/api-javascript) 인스턴스에서 `ssrFetchModule`을 제공합니다. 이와 함께 `fetchModule`도 Vite 메인 진입점에서 노출하는데, 이는 코드가 `new Function`을 사용해 실행될 것으로 예상하는 `ssrFetchModule`과 달리 코드 실행 방식에 대해 어떠한 가정도 하지 않습니다. 이는 이러한 함수들이 반환하는 소스 맵에서 확인할 수 있습니다.

`ViteRuntime` Runner는 코드 실행을 담당합니다. Vite는 기본적으로 `ESModulesRunner`를 제공하며, `new AsyncFunction`을 사용하여 코드를 실행합니다. 자바스크립트 런타임이 안전하지 않은 평가(Evaluation)를 지원하지 않는 경우, 이를 직접 구현해 전달할 수 있습니다.

런타임이 제공하는 두 가지 주요 메서드는 `executeUrl`과 `executeEntrypoint`입니다. 기본적으로 같은 동작을 하지만, HMR이 `full-reload` 이벤트를 트리거하는 경우 `executeEntrypoint`로 실행된 모든 모듈은 다시 실행된다는 차이점이 있습니다. 이때 Vite 런타임은 `exports` 객체를 덮어쓸 뿐 업데이트하지 않으므로, 최신 `exports` 객체를 사용하려면 `executeUrl`을 실행하거나 `moduleCache`에서 모듈을 다시 가져와야 합니다.

**사용 예제:**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // HMR 지원을 위해 hmr.connection을 전달할 수도 있습니다.
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions` {#viteruntimeoptions}

```ts
export interface ViteRuntimeOptions {
  /**
   * 프로젝트 루트
   */
  root: string
  /**
   * 모듈 정보를 가져오는 메서드입니다.
   * SSR은 Vite에서 제공하는 `server.ssrFetchModule` 함수를 사용할 수 있습니다.
   * 다른 런타임 사용 사례는 Vite 메인 진입점에서 가져올 수 있는 `fetchModule`을 사용할 수 있습니다.
   */
  fetchModule: FetchFunction
  /**
   * 소스 맵이 해석되는 방법에 대한 설정입니다. `process.setSourceMapsEnabled`가 사용 가능하다면 `node`로 설정됩니다.
   * 그렇지 않은 경우, 기본적으로 `Error.prepareStackTrace` 메서드를 재정의하는 `prepareStackTrace`를 사용합니다.
   * 객체를 전달해 Vite에서 처리되지 않은 파일에 대한 파일 내용과 소스 맵 해석 방법을 설정할 수도 있습니다.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * HMR을 비활성화하거나 HMR 옵션을 구성합니다.
   */
  hmr?:
    | false
    | {
        /**
         * HMR이 클라이언트와 서버 사이에서 어떻게 통신하는지 구성합니다.
         */
        connection: HMRRuntimeConnection
        /**
         * HMR 로거를 구성합니다.
         */
        logger?: false | HMRLogger
      }
  /**
   * 커스텀 모듈 캐시. 전달하지 않으면 각 ViteRuntime 인스턴스에 대해 모듈 캐시를 별도로 생성합니다.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner` {#vitemodulerunner}

**타입 시그니처:**

```ts
export interface ViteModuleRunner {
  /**
   * Vite에 의해 변환된 코드를 실행합니다.
   * @param context 함수 컨텍스트
   * @param code 변환된 코드
   * @param id 모듈을 가져오는 데 사용된 ID
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * 외부 모듈을 실행합니다.
   * @param file 외부 모듈에 대한 파일 URL
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite는 기본적으로 이 인터페이스를 구현한 `ESModulesRunner`를 제공합니다. 이는 코드를 실행하기 위해 `new AsyncFunction`을 사용하기에, 코드에 인라인 소스 맵이 포함되어 있다면 [오프셋 2줄](https://tc39.es/ecma262/#sec-createdynamicfunction)이 포함되어야 합니다(이는 `server.ssrFetchModule`에 의해 자동으로 처리됩니다). 만약 필요한 실행자(Runner) 구현이 이러한 제약을 따르지 않는다면, `vite`에서 제공하는 `fetchModule`을 직접 사용해야 합니다.

## HMRRuntimeConnection {#hmrruntimeconnection}

**타입 시그니처:**

```ts
export interface HMRRuntimeConnection {
  /**
   * 클라이언트에 메시지를 보내기 전에 확인됩니다.
   */
  isReady(): boolean
  /**
   * 클라이언트에 메시지를 보냅니다.
   */
  send(message: string): void
  /**
   * 커넥션이 업데이트를 트리거할 때 HMR을 처리하는 방법에 대한 구성입니다.
   * 메서드는 커넥션이 HMR 업데이트를 수신할 때 이 콜백을 호출할 것으로 예상합니다. 
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

이 인터페이스는 HMR 통신이 어떻게 구성되는지를 정의합니다. Vite는 Vite SSR 과정에서 HMR을 지원하기 위해 `ServerHMRConnector`를 메인 진입점에서 제공하고 있습니다. `isReady`와 `send` 메서드는 일반적으로 커스텀 이벤트가 트리거될 때 호출됩니다(예: `import.meta.hot.send("my-event")`).

`onUpdate`는 새 런타임이 초기화될 때 한 번만 호출됩니다. 커넥션이 HMR 이벤트를 트리거할 때 호출될 메서드를 전달합니다. 내부 구현은 커넥션 종류에 따라 다르지만(예: `WebSocket`/`EventEmitter`/`MessageChannel`), 보통 다음과 같습니다:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

콜백은 큐에 들어가며, 다음 업데이트를 처리하기 전, 현재 업데이트가 완료될 때까지 대기합니다. 브라우저 구현과 달리, Vite 런타임에서 HMR 업데이트는 모듈을 업데이트하기 전에 `vite:beforeUpdate`/`vite:beforeFullReload`와 같은 모든 리스너가 완료될 때까지 대기합니다.

## `createViteRuntime` {#createviteruntime}

**타입 시그니처:**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**사용 예제:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

`createViteRuntime` 메서드는 `server.ssrLoadModule`과 유사하지만, 기본적으로 HMR을 지원한다는 차이점이 있습니다. 대체 또한 어렵지 않으며, [`options`](#mainthreadruntimeoptions)를 전달해 요구 사항에 맞춰 SSR 런타임 동작 방식을 커스터마이징할 수도 있습니다.

## `MainThreadRuntimeOptions` {#mainthreadruntimeoptions}

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * HMR을 비활성화하거나 HMR 로거를 구성합니다.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * 커스텀 모듈 실행자를 전달합니다. 코드가 실행되는 방식을 제어합니다.
   */
  runner?: ViteModuleRunner
}
```