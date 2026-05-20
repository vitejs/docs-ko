# JavaScript API {#javascript-api}

Vite의 자바스크립트 API들은 전부 타입이 명시되어 있고 인텔리센스와 유효성 검사를 효과적으로 사용하기 위해 타입 스크립트 또는 VSCode의 JS 타입 검사 활성화를 추천합니다.

## `createServer` {#createserver}

**타입 시그니처:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**사용 예제:**

```ts twoslash
import { createServer } from 'vite'

const server = await createServer({
  // any valid user config options, plus `mode` and `configFile`
  configFile: false,
  root: import.meta.dirname,
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

const parentServer = http.createServer() // or express, koa, etc.

const vite = await createServer({
  server: {
    // Enable middleware mode
    middlewareMode: {
      // Provide the parent http server for proxy WebSocket
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Proxying WebSocket
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

## `ResolvedConfig` {#resolvedconfig}

`ResolvedConfig` 인터페이스는 `UserConfig`의 모든 속성들을 가지고 있지만, 대부분의 속성들은 실제 값을 가지고 있으며 `undefined`가 아닙니다. 또한 다음과 같은 유틸리티들도 포함합니다:

- `config.assetsInclude`: `id`가 asset으로 간주되는지 확인하는 함수입니다.
- `config.logger`: Vite의 내부 로거(Logger) 객체입니다.

## `ViteDevServer` {#vitedevserver}

```ts
interface ViteDevServer {
  /**
   * The resolved Vite config object.
   */
  config: ResolvedConfig
  /**
   * A connect app instance
   * - Can be used to attach custom middlewares to the dev server.
   * - Can also be used as the handler function of a custom http server
   *   or as a middleware in any connect-style Node.js frameworks.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Native Node http server instance.
   * Will be null in middleware mode.
   */
  httpServer: http.Server | null
  /**
   * Chokidar watcher instance. If `config.server.watch` is set to `null`,
   * it will not watch any files and calling `add` or `unwatch` will have no effect.
   * https://github.com/paulmillr/chokidar/tree/3.6.0#api
   */
  watcher: FSWatcher
  /**
   * WebSocket server with `send(payload)` method.
   */
  ws: WebSocketServer
  /**
   * Rollup plugin container that can run plugin hooks on a given file.
   */
  pluginContainer: PluginContainer
  /**
   * Module graph that tracks the import relationships, url to file mapping
   * and hmr state.
   */
  moduleGraph: ModuleGraph
  /**
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * in middleware mode or if the server is not listening on any port.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Programmatically resolve, load and transform a URL and get the result
   * without going through the http request pipeline.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Apply Vite built-in HTML transforms and any plugin HTML transforms.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * Load a given URL as an instantiated module for SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Fix ssr error stacktrace.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Triggers HMR for a module in the module graph. You can use the `server.moduleGraph`
   * API to retrieve the module to be reloaded. If `hmr` is false, this is a no-op.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Start the server.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Restart the server.
   *
   * @param forceOptimize - force the optimizer to re-bundle, same as --force cli flag
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Stop the server.
   */
  close(): Promise<void>
  /**
   * Bind CLI shortcuts
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Calling `await server.waitForRequestsIdle(id)` will wait until all static imports
   * are processed. If called from a load or transform plugin hook, the id needs to be
   * passed as a parameter to avoid deadlocks. Calling this function after the first
   * static imports section of the module graph has been processed will resolve immediately.
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
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**사용 예제:**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { build } from 'vite'

await build({
  root: path.resolve(import.meta.dirname, './project'),
  base: '/foo/',
  build: {
    rolldownOptions: {
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

```ts twoslash
import { preview } from 'vite'

const previewServer = await preview({
  // any valid user config options, plus `mode` and `configFile`
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
   * The resolved vite config object
   */
  config: ResolvedConfig
  /**
   * A connect app instance.
   * - Can be used to attach custom middlewares to the preview server.
   * - Can also be used as the handler function of a custom http server
   *   or as a middleware in any connect-style Node.js frameworks
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * native Node http server instance
   */
  httpServer: http.Server
  /**
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * if the server is not listening on any port.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Print server urls
   */
  printUrls(): void
  /**
   * Bind CLI shortcuts
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
  defaultMode = 'development',
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
  isRoot = true,
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
  root = searchForPackageRoot(current),
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
  prefixes: string | string[] = 'VITE_',
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

## `transformWithOxc` {#transformwithoxc}

**타입 시그니처:**

```ts
async function transformWithOxc(
  code: string,
  filename: string,
  options?: OxcTransformOptions,
  inMap?: object,
): Promise<Omit<OxcTransformResult, 'errors'> & { warnings: string[] }>
```

[Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer)를 사용해 JavaScript 또는 TypeScript를 변환합니다. Vite의 내부 Oxc Transformer 변환 과정과 동일하게 수행하고자 하는 플러그인 작성 시 유용합니다.

## `transformWithEsbuild` {#transformwithesbuild}

**타입 시그니처:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```

**Deprecated:** 대신 `transformWithOxc`를 사용하세요.

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

## `version` {#version}

**타입:** `string`

문자열로 표현된 현재 Vite 버전입니다(예: `"8.0.0"`).

## `rolldownVersion` {#rolldownversion}

**타입:** `string`

문자열로 표현된 Vite가 사용하는 Rolldown 버전입니다(예: `"1.0.0"`). `rolldown`의 [`VERSION`](https://rolldown.rs/reference/Variable.VERSION)을 다시 익스포트한 값입니다.

## `esbuildVersion` {#esbuildversion}

**타입:** `string`

하위 호환성을 위해서만 유지됩니다.

## `rollupVersion` {#rollupversion}

**타입:** `string`

하위 호환성을 위해서만 유지됩니다.
