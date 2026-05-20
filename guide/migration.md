# v7에서 마이그레이션하기 {#migration-from-v7}

Vite v6 및 v7을 위해 Rolldown이 통합된 Vite 기술 프리뷰 릴리스인 `rolldown-vite`에서 마이그레이션하는 경우, 제목에 <Badge text="NRV" type="warning" />가 있는 섹션만 적용됩니다.

## 기본 브라우저 타깃 변경 [<Badge text="NRV" type="warning" />](#migration-from-v7) {#default-browser-target-change}

`build.target`의 기본 브라우저 값과 `'baseline-widely-available'`이 더 새로운 브라우저 버전으로 업데이트되었습니다:

- Chrome 107 → 111
- Edge 107 → 111
- Firefox 104 → 114
- Safari 16.0 → 16.4

이 브라우저 버전들은 2026-01-01 기준 [Baseline Widely Available](https://web-platform-dx.github.io/web-features/) 기능 세트와 일치합니다. 즉, 모두 약 2년 반 전에 릴리스된 버전입니다.

## Rolldown {#rolldown}

Vite 8은 [esbuild](https://esbuild.github.io/)와 [Rollup](https://rollupjs.org/) 대신 [Rolldown](https://rolldown.rs/) 및 [Oxc](https://oxc.rs/) 기반 도구를 사용합니다.

### 점진적 마이그레이션 {#gradual-migration}

`rolldown-vite` 패키지는 다른 Vite 8 변경 없이 Rolldown이 적용된 Vite 7을 구현합니다. 이는 Vite 8로 마이그레이션하기 위한 중간 단계로 사용할 수 있습니다. Vite 7에서 `rolldown-vite`로 전환하려면 Vite 7 문서의 [Rolldown 통합 가이드](https://v7.vite.dev/guide/rolldown)를 참고하세요.

`rolldown-vite`에서 Vite 8로 마이그레이션하는 사용자는 `package.json`의 디펜던시 변경을 되돌리고 Vite 8로 업데이트할 수 있습니다:

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2" // [!code --]
    "vite": "^8.0.0" // [!code ++]
  }
}
```

### 디펜던시 최적화 도구가 이제 Rolldown을 사용합니다 {#dependency-optimizer-now-uses-rolldown}

이제 디펜던시 최적화에는 esbuild 대신 Rolldown이 사용됩니다. Vite는 하위 호환성을 위해 [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions)를 계속 지원하며, 이를 자동으로 [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions)로 변환합니다. `optimizeDeps.esbuildOptions`는 이제 지원 중단되었고 향후 제거될 예정이므로 `optimizeDeps.rolldownOptions`로 마이그레이션하는 것을 권장합니다.

다음 옵션은 자동으로 변환됩니다:

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> [`rolldownOptions.output.minify`](https://rolldown.rs/reference/OutputOptions.minify)
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> [`rolldownOptions.treeshake`](https://rolldown.rs/reference/InputOptions.treeshake)
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> [`rolldownOptions.transform.define`](https://rolldown.rs/reference/InputOptions.transform#define)
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> [`rolldownOptions.moduleTypes`](https://rolldown.rs/reference/InputOptions.moduleTypes)
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> [`!rolldownOptions.resolve.symlinks`](https://rolldown.rs/reference/InputOptions.resolve#symlinks)
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> [`rolldownOptions.resolve.extensions`](https://rolldown.rs/reference/InputOptions.resolve#extensions)
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> [`rolldownOptions.resolve.mainFields`](https://rolldown.rs/reference/InputOptions.resolve#mainfields)
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> [`rolldownOptions.resolve.conditionNames`](https://rolldown.rs/reference/InputOptions.resolve#conditionnames)
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> [`rolldownOptions.output.keepNames`](https://rolldown.rs/reference/OutputOptions.keepNames)
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> [`rolldownOptions.platform`](https://rolldown.rs/reference/InputOptions.platform)
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> [`rolldownOptions.plugins`](https://rolldown.rs/reference/InputOptions.plugins) (부분 지원)

호환성 레이어가 설정한 옵션은 `configResolved` 훅에서 확인할 수 있습니다:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps.rolldownOptions)
  },
},
```

### Oxc를 통한 JavaScript 변환 {#javascript-transforms-by-oxc}

이제 JavaScript 변환에는 esbuild 대신 Oxc가 사용됩니다. Vite는 하위 호환성을 위해 [`esbuild`](/config/shared-options#esbuild) 옵션을 계속 지원하며, 이를 자동으로 [`oxc`](/config/shared-options#oxc)로 변환합니다. `esbuild`는 이제 지원 중단되었고 향후 제거될 예정이므로 `oxc`로 마이그레이션하는 것을 권장합니다.

다음 옵션은 자동으로 변환됩니다:

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
- [`esbuild.jsx`](https://esbuild.github.io/api/#jsx) -> [`oxc.jsx`](https://oxc.rs/docs/guide/usage/transformer/jsx)
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
  - `esbuild.jsx: 'automatic'` -> `oxc.jsx: { runtime: 'automatic' }`
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
  - `esbuild.jsx: 'transform'` -> `oxc.jsx: { runtime: 'classic' }`
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> transform 훅을 사용하는 커스텀 플러그인
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> transform 훅을 사용하는 커스텀 플러그인

[`esbuild.supported`](https://esbuild.github.io/api/#supported) 옵션은 Oxc에서 지원되지 않습니다. 이 옵션이 필요하다면 [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373)을 참고하세요.

호환성 레이어가 설정한 옵션은 `configResolved` 훅에서 확인할 수 있습니다:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
  },
},
```

현재 Oxc transformer는 사양이 진전되기를 기다리고 있어 네이티브 데코레이터 낮추기를 지원하지 않습니다. ([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170))를 참고하세요.

:::: details 네이티브 데코레이터 낮추기를 위한 우회 방법

당분간 네이티브 데코레이터를 낮추려면 [Babel](https://babeljs.io/) 또는 [SWC](https://swc.rs/)를 사용할 수 있습니다.

**Babel 사용:**

::: code-group

```bash [npm]
$ npm install -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Yarn]
$ yarn add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [pnpm]
$ pnpm add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Bun]
$ bun add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Deno]
$ deno add -D npm:@rolldown/plugin-babel npm:@babel/plugin-proposal-decorators
```

:::

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'

function decoratorPreset(options: Record<string, unknown>) {
  return {
    preset: () => ({
      plugins: [['@babel/plugin-proposal-decorators', options]],
    }),
    rolldown: {
      // 파일에 데코레이터가 포함된 경우에만 이 변환을 실행합니다.
      filter: {
        code: '@',
      },
    },
  }
}

export default defineConfig({
  plugins: [babel({ presets: [decoratorPreset({ version: '2023-11' })] })],
})
```

