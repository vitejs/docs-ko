# v2에서 마이그레이션하기 {#migrating-from-v2}

## 지원하는 Node 버전 {#node-support}

Vite는 EOL(End-of-life)에 도달한 Node v12를 더 이상 지원하지 않습니다. Node 버전 14.6 이상을 사용해주세요.

## 최신 브라우저 기준 변경 {#modern-browser-baseline-change}

프로덕션 버전으로 빌드 및 번들링 시, 소스 코드가 최신 JavaScript를 지원하는 환경에서 동작한다고 가정하고 진행됩니다. 기존적으로 Vite는 [네이티브 ES 모듈](https://caniuse.com/es6-module), [네이티브 ESM의 동적 Import](https://caniuse.com/es6-module-dynamic-import), 그리고 [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta)를 지원하는 브라우저를 대상으로 하고 있습니다:

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

만약 이보다 이전 버전의 브라우저를 대상으로 한다면 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 사용해주세요. 이 플러그인은 자동으로 레거시 청크 및 ES 언어 기능에 대한 폴리필을 생성합니다.

## 설정 옵션 관련 변경 사항 {#config-options-changes}

- 아래의 옵션은 이미 Vite v2에서 사용되지 않는 옵션이었으며, v3에서는 제거되었습니다:

  - `optimizeDeps.keepNames` ([`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedepsesbuildoptions)로 변경)
  - `build.base` ([`base`](../config/shared-options.md#base)로 변경)
  - `alias` ([`resolve.alias`](../config/shared-options.md#resolvealias)로 변경)
  - `dedupe` ([`resolve.dedupe`](../config/shared-options.md#resolvededupe)로 변경)
  - `polyfillDynamicImport` (동적 Import를 지원하지 않는 브라우저는 [`@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 사용해주세요)

## 개발 서버 관련 변경 사항 {#dev-server-changes}

Vite는 CJS 포맷의 디펜던시를 ESM으로 변환하고 브라우저가 요청해야 하는 모듈의 개수를 줄이기 위해 esbuild를 이용해 디펜던시를 최적화합니다. 이와 관련하여, Vite v3에서는 디펜던시를 발견하고 일괄적으로 처리하는 기본 방식이 변경되었습니다. v2에서는 콜드-스타트와 관련된 디펜던시를 최적화하기 위해 esbuild로 사용자 코드를 사전에 탐색해야 했었으나, v3에서는 더 이상 이를 수행하지 않습니다. 이 대신 소스 코드 로드 시 Import 되는 모든 사용자의 모듈이 처리될 때까지 첫 번째 디펜던시 최적화 작업이 지연됩니다.

만약 v2의 방식을 되돌리고자 한다면 [`optimizeDeps.devScan`](../config/dep-optimization-options.md#optimizedepsdevscan) 옵션을 이용해주세요.

## 빌드 관련 변경 사항 {#build-changes}

v3에서, Vite는 기본적으로 esbuild를 사용해 디펜던시를 최적화합니다. 이 덕분에 v2에 있었던 dev와 prod간의 중요한 차이점 중 하나가 사라지게 됩니다. esbuild는 CJS 포맷의 디펜던시를 ESM으로 변환하기 때문에 [`@rollupjs/plugin-commonjs`]는 더 이상 사용하지 않아도 됩니다.

만약 v2의 방식을 되돌리고자 한다면 [`optimizeDeps.disabled: 'build'`](../config/dep-optimization-options.md#optimizedepsdisabled) 옵션을 이용해주세요.

## SSR 관련 변경 사항 {#ssr-changes}

Vite v3는 기본적으로 SSR 빌드 시 ESM을 타깃으로 합니다. ESM을 사용하게 되면 [SSR 외부화 휴리스틱](../guide/ssr.html#ssr-externals)은 더 이상 필요하지 않기 때문이죠. [`ssr.noExternal`](../config/ssr-options.md#ssrnoexternal) 옵션을 이용해 SSR 번들에 포함될 디펜던시를 설정할 수도 있습니다.

프로젝트에서 SSR용 ESM을 사용할 수 없는 경우라면, `ssr.format: 'cjs'`로 설정해 CJS 번들을 생성할 수도 있습니다. 이 경우 Vite v2와 동일한 외부화 방식이 사용됩니다.

## 일반적인 변경 사항 {#general-changes}

- [`import.meta.glob`](features.md#glob-import-as) 옵션이 `{ assert: { type: 'raw' }}`에서 `{ as: 'raw' }`으로 변경되었습니다.

- SSR 및 lib 모드에서 빌드된 JS 파일의 확장자는 이제 포맷과 패키지 타입에 따라 올바른 확장자(`js`, `mjs`, 또는 `cjs`)를 갖습니다.

## v1에서 마이그레이션하기 {#migration-from-v1}

[v1에서 마이그레이션하기](./migration-from-v1.md) 문서를 먼저 확인해 앱을 Vite v2로 마이그레이션 한 다음, 이 페이지에서 언급된 내용을 확인해 v3로 마이그레이션을 진행해주세요.
