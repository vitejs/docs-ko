# v4에서 마이그레이션하기 {#migration-from-v4}

## Node.js 지원 {#node-js-support}

Vite는 더 이상 EOL에 도달한 Node.js 14 / 16 / 17 / 19를 지원하지 않습니다. Node.js 18 / 20+이 필요합니다.

## Rollup 4 {#rollup-4}

Vite는 이제 Rollup 4를 사용하며, 이 변경 사항은 특정 부분에 영향을 끼칠 수 있습니다.    

- Import assertion(`assertions` 속성)은 import attributes(`attributes` 속성)으로 표현을 바꾸었습니다.
- Acorn 플러그인을 더 이상 지원하지 않습니다.
- Vite 플러그인의 `this.resolve` `skipSelf` 옵션은 이제 기본적으로 `true`입니다.
- Vite 플러그인의 `this.parse`는 현재 일시적으로 `allowReturnOutsideFunction` 옵션만을 지원합니다.  

[`build.rollupOptions`](/config/build-options.md#build-rollupoptions)에서 빌드와 관련되어 바뀐 부분을 확인하려면, [Rollup 4 릴리즈 노트](https://github.com/rollup/rollup/releases/tag/v4.0.0)의 변경 사항을 참고해 주세요.

## CJS Node API 사용 중단 {#deprecate-cjs-node-api}

Vite의 CJS Node API는 더 이상 제공되지 않습니다. `require('vite')` 호출 시 경고가 나타나며, 이 대신 파일이나 프레임워크를 업데이트하여 Vite의 ESM 빌드를 가져오도록 해야 합니다.

표준 Vite 프로젝트에서 다음을 확인해 주세요:

1. `vite.config.js` 파일에서 ESM 문법을 사용하고 있습니다.
2. 가장 가까운 `package.json` 파일에 `"type": "module"`이 있거나 `.mjs`/`.mts` 확장자(예: `vite.config.mjs` 또는 `vite.config.mts`)를 사용하고 있습니다.

다른 프로젝트의 경우, 몇 가지 일반적인 접근 방식이 있습니다:

- **ESM을 기본값으로 설정하고, 필요한 경우 CJS를 사용:** 프로젝트 `package.json`에 `"type": "module"`을 추가하세요. 이후 모든 `*.js` 파일은 ESM으로 해석되며 ESM 문법을 사용해야 합니다. 다만 확장자가 `.cjs`인 파일은 CJS로 해석됩니다.
- **CJS를 기본값으로 유지하고, 필요한 경우 ESM을 사용:** 프로젝트 `package.json`에 `"type": "module"`이 없다면, 모든 `*.js` 파일은 CJS로 해석됩니다. 다만 확장자가 `.mjs`인 파일은 ESM으로 해석됩니다.
- **Vite를 동적으로 임포트:** CJS를 계속 사용해야 하는 경우, `import('vite')`를 사용하여 Vite를 동적으로 임포트할 수 있습니다. 이를 위해 코드가 `async` 컨텍스트에서 작성되어야 하지만, Vite의 API가 대부분 비동기적이기 때문에 일반적으로 문제가 되지 않습니다.

자세한 내용은 [트러블슈팅 가이드](/guide/troubleshooting.html#vite-cjs-node-api-deprecated)를 참조하세요.

## `define` 및 `import.meta.env.*` 치환 방식 변경 {#rework-define-and-import-meta-env-replacement-strategy}

Vite 4에서 [`define`](/config/shared-options.md#define) 및 [`import.meta.env.*`](/guide/env-and-mode.md#env-variables) 기능은 개발과 빌드 단계에서 서로 다른 치환 방식을 사용하고 있습니다:

- 개발 단계에서는 두 기능 모두 `globalThis`와 `import.meta`에 전역 변수로 주입됩니다.
- 빌드 단계에서는 두 기능 모두 정규식을 사용하여 정적으로 치환됩니다.

이에 따라 변수 접근 시 개발과 빌드 단계에서 일관성이 없어지며, 때로는 빌드가 실패하기도 합니다. 예를 들어:

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// dev: { __APP_VERSION__: "1.0.0" } ✅
// build: { "1.0.0" } ❌

const docs = 'I like import.meta.env.MODE'
// dev: "I like import.meta.env.MODE" ✅
// build: "I like "production"" ❌
```

Vite 5에서는 `esbuild`를 사용해 빌드 시 치환하는 방식으로 일관성을 유지하도록 하였습니다.

이 변경 사항은 대부분의 환경설정에는 영향을 미치지 않습니다. 이미 `define` 값은 esbuild의 문법을 따라야 한다는 사실이 문서화되어 있기 때문입니다:

> esbuild와의 일관성을 유지하기 위해, 표현식은 JSON 객체(null, boolean, number, string, array, 또는 object)이거나 단일 식별자여야 합니다.

만약 값을 직접 정적으로 치환하는 것을 선호한다면, [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace) 플러그인을 사용해 주세요.

## 일반 변경 사항 {#general-changes}

### 이제 SSR 외부화 모듈은 프로덕션과 일치 {#ssr-externalized-modules-value-now-matches-production}

Vite 4에서는 상호 운용성을 위해 SSR 외부화 모듈이 `.default`와 `.__esModule`로 접근하도록 래핑 되었으나, 이는 런타임 환경(예: Note.js)에서 로드될 때 프로덕션에서의 동작과 일치하지 않았기에, 일관성 측면에서 파악하기 어려운 문제를 발생시켰습니다. 참고로 기본적으로 링크되지 않은 모든 프로젝트 디펜던시는 SSR 외부화됩니다.

Vite 5에서는 프로덕션과 일치하도록 `.default` 및 `.__esModule` 처리를 제거했습니다. 일반적으로 올바르게 패키징된 디펜던시에는 영향을 미치지 않으나, 모듈 로드에 문제가 발생하는 경우 다음 방법을 시도해 볼 수 있습니다:

```js
// Before:
import { foo } from 'bar'

// After:
import _bar from 'bar'
const { foo } = _bar
```

```js
// Before:
import foo from 'bar'

// After:
import * as _foo from 'bar'
const foo = _foo.default
```

이 변경 사항은 Node.js 동작과 일치하므로, Node.js에서 임포트해 테스트할 수도 있습니다. 만약 이전 동작을 유지하고자 한다면, `legacy.proxySsrExternalModules`를 `true`로 설정하세요.

### `worker.plugins` 옵션은 이제 함수를 전달받음 {#worker-plugins-is-now-a-function}

Vite 4에서의 [`worker.plugins`](/config/worker-options.md#worker-plugins) 옵션은 플러그인의 배열(`(Plugin | Plugin[])[]`)을 전달받았습니다. Vite 5에서는 플러그인의 배열을 반환하는 함수(`() => (Plugin | Plugin[])[]`)를 전달해야 합니다. 병렬 워커 빌드를 보다 일관되고 예측 가능하게 실행하기 위해 이와 같이 변경되었습니다.

### `.`를 포함하는 경로가 index.html로 폴백되도록 허용 {#allow-path-containing-to-fallback-to-index-html}

Vite 4에서는 [`appType`](/config/shared-options.md#apptype)이 기본값인 `spa`로 설정되어 있더라도 `.`을 포함하는 경로에 접근하면 index.html로 폴백되지 않았습니다. Vite 5에서는 index.html로 폴백됩니다.

이미지 경로를 존재하지 않는 파일(예: `<img src="./file-does-not-exist.png">`)로 지정해도 더 이상 브라우저에서 404 에러 메시지를 콘솔에 표시하지 않습니다.

### 개발 및 프리뷰 단계에서의 HTML 동작 일치 {#align-dev-and-preview-html-serving-behaviour}

Vite 4에서는 디렉터리 구조와 끝 슬래시에 따라 개발 서버와 프리뷰 서버가 HTML을 다르게 제공합니다. 이는 빌드된 앱을 테스트할 때 일관성을 떨어뜨리기 때문에, Vite 5에서는 하나의 동작으로 리팩토링 되었습니다. 예를 들어 다음과 같은 파일 구조가 있다고 가정했을 때, 아래 표와 같이 동작합니다:

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| 요청               | 이전 (개발)                    | 이전 (프리뷰)        | 이후 (개발 & 프리뷰)             |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (SPA 폴백)      | `/dir/index.html` | `/index.html` (SPA 폴백)      |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (SPA 폴백)      | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (SPA 폴백)      | `/file.html`      | `/index.html` (SPA 폴백)      |

### 매니페스트 파일은 이제 기본적으로 `.vite` 디렉터리에 생성됨 {#manifest-files-are-now-generated-in-vite-directory-by-default}

Vite 4에서는 매니페스트 파일([`build.manifest`](/config/build-options.md#build-manifest)와 [`build.ssrManifest`](/config/build-options.md#build-ssrmanifest))이 기본적으로 `build.outDir`의 루트에 생성되었습니다.

Vite 5에서는 [`build.outDir`](/config/build-options.md#build-outdir)의 `.vite` 디렉터리에 생성됩니다. 이 변경 사항은 동일한 매니페스트 파일 이름을 가진 public 파일이 `build.outDir`로 복사될 때 충돌을 방지하는 데 도움이 됩니다.

### CLI 단축키는 `Enter`를 눌러 실행해야 함 {#cli-shortcuts-require-an-additional-enter-press}

CLI 단축키(예: 개발 서버를 재시작하는 `r`)는 이제 명시적으로 `Enter`를 눌러야 실행됩니다. 예를 들어, 개발 서버를 재시작하려면 `r + Enter`를 누르면 됩니다.

이 변경으로 Vite가 OS별 단축키를 무시하고 제어하는 것을 방지하며, Vite 개발 서버를 다른 프로세스와 결합할 때 더 나은 호환성을 제공할 수 있게 되고, [이전의 주의 사항](https://github.com/vitejs/vite/pull/14342)을 피할 수 있습니다.

### `experimentalDecorators` 및 `useDefineForClassFields` TypeScript 동작 변경 {#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour}

Vite 5는 esbuild 0.19를 사용하며, esbuild 0.18의 호환성 계층도 제거해 [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)와 [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)가 처리되는 방식이 변경되었습니다.

- **`experimentalDecorators`는 기본적으로 활성화되지 않습니다.**

  데코레이터를 사용하려면 `tsconfig.json`의 `compilerOptions.experimentalDecorators`를 `true`로 설정해야 합니다.

- **`useDefineForClassFields`의 기본값은 TypeScript `target` 값에 따라 달라집니다.**

  `target`이 `ESNext` 또는 `ES2022` 이상이 아니거나, `tsconfig.json` 파일이 존재하지 않는 경우, `useDefineForClassFields`는 기본적으로 `false`로 설정되는데, 이를 `esbuild.target`의 기본값인 `esnext`와 함께 사용할 경우 문제가 발생할 수 있습니다. 이는 [정적 초기화 블록](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility)으로 트랜스파일링되어 브라우저에서 지원되지 않을 수 있기 때문입니다.

  따라서, `target`을 `ESNext` 또는 `ES2022` 이상으로 설정하거나, `tsconfig.json`을 구성할 때 `useDefineForClassFields`를 명시적으로 `true`로 설정하는 것을 권장합니다.

```jsonc
{
  "compilerOptions": {
    // 데코레이터를 사용하는 경우 true로 설정
    "experimentalDecorators": true,
    // 브라우저에서 구문 분석 오류가 발생하는 경우 true로 설정
    "useDefineForClassFields": true
  }
}
```

### `--https` 플래그 및 `https: true` 설정 제거 {#remove-https-flag-and-https-true}

`--https` 플래그는 내부적으로 `server.https: true`와 `preview.https: true`를 설정합니다. 이 설정은 [Vite 3에서 삭제되었던](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation) HTTPS 인증서 자동 생성 기능과 함께 사용하기 위해 만들어졌는데, 이를 적용해도 Vite는 인증서 없이 HTTPS 서버를 시작하므로, 더 이상 의미가 없습니다.

[`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) 또는 [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert)를 사용하고 있다면, 이미 내부적으로 `https` 설정이 되어 있으므로, `--https`, `server.https: true`, `preview.https: true`를 제거해도 됩니다.

### `resolvePackageEntry`와 `resolvePackageData` API 제거 {#remove-resolvepackageentry-and-resolvepackagedata-apis}

`resolvePackageEntry`와 `resolvePackageData` API는 Vite의 내부를 노출해 Vite 4.3의 최적화를 잠재적으로 가로막았기에 제거되었습니다. 이 API는 다음과 같은 서드파티 패키지로 대체할 수 있습니다:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) 또는 [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve) 패키지.
- `resolvePackageData`: 위와 동일하며, 패키지 디렉터리를 크롤링하여 루트의 `package.json`을 가져옵니다. [`vitefu`](https://github.com/svitejs/vitefu) 커뮤니티 패키지를 사용할 수도 있습니다.

```js
import { resolve } from 'import-meta-env'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## 사용되지 않는 API 제거 {#removed-deprecated-apis}

- CSS 파일의 기본 내보내기 (예: `import style from './foo.css'`): 이 대신 `?inline` 쿼리를 사용
- `import.meta.globEager`: 이 대신 `import.meta.glob('*', { eager: true })`를 사용
- `ssr.format: 'cjs`' 및 `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` 및 `server.middlewareMode: 'html'`: 이 대신 [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) 를 사용 ([#8452](https://github.com/vitejs/vite/pull/8452))

## 고급 {#advanced}

플러그인/도구 개발자에게만 영향을 미치는 변경 사항입니다.

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
  - `configurePreviewServer` 훅은 이제 `PreviewServerForHook` 타입이 아닌 `PreviewServer` 타입을 받습니다.
- [[#14818] refactor(preview)!: use base middleware](https://github.com/vitejs/vite/pull/14818)
  - `configurePreviewServer`의 반환 함수에서 추가된 미들웨어는 이제 `req.url` 값을 비교할 때 `base`에 접근할 수 없습니다. 이는 개발 서버와 일관된 동작을 할 수 있도록 합니다. 필요한 경우에는 `configResolved` 훅에서 `base`를 확인할 수 있습니다.
- [[#14834] fix(types)!: expose httpServer with Http2SecureServer union](https://github.com/vitejs/vite/pull/14834)
  - 이제 적절한 경우에 `http.Server | http2.Http2SecureServer`가 `http.Server` 대신 사용됩니다.

이 외로, 몇몇 사용자에게만 영향을 미치는 변경 사항도 있습니다.

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - 빌드 시 최상위 `this`가 기본적으로 `globalThis`로 재작성되었는데, 이 동작은 이제 제거되었습니다.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - 내부 가상 모듈의 id에 확장자(`.js`)가 추가되었습니다.
- [[#14583] refactor!: remove exporting internal APIs](https://github.com/vitejs/vite/pull/14583)
  - 실수로 Export 한 내부 API를 제거했습니다: `isDepsOptimizerEnabled`와 `getDepOptimizationConfig`
  - Export 한 내부 API를 제거했습니다: `DepOptimizationResult`, `DepOptimizationProcessing`, 그리고 `DepsOptimizer`
  - `ResolveWorkerOptions` 타입을 `ResolvedWorkerOptions`로 이름을 변경했습니다.
- [[#5657] fix: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - 과거 Vite가 `Accept: text/html`이 아닌 기본(Base) 경로 외부의 요청에 대해, 마치 기본 경로로 요청된 것처럼 응답했습니다. 이제 더 이상 그렇게 하지 않고 404로 응답합니다.
- [[#14723] fix(resolve)!: remove special .mjs handling](https://github.com/vitejs/vite/pull/14723)
  - 과거 라이브러리의 `"exports"` 필드가 `.mjs` 파일을 매핑하는 경우, Vite는 특정 라이브러리와의 호환성을 유지하기 위해 `"browser"`와 `"module"` 필드를 일치시키려고 시도했습니다. 이 동작은 이제 Export 식별 알고리즘과 일치하도록 제거되었습니다.
- [[#14733] feat(resolve)!: remove `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
  - `resolve.browserField` 필드는 Vite 3부터 [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields)의 기본값인 `['browser', 'module', 'jsnext:main', 'jsnext']`로 대체되었습니다.
- [[#14855] feat!: add isPreview to ConfigEnv and resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - `ConfigEnv` 객체의 `ssrBuild`의 이름을 `isSsrBuild`로 변경했습니다.

## v3에서 마이그레이션하기 {#migration-from-v3}

먼저 [v3에서 마이그레이션하기 가이드](./migration-from-v3.md)를 확인하여 앱을 Vite v4로 이전하는 데 필요한 변경 사항을 확인하고, 그다음 이 페이지의 변경 사항을 진행하세요.