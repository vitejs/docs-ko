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
  // 유효한 사용자 설정 옵션과 `mode`, `configFile`
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

const parentServer = http.createServer() // 또는 express, koa 등

const vite = await createServer({
  server: {
    // 미들웨어 모드 활성화
    middlewareMode: {
      // 프록시 WebSocket에 부모 http 서버를 제공합니다.
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

## `ResolvedConfig` {#resolvedconfig}

`ResolvedConfig` 인터페이스는 `UserConfig`의 모든 속성들을 가지고 있지만, 대부분의 속성들은 실제 값을 가지고 있으며 `undefined`가 아닙니다. 또한 다음과 같은 유틸리티들도 포함합니다:

- `config.assetsInclude`: `id`가 asset으로 간주되는지 확인하는 함수입니다.
- `config.logger`: Vite의 내부 로거(Logger) 객체입니다.

## `ViteDevServer` {#vitedevserver}

```ts
interface ViteDevServer {
  /**
   * 해석된 Vite 설정 객체입니다.
   */
  config: ResolvedConfig
  /**
   * connect 앱 인스턴스입니다.
   * - 개발 서버에 커스텀 미들웨어를 연결하는 데 사용할 수 있습니다.
   * - 커스텀 http 서버의 핸들러 함수나 connect 스타일 Node.js
   *   프레임워크의 미들웨어로도 사용할 수 있습니다.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 네이티브 Node http 서버 인스턴스입니다.
   * 미들웨어 모드에서는 null입니다.
   */
  httpServer: http.Server | null
  /**
   * Chokidar watcher 인스턴스입니다. `config.server.watch`가 `null`이면
   * 어떤 파일도 감시하지 않으며, `add` 또는 `unwatch`를 호출해도 효과가 없습니다.
   * https://github.com/paulmillr/chokidar/tree/3.6.0#api
   */
  watcher: FSWatcher
  /**
   * `send(payload)` 메서드가 있는 WebSocket 서버입니다.
   */
  ws: WebSocketServer
  /**
   * 지정된 파일에 대해 플러그인 훅을 실행할 수 있는 Rollup 플러그인 컨테이너입니다.
   */
  pluginContainer: PluginContainer
  /**
   * import 관계와 URL-파일 매핑,
   * HMR 상태를 추적하는 모듈 그래프입니다.
   */
  moduleGraph: ModuleGraph
  /**
   * Vite가 CLI에 출력하는 해석된 URL입니다(URL 인코딩됨).
   * 미들웨어 모드이거나 서버가 어떤 포트에서도 수신하지 않으면 `null`을 반환합니다.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * http 요청 파이프라인을 거치지 않고 프로그래밍 방식으로 URL을
   * 해석, 로드, 변환하고 결과를 가져옵니다.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Vite 내장 HTML 변환과 모든 플러그인 HTML 변환을 적용합니다.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * 지정된 URL을 SSR용 인스턴스화된 모듈로 로드합니다.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * SSR 오류 스택 트레이스를 수정합니다.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * 모듈 그래프 안의 모듈에 대해 HMR을 트리거합니다. 다시 로드할 모듈은
   * `server.moduleGraph` API로 가져올 수 있습니다. `hmr`이 false이면 아무 작업도 하지 않습니다.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * 서버를 시작합니다.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * 서버를 다시 시작합니다.
   *
   * @param forceOptimize - 최적화 도구가 다시 번들링하도록 강제합니다. --force CLI 플래그와 같습니다.
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * 서버를 중지합니다.
   */
  close(): Promise<void>
  /**
   * CLI 단축키를 바인딩합니다.
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * `await server.waitForRequestsIdle(id)`를 호출하면 모든 정적 import가
   * 처리될 때까지 기다립니다. load 또는 transform 플러그인 훅에서 호출한다면
   * 데드락을 피하기 위해 id를 매개변수로 전달해야 합니다. 모듈 그래프의 첫 정적
   * import 섹션이 처리된 뒤 이 함수를 호출하면 즉시 resolve됩니다.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle`은 Vite 개발 서버가 갖는 온디맨드 특성(요청 시 소스 코드를 실시간으로 변환하여 제공하는 방식을 예로 들 수 있습니다. - 옮긴이)을 따르기 어려운 기능의 DX를 개선하는 데 사용할 수 있습니다. 가령 Tailwind는 코드를 확인할 때까지 CSS 클래스 생성을 지연시켜야 스타일 변경으로 인한 깜빡임을 피할 수 있는데, 이러한 상황에서 도움이 될 수 있습니다(실제 동작 예시는 [Vite Tailwind 플레이그라운드](https://github.com/vitejs/vite/blob/98888439e07c1dc6425deea3474330ad27b8bf33/playground/tailwind/vite.config.ts#L12-L16)에서 확인할 수 있습니다 - 옮긴이). 만약 이 함수가 로드 또는 변환 훅에서 호출되고, 이와 함께 기본적으로 제공되는 HTTP1 서버를 사용한다면, 모든 정적 임포트를 처리할 때까지 여섯 개의 http 채널 중 하나가 차단됩니다. 또한 현재 Vite 디펜던시 최적화 방식 중, 디펜던시 누락으로 인한 전체 페이지 리로드를 피하기 위해 이 함수를 사용하고 있습니다. 이를 통해 정적으로 임포트된 소스로부터 가져오는 모든 디펜던시가 처리될 때까지 사전 번들링된 디펜던시 로딩을 지연시켜 리로드를 피합니다. 마지막으로 Vite는 향후 메이저 버전 업데이트에서 대규모 애플리케이션의 콜드 스타트 시 발생할 수 있는 성능 저하를 피하기 위해 `optimizeDeps.crawlUntilStaticImports: false`를 기본값으로 설정할 수 있습니다.
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
  // 유효한 사용자 설정 옵션과 `mode`, `configFile`
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
   * 해석된 Vite 설정 객체입니다.
   */
  config: ResolvedConfig
  /**
   * connect 앱 인스턴스입니다.
   * - 프리뷰 서버에 커스텀 미들웨어를 연결하는 데 사용할 수 있습니다.
   * - 커스텀 http 서버의 핸들러 함수나 connect 스타일 Node.js
   *   프레임워크의 미들웨어로도 사용할 수 있습니다.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 네이티브 Node http 서버 인스턴스입니다.
   */
  httpServer: http.Server
  /**
   * Vite가 CLI에 출력하는 해석된 URL입니다(URL 인코딩됨).
   * 서버가 어떤 포트에서도 수신하지 않으면 `null`을 반환합니다.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 서버 URL을 출력합니다.
   */
  printUrls(): void
  /**
   * CLI 단축키를 바인딩합니다.
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

`overrides`의 `null`과 `undefined` 값은 건너뛰며 병합하지 않습니다. `defaults`의 값을 명시적으로 지워야 한다면 `mergeConfig` 결과를 직접 수정하세요.

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