**SWC 사용:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-swc @swc/core
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-swc @swc/core
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```

```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            transform: { decoratorVersion: '2023-11' },
          },
        },
      }),
      // 파일에 데코레이터가 포함된 경우에만 이 변환을 실행합니다.
      { transform: { code: '@' } },
    ),
  ],
})
```

::::

#### esbuild 폴백 {#esbuild-fallbacks}

`esbuild`는 더 이상 Vite에서 직접 사용되지 않으며 이제 선택적 디펜던시입니다. `transformWithEsbuild` 함수를 사용하는 플러그인을 사용 중이라면 `esbuild`를 `devDependency`로 설치해야 합니다. `transformWithEsbuild` 함수는 지원 중단되었고 향후 제거될 예정입니다. 대신 새로운 `transformWithOxc` 함수로 마이그레이션하는 것을 권장합니다.

### Oxc를 통한 JavaScript 최소화 {#javascript-minification-by-oxc}

이제 JavaScript 최소화에는 esbuild 대신 Oxc Minifier가 사용됩니다. esbuild로 다시 전환하려면 지원 중단된 [`build.minify: 'esbuild'`](/config/build-options#build-minify) 옵션을 사용할 수 있습니다. 이 설정 옵션은 향후 제거될 예정이며, Vite가 더 이상 esbuild에 직접 의존하지 않으므로 `esbuild`를 `devDependency`로 설치해야 합니다.

최소화 동작을 제어하기 위해 `esbuild.minify*` 옵션을 사용하고 있었다면 이제 대신 `build.rolldownOptions.output.minify`를 사용할 수 있습니다. `esbuild.drop` 옵션을 사용하고 있었다면 이제 [`build.rolldownOptions.output.minify.compress.drop*` 옵션](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination)을 사용할 수 있습니다.

프로퍼티 맹글링과 관련 옵션([`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`](https://esbuild.github.io/api/#mangle-props))은 Oxc에서 지원되지 않습니다. 이러한 옵션이 필요하다면 [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375)를 참고하세요.

esbuild와 Oxc Minifier는 소스 코드에 대해 약간 다른 가정을 합니다. 최소화 도구 때문에 코드가 깨진다고 의심된다면 다음 문서에서 이러한 가정을 비교할 수 있습니다:

- [esbuild minify assumptions](https://esbuild.github.io/api/#minify-considerations)
- [Oxc Minifier assumptions](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)

JavaScript 앱에서 최소화와 관련된 문제를 발견하면 보고해 주세요.

### Lightning CSS를 통한 CSS 최소화 {#css-minification-by-lightning-css}

이제 CSS 최소화에는 기본적으로 [Lightning CSS](https://lightningcss.dev/)가 사용됩니다. esbuild로 다시 전환하려면 [`build.cssMinify: 'esbuild'`](/config/build-options#build-cssminify) 옵션을 사용할 수 있습니다. 이 경우 `esbuild`를 `devDependency`로 설치해야 합니다.

Lightning CSS는 더 나은 문법 낮추기를 지원하며, CSS 번들 크기가 약간 증가할 수 있습니다.

### 일관된 CommonJS 상호 운용성 {#consistent-commonjs-interop}

CommonJS(CJS) 모듈의 `default` 임포트가 이제 일관된 방식으로 처리됩니다.

다음 조건 중 하나와 일치하면 `default` 임포트는 임포트 대상 CJS 모듈의 `module.exports` 값입니다. 그렇지 않으면 `default` 임포트는 임포트 대상 CJS 모듈의 `module.exports.default` 값입니다:

- 임포터가 `.mjs` 또는 `.mts`입니다.
- 임포터에 가장 가까운 `package.json`의 `type` 필드가 `module`로 설정되어 있습니다.
- 임포트 대상 CJS 모듈의 `module.exports.__esModule` 값이 true로 설정되어 있지 않습니다.

::: details 이전 동작

개발 중에는 다음 조건 중 하나와 일치하면 `default` 임포트가 임포트 대상 CJS 모듈의 `module.exports` 값이었습니다. 그렇지 않으면 `default` 임포트는 임포트 대상 CJS 모듈의 `module.exports.default` 값이었습니다:

- _임포터가 디펜던시 최적화에 포함되어 있고_ `.mjs` 또는 `.mts`입니다.
- _임포터가 디펜던시 최적화에 포함되어 있고_ 임포터에 가장 가까운 `package.json`의 `type` 필드가 `module`로 설정되어 있습니다.
- 임포트 대상 CJS 모듈의 `module.exports.__esModule` 값이 true로 설정되어 있지 않습니다.

빌드에서는 조건이 다음과 같았습니다:

- 임포트 대상 CJS 모듈의 `module.exports.__esModule` 값이 true로 설정되어 있지 않습니다.
- _`module.exports`의 `default` 프로퍼티가 존재하지 않습니다_.

([`build.commonjsOptions.defaultIsModuleExports`](https://github.com/rollup/plugins/tree/master/packages/commonjs#defaultismoduleexports)가 기본값 `'auto'`에서 변경되지 않았다고 가정)

:::

이 문제에 대한 자세한 내용은 Rolldown 문서를 참고하세요: [Ambiguous `default` import from CJS modules - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules).

이 변경은 CJS 모듈을 임포트하는 기존 코드 일부를 깨뜨릴 수 있습니다. 지원 중단된 `legacy.inconsistentCjsInterop: true` 옵션을 사용하면 이전 동작을 임시로 복원할 수 있습니다. 이 변경의 영향을 받는 패키지를 발견하면 패키지 작성자에게 보고하거나 PR을 보내 주세요. 작성자가 맥락을 이해할 수 있도록 위의 Rolldown 문서를 함께 링크해 주세요.

### 포맷 스니핑을 통한 모듈 해석 제거 {#removed-module-resolution-using-format-sniffing}

`package.json`에 `browser`와 `module` 필드가 모두 있는 경우, Vite는 파일 내용에 따라 필드를 해석하고 브라우저용 ESM 파일을 선택하곤 했습니다. 이는 일부 패키지가 Node.js용 ESM 파일을 가리키기 위해 `module` 필드를 사용하고, 다른 일부 패키지가 브라우저용 UMD 파일을 가리키기 위해 `browser` 필드를 사용했기 때문에 도입되었습니다. 최신 `exports` 필드가 이 문제를 해결했고 많은 패키지에서 채택되었으므로, Vite는 더 이상 이 휴리스틱을 사용하지 않고 항상 [`resolve.mainFields`](/config/shared-options#resolve-mainfields) 옵션의 순서를 따릅니다. 이 동작에 의존하고 있었다면 [`resolve.alias`](/config/shared-options#resolve-alias) 옵션을 사용해 필드를 원하는 파일로 매핑하거나 패키지 매니저로 패치를 적용할 수 있습니다(예: `patch-package`, `pnpm patch`).

### 외부화된 모듈에 대한 Require 호출 {#require-calls-for-externalized-modules}

외부화된 모듈에 대한 `require` 호출은 이제 `import` 문으로 변환되지 않고 `require` 호출로 보존됩니다. 이는 `require` 호출의 의미를 보존하기 위한 것입니다. 이를 `import` 문으로 변환하고 싶다면 Vite에서 다시 내보내는 [Rolldown의 내장 `esmExternalRequirePlugin`](https://rolldown.rs/builtin-plugins/esm-external-require)을 사용할 수 있습니다.

```js
import { defineConfig, esmExternalRequirePlugin } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    esmExternalRequirePlugin({
      external: ['react', 'vue', /^node:/],
    }),
  ],
})
```

자세한 내용은 Rolldown 문서를 참고하세요: [`require` external modules - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules).

### UMD / IIFE에서의 `import.meta.url` {#import-meta-url-in-umd-iife}

`import.meta.url`은 더 이상 UMD / IIFE 출력 형식에서 폴리필되지 않습니다. 기본적으로 `undefined`로 대체됩니다. 이전 동작을 선호한다면 [`build.rolldownOptions.output.intro`](https://rolldown.rs/reference/OutputOptions.intro) 옵션과 함께 [`define`](/config/shared-options#define) 옵션을 사용할 수 있습니다. 자세한 내용은 Rolldown 문서를 참고하세요: [Well-known `import.meta` properties - Non ESM Output Formats | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties).

### `build.rollupOptions.watch.chokidar` 옵션 제거 {#removed-build-rollupoptions-watch-chokidar-option}

`build.rollupOptions.watch.chokidar` 옵션이 제거되었습니다. [`build.rolldownOptions.watch.watcher`](https://rolldown.rs/reference/InputOptions.watch#watcher) 옵션으로 마이그레이션하세요.

### `build.rollupOptions.output.manualChunks` 객체 형식 제거 및 함수 형식 지원 중단 {#removed-object-form-build-rollupoptions-output-manualchunks-and-deprecate-function-form-one}

`output.manualChunks` 옵션의 객체 형식은 더 이상 지원되지 않습니다. `output.manualChunks`의 함수 형식은 지원 중단되었습니다. Rolldown에는 더 유연한 [`codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting) 옵션이 있습니다. `codeSplitting`에 대한 자세한 내용은 Rolldown 문서를 참고하세요: [Manual Code Splitting - Rolldown](https://rolldown.rs/in-depth/manual-code-splitting).

### `build()`가 `BundleError`를 던집니다 {#build-throws-bundleerror}

_이 변경은 JS API 사용자에게만 영향을 줍니다._

`build()`는 이제 플러그인에서 던진 원본 오류 대신 [`BundleError`](https://rolldown.rs/reference/TypeAlias.BundleError)를 던집니다. `BundleError`는 `Error & { errors?: RolldownError[] }` 타입이며, 개별 오류를 `errors` 배열로 감쌉니다. 개별 오류가 필요하다면 `.errors`에 접근해야 합니다:

```js
try {
  await build()
} catch (e) {
  if (e.errors) {
    for (const error of e.errors) {
      console.log(error.code) // error code
    }
  }
}
```

### 모듈 타입 지원 및 자동 감지 {#module-type-support-and-auto-detection}

_이 변경은 플러그인 개발자에게만 영향을 줍니다._

Rolldown은 [모듈 타입](https://rolldown.rs/guide/notable-features#module-types)에 대한 실험적 지원을 제공합니다. 이는 [esbuild의 `loader` 옵션](https://esbuild.github.io/api/#loader)과 유사합니다. 이로 인해 Rolldown은 해석된 id의 확장자를 기준으로 모듈 타입을 자동 설정합니다. `load` 또는 `transform` 훅에서 다른 모듈 타입의 콘텐츠를 JavaScript로 변환하고 있다면 반환값에 `moduleType: 'js'`를 추가해야 할 수 있습니다:

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

### 기타 관련 지원 중단 {#other-related-deprecations}

다음 옵션들은 지원 중단되었으며 향후 제거될 예정입니다:

- `build.rollupOptions`: `build.rolldownOptions`로 이름이 변경되었습니다.
- `worker.rollupOptions`: `worker.rolldownOptions`로 이름이 변경되었습니다.
- `build.commonjsOptions`: 이제 no-op입니다.
- `build.dynamicImportVarsOptions.warnOnError`: 이제 no-op입니다.
- `resolve.alias[].customResolver`: 대신 `resolveId` 훅과 `enforce: 'pre'`를 사용하는 커스텀 플러그인을 사용하세요.

## 지원 중단된 기능 제거 [<Badge text="NRV" type="warning" />](#migration-from-v7) {#removed-deprecated-features}

- `import.meta.hot.accept`에 URL을 전달하는 것은 더 이상 지원되지 않습니다. 대신 id를 전달하세요. ([#21382](https://github.com/vitejs/vite/pull/21382))

## 고급 {#advanced}

다음 호환성이 깨지는 변경 사항들은 소수의 사용 사례에만 영향을 줄 것으로 예상됩니다:

- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs)는 아직 지원되지 않습니다. ([rolldown-vite#365](https://github.com/vitejs/rolldown-vite/issues/365))
- TypeScript 레거시 namespace는 부분적으로만 지원됩니다. 자세한 내용은 [Oxc Transformer 관련 문서](https://oxc.rs/docs/guide/usage/transformer/typescript.html#partial-namespace-support)를 참고하세요.
- `define`은 객체에 대한 참조를 공유하지 않습니다: `define`에 객체를 값으로 전달하면 각 변수는 해당 객체의 별도 복사본을 갖습니다. 자세한 내용은 [Oxc Transformer 관련 문서](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)를 참고하세요.
- `bundle` 객체 변경 사항(`bundle`은 `generateBundle` / `writeBundle` 훅에 전달되고 `build` 함수가 반환하는 객체입니다):
  - `bundle[foo]`에 할당하는 것은 지원되지 않습니다. Rollup에서도 권장되지 않습니다. 대신 `this.emitFile()`을 사용하세요.
  - 훅 사이에서 참조가 공유되지 않습니다. ([rolldown-vite#410](https://github.com/vitejs/rolldown-vite/issues/410))
  - `structuredClone(bundle)`은 `DataCloneError: #<Object> could not be cloned` 오류를 발생시킵니다. 이는 더 이상 지원되지 않습니다. `structuredClone({ ...bundle })`로 복제하세요. ([rolldown-vite#128](https://github.com/vitejs/rolldown-vite/issues/128))
- Rollup의 모든 병렬 훅은 순차 훅처럼 동작합니다. 자세한 내용은 [Rolldown 문서](https://rolldown.rs/apis/plugin-api#sequential-hook-execution)를 참고하세요.
- `"use strict";`가 때때로 주입되지 않습니다. 자세한 내용은 [Rolldown 문서](https://rolldown.rs/in-depth/directives)를 참고하세요.
- plugin-legacy로 ES5 이하로 변환하는 것은 지원되지 않습니다. ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))
- 동일한 브라우저를 여러 버전으로 `build.target` 옵션에 전달하면 이제 오류가 발생합니다. esbuild는 그중 최신 버전을 선택했지만, 이는 의도한 동작이 아니었을 가능성이 큽니다.
- Rolldown의 미지원 항목: 다음 기능은 Rolldown에서 지원되지 않으며 Vite에서도 더 이상 지원되지 않습니다.
  - `build.rollupOptions.output.format: 'system'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2387))
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2528))
  - `shouldTransformCachedModule` 훅 ([rolldown#4389](https://github.com/rolldown/rolldown/issues/4389))
  - `resolveImportMeta` 훅 ([rolldown#1010](https://github.com/rolldown/rolldown/issues/1010))
  - `renderDynamicImport` 훅 ([rolldown#4532](https://github.com/rolldown/rolldown/issues/4532))
  - `resolveFileUrl` 훅
- `parseAst` / `parseAstAsync` 함수는 더 많은 기능을 가진 `parseSync` / `parse` 함수를 위해 지원 중단되었습니다.
- 주석은 `renderChunk` 훅 이후가 아니라 이전에 제거됩니다.
- [여기](https://rolldown.rs/reference/OutputOptions.comments)에 나열된 주석 외의 주석은 이동될 수 있습니다. Rollup은 인접 코드가 제거되는 경우에만 주석을 제거합니다.

## v6에서 마이그레이션하기 {#migration-from-v6}

먼저 Vite v7 문서의 [v6에서 마이그레이션하기](https://v7.vite.dev/guide/migration) 가이드를 확인해 앱을 Vite 7로 포팅하는 데 필요한 변경 사항을 적용한 다음, 이 페이지의 변경 사항을 진행하세요.
