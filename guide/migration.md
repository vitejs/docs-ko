# v5에서 마이그레이션하기 {#migration-from-v5}

## 환경 API {#environment-api}

실험적이고 새로운 [환경 API](/guide/api-environment.md)를 위해 커다란 내부 리팩토링이 필요했습니다. 그럼에도 Vite 6는 프로젝트 대부분이 새로운 메이저 버전으로 빠르게 업그레이드할 수 있도록 호환성을 유지하고자 노력했습니다. 우리는 생태계가 새로운 API를 준비하고 사용할 때까지 기다릴 예정입니다. 일부 엣지 케이스가 있을 수는 있지만, 저수준 API를 사용하는 프레임워크 및 도구에 대해서만 영향을 미칠 것입니다. 릴리스 전 생태계 내 메인테이너들과 협력하여 이러한 차이를 완화하기 위해 노력했습니다. 만약 문제점을 발견하셨다면 [이슈를 생성](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml)해 주세요.

Vite 구현 변경으로 인해 내부 API 중 일부가 제거되었습니다. 이러한 API를 사용하고 계셨다면, [기능 요청](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml)을 생성해 주세요.

## Vite 런타임 API {#vite-runtime-api}

실험적인 Vite 런타임 API는 모듈 러너 API로 발전했으며, Vite 6에서 새롭고 실험적인 [환경 API](/guide/api-environment)의 일부로 릴리스되었습니다. Vite 5.1에서 도입된 API가 실험적인 기능이었음을 고려할 때, 이를 제거하는 것이 호환성을 깨뜨리는 변경 사항까지는 아니지만, Vite 6로 마이그레이션하기 위해 모듈 러너에 해당하는 기능으로 업데이트해야 합니다.

## 일반적인 변경 사항 {#general-changes}

### `resolve.conditions` 기본값 {#default-value-for-resolve-conditions}

이 변경 사항은 [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions)를 설정하지 않은 사용자에게는 영향을 미치지 않습니다.

Vite 5에서 `resolve.conditions` 기본값은 `[]`였으며, 일부 조건들이 내부적으로 추가되었습니다. 참고로 `ssr.resolve.conditions`는 `resolve.conditions` 값을 기본값으로 사용했었습니다.

Vite 6부터는 일부 조건들이 더 이상 내부적으로 추가되지 않으며, 항상 설정에 명시해야 합니다.
이 조건들은 다음과 같습니다:

- `resolve.conditions`: `['module', 'browser', 'development|production']`
- `ssr.resolve.conditions`: `['module', 'node', 'development|production']`

다만 이 값들은 이제 기본값이며, `ssr.resolve.conditions`는 더 이상 `resolve.conditions`를 사용하지 않습니다. 참고로 `development|production`은 `process.env.NODE_ENV` 값에 따라 `production` 또는 `development`로 대체되는 특별한 변수입니다. 이러한 기본값들은 `vite`에서 `defaultClientConditions`와 `defaultServerConditions`로 제공됩니다.

만약 `resolve.conditions` 또는 `ssr.resolve.conditions`에 대해 커스텀 값을 지정했다면, 새로운 조건들을 포함하도록 업데이트해야 합니다.
예를 들어, 이전에 `resolve.conditions`에 대해 `['custom']`을 지정했다면, 대신 `['custom', ...defaultClientConditions]`를 지정해야 합니다.

### JSON stringify {#json-stringify}

