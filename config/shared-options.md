# 공용 옵션 {#shared-options}

## root {#root}

- **타입:** `string`
- **기본값:** `process.cwd()`

프로젝트 루트 디렉터리 (`index.html` 파일이 있는 곳) 입니다. 이는 절대 경로 또는 현재 작업 디렉터리(CWD) 위치로부터 상대적인 경로가 될 수도 있습니다.

[프로젝트 루트](/guide/#index-html-and-project-root)에서 더 자세한 점을 볼 수 있습니다.

## base {#base}

- **타입:** `string`
- **기본값:** `/`
- **관련 항목:** [`server.origin`](/config/server-options.md#server-origin)

개발 또는 프로덕션 모드에서 사용되는 Public Base Path 입니다. 유효한 값은 다음과 같습니다:

- 절대 URL 경로명, 예) `/foo/`
- 전체 URL, 예) `https://foo.com/` (URL Origin 부분은 개발에서 사용되지 않습니다)
- 빈 문자열 또는 `./`

[Public Base Path](/guide/build#public-base-path)에서 더 자세한 점을 볼 수 있습니다.

## mode {#mode}

- **타입:** `string`
- **기본값:** `serve` 에서는 `'development'`, `build` 에서는 `'production'`

설정에서 이것을 지정하면 **serve와 build 모두**에서 기본 모드를 오버라이드 합니다. 또한 이 값은 명령 줄 `--mode` 옵션으로도 오버라이드 될 수 있습니다.

[환경 변수와 모드](/guide/env-and-mode)에서 더 자세한 점을 볼 수 있습니다.

## define {#define}

- **타입:** `Record<string, any>`

전역 상수로 대체되는 값을 정의합니다. 정의된 내용들은 개발 중에는 전역으로 정의되나, 빌드 중에는 정적으로 대체됩니다.

Vite는 [esbuild defines](https://esbuild.github.io/api/#define)를 사용해 치환을 수행하므로, 값 표현식은 JSON 직렬화할 수 있는 값(null, boolean, number, string, array, 또는 object) 또는 단일 식별자인 문자열이어야 합니다. 만약 문자열이 아니라면, Vite는 `JSON.stringify`를 통해 자동으로 문자열로 변환합니다.

**예시:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip 참고
TypeScript를 사용할 때 타입 체크 및 인텔리센스를 활성화하고자 한다면, `env.d.ts` 또는 `vite-env.d.ts` 파일에 해당 타입을 선언해줘야 합니다.

예제:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins {#plugins}

- **타입:** ` (Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

사용할 플러그인의 배열입니다. 잘못된 플러그인은 무시되고 플러그인의 배열은 평탄화됩니다. 만약 프로미스 객체가 반환된다면, 실행되기 전 해당 데이터를 모두 가져옵니다. [플러그인 API](/guide/api-plugin)에서 Vite 플러그인에 대한 더 자세한 점을 볼 수 있습니다.

## publicDir {#publicdir}

- **타입:** `string | false`
- **기본값:** `"public"`

정적 에셋들을 제공하는 디렉터리 입니다. 이 디렉터리의 파일들은 개발 중에는 `/` 에서 제공되고 빌드 시에는 `outDir`의 루트로 복사되며, 변형 없이 언제나 있는 그대로 제공되거나 복사됩니다. 값은 절대 파일 시스템 경로 또는 프로젝트 루트의 상대적인 경로중 하나가 될 수 있습니다.

`publicDir`를 `false`로 정의하면 이 기능이 비활성화됩니다.

[`public` 디렉터리](/guide/assets#the-public-directory)에서 더 자세한 점을 볼 수 있습니다.

## cacheDir {#cachedir}

- **타입:** `string`
- **기본값:** `"node_modules/.vite"`

캐시 파일을 저장할 디렉터리 입니다. 이 디렉터리의 파일들은 미리 번들된 의존 파일이거나 Vite에 의해 생성된 어떤 다른 캐시 파일로서, 성능을 향상시킬 수 있습니다. 캐시 파일을 다시 생성하기 위해 `--force` 플래그를 사용하거나 또는 직접 디렉터리를 삭제할 수 있습니다. 값은 절대 파일 시스템 경로 또는 프로젝트 루트의 상대적인 경로중 하나가 될 수 있습니다.

## resolve.alias {#resolve-alias}

- **타입:**
`Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

이 옵션의 값은 `@rollup/plugin-alias` 의 [entries 옵션](https://github.com/rollup/plugins/tree/master/packages/alias#entries)으로 전달됩니다. 객체나 `{ find, replacement, customResolver }` 페어 배열이 될 수 있습니다.

파일 시스템 경로에 별칭을 만들 때에는, 반드시 절대 경로를 사용하세요. 상대 경로 별칭은 있는 그대로 사용되며, 파일 시스템 경로로 적절하게 해석되지 않습니다.

더 자세한 해결책은 [플러그인](/guide/api-plugin)에서 찾아볼 수 있습니다.

::: warning SSR 사용 시 주의사항
[SSR 외부화된 디펜던시](/guide/ssr.md#ssr-externals)를 위해 별칭을 사용했다면, 기존의 실제 `node_modules` 패키지도 별칭으로 설정하는 것이 좋습니다. [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias)과 [pnpm](https://pnpm.io/aliases/) 모두 `npm:` 접두사를 통해 별칭을 지원합니다.
:::

## resolve.dedupe {#resolve-dedupe}

- **타입:** `string[]`

만약 앱 내에서 (호이스팅 또는 모노리포 안의 연결된 패키지로 인해 발생할 수 있는) 동일한 디펜던시의 중복된 복사본을 갖고 있다면, 이 옵션을 사용해서 무조건 Vite가 나열된 디펜던시를 항상 (프로젝트 루트의) 동일한 복사본으로 사용하게 할 수 있습니다.

:::warning SSR + ESM
SSR 빌드의 경우, `build.rollupOptions.output`을 통해 구성된 ESM 빌드 결과물에 대해 중복된 코드의 제거가 진행되지 않습니다. 이를 해결하기 위해서는 ESM이 모듈 로드에 대한 플러그인 지원을 개선할 때까지 CJS(CommonJS) 빌드를 이용하는 것입니다.
:::

## resolve.conditions {#resolve-conditions}

- **타입:** `string[]`

패키지로부터 [조건부 내보내기](https://nodejs.org/api/packages.html#packages_conditional_exports)를 할 때, 추가적으로 허용되는 조건입니다.

조건부 내보내기를 동반한 패키지는 `package.json`내에 다음의 `exports` 필드를 가질 수 있습니다:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

여기에, `import`와 `require`는 "조건"입니다. 조건은 중첩될 수 있으며 구체적인 조건부터 덜 구체적인 조건까지 다양하게 지정될 수 있습니다.

Vite 는 "허용되는 조건들"의 목록을 가지며 이것은 허용되는 목록 안의 첫 번째 조건과 매치됩니다. 기본적으로 허용되는 조건들은 `import`, `module`, `browser`, `default`, 그리고 현재 모드를 기반으로 한 `production/development` 입니다. `resolve.conditions` 설정 옵션은 추가로 허용되는 조건들을 지정하는 것을 허용합니다.

:::warning 하위 경로 내보내기 키값
"/"로 끝나는 `exports` 객체의 키값은 Node에서 더는 사용되지 않기 때문에 제대로 작동하지 않을 수 있습니다. 이 대신 [`*` 하위 경로 패턴](https://nodejs.org/api/packages.html#package-entry-points)을 사용할 수 있도록 사용하고 있는 패키지의 관리자에게 문의해주세요.
:::

## resolve.mainFields {#resolve-mainfields}

- **타입:** `string[]`
- **기본값:** `['browser', 'module', 'jsnext:main', 'jsnext']`

패키지의 진입점을 확인할 때 시도할 `package.json`안의 필드 목록입니다. 이것은 `exports` 필드에서 처리되는 조건부 내보내기보다 우선순위가 낮습니다: 만약 진입점이 `exports`로부터 성공적으로 확인되면, 메인 필드는 무시될 것입니다.

## resolve.extensions {#resolve-extensions}

- **타입:** `string[]`
- **기본값:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

확장자를 생략한 가져오기를 위해 시도할 파일 확장자 목록입니다. IDE와 타입 지원을 방해할 수 있으므로 (`.vue`와 같은) 사용자가 지정한 방식의 가져오기 형식에 대해서는 확장자를 생략하지 **않는** 것을 추천합니다.

## resolve.preserveSymlinks {#resolve-preservesymlinks}

- **타입:** `boolean`
- **기본값:** `false`

이 설정을 활성화하면 Vite가 심볼릭 링크를 따르는 실제 파일 경로 대신, 심볼릭 링크를 따르지 않는 원래 파일 경로로 파일의 ID를 결정하게 됩니다.

- **관련 항목:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks
  ](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce {#html-cspnonce}

- **타입:** `string`
- **관련 항목:** [콘텐츠 보안 정책 (Content Security Policy, CSP)](/guide/features#content-security-policy-csp)

스크립트 및 스타일 태그를 생성할 때 사용되는 nonce 값에 대한 자리 표시자입니다. 이 값을 설정하면 nonce 값을 가진 메타 태그도 생성됩니다.

## css.modules {#css-modules}

- **타입:**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * 기본값: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

CSS 모듈에 대한 설정입니다. 옵션들은 [postcss-modules](https://github.com/css-modules/postcss-modules)로 전달됩니다.

[Lightning CSS](../guide/features.md#lightning-css)를 사용할 때 이 옵션은 어떠한 효과도 없습니다. Lightning CSS가 활성화된 경우, [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html)를 이 대신 사용해야 합니다.

## css.postcss {#css-postcss}

- **타입:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

인라인 PostCSS 설정, 또는 PostCSS 설정을 검색할 사용자 지정 디렉터리(기본값은 프로젝트 루트)입니다.

인라인 PostCSS 설정의 경우, `postcss.config.js`와 동일한 형식으로 작성해야 합니다. 다만 `plugins` 프로퍼티의 경우, 오로지 [array format](https://github.com/postcss/postcss-load-config/blob/main/README.md#array)만을 사용할 수 있습니다.

검색은 [postcss-load-config](https://github.com/postcss/postcss-load-config)를 사용하여 수행되며, 지원되는 설정 파일 이름만 불러오게 됩니다.

인라인 설정이 제공되는 경우, Vite는 다른 PostCSS 설정 소스를 찾지 않을 것입니다.

## css.preprocessorOptions {#css-preprocessoroptions}

- **타입:** `Record<string, object>`

CSS 전처리기에 전달할 옵션을 지정합니다. 파일 확장자는 옵션의 키로 사용됩니다. 전처리기에 대한 지원되는 옵션은 각각의 문서에서 찾을 수 있습니다:

- `sass`/`scss` - [옵션](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less` - [옵션](https://lesscss.org/usage/#less-options).
- `styl`/`stylus` - [`define`](https://stylus-lang.com/docs/js.html#define-name-node)만 지원되며, 객체로 전달할 수 있습니다.

**예시**:

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData {#css-preprocessoroptions-extension-additionaldata}

- **타입:** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

이 옵션은 각 스타일 콘텐츠에 추가적인 코드를 주입하는 데 사용할 수 있습니다. 변수가 아닌 실제 스타일을 포함한다면, 해당 스타일이 최종 번들에 중복된다는 점을 유의하세요.

**예시:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

## css.preprocessorMaxWorkers {#css-preprocessormaxworkers}

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/15835)
- **타입:** `number | true`
- **기본값:** `0` (워커를 생성하지 않고 메인 스레드에서 실행)

이 옵션을 설정하면 CSS 전처리기는 가능한 경우 워커에서 실행됩니다. `true`는 CPU 수에서 1을 뺀 값입니다.

## css.devSourcemap {#css-devsourcemap}

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13845)
- **타입:** `boolean`
- **기본값:** `false`

개발 중 CSS 소스 맵을 활성화할지 여부를 나타냅니다.

## css.transformer {#css-transformer}

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13835)
- **타입:** `'postcss' | 'lightningcss'`
- **기본값:** `'postcss'`

CSS 처리에 사용되는 엔진을 선택합니다. 자세한 내용은 [Lightning CSS](../guide/features.md#lightning-css)를 참고해 주세요.

::: info 중복된 `@import`
postcss(postcss-import)는 중복된 `@import`에 대해 브라우저와는 다른 동작을 합니다. 자세한 내용은 [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462)를 참고해 주세요.
:::

## css.lightningcss {#css-lightningcss}

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13835)
- **타입:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

Lightning CSS 옵션입니다. 전체 변환 옵션은 [Lightning CSS 리포지토리](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts)에서 찾을 수 있습니다.

## json.namedExports {#json-namedexports}

- **타입:** `boolean`
- **기본값:** `true`

`.json` 파일에서 명명된 가져오기를 지원하는지 여부입니다.

## json.stringify {#json-stringify}

- **타입:** `boolean`
- **기본값:** `false`

`true`로 지정한다면, 가져온 JSON 은 특히 JSON 파일이 클 때 객체 리터럴보다 성능이 월등히 뛰어난 `export default JSON.parse("...")`으로 변환됩니다.

이 옵션을 사용하면 명명된 가져오기가 비활성화됩니다.

## esbuild {#esbuild}

- **타입:** `ESBuildOptions | false`

`ESBuildOptions`는 [esbuild 변환 옵션](https://esbuild.github.io/api/#transform)을 확장합니다. 가장 일반적인 사례는 JSX를 커스터마이즈하는 것입니다:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

기본적으로, ESBuild는 `ts`, `jsx`, `tsx` 파일들에 적용됩니다. `esbuild.include`와 `esbuild.exclude`를 사용하여 커스터마이즈할 수 있으며, 정규식이나 [picomatch](https://github.com/micromatch/picomatch#globbing-features) 패턴 또는 그 중 하나의 배열이 될 수 있습니다.

추가적으로, ESBuild에 의해 변환된 모든 파일에 대해 JSX 헬퍼 `import` 들을 자동으로 주입하기 위해 `esbuild.jsxInject`도 사용할 수 있습니다:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

[`build.minify`](./build-options.md#build-minify)가 `true`인 경우, 기본적으로 모든 축소(Minify) 최적화가 적용됩니다. 코드의 [일부분](https://esbuild.github.io/api/#minify)만 이를 적용하지 않기 위해서는 `esbuild.minifyIdentifiers`, `esbuild.minifySyntax`, 또는 `esbuild.minifyWhitespace` 옵션을 `false`로 설정해주세요. 참고로 `esbuild.minify` 옵션은 `build.minify`를 재정의하는 데 사용할 수 없습니다.

esbuild 변환을 사용하지 않으려면 `false`로 설정하세요.

## assetsInclude {#assetsinclude}

- **타입:** `string | RegExp | (string | RegExp)[]`
- **관련 항목:** [정적 에셋 가져오기](/guide/assets)

정적 에셋으로 처리할 추가 [picomatch 패턴](https://github.com/micromatch/picomatch#globbing-features)을 지정합니다:

- HTML에서 참조되거나 `fetch` 또는 XHR을 통해 직접 요청될 때, 이것은 플러그인 변환 파이프라인에서 제외됩니다.

- JS에서 그것을 가져오면 처리된 URL 문자열이 반환됩니다. (이것은 에셋 형식을 다르게 처리하기 위한 `enforce: 'pre'` 플러그인이 있다면 덮어 쓰일 수 있습니다.)

이 빌트인 에셋 형식 목록은 [여기](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts)에서 확인할 수 있습니다.

**예제:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf']
})
```

## logLevel {#loglevel}

- **타입:** `'info' | 'warn' | 'error' | 'silent'`

콘솔 출력의 상세 정도를 조정합니다. 기본값은 `'info'` 입니다.

## customLogger {#customlogger}

- **타입:**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

커스텀 로거를 사용하여 메시지를 로그로 남깁니다. `createLogger` API를 사용해 Vite의 로거를 가져와 메시지를 변경하거나 특정 경고를 필터링하는 등의 작업을 수행할 수 있습니다.

```js twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // 빈 CSS 파일에 대한 경고 무시
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen {#clearscreen}

- **타입:** `boolean`
- **기본값:** `true`

특정 메시지를 로그로 남길 때, Vite가 터미널 화면을 지우지 않도록 하려면 `false`로 설정하세요. 명령 줄에서는 `--clearScreen false`를 사용하세요.

## envDir {#envdir}

- **타입:** `string`
- **기본값:** `root`

'.env' 파일이 로드되는 디렉터리입니다. 절대 경로 또는 프로젝트 루트에 상대적인 경로일 수 있습니다.

환경 파일에 대한 더 자세한 점을 알려면, [여기](/guide/env-and-mode#env-files)를 확인하세요.

## envPrefix {#envprefix}

- **타입:** `string | string[]`
- **기본값:** `VITE_`

`envPrefix`로 시작하는 환경 변수는 import.meta.env를 통해 소스 코드에서 접근할 수 있습니다.

:::warning 보안 권고 사항
`envPrefix`를 `''`로 설정해서는 안 됩니다. 이렇게 설정한 경우 모든 환경 변수가 노출되며, 이로 인해 예기치 않게 민감한 정보가 누출될 수 있습니다. 따라서 Vite는 `''`로 설정되었을 때 오류를 발생시킵니다.

접두사가 붙지 않은 변수를 노출하려면, 이 대신 [define](#define) 옵션을 사용하세요:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType {#apptype}

- **타입:** `'spa' | 'mpa' | 'custom'`
- **기본값:** `'spa'`

애플리케이션이 단일 페이지 애플리케이션(SPA), [다중 페이지 애플리케이션(MPA)](../guide/build#multi-page-app), 또는 커스텀 애플리케이션(SSR 및 커스텀 HTML 처리를 하는 프레임워크)인지 여부:

- `'spa'`: HTML 미들웨어와 SPA 폴백(Fallback)을 사용합니다. 프리뷰 모드에서 `single: true`로 [sirv](https://github.com/lukeed/sirv)를 설정합니다.
- `'mpa'`: HTML 미들웨어를 포함합니다.
- `'custom'`: HTML 미들웨어를 포함하지 않습니다.

좀 더 많은 정보가 필요하다면 Vite의 [SSR 가이드](/guide/ssr#vite-cli)를 참고해주세요. [`server.middlewareMode`](./server-options#server-middlewaremode) 옵션도 참고가 가능합니다.