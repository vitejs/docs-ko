# JavaScript API {#javascript-api}

Vite의 자바스크립트 API들은 전부 타입이 명시되어 있고 intellisense와 유효성 검사를 효과적으로 사용하기 위해 타입 스크립트 또는 VSCode의 JS 타입 검사 활성화를 추천합니다.

## `createServer` {#createserver}

**타입 시그니처:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**사용 예제:**

```js
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    // 유효한 유저 설정 옵션들, 추가적으로 `mode`와 `configFile`가 있습니다.
    configFile: false,
    root: __dirname,
    server: {
      port: 1337
    }
  })
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
})()
```

::: tip 참고
`createServer`와 `build`는 `mode` 설정 옵션과 `process.env.NODE_ENV`에 의존해 관련 동작을 수행합니다. 따라서 동일한 Node.js 프로세스에서 이 두 함수를 사용하는 경우 충돌이 발생될 수 있으며, 이를 방지하고자 한다면 두 API의 `process.env.NODE_ENV` 또는 `mode` 설정 옵션을 `development`로 설정하세요. 아니면 하위 프로세스를 만들어 API를 각각 실행하는 방법도 있습니다.
:::

## `InlineConfig` {#inlineconfig}

`InlineConfig` 인터페이스는 `UserConfig`의 추가적인 속성들로 확장됩니다:

- `configFile`: 특정 설정 파일을 지칭할 때 사용합니다. 만약 설정이 되어있지 않다면, Vite는 자동적으로 프로젝트 루트에서 결정합니다. `false`로 설정한다면 자동 설정을 비활성화합니다.
- `envFile`: `false` 일 때는 `.env` 파일들을 비활성화합니다.

## `ResolvedConfig` {#resolvedconfig}

`ResolvedConfig` 인터페이스는 `UserConfig`의 모든 속성들을 가지고 있지만, 대부분의 속성들은 실제 값을 가지고 있으며 `undefined`가 아닙니다. 또한 다음과 같은 유틸리티들도 포함합니다:

- `config.assetsInclude`: `id`가 asset으로 간주되는지 확인하는 함수입니다.
- `config.logger`: Vite의 내부 로거(Logger) 객체입니다.

## `ViteDevServer` {#vitedevserver}

```ts
interface ViteDevServer {
  /**
   * 수용된 Vite 설정 객체.
   */
  config: ResolvedConfig
  /**
   * 연결 앱 인스턴스
   * - 개발 서버에 커스텀 미들웨어들을 붙이는데 사용될 수 있습니다.
   * - 커스텀 http 서버 제어 함수로 사용될 수 있습니다.
   *   또는 모든 연결 스타일의 Node.js 프레임워크에서 미들웨어로 사용됩니다.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Native Node http 서버 인스턴스.
   * middleware 모드에서는 null이 됩니다.
   */
  httpServer: http.Server | null
  /**
   * Chokidar watcher 인스턴스. 만약 `config.server.watch`가 `null` 이라면,
   * NOOP(아무런 일도 수행하지 않는 - 옮긴이) 이벤트 이미터를 반환합니다.
   * https://github.com/paulmillr/chokidar#api
   */
  watcher: FSWatcher
  /**
   * `send(payload)` 함수가 있는 web socket 서버
   */
  ws: WebSocketServer
  /**
   * 주어진 파일에 플러그인 hooks를 실행할 수 있는 rollup 플러그인 컨테이너
   */
  pluginContainer: PluginContainer
  /**
   * Url로 파일이 맵핑되어 있고 hmr 상태들의 import 관계들을 볼 수 있는
   * 모듈 그래프.
   */
  moduleGraph: ModuleGraph
  /**
   * 확인된 URL은 Vite가 CLI로 출력합니다.
   * 미들웨어 모드 또는 `server.listen`이 호출되기 전에는 null 값을 갖습니다.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 프로그래밍 방식으로 URL을 확인, 로드 및 변환하고 http 요청 파이프 라인을 
   * 거치지 않고도 결과를 얻을 수 있습니다.
   */
  transformRequest(
    url: string,
    options?: TransformOptions
  ): Promise<TransformResult | null>
  /**
   * Vite 빌트인 HTML 변환 및 플러그인 HTML 변환을 적용합니다.
   */
  transformIndexHtml(url: string, html: string): Promise<string>
  /**
   * 주어진 URL을 SSR을 위해 인스턴스화 된 모듈로 로드합니다.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean }
  ): Promise<Record<string, any>>
  /**
   * SSR 에러 stacktrace 수정하기
   */
  ssrFixStacktrace(e: Error): void
  /**
   * 모듈 그래프의 모듈에 대한 HMR을 트리거합니다. `server.moduleGraph` API를 사용하여 다시 로드할 모듈을 검색할 수 있습니다.
   * `hmr`이 false이면 아무것도 하지 않습니다.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * 서버 시작하기.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * 서버 재시작하기.
   *
   * @param forceOptimize - optimizer가 re-bundle를 강제시킵니다. --force cli flag를 쓴 것과 똑같습니다.
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * 서버 멈추기.
   */
  close(): Promise<void>
  /**
   * CLI 단축키 바인딩하기
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
}
```

