# `Environment` 인스턴스 사용하기 {#using-environment-instances}

:::info 릴리즈 후보
환경 API는 현재 릴리즈 후보 단계에 있습니다. 생태계가 실험하고 이를 기반으로 구축할 수 있도록 주요 릴리즈 간 API의 안정성을 유지할 계획입니다. 다만 [일부 특정 API](/changes/#considering)는 여전히 실험적인 기능으로 간주됩니다.

다운스트림 프로젝트들이 새로운 기능을 실험하고 검증할 시간을 가진 후, 향후 메이저 릴리즈에서 (잠재적인 주요 변경 사항과 함께) 이러한 새로운 API를 안정화할 계획입니다.

리소스:

- [피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 새로운 API에 대한 피드백을 모으고 있습니다.
- [환경 API PR](https://github.com/vitejs/vite/pull/16471)에서 새로운 API를 구현하고 검토했습니다.

여러분의 피드백을 공유해주세요.
:::

## 환경에 접근하기 {#accessing-the-environments}

개발 단계에서, `server.environments`로 개발 서버의 사용 가능한 환경에 접근할 수 있습니다:

```js
// 서버를 생성하거나 configureServer 훅에서 가져옵니다
const server = await createServer(/* options */)

const clientEnvironment = server.environments.client
clientEnvironment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

플러그인에서도 현재 환경에 접근할 수 있습니다. 자세한 내용은 [플러그인을 위한 환경 API](./api-environment-plugins.md#accessing-the-current-environment-in-hooks)를 참조하세요.

## `DevEnvironment` 클래스 {#devenvironment-class}

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
```

`DevEnvironmentContext`는 다음과 같습니다:

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

그리고 `TransformResult`는 다음과 같습니다:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Vite 서버의 환경 인스턴스는 `environment.transformRequest(url)` 메서드로 URL을 처리합니다. 이 함수는 플러그인 파이프라인을 사용해 `url`을 모듈 `id`로 해석하고, 로드한 뒤(파일 시스템에서 파일을 읽거나 가상 모듈을 구현하는 플러그인을 통해), 코드를 변환합니다. 모듈 변환 중에는 의존성 관계(`import` 구문)와 메타데이터를 분석하여 모듈 노드를 생성하거나 업데이트하고, 이를 환경 모듈 그래프에 기록합니다. 처리가 완료되면 변환 결과도 모듈에 저장됩니다.

:::info transformRequest 이름에 대해
현재 제안 버전에서는 Vite API에 익숙한 사용자들이 쉽게 이해하고 논의할 수 있도록 `transformRequest(url)`와 `warmupRequest(url)`를 사용했습니다. 릴리스 전에 이름을 검토할 기회가 있을 것입니다. 예를 들어, Rollup 플러그인 훅인 `context.load(id)`를 참고해 `environment.processModule(url)` 또는 `environment.loadModule(url)`로 이름을 지을 수 있습니다. 현재로서는 기존 이름을 유지하고 이 논의를 나중으로 미루고자 합니다.
:::

## 독립된 모듈 그래프 {#separate-module-graphs}

각 환경은 독립된 모듈 그래프를 가지며, 모든 그래프는 동일한 시그니처를 가지므로 환경에 의존하지 않고 그래프를 탐색하거나 쿼리하는 일반적인 알고리즘을 구현할 수 있습니다. `hotUpdate`가 좋은 예시입니다. 파일이 수정되면 각 환경의 모듈 그래프로 영향받는 모듈을 찾아내고 독립적으로 HMR을 수행합니다.

::: info
Vite v5는 클라이언트와 SSR이 혼합된 모듈 그래프를 가지고 있었습니다. 처리되지 않았거나 무효화된 노드가 주어졌을 때 클라이언트, SSR, 또는 둘 다인지 알 수 없었습니다. 모듈 노드는 `clientImportedModules`와 `ssrImportedModules`와 같이 접두사가 붙은 속성을 가지고 있었고, `importedModules`는 둘의 합집합을 반환했습니다. `importers`는 각 모듈 노드에 대해, 클라이언트와 SSR 환경 모두에서 이를 가져다 쓰는 모듈을 의미했습니다. 또한 모듈 노드는 `transformResult`와 `ssrTransformResult`를 가졌습니다. 하위 호환성 계층을 통해 생태계는 더 이상 사용되지 않는 `server.moduleGraph`에서 마이그레이션할 수 있습니다.
:::

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

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = monotonicDateNow(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```