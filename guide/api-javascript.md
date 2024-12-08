# JavaScript API {#javascript-api}

Vite의 자바스크립트 API들은 전부 타입이 명시되어 있고 intellisense와 유효성 검사를 효과적으로 사용하기 위해 타입 스크립트 또는 VSCode의 JS 타입 검사 활성화를 추천합니다.

## `createServer` {#createserver}

**타입 시그니처:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**사용 예제:**

```ts twoslash
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // 유효한 유저 설정 옵션들, 추가적으로 `mode`와 `configFile`가 있습니다.
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

::: tip 참고
`createServer`와 `build`는 `mode` 설정 옵션과 `process.env.NODE_ENV`에 의존해 관련 동작을 수행합니다. 따라서 동일한 Node.js 프로세스에서 이 두 함수를 사용하는 경우 충돌이 발생될 수 있으며, 이를 방지하고자 한다면 두 API의 `process.env.NODE_ENV` 또는 `mode` 설정 옵션을 `development`로 설정하세요. 아니면 하위 프로세스를 만들어 API를 각각 실행하는 방법도 있습니다.
:::

::: tip 참고
[미들웨어 모드](/config/server-options.md#server-middlewaremode)와 [WebSocket용 프록시 설정](/config/server-options.md#server-proxy)을 함께 사용할 때, 프록시를 올바르게 바인딩하려면 부모 http 서버를 `middlewareMode`에 전달해야 합니다.

<details>
<summary>예시</summary>

```ts twoslash
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // 또는 express, koa 등

const vite = await createServer({
  server: {
    // 미들웨어 모드 활성화
    middlewareMode: {
      // 프록시 WebSocket을 위해 부모 http 서버 제공
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // WebSocket 프록시
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>
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
   * Chokidar watcher 인스턴스. `config.server.watch`가 `null` 이라면
   * 어떠한 파일도 감시하지 않으며, `add` 또는 `unwatch`를 호출해도 아무런 효과가 없습니다.
   * https://github.com/paulmillr/chokidar/tree/3.6.0#api
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
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * in middleware mode or if the server is not listening on any port.
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
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * 주어진 URL을 SSR을 위해 인스턴스화 된 모듈로 로드합니다.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean }
  ): Promise<Record<string, any>>
  /**
   * SSR 에러 stacktrace 수정
   */
  ssrFixStacktrace(e: Error): void
  /**
   * 모듈 그래프의 모듈에 대한 HMR을 트리거합니다. `server.moduleGraph` API를 사용하여 다시 로드할 모듈을 검색할 수 있습니다.
   * `hmr`이 false이면 아무것도 하지 않습니다.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * 서버 시작
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * 서버 재시작
   *
   * @param forceOptimize - optimizer가 re-bundle를 강제시킵니다. --force cli flag를 쓴 것과 똑같습니다.
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * 서버 종료
   */
  close(): Promise<void>
  /**
   * CLI 단축키 바인딩
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * `await server.waitForRequestsIdle(id)`를 호출하면 모든 정적 임포트가 처리될 때까지
   * 대기합니다. 로드 또는 변환 플러그인 훅에서 호출하는 경우, 교착 상태를 피하기 위해 id를
   * 매개변수로 전달해야 합니다. 모듈 그래프의 첫 번째 정적 임포트를 처리한 후 이 함수를 호출하면
   * 즉시 처리됩니다.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle`은 Vite 개발 서버가 갖는 온디맨드 특성(요청 시 소스 코드를 실시간으로 변환하여 제공하는 방식을 예로 들 수 있습니다. - 옮긴이)을 따르기 어려운 기능들에 대한 DX를 개선하기 위해 사용이 가능합니다. 가령 Tailwind는 코드를 확인할 때까지 CSS 클래스 생성을 지연시켜야 스타일 변경으로 인한 깜빡이는 현상을 피할 수 있는데, 이러한 상황에서 도움이 될 수 있습니다(실제 동작하는 예시는 [Vite Tailwind 플레이그라운드](https://github.com/vitejs/vite/blob/98888439e07c1dc6425deea3474330ad27b8bf33/playground/tailwind/vite.config.ts#L12-L16)에서 확인이 가능합니다 - 옮긴이). 만약 이 함수가 로드 또는 변환 훅에서 호출되고, 이와 함께 기본적으로 제공되는 HTTP1 서버를 사용한다면, 모든 정적 임포트를 처리할 때까지 여섯 개의 http 채널 중 하나가 차단됩니다. 또한 현재 Vite 디펜던시 최적화 방식 중, 디펜던시 누락으로 인해 전체 페이지에 대한 리로드를 피하기 위해 이 함수를 사용하고 있습니다. 이를 통해 정적으로 임포트된 소스로부터 가져와지는 모든 디펜던시가 처리될 때까지 사전 번들링된 디펜던시 로딩을 지연시켜 리로드를 피할 수 있게 됩니다. 마지막으로 Vite는 향후 메이저 버전 업데이트에서 대규모 애플리케이션의 콜드 스타트 시 발생할 수 있는 성능 저하를 피하기 위해 `optimizeDeps.crawlUntilStaticImports: false`를 기본값으로 설정할 수 있습니다.
:::

## `build` {#build}

**타입 시그니처:**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**사용 예제:**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await build({
  root: path.resolve(__dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `preview` {#preview}

**타입 시그니처:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**사용 예제:**

```js twoslash
import { preview } from 'vite'

const previewServer = await preview({
  // 유효한 유저 설정 옵션들, 추가적으로 `mode`와 `configFile`가 있습니다.
  preview: {
    port: 8080,
    open: true,
  },
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
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
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * if the server is not listening on any port.
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
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

프리뷰와 개발 단계에서의 `command`의 값은 `serve`이며, 프로덕션 빌드 시에는 `build`가 됩니다.

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

```ts twoslash
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
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

다음 조건을 만족하여 워크스페이스가 될 수 있는 루트를 검색합니다. 그렇지 않다면 `root`를 반환합니다:

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
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

esbuild를 사용하여 Vite 설정 파일을 수동으로 로드합니다.

## `preprocessCSS` {#preprocesscss}

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13815)

**타입 시그니처:**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig,
): Promise<PreprocessCSSResult>
interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

`.css`, `.scss`, `.sass`, `.less`, `.styl` 및 `.stylus` 파일을 브라우저에서 사용하거나 다른 도구에서 파싱할 수 있도록 일반 CSS로 전처리합니다. [내장된 CSS 전처리기](/guide/features#css-pre-processors)처럼 사용 시 해당 전처리기가 설치되어 있어야 합니다.

사용되는 전처리기는 `filename` 확장자로부터 추론됩니다. 다만 `filename`이 `.module.{ext}`로 끝난다면 [CSS 모듈](https://github.com/css-modules/css-modules)로 추론되며, 반환된 결과에는 원본 클래스 이름을 변환된 이름으로 매핑한 `modules` 객체가 포함됩니다.

참고로 전처리기는 `url()` 또는 `image-set()` 내부에 존재하는 URL을 확인하지 않는다는 점에 유의하세요.