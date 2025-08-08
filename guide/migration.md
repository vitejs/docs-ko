# v6에서 마이그레이션하기 {#migration-from-v6}

## Node.js 지원 {#node-js-support}

Vite는 수명이 종료된 Node.js 18을 더이상 지원하지 않습니다. 이제 Node.js 20.19+ / 22.12+ 버전이 필요합니다.

## 기본 브라우저 타깃 변경 {#default-browser-target-change}

`build.target`의 기본 브라우저 값이 더 최신 브라우저로 업데이트되었습니다.

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

이러한 브라우저 버전은 2025-05-01 기준으로 [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available 기능 세트와 일치합니다. 즉, 모두 2022-11-01 이전에 출시된 버전들입니다.

Vite 5에서는 기본 타깃이 `'modules'`로 명명되었지만, 이는 더 이상 사용할 수 없습니다. 대신 새로운 기본 타깃인 `'baseline-widely-available'`이 도입되었습니다.

## 일반적인 변경 사항 {#general-changes}

### Sass 레거시 API 지원 제거 {#removed-sass-legacy-api-support}

계획대로 Sass 레거시 API 지원이 제거되었습니다. Vite는 이제 모던 API만 지원합니다. `css.preprocessorOptions.sass.api` / `css.preprocessorOptions.scss.api` 옵션을 제거할 수 있습니다.

## 사용 중단된 기능 제거 {#removed-deprecated-features}

- `splitVendorChunkPlugin` (v5.2.7에서 사용 중단됨)
  - 이 플러그인은 원래 Vite v2.9로의 마이그레이션을 쉽게 하기 위해 제공되었습니다.
  - 필요한 경우 청크 동작을 제어하기 위해 `build.rollupOptions.output.manualChunks` 옵션을 사용할 수 있습니다.
- `transformIndexHtml`에 대한 훅 레벨 `enforce` / `transform` (v4.0.0에서 사용 중단됨)
  - [Rollup 객체 훅](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.)과 인터페이스를 맞추기 위해 변경되었습니다.
  - `enforce` 대신 `order`를 사용하고, `transform` 대신 `handler`를 사용해야 합니다.

## 고급 {#advanced}

일부 사용자에게만 영향을 미치는 다른 호환성이 깨지는 변경 사항들이 있습니다.

- [[#19979] chore: declare version range for peer dependencies](https://github.com/vitejs/vite/pull/19979)
  - CSS 전처리기에 대한 피어 디펜던시 버전 범위를 명시했습니다.
- [[#20013] refactor: remove no-op `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - `legacy.proxySsrExternalModules` 프로퍼티는 Vite 6부터 효과가 없었습니다. 이제 제거되었습니다.
- [[#19985] refactor!: remove deprecated no-op type only properties](https://github.com/vitejs/vite/pull/19985)
  - 다음과 같은 사용되지 않는 프로퍼티들이 제거되었습니다: `ModuleRunnerOptions.root`, `ViteDevServer._importGlobMap`, `ResolvePluginOptions.isFromTsImporter`, `ResolvePluginOptions.getDepsOptimizer`, `ResolvePluginOptions.shouldExternalize`, `ResolvePluginOptions.ssrConfig`
- [[#19986] refactor: remove deprecated env api properties](https://github.com/vitejs/vite/pull/19986)
  - 이러한 프로퍼티들은 처음부터 사용이 중단되었으며, 이제 제거되었습니다.
- [[#19987] refactor!: remove deprecated `HotBroadcaster` related types](https://github.com/vitejs/vite/pull/19987)
  - 이러한 타입들은 현재 사용 중단된 Runtime API의 일부로 도입되었습니다. 이제 제거되었습니다: `HMRBroadcaster`, `HMRBroadcasterClient`, `ServerHMRChannel`, `HMRChannel`
- [[#19996] fix(ssr)!: don't access `Object` variable in ssr transformed code](https://github.com/vitejs/vite/pull/19996)
  - 모듈 러너 런타임 컨텍스트에 대해 `__vite_ssr_exportName__`이 이제 필요합니다.
- [[#20045] fix: treat all `optimizeDeps.entries` values as globs](https://github.com/vitejs/vite/pull/20045)
  - `optimizeDeps.entries`는 이제 리터럴 문자열 경로를 받지 않습니다. 대신 항상 glob을 받습니다.
- [[#20222] feat: apply some middlewares before `configureServer` hook](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: apply some middlewares before `configurePreviewServer` hook](https://github.com/vitejs/vite/pull/20224)
  - 일부 미들웨어가 이제 `configureServer` / `configurePreviewServer` 훅 이전에 적용됩니다. 특정 경로가 [`server.cors`](../config/server-options.md#server-cors) / [`preview.cors`](../config/preview-options.md#preview-cors) 옵션을 적용되지 않고자 한다면, 응답에서 관련 헤더를 제거해야 합니다.

## v5에서 마이그레이션 {#migration-from-v5}

먼저 Vite v6 문서의 [v5에서 마이그레이션하기](./migration-from-v5) 가이드를 확인해 앱을 Vite 6로 포팅하는 데 필요한 사항을 진행한 다음, 이 페이지의 변경 사항을 적용하세요.