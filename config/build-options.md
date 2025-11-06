# 빌드 옵션 {#build-options}

별도로 명시되지 않은 한, 이 섹션의 옵션들은 빌드에만 적용됩니다.

## build.target {#build-target}

- **타입:** `string | string[]`
- **기본값:** `'baseline-widely-available'`
- **관련 항목:** [브라우저 지원 현황](/guide/build#browser-compatibility)

최종 번들에 대한 브라우저 호환성 타깃입니다. 기본값은 Vite 전용 값인 `'baseline-widely-available'`로, 2025-05-01에 [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available에 포함된 브라우저를 타깃으로 합니다. 구체적으로는 `['chrome107', 'edge107', 'firefox104', 'safari16']`입니다.

또 다른 Vite 한정 옵션은 `'esnext'` 로, 네이티브 동적 Import를 지원하며 트랜스파일링을 최소한만 수행합니다.

변환은 esbuild로 수행되며, 값은 유효한 [esbuild 타깃 옵션](https://esbuild.github.io/api/#target)이어야 합니다. 커스텀 타깃은 ES 버전 (예: `es2015`)이나 버전이 있는 브라우저 (예: `chrome58`) 또는 다중 타깃 문자열의 배열이 될 수 있습니다.

코드안에 esbuild로 안전하게 트랜스파일 할 수 없는 기능이 포함된 경우 빌드는 실패할 것입니다. 자세한 점은 [esbuild 문서](https://esbuild.github.io/content-types/#javascript)를 확인하세요.

## build.modulePreload {#build-modulepreload}

- **타입:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **기본값:** `{ polyfill: true }`

기본적으로, [모듈 사전로드 폴리필](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)이 자동으로 주입됩니다. 폴리필은 각 `index.html` 엔트리의 프록시 모듈에 자동 주입됩니다. 빌드가 `build.rollupOptions.input`을 통해 HTML이 아닌 커스텀 엔트리를 사용하도록 설정된 경우, 커스텀 엔트리에 직접 폴리필을 가져와야 합니다:

```js
import 'vite/modulepreload-polyfill'
```

참고: 폴리필은 [라이브러리 모드](/guide/build#library-mode)에 적용되지 **않습니다**. 네이티브 동적 가져오기 없이 브라우저를 지원해야 한다면, 아마도 라이브러리에서 이것을 사용하지 않는 것이 좋습니다.

폴리필은 `{ polyfill: false }`를 사용하여 비활성 할 수 있습니다.

각 동적 가져오기를 위한 사전 로드되는 청크 목록은 Vite에서 산출합니다. 기본적으로, 이러한 디펜던시를 로드할 때 `base`를 포함하는 하나의 절대경로가 사용됩니다. `base`가 상대적인 경우 (`''` or `'./'`), 절대 경로가 최종 배포되는 base에 의존하지 않도록 `import.meta.url`이 런타임에 사용됩니다.

디펜던시 목록 및 그 경로에 대한 세밀한 제어를 위해 `resolveDependencies` 함수를 사용한 실험적인 지원사항이 있습니다. [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13841). `ResolveModulePreloadDependenciesFn` 유형의 함수가 그것입니다:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]
```

`resolveDependencies` 함수는 각 동적 임포트에 대해, 의존하는 청크 목록과 함께 호출됩니다. 진입점 HTML 파일에 임포트된 청크에 대해서도 호출됩니다. 필터링되거나 더 많은 디펜던시가 존재하는 새로운 디펜던시 배열을 반환할 수 있으며, 경로도 수정할 수 있습니다. `deps` 경로는 `build.outDir`을 기준으로 하며, 반환 값도 `build.outDir`에 대한 상대 경로여야 합니다.

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  },
}
```

결정된 디펜던시 경로는 [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options)를 사용하여 추가로 수정될 수 있습니다.

## build.polyfillModulePreload {#build-polyfillmodulepreload}

- **타입:** `boolean`
- **기본값:** `true`
- **사용 중단** `build.modulePreload.polyfill`을 사용하세요.

[module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)을 자동으로 주입할지 여부입니다.

## build.outDir {#build-outdir}

- **타입:** `string`
- **기본값:** `dist`

([프로젝트 루트](/guide/#index-html-and-project-root)에 상대적인) 출력 디렉터리를 지정합니다.

## build.assetsDir {#build-assetsdir}

- **타입:** `string`
- **기본값:** `assets`

생성된 에셋을 (`build.outDir`에 상대적으로) 저장할 디렉터리를 지정합니다. [라이브러리 모드](/guide/build#library-mode)에서는 사용되지 않습니다.

## build.assetsInlineLimit {#build-assetsinlinelimit}

- **타입:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **기본값:** `4096` (4KiB)

이 값보다 작은 크기로 import 되거나 참조된 에셋은 부가적인 http 요청을 피하고자 base64 URL로 인라인 처리됩니다. 만일 인라인 변환을 사용하지 않으려면 `0`으로 설정하세요.

콜백이 전달되면, boolean을 반환하여 opt-in 또는 opt-out 할 수 있습니다(여기서 opt-in은 인라인을, opt-out은 기본값을 사용합니다. 자세한 구현 사항은 [커밋](https://github.com/vitejs/vite/commit/4d1342ebe0969cbcfc9c6d7fc5347f85df07df7f#diff-91776e7c6039d23a070162f02a69cd46046a2095bd5ecb384ae9e27f2ea5288fR414-R416)을 참고해 주세요. - 옮긴이). 반환되는 값이 없으면 기본 로직이 적용됩니다.

Git LFS(Large File Storage) 자리 표시자는 해당 파일의 내용을 포함하고 있지 않기에 인라인에서는 자동으로 제외됩니다.

::: tip 참고
`build.lib`를 지정하면 `build.assetsInlineLimit`는 무시되며 파일 크기나 Git LFS 자리 표시자와 관계없이 에셋이 항상 인라인 처리됩니다.
:::

## build.cssCodeSplit {#build-csscodesplit}

- **타입:** `boolean`
- **기본값:** `true`

CSS 코드 분할을 활성화/비활성화합니다. 활성화된 경우 비동기 JS 청크로 가져온 CSS 코드가 청크로 유지되고, 이후 청크를 가져올 때 함께 가져오게 됩니다.

비활성화된 경우, 전체 프로젝트의 모든 CSS가 단일 CSS 파일로 추출됩니다.

::: tip 참고
만약 `build.lib`으로 지정하게 되면, `build.cssCodeSplit`이 기본적으로 `false`가 됩니다.
:::

## build.cssTarget {#build-csstarget}

- **타입:** `string | string[]`
- **기본값:** [`build.target`](#build-target)과 동일

이 옵션을 사용하면 CSS 축소 시 타깃이 되는 브라우저를 설정할 수 있습니다.

일반적으로 비주류 브라우저를 대상으로 하는 경우에만 사용되며, Android WeChat WebView를 예로 들 수 있습니다.
이 브라우저는 대부분의 최신 JavaScript 문법을 지원하지만 [16진수 CSS 색상 표기법인 `#RGBA`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors)를 지원하지 않습니다.
이런 경우, Vite가 `rgba()` 색상을 `#RGBA` 16진수 표기법으로 변환하지 않도록 `build.cssTarget`을 `chrome61`로 설정해야 합니다.

## build.cssMinify {#build-cssminify}

- **타입:** `boolean | 'esbuild' | 'lightningcss'`
- **기본값:** 클라이언트는 [`build.minify`](#build-minify)와 동일, SSR은 `'esbuild'`

이 옵션을 사용하면 기본값이 `build.minify`로 설정되는 대신 CSS 축소화를 구체적으로 재정의할 수 있으므로, JS와 CSS를 별도로 축소화할 수 있습니다. Vite는 기본적으로 `esbuild`를 사용해 CSS를 축소화하지만, 옵션을 `'lightningcss'`로 설정하면 [Lightning CSS](https://lightningcss.dev/minification.html)를 사용할 수도 있습니다. 이를 선택한 경우, [`css.lightningcss`](./shared-options.md#css-lightningcss)를 통해 설정이 가능합니다.

## build.sourcemap {#build-sourcemap}

- **타입:** `boolean | 'inline' | 'hidden'`
- **기본값:** `false`

프로덕션에서 소스 맵을 생성합니다. `true`인 경우 별도의 소스 맵 파일이 생성됩니다. `'inline'`인 경우 소스 맵이 결과 출력 파일에 데이터 URI로 추가됩니다. `'hidden'`은 번들 파일의 해당 소스 맵 설명이 표시되지 않는 경우를 제외하고 `true`와 같이 작동합니다.

## build.rollupOptions {#build-rollupoptions}

- **타입:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

기존 Rollup 번들을 커스텀합니다. 이는 Rollup 설정 파일에서 내보낼 수 있는 옵션과 같으며 Vite의 내부 Rollup 옵션과 병합됩니다. 더 자세한 점은 [Rollup 옵션 문서](https://rollupjs.org/configuration-options/)를 참고하세요.

## build.commonjsOptions {#build-commonjsoptions}

- **타입:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

[@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs)에 전달할 옵션입니다.

## build.dynamicImportVarsOptions {#build-dynamicimportvarsoptions}

- **타입:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **관련 항목:** [동적 Import](/guide/features#dynamic-import)

[@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars)에 전달할 옵션입니다.

## build.lib {#build-lib}

- **타입:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **관련 항목:** [라이브러리 모드](/guide/build#library-mode)

라이브러리로 빌드합니다. 라이브러리에서 HTML을 진입점으로 사용할 수 없으므로, `entry`가 필요합니다. `name`은 노출된 전역 변수이며 `formats`가 `'umd'` 또는 `'iife'` 일 때 필요합니다. `formats` 기본값은 `['es', 'umd']` 이나, 여러 진입점이 존재한다면 `['es', 'cjs']`가 됩니다.

`fileName`은 패키지 파일 출력의 이름이며, 기본값은 `package.json`의 `"name"` 입니다. `format`과 `entryName`을 인자로 받아 파일 이름을 반환하는 함수로도 정의할 수 있습니다.

패키지가 CSS를 임포트한다면 `cssFileName`을 사용하여 CSS 파일 출력의 이름을 지정할 수도 있습니다. `fileName`이 문자열로 설정되었다면 이를 기본값으로 사용하며, 그렇지 않다면 `package.json`의 `"name"` 값을 사용합니다.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.license

- **Type:** `boolean | { fileName?: string }`
- **Default:** `false`
- **Related:** [License](/guide/features#license)

When set to `true`, the build will generate a `.vite/license.md` file that includes all bundled dependencies' licenses.

If `fileName` is passed, it will be used as the license file name relative to the `outDir`. If it ends with `.json`, the raw JSON metadata will be generated instead and can be used for further processing. For example:

```json
[
  {
    "name": "dep-1",
    "version": "1.2.3",
    "identifier": "CC0-1.0",
    "text": "CC0 1.0 Universal\n\n..."
  },
  {
    "name": "dep-2",
    "version": "4.5.6",
    "identifier": "MIT",
    "text": "MIT License\n\n..."
  }
]
```

::: tip
If you'd like to reference the license file in the built code, you can use `build.rollupOptions.output.banner` to inject a comment at the top of the files. For example:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
    rollupOptions: {
      output: {
        banner:
          '/* See licenses of bundled dependencies at https://example.com/license.md */',
      },
    },
  },
})
```

:::

## build.manifest {#build-manifest}

- **타입:** `boolean | string`
- **기본값:** `false`
- **관련 항목:** [백엔드 프레임워크와 함께 사용하기](/guide/backend-integration)

해시되지 않은 에셋 파일 이름과 해시된 버전 간 매핑을 포함하는 매니패스트 파일을 생성할지 여부입니다. 이는 서버 프레임워크에서 올바른 에셋 링크를 렌더링하는 데 사용될 수 있습니다.

값이 문자열이면 `build.outDir`을 기준으로 하는 매니페스트 파일 경로로 사용됩니다. `true`면 `.vite/manifest.json`이 경로가 됩니다.

## build.ssrManifest {#build-ssrmanifest}

- **타입:** `boolean | string`
- **기본값:** `false`
- **관련 항목:** [서버 측 렌더링](/guide/ssr)

프로덕션 환경에서 필요한 스타일 링크 및 에셋 프리로드 디렉티브를 식별하는 데 사용되는 SSR 매니페스트 파일을 생성할지 여부입니다.

값이 문자열이면 `build.outDir`을 기준으로 하는 매니페스트 파일 경로로 사용됩니다. `true`면 `.vite/ssr-manifest.json`이 경로가 됩니다.

## build.ssr {#build-ssr}

- **타입:** `boolean | string`
- **기본값:** `false`
- **관련 항목:** [서버 측 렌더링](/guide/ssr)

서버 측 렌더링으로 빌드합니다. 설정 값은 SSR 항목을 직접 지정하는 문자열이거나, `rollupOptions.input`을 통해 SSR 항목을 지정해야 하는 `true`가 될 수 있습니다.

## build.emitAssets {#build-emitassets}

- **타입:** `boolean`
- **기본값:** `false`

클라이언트가 아닌 빌드 중에는 정적 에셋이 생성되지 않습니다. 이는 해당 에셋들이 클라이언트 빌드의 일부로 생성될 것으로 가정되기 때문입니다. 이 옵션은 프레임워크가 다른 환경의 빌드에서 에셋을 강제로 생성할 수 있게 해줍니다. 빌드 후 단계에서 에셋을 병합하는 것은 프레임워크의 책임입니다.

## build.ssrEmitAssets {#build-ssremitassets}

- **타입:** `boolean`
- **기본값:** `false`

SSR 빌드 중에는 정적 에셋이 따로 생성되지 않는데, 이는 클라이언트 빌드의 일부에 포함될 것으로 간주하기 때문입니다. 다만 필요한 경우 이 옵션을 사용하여 클라이언트와 SSR 빌드 모두에서 에셋을 생성하도록 강제할 수 있습니다. 이 경우 프레임워크는 빌드 이후 단계에서 에셋을 병합하는 것이 필요합니다. 이 옵션은 환경 API가 안정화되면 `build.emitAssets`로 대체될 예정입니다.

## build.minify {#build-minify}

- **타입:** `boolean | 'terser' | 'esbuild'`
- **기본값:** 클라이언트 빌드에는 `'esbuild'`를, SSR 빌드에는 `false`를 사용

코드 경량화를 사용하지 않으려면 `false`로 설정하거나, 사용할 코드 경량화 도구를 지정하세요. 기본값은 [Esbuild](https://github.com/evanw/esbuild)로, Terser보다 20에서 40배가량 빠르며 압축률 또한 1 ~ 2%밖에 떨어지지 않습니다.

참고로 `build.minify` 옵션은 `'es'`를 사용하는 라이브러리 모드에서 공백을 축소화하지 않습니다. 이는 Pure 애노테이션(`@__PURE__`)을 제거하고, 또 트리 셰이킹을 제대로 동작하지 못하게 만들기 때문입니다.

`'terser'`로 설정할 경우, Terser를 설치해야 합니다.

```sh
npm add -D terser
```

## build.terserOptions {#build-terseroptions}

- **타입:** `TerserOptions`

Terser로 전달할 추가적인 [경량화 옵션](https://terser.org/docs/api-reference#minify-options)입니다.

`maxWorkers: number` 옵션을 전달하여 생성할 최대 워커 수를 지정할 수도 있습니다. 기본값은 CPU 수에서 1을 뺀 값입니다.

## build.write {#build-write}

- **타입:** `boolean`
- **기본값:** `true`

번들을 생성할 때 디스크에 기록하지 않으려면 `false`로 설정하세요. 이것은 디스크에 쓰기 전에 번들의 추가 후처리가 필요한 [프로그래밍 방식 `build()` 호출](/guide/api-javascript#build)에서 주로 사용됩니다.

## build.emptyOutDir {#build-emptyoutdir}

- **타입:** `boolean`
- **기본값:** `outDir`이 `root` 안에 있다면 `true`

기본적으로 Vite는 `outDir`이 프로젝트 루트 내부에 있는 경우 빌드할 때 이 곳을 비웁니다. `outDir`가 루트 외부에 있으면 실수로 중요한 파일을 제거하지 않도록 경고 메시지가 표시됩니다. 경고를 표시하지 않도록 이 옵션을 명시적으로 설정할 수 있습니다. 명령 줄에서는 `--emptyOutDir`로 이를 사용할 수 있습니다.

## build.copyPublicDir {#build-copypublicdir}

- **타입:** `boolean`
- **기본값:** `true`

기본적으로 Vite는 빌드할 때 `publicDir`에서 `outDir`로 파일을 복사합니다. 이를 비활성화하려면 `false`로 설정하세요.

## build.reportCompressedSize {#build-reportcompressedsize}

- **타입:** `boolean`
- **기본값:** `true`

gzip 압축 크기 리포트를 활성화/비활성화합니다. 큰 출력 파일을 압축하는 경우 속도가 느릴 수 있으므로, 이를 사용하지 않도록 설정하면 대규모 프로젝트의 빌드 성능이 향상될 수 있습니다.

## build.chunkSizeWarningLimit {#build-chunksizewarninglimit}

- **타입:** `number`
- **기본값:** `500`

경고를 표시할 청크 크기의 경계(단위: kB). [자바스크립트 크기 자체가 실행 시간과 관련이 있기 때문에](https://v8.dev/blog/cost-of-javascript-2019), 압축되지 않은 청크 크기를 기준으로 비교합니다.

## build.watch {#build-watch}

- **타입:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **기본값:** `null`

Rollup 감시자를 사용하려면 `{}`로 설정하세요. 이는 대부분 빌드 전용 플러그인 또는 통합 프로세스를 포함하는 경우에 사용됩니다.

::: warning Windows Subsystem for Linux (WSL) 2 에서 Vite 사용하기

파일 시스템 변경사항 감시가 WSL2에서 동작하지 않는 경우가 있습니다.
자세한 사항은 [`server.watch`](./server-options.md#server-watch)를 참고해주세요.

:::