## `build` {#build}

**타입 시그니처:**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**사용 예제:**

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      }
    }
  })
})()
```

## `preview` {#preview}

**타입 시그니처:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**사용 예제:**

```js
import { preview } from 'vite'
;(async () => {
  const previewServer = await preview({
    // 유효한 유저 설정 옵션들, 추가적으로 `mode`와 `configFile`가 있습니다.
    preview: {
      port: 8080,
      open: true
    }
  })

  previewServer.printUrls()
  previewServer.bindCLIShortcuts({ print: true })
})()
```

## `PreviewServer` {#previewserver}

```ts
interface PreviewServer {
  /**
   * 해석된 Vite 설정 객체
   */
  config: ResolvedConfig
  /**
   * connect 앱 인스턴스.
   * - 커스텀 미들웨어를 프리뷰 서버에 연결할 수 있습니다.
   * - 또한 커스텀 http 서버의 핸들러 함수 또는 connect 스타일의 Node.js 프레임워크의
   *   미들웨어로 사용할 수 있습니다.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 네이티브 Node http 서버 인스턴스
   */
  httpServer: http.Server
  /**
   * Vite가 CLI에 출력하는 해석된 URL
   * 서버가 시작되기 전에는 null입니다.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 서버 URL 출력하기
   */
  printUrls(): void
  /**
   * CLI 단축키 바인딩하기
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig` {#resolveconfig}

**타입 시그니처:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig>
```

개발 단계에서의 `command`의 값은 `serve`입니다 (cli에서는 `vite`, `vite dev`, 그리고 `vite serve`는 전부 별칭입니다).

## `mergeConfig` {#mergeconfig}

**타입 시그니처:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true
): Record<string, any>
```

Vite 설정을 깊이(Deep) 병합합니다. `isRoot`는 병합되는 Vite 설정의 레벨을 나타냅니다. 예를 들어, `build` 옵션을 두 개 병합한다면 `false`로 설정합니다.

::: tip 참고
`mergeConfig` 함수는 오직 객체 형태의 설정만 전달받습니다. 만약 콜백 형태의 설정이 있다면, `mergeConfig`에 전달하기 전에 호출해야 합니다.

`defineConfig` 함수를 통해 콜백 형태로 다른 설정을 병합할 수 있습니다:

```ts
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `searchForWorkspaceRoot` {#searchforworkspaceroot}

**타입 시그니처:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current)
): string
```

**관련 문서:** [server.fs.allow](/config/server-options.md#server-fs-allow)

Search for the root of the potential workspace if it meets the following conditions, otherwise it would fallback to `root`:
-> 만약 다음 조건을 만족한다면, 작업 공간의 루트를 찾습니다. 아니라면 `root`를 반환합니다:

- `package.json`에 `workspaces` 필드가 있음
- 다음 파일 중 하나가 존재
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv` {#loadenv}

**타입 시그니처:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_'
): Record<string, string>
```

**관련 문서:** [`.env` Files](./env-and-mode.md#env-files)

`envDir` 내부의 `.env` 파일을 로드합니다. 기본적으로 `VITE_`로 시작하는 환경 변수만 로드되나, `prefixes`를 통해 이를 변경할 수 있습니다.

## `normalizePath` {#normalizepath}

**타입 시그니처:**

```ts
function normalizePath(id: string): string
```

**관련 문서:** [Path Normalization](./api-plugin.md#path-normalization)

Vite 플러그인 간에 상호 작용할 수 있도록 경로를 정규화합니다.

## `transformWithEsbuild` {#transformwitesbuild}

**타입 시그니처:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object
): Promise<ESBuildTransformResult>
```

esbuild를 사용하여 JavaScript 또는 TypeScript를 변환합니다. Vite의 내부 esbuild 변환 과정과 동일하게 수행하고자 하는 플러그인 작성 시 유용합니다.

## `loadConfigFromFile` {#loadconfigfromfile}

**타입 시그니처:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

esbuild를 사용하여 Vite 설정 파일을 수동으로 로드합니다.