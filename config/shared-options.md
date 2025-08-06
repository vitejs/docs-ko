<template>
  <a
    href="/guide/api-environment#environments-configuration"
    class="ignore-header"
  >
    <Badge type="info" text="non-inherit" />
## optimizeDeps.entries <NonInheritBadge />
</template>
  </a>
      | 'dashes'
  }
import NonInheritBadge from './components/NonInheritBadge.vue'

[Lightning CSS](../guide/features.md#lightning-css)를 사용할 때 이 옵션은 어떠한 효과도 없습니다. Lightning CSS가 활성화된 경우, [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html)를 이 대신 사용해야 합니다.
## optimizeDeps.exclude <NonInheritBadge />

## css.postcss {#css-postcss}


    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
    app.component('NonInheritBadge', NonInheritBadge)
        },
      },
      scss: {
        importers: [
          // ...
        ],
      },
    },
  },
## optimizeDeps.include <NonInheritBadge />
})
```

### css.preprocessorOptions[extension].additionalData {#css-preprocessoroptions-extension-additionaldata}

- **타입:** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

이 옵션은 각 스타일 콘텐츠에 추가적인 코드를 주입하는 데 사용할 수 있습니다. 변수가 아닌 실제 스타일을 포함한다면, 해당 스타일이 최종 번들에 중복된다는 점을 유의하세요.

**예시:**
```js
- Don't transform SVGs into UI framework components (React, Vue, etc.). Import them as strings or URLs instead.
- **기본값:** `0` (워커를 생성하지 않고 메인 스레드에서 실행)
- **타입:** `boolean`

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13835)
- **타입:** `'postcss' | 'lightningcss'`
## optimizeDeps.esbuildOptions <NonInheritBadge />
- **기본값:** `'postcss'`
## css.lightningcss {#css-lightningcss}
    ['css', ['lightningcss']],

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  Targets,
} from 'lightningcss'
For TypeScript users, make sure to add the type declarations in the `vite-env.d.ts` file to get type checks and Intellisense.

{
  targets?: Targets
  include?: Features
  exclude?: Features
When not explicitly documented, environment inherits the configured top-level config options (for example, the new `server` and `edge` environments will inherit the `build.sourcemap: false` option). A small number of top-level options, like `optimizeDeps`, only apply to the `client` environment, as they don't work well when applied as a default to server environments. Those options have <NonInheritBadge /> badge in [the reference](/config/). The `client` environment can also be configured explicitly through `environments.client`, but we recommend to do it with the top-level options so the client config remains unchanged when adding new environments.
  drafts?: Drafts
## optimizeDeps.force <NonInheritBadge />
  nonStandard?: NonStandard
Vite provides type definitions for `import.meta.hot` in [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). You can create an `vite-env.d.ts` in the `src` directory so TypeScript picks up the type definitions:

```ts [vite-env.d.ts]
- **기본값:** `'auto'`
## optimizeDeps.noDiscovery <NonInheritBadge />

`true`로 지정한다면, 임포트하는 JSON은 `export default JSON.parse("...")`으로 변환됩니다. JSON 파일이 클 때 객체 리터럴보다 성능이 월등히 뛰어납니다.

`'auto'`로 설정한다면, [데이터가 10kB보다 큰 경우에만](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger) 문자열화됩니다.

```js
## optimizeDeps.holdUntilCrawlEnd <NonInheritBadge />

## logLevel {#loglevel}

- **타입:**
    clearScreen(type: LogType): void

- **기본값:** `root`
## optimizeDeps.disabled <NonInheritBadge />

'.env' 파일이 로드되는 디렉터리입니다. 절대 경로 또는 프로젝트 루트에 상대적인 경로일 수 있습니다. `false`는 `.env` 파일 로딩을 비활성화합니다.

환경 파일에 대한 더 자세한 점을 알려면, [여기](/guide/env-and-mode#env-files)를 확인하세요.

## envPrefix {#envprefix}

- **타입:** `string | string[]`
- **기본값:** `VITE_`


:::warning 보안 권고 사항
`envPrefix`를 `''`로 설정해서는 안 됩니다. 이렇게 설정한 경우 모든 환경 변수가 노출되며, 이로 인해 예기치 않게 민감한 정보가 누출될 수 있습니다. 따라서 Vite는 `''`로 설정되었을 때 오류를 발생시킵니다.

## optimizeDeps.needsInterop <NonInheritBadge />
접두사가 붙지 않은 변수를 노출하려면, 이 대신 [define](#define) 옵션을 사용하세요:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
## resolve.conditions <NonInheritBadge />
}
```

:::



- `'spa'`: HTML 미들웨어와 SPA 폴백(Fallback)을 사용합니다. 프리뷰 모드에서 `single: true`로 [sirv](https://github.com/lukeed/sirv)를 설정합니다.

더 많은 정보가 필요하다면 Vite의 [SSR 가이드](/guide/ssr#vite-cli)를 참고해주세요. [`server.middlewareMode`](./server-options#server-middlewaremode) 옵션도 참고가 가능합니다.

## future {#future}
- The file containing the reference to `vite/client` (normally `vite-env.d.ts`):
                resolvers,
                options.alias,
                maxWorkers,
              ),
  let compilerPromise: Promise<Sass.AsyncCompiler> | undefined
    typeof WorkerWithFallback<
      [
      ],
      ScssWorkerResult
    >
  >
Depending on the preprocessor options, Vite may run the preprocessors on the main thread even if this option is not set to `0`.
## resolve.mainFields <NonInheritBadge />