Vite 5에서는 [`json.stringify: true`](/config/shared-options#json-stringify)가 설정되면 [`json.namedExports`](/config/shared-options#json-namedexports)가 비활성화되었습니다.

Vite 6부터는 `json.stringify: true`가 설정되어 있어도 `json.namedExports`가 비활성화되지 않으며, 설정을 유지합니다. 이전 동작을 유지하고 싶다면 `json.namedExports: false`로 설정해 주세요.

또한 Vite 6는 `json.stringify`의 새로운 기본값으로, 커다란 JSON 파일만 문자열화하는 `'auto'`를 추가했습니다. 이 동작을 비활성화하려면 `json.stringify: false`로 설정하세요.

### HTML 요소에 대한 에셋 참조 지원 확장 {#extended-support-of-asset-references-in-html-elements}

Vite 5에서는 `<link href>`, `<img src>` 등과 같이 Vite에서 처리하고 번들링할 에셋을 참조할 수 있는 HTML 요소는 한정적이었습니다.

Vite 6는 더 많은 HTML 요소에 대해 이와 같은 기능을 지원합니다. 전체 목록은 [HTML 기능](/guide/features.html#html) 문서를 확인해 주세요.

특정 요소에 대해 HTML 처리를 비활성화하려면, 해당 요소에 `vite-ignore` 속성을 추가해 가능합니다.

### postcss-load-config {#postcss-load-config}

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config)가 v4에서 v6로 업데이트되었습니다. TypeScript postcss 설정 파일을 로드하기 위해 [`ts-node`](https://www.npmjs.com/package/ts-node) 대신 [`tsx`](https://www.npmjs.com/package/tsx) 또는 [`jiti`](https://www.npmjs.com/package/jiti)가 필요합니다. 또한 YAML postcss 설정 파일을 로드하기 위해 [`yaml`](https://www.npmjs.com/package/yaml)이 필요합니다.

### Sass는 이제 기본적으로 모던 API를 사용합니다 {#sass-now-uses-modern-api-by-default}

Vite 5에서는 Sass에 대해 기본적으로 레거시 API가 사용되었습니다. Vite 5.4에서 모던 API에 대한 지원이 추가되었습니다.

Vite 6부터는 Sass에 대해 기본적으로 모던 API가 사용됩니다. 여전히 레거시 API를 사용하고 싶다면 [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions)로 설정해 주세요. 단, 레거시 API 지원은 Vite 7에서 제거될 예정입니다.

모던 API로 마이그레이션하려면 [Sass 문서](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/)를 참고해 주세요.

### 라이브러리 모드에서 CSS 출력 파일 이름 커스터마이징 {#customize-css-output-file-name-in-library-mode}

Vite 5에서는 라이브러리 모드의 CSS 출력 파일 이름이 항상 `style.css`였으며, Vite 설정으로는 쉽게 변경할 수 없었습니다.

Vite 6부터는 파일 이름이 JS 출력 파일과 유사하게 `package.json` "name"을 기본적으로 사용합니다. 또한 [`build.lib.fileName`](/config/build-options.md#build-lib)이 문자열로 설정된 경우, 해당 값이 CSS 출력 파일 이름에도 사용됩니다. CSS 파일 이름을 명시적으로 설정하려면, 새로운 옵션인 [`build.lib.cssFileName`](/config/build-options.md#build-lib)을 사용할 수 있습니다.

마이그레이션 시, `style.css` 파일 이름에 대해 의존성이 존재하는 경우, 패키지 이름을 기반으로 하는 새로운 이름으로 변경해야 합니다. 아래는 예시입니다:

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

이 대신 Vite 5에서와 같이 `style.css`를 유지하고자 한다면 `build.lib.cssFileName: 'style'`로 설정해 주세요.

## 고급 {#advanced}

일부 사용자에게만 영향을 미치며, 호환성이 유지되지 않는 변경 사항들이 있습니다.

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - CSS 파일에 대한 `default import`는 [Vite 4에서 더 이상 사용되지 않음](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string)으로 표시되었고, Vite 5에서도 제거되었지만, SSR 개발 모드에서는 의도치 않게 지원되고 있었습니다. 이 기능은 이제 제거되었습니다.
- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify)는 이제 SSR 빌드에서도 기본적으로 활성화됩니다.
- [[#18070] feat!: proxy bypass with WebSocket](https://github.com/vitejs/vite/pull/18070)
  - `server.proxy[path].bypass`는 이제 WebSocket 업그레이드 요청에 대해서도 호출되며, 이 경우 `res` 매개변수는 `undefined`가 됩니다.
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - [`build.minify: 'terser'`](/config/build-options#build-minify)에 대한 terser 버전이 5.4.0에서 5.16.0으로 업그레이드되었습니다.
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires)가 이제 기본적으로 `true`입니다(이전에는 `'auto'`).
    - 이로 인해 번들 크기가 커질 수 있지만, 더 결정론적인 빌드(동일한 입력에 대해 동일한 출력이 보장되는 빌드 - 옮긴이)가 가능해집니다.
    - CommonJS 파일을 진입점으로 지정하는 경우 추가 단계가 필요할 수 있습니다. 자세한 내용은 [commonjs 플러그인 문서](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points)를 참고하세요.
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - 범위 중괄호(`{01..03}` ⇒ `['01', '02', '03']`)와 증분 중괄호(`{2..8..2}` ⇒ `['2', '4', '6', '8']`)는 더 이상 glob에서 지원되지 않습니다.
- [[#18395] feat(resolve)!: allow removing conditions](https://github.com/vitejs/vite/pull/18395)
  - 이 PR은 위에서 언급한 "`resolve.conditions` 기본값" 호환성이 깨지는 변경 사항뿐만 아니라, SSR에서 외부화되지 않은 디펜던시에 대해 `resolve.mainFields`가 사용되지 않도록 합니다. `resolve.mainFields`를 사용하고 있고, 이를 SSR에서 외부화되지 않은 디펜던시에도 적용하고 싶다면, [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields)를 사용할 수 있습니다.
- [[#18493] refactor!: remove fs.cachedChecks option](https://github.com/vitejs/vite/pull/18493)
  - 캐시된 폴더에 파일을 작성하고 즉시 임포트할 때 발생하는 엣지 케이스로 인해, 이 최적화 옵션이 제거되었습니다.
- [[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)
  - 이제 환경 변수 내에서 다른 환경 변수를 참조할 때, 참조되는 변수가 먼저 정의되어 있어야 합니다. 자세한 내용은 [`dotenv-expand` 변경 로그](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16)를 참고하세요.
- [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - 더 이상 SSR 전용 모듈에 대한 업데이트가 클라이언트에서 전체 페이지 리로드를 트리거하지 않습니다. 이전 동작으로 돌아가려면 커스텀 Vite 플러그인을 사용할 수 있습니다:
    <details>
    <summary>예제 코드 보기</summary>

    ```ts twoslash
    import type { Plugin, EnvironmentModuleNode } from 'vite'

    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return

            let hasSsrOnlyModules = false

            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue

              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true,
              )
              hasSsrOnlyModules = true
            }

            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## v4에서 마이그레이션 {#migration-from-v4}

먼저 Vite v5의 [v4에서 마이그레이션하기](https://v5.vite.dev/guide/migration.html) 문서를 확인해 앱을 Vite 5로 포팅하는 데 필요한 사항을 진행한 다음, 이 페이지에서 마이그레이션을 진행하세요.