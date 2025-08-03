# `Environment` 인스턴스 사용하기 {#using-environment-instances}
import { monotonicDateNow } from '../utils'
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




Vite 6 formalizes the concept of Environments. Until Vite 5, there were two implicit Environments (`client`, and optionally `ssr`). The new Environment API allows users and framework authors to create as many environments as needed to map the way their apps work in production. This new capability required a big internal refactoring, but a lot of effort has been placed on backward compatibility. The initial goal of Vite 6 is to move the ecosystem to the new major as smoothly as possible, delaying the adoption of the APIs until enough users have migrated and frameworks and plugin authors have validated the new design.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
  createDebugger,
  monotonicDateNow,
  isCSSRequest,
## 환경에 접근하기 {#accessing-the-environments}
개발 단계에서, `server.environments`로 개발 서버의 사용 가능한 환경에 접근할 수 있습니다:

```js
// 서버를 생성하거나 configureServer 훅에서 가져옵니다
const server = await createServer(/* options */)

const clientEnvironment = server.environments.client
clientEnvironment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
- `ssr`: runs the app in node (or other server runtimes) which renders pages before sending them to the browser.

## `DevEnvironment` 클래스 {#devenvironment-class}

  monotonicDateNow,
개발 단계에서는 각 환경이 `DevEnvironment` 클래스의 인스턴스입니다:

```ts
class DevEnvironment {
  /**
   * Vite 서버에서 환경을 식별하는 고유 식별자입니다.
   * 기본적으로 Vite는 'client'와 'ssr' 환경을 제공합니다.
   */
  name: string
  /**
   * 런타임 모듈 러너와 메시지를 주고받기 위한
   * 통신 채널입니다.
   */
  hot: NormalizedHotChannel
  /**
   * 모듈 노드 그래프로, 처리된 모듈 간 의존성 관계와
   * 처리된 코드의 캐시를 포함합니다.
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * 이 환경에 구성된 플러그인 목록이며, 환경별
   * `create` 훅으로 생성된 플러그인도 포함합니다.
   */
  plugins: Plugin[]
  /**
   * 환경 플러그인 파이프라인으로 코드를 해석, 로드,
   * 변환합니다.
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * 이 환경에 구성된 설정입니다. 서버 전역 범위의
   * 옵션은 모든 환경의 기본값으로 사용되며, 재정의할 수
   * 있습니다(resolve 조건, external, optimizedDeps).
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentContext,
  )

  /**
   * URL을 ID로 해석하고 로드한 뒤, 플러그인 파이프라인으로
   * 코드를 처리합니다. 모듈 그래프도 함께 업데이트됩니다.
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * 요청을 낮은 우선순위로 등록하여 폭포수 현상을
   * 방지합니다. Vite 서버는 다른 요청에서 가져온
   * 모듈 정보를 활용해 모듈 그래프를 미리 준비할
   * 수 있습니다.
   */
  async warmupRequest(url: string): Promise<void>
}

`DevEnvironmentContext`는 다음과 같습니다:
Given a Vite server configured in middleware mode as described by the [SSR setup guide](/guide/ssr#setting-up-the-dev-server), let's implement the SSR middleware using the environment API. Remember that it doesn't have to be called `ssr`, so we'll name it `server` in this example. Error handling is omitted.

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
  }
  depsOptimizer?: DepsOptimizer
const viteServer = await createServer({
}
```

그리고 `TransformResult`는 다음과 같습니다:
  const timestamp = monotonicDateNow()

```ts
interface TransformResult {
The current Vite server API is not yet deprecated and is backward compatible with Vite 5.
  code: string
  map: SourceMap | { mappings: '' } | null
  deps?: string[]
  dynamicDeps?: string[]
const serverEnvironment = viteServer.environments.server
```

현재 제안 버전에서는 Vite API에 익숙한 사용자들이 쉽게 이해하고 논의할 수 있도록 `transformRequest(url)`와 `warmupRequest(url)`를 사용했습니다. 릴리스 전에 이름을 검토할 기회가 있을 것입니다. 예를 들어, Rollup 플러그인 훅인 `context.load(id)`를 참고해 `environment.processModule(url)` 또는 `environment.loadModule(url)`로 이름을 지을 수 있습니다. 현재로서는 기존 이름을 유지하고 이 논의를 나중으로 미루고자 합니다.
:::


각 환경은 독립된 모듈 그래프를 가지며, 모든 그래프는 동일한 시그니처를 가지므로 환경에 의존하지 않고 그래프를 탐색하거나 쿼리하는 일반적인 알고리즘을 구현할 수 있습니다. `hotUpdate`가 좋은 예시입니다. 파일이 수정되면 각 환경의 모듈 그래프로 영향받는 모듈을 찾아내고 독립적으로 HMR을 수행합니다.
  template = await viteServer.transformIndexHtml(url, template)

::: info
:::

  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )
각 모듈은 `EnvironmentModuleNode` 인스턴스로 표현됩니다. 모듈은 아직 처리되지 않은 상태에서도 그래프에 등록될 수 있으며, 이 경우 `transformResult`는 `null`을 갖습니다. `importers`와 `importedModules`도 모듈이 처리된 후에 업데이트됩니다.

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph`는 `EnvironmentModuleGraph`의 인스턴스입니다:

```ts
export class EnvironmentModuleGraph {
  environment: string
    timestamp: number = monotonicDateNow(),

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

    timestamp: number = monotonicDateNow(),
  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>
      updateModules(this, module.file, [module], monotonicDateNow())

  createFileOnlyEntry(file: string): EnvironmentModuleNode


  updateModuleTransformResult(
In a future major, we could have complete alignment:
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void
  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```
    const timestamp = monotonicDateNow()
    timestamp: number = monotonicDateNow(),
  const timestamp = monotonicDateNow()
          monotonicDateNow(),
  test('hmr works for self-accepted module within circular imported files', async () => {
  test('hmr should not reload if no accepted within circular imported files', async () => {
  const t = monotonicDateNow()

let lastDateNow = 0
/**
 * Similar to `Date.now()`, but strictly monotonically increasing.
 *
 * This function will never return the same value.
 * Thus, the value may differ from the actual time.
 *
 * related: https://github.com/vitejs/vite/issues/19804
 */
export function monotonicDateNow(): number {
  const now = Date.now()
  if (now > lastDateNow) {
    lastDateNow = now
    return lastDateNow
  }

  lastDateNow++
  return lastDateNow
}