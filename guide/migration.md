# v2에서 마이그레이션하기 {#migrating-from-v2}

## 지원하는 Node.js 버전 {#node-support}

Vite는 EOL(End-of-life)에 도달한 Node.js v12를 더 이상 지원하지 않습니다. Node.js 버전 14.18+ 이상을 사용해주세요.

## 최신 브라우저 기준 변경 {#modern-browser-baseline-change}

프로덕션 버전으로 빌드 및 번들링 시, 소스 코드가 최신 JavaScript를 지원하는 환경에서 동작한다고 가정하고 진행됩니다. 기존적으로 Vite는 [네이티브 ES 모듈](https://caniuse.com/es6-module), [네이티브 ESM의 동적 Import](https://caniuse.com/es6-module-dynamic-import), 그리고 [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta)를 지원하는 브라우저를 대상으로 하고 있습니다:

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

만약 이보다 이전 버전의 브라우저를 대상으로 한다면 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 사용해주세요. 이 플러그인은 자동으로 레거시 청크 및 ES 언어 기능에 대한 폴리필을 생성합니다.

## 설정 옵션 관련 변경 사항 {#config-options-changes}

아래의 옵션은 이미 Vite v2에서 사용되지 않는 옵션이었으며, v3에서는 제거되었습니다:

- `alias` ([`resolve.alias`](../config/shared-options.md#resolve-alias)로 변경)
- `dedupe` ([`resolve.dedupe`](../config/shared-options.md#resolve-dedupe)로 변경)
- `build.base` ([`base`](../config/shared-options.md#base)로 변경)
- `build.brotliSize` ([`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize)로 변경)
- `build.cleanCssOptions` (Vite는 이제 CSS 압축 시 esbuild를 사용합니다)
- `polyfillDynamicImport` (동적 Import를 지원하지 않는 브라우저는 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 사용해주세요)
- `optimizeDeps.keepNames` ([`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedeps-esbuildoptions)로 변경)

## 아키텍처 변경과 레거시 옵션들 {#architecture-changes-and-legacy-options}

이 섹션에서는 Vite v3 아키텍처에 대한 가장 큰 변경 사항에 대해 설명합니다. 만약 호환성 문제가 있는 경우, 프로젝트를 v2에서 마이그레이션 할 수 있도록 Vite v2 전략으로 되돌리는 레거시 옵션이 존재합니다.

## 개발 서버 관련 변경 사항 {#dev-server-changes}

Vite 개발 서버의 기본 포트 번호는 이제 5173 입니다. 물론 [`server.port`](../config/server-options.md#server-port) 옵션을 이용해 3000으로 설정할 수 있습니다.

Vite's default dev server host is now `localhost`. In Vite v2, Vite was listening to `127.0.0.1` by default. Node.js under v17 normally resolves `localhost` to `127.0.0.1`, so for those versions, the host won't change. For Node.js 17+, you can use [`server.host`](../config/server-options.md#server-host) to set it to `127.0.0.1` to keep the same host as Vite v2.

Note that Vite v3 now prints the correct host. This means Vite may print `127.0.0.1` as the listening host when `localhost` is used. You can set [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) to prevent this. See [`server.host`](../config/server-options.md#server-host) for more details.

### SSR 관련 변경 사항 {#ssr-changes}

Vite v3는 기본적으로 SSR 빌드 시 ESM을 타깃으로 합니다. ESM을 사용하게 되면 [SSR 외부화 휴리스틱](../guide/ssr.html#ssr-externals)은 더 이상 필요하지 않기 때문이죠. [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) 옵션을 이용해 SSR 번들에 포함될 디펜던시를 설정할 수도 있습니다.

프로젝트에서 SSR용 ESM을 사용할 수 없는 경우라면, `legacy.buildSsrCjsExternalHeuristics` 옵션을 이용해 Vite v2와 동일한 외부화 방식을 사용하는 CJS 번들 생성이 가능합니다.

또한 [`build.rollupOptions.output.inlineDynamicImports`](https://rollupjs.org/guide/en/#outputinlinedynamicimports) 옵션은 이제 `ssr.target`이 `'node'`일 때 기본적으로 `false`가 됩니다. 따라서 Node.js 빌드 시 `inlineDynamicImports`로 인해 발생되는 실행 순서 변경이나 단일 파일로 번들링되지 않습니다.

## 일반적인 변경 사항 {#general-changes}

- SSR 및 lib 모드에서 빌드된 JS 파일의 확장자는 이제 포맷과 패키지 타입에 따라 올바른 확장자(`js`, `mjs`, 또는 `cjs`)를 갖습니다.
- Terser는 이제 선택적인(Optional) 디펜던시입니다. 필요한 경우 `build.minify: 'terser'` 옵션과 함께 이 디펜던시를 설치해주세요.
  ```shell
  npm add -D terser
  ```

### `import.meta.glob` {#import-meta-glob}

- Raw에 대한 [`import.meta.glob`](features.md#glob-import-as) 옵션이 `{ assert: { type: 'raw' }}`에서 `{ as: 'raw' }`으로 변경되었습니다.
- `import.meta.glob`의 키는 이제 현재 모듈에 상대적으로 설정할 수 있습니다.

  ```diff
  // 파일: /foo/index.js
  const modules = import.meta.glob('../foo/*.js')

  // 변환된 코드:
  const modules = {
  -  '../foo/bar.js': () => {}
  +  './bar.js': () => {}
  }
  ```

- `import.meta.glob`과 함께 별칭을 사용하는 경우에는 키 값이 항상 절대적인 위치를 가리키게 됩니다.
- `import.meta.globEager` 옵션은 더 이상 사용되지 않습니다. 이 대신 `import.meta.glob('*', { eager: true })`을 사용해주세요.

### WebAssembly 지원 관련 {#webassembly-support}

["ESM integration for Wasm"](https://github.com/WebAssembly/esm-integration)과의 향후 충돌을 방지하지 위해 `import init from 'example.wasm'` 구문이 삭제되었습니다.
이 대신 `?init` 접미사를 사용해주세요.

```diff
-import init from 'example.wasm'
+import init from 'example.wasm?init'

-init().then((exports) => {
+init().then(({ exports }) => {
  exports.test()
})
```

### 자동으로 https 인증서 생성하기 {#automatic-https-certificate-generation}

`https` 옵션을 사용할 때는 유효한 인증서가 필요합니다. Vite v2에서는 인증서가 존재하지 않은 경우 자체적으로 서명된 인증서를 만든 뒤 캐싱했었습니다. Vite v3부터는 인증서를 직접 수동으로 생성하는 것을 권고하지만, v2의 인증서 자동 생성 방식을 계속 사용하고자 한다면 프로젝트에 [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) 플러그인을 추가해주세요.

```js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [basicSsl()]
}
```

## 실험적 기능 {#experimental}

### 빌드 시 esbuild 디펜던시 최적화 사용하기 {#using-esbuild-deps-optimization-at-build-time}

Vite v3에서는 esbuild를 사용해 빌드 시 디펜던시를 최적화할 수 있습니다. 이를 활성화하면 Vite v2에 있었던 개발 버전과 프로덕션 버전 사이의 중요한 차이점 중 하나가 사라지게 됩니다. esbuild는 CJS 포맷의 디펜던시를 ESM으로 변환하기 때문에 [`@rollupjs/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs)는 더 이상 사용하지 않아도 됩니다.

이 빌드 방식을 사용하고자 한다면 `optimizeDeps.disabled` 옵션의 값을 `false`로 설정해주세요(v3의 기본값은 `disabled: 'build'` 입니다). `@rollup/plugin-commonjs`는 `build.commonjsOptions: { include: [] }`로 제거할 수 있습니다.

## Advanced {#advanced}

아래는 Vite 관련 플러그인 또는 툴 개발자에게만 영향을 미치는 몇 가지 변경 사항들에 대한 내용입니다.

- [[#5868] refactor: remove deprecated api for 3.0](https://github.com/vitejs/vite/pull/5868)
  - `printHttpServerUrls` 제거
  - `server.app`, `server.transformWithEsbuild` 제거
  - `import.meta.hot.acceptDeps` 제거
- [[#6901] fix: sequential injection of tags in transformIndexHtml](https://github.com/vitejs/vite/pull/6901)
  - `transformIndexHtml`은 이제 이전 플러그인에 의해 수정된 올바른 콘텐츠를 가져오기에, 이제 삽입된 태그의 순서가 예상과 같이 동작합니다.
- [[#7995] chore: do not fixStacktrace](https://github.com/vitejs/vite/pull/7995)
  - `ssrLoadModule`의 `fixStacktrace` 옵션의 기본 값은 이제 `false` 입니다.
- [[#8178] feat!: migrate to ESM](https://github.com/vitejs/vite/pull/8178)
  - `formatPostcssSourceMap`는 이제 비동기적(async)으로 동작합니다
  - `resolvePackageEntry` 및 `resolvePackageData`는 더 이상 CJS 빌드에서 사용할 수 없습니다. (CJS에서 사용하기 위해서는 동적 Import 기능이 필요합니다.)
- [[#8626] refactor: type client maps](https://github.com/vitejs/vite/pull/8626)
  - `import.meta.hot.accept` 옵션의 콜백 타입이 더 엄격해졌습니다. 이제 `(mod: (Record<string, any> & { [Symbol.toStringTag]: 'Module' }) | undefined) => void` 입니다(기존 `(mod: any) => void`).

아래는 일부 사용자에게만 영향을 미치는 변경 사항입니다.

- [[#5018] feat: enable `generatedCode: 'es2015'` for rollup build](https://github.com/vitejs/vite/pull/5018)
  - 사용자 코드에 ES5만 포함된 경우에도 ES5로 변환하는 과정은 이제 필요합니다.
- [[#7877] fix: vite client types](https://github.com/vitejs/vite/pull/7877)
  - `/// <reference lib="dom" />`이 `vite/client.d.ts`에서 제거되었습니다. 따라서 `{ "lib": ["dom"] }` 또는 `{ "lib": ["webworker"] }`이 `tsconfig.json`에 명시되어야 합니다.
- [[#8090] feat: preserve process env vars in lib build](https://github.com/vitejs/vite/pull/8090)
  - `process.env.*`는 이제 라이브러리 모드에서도 보존됩니다.
- [[#8280] feat: non-blocking esbuild optimization at build time](https://github.com/vitejs/vite/pull/8280)
  - `server.force` 옵션이 `optimizeDeps.force` 옵션 대신 제거되었습니다.
- [[#8550] fix: dont handle sigterm in middleware mode](https://github.com/vitejs/vite/pull/8550)
  - 미들웨어 모드에서 실행할 때, Vite는 더 이상 `SIGTERM`에서 프로세스를 종료하지 않습니다.

## v1에서 마이그레이션하기 {#migration-from-v1}

[v1에서 마이그레이션하기](./migration-from-v1.md) 문서를 먼저 확인해 앱을 Vite v2로 마이그레이션 한 다음, 이 페이지에서 언급된 내용을 확인해 v3로 마이그레이션을 진행해주세요.
