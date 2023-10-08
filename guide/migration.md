# v4에서 마이그레이션하기 {#migration-from-v4}

## Node.js 지원 {#node-js-support}

Vite는 더 이상 EOL에 도달한 Node.js 14 / 16 / 17 / 19를 지원하지 않습니다. Node.js 18 / 20+이 필요합니다.

## CJS Node API 사용 중단 {#deprecate-cjs-node-api}

Vite의 CJS Node API는 더 이상 제공되지 않습니다. `require('vite')` 호출 시 경고가 나타나며, 이 대신 파일이나 프레임워크를 업데이트하여 Vite의 ESM 빌드를 가져오도록 해야 합니다.

표준 Vite 프로젝트에서 다음을 확인해 주세요:

1. `vite.config.js` 파일에서 ESM 문법을 사용하고 있습니다.
2. 가장 가까운 `package.json` 파일에 `"type": "module"`이 있거나 `.mjs` 확장자(예: `vite.config.mjs`)를 사용하고 있습니다.

다른 프로젝트의 경우, 몇 가지 일반적인 접근 방식이 있습니다:

- **ESM을 기본값으로 설정하고, 필요한 경우 CJS를 사용:** 프로젝트 `package.json`에 `"type": "module"`을 추가하세요. 이후 모든 `*.js` 파일은 ESM으로 해석되며 ESM 문법을 사용해야 합니다. 다만 확장자가 `.cjs`인 파일은 CJS로 해석됩니다.
- **CJS를 기본값으로 유지하고, 필요한 경우 ESM을 사용:** 프로젝트 `package.json`에 `"type": "module"`이 없다면, 모든 `*.js` 파일은 CJS로 해석됩니다. 다만 확장자가 `.mjs`인 파일은 ESM으로 해석됩니다.
- **Vite를 동적으로 임포트:** CJS를 계속 사용해야 하는 경우, `import('vite')`를 사용하여 Vite를 동적으로 임포트할 수 있습니다. 이를 위해 코드가 `async` 컨텍스트에서 작성되어야 하지만, Vite의 API가 대부분 비동기적이기 때문에 일반적으로 문제가 되지 않습니다.

자세한 내용은 [트러블슈팅 가이드](https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated)를 참조하세요.

## 일반 변경 사항 {#general-changes}

### `.`를 포함하는 경로가 index.html로 폴백되도록 허용 {#allow-path-containing-to-fallback-to-index-html}

Vite 4에서 `appType`이 `'SPA'`(기본값)로 설정되어 있더라도 `.`를 포함하는 경로에 접근하면 index.html로 폴백되지 않았습니다.
Vite 5에서는 index.html로 폴백됩니다.

이미지 경로를 존재하지 않는 파일(예: `<img src="./file-does-not-exist.png">`)로 지정해도 더 이상 브라우저에서 404 에러 메시지를 콘솔에 표시하지 않습니다.

### 매니페스트 파일은 이제 기본적으로 `.vite` 디렉터리에 생성됨 {#manifest-files-are-now-generated-in-vite-directory-by-default}

Vite 4에서는 매니페스트 파일(`build.manifest`, `build.ssrManifest`)이 기본적으로 `build.outDir`의 루트에 생성되었습니다. Vite 5에서는 `build.outDir`의 `.vite` 디렉터리에 생성됩니다.

### CLI 단축키는 `Enter`를 눌러 실행해야 함 {#cli-shortcuts-require-an-additional-enter-press}

CLI 단축키(예: 개발 서버를 재시작하는 `r`)는 이제 명시적으로 `Enter`를 눌러야 실행됩니다. 예를 들어, 개발 서버를 재시작하려면 `r + Enter`를 누르면 됩니다.

이 변경으로 Vite가 OS별 단축키를 무시하고 제어하는 것을 방지하며, Vite 개발 서버를 다른 프로세스와 결합할 때 더 나은 호환성을 제공할 수 있게 되고, [이전의 주의 사항](https://github.com/vitejs/vite/pull/14342)을 피할 수 있습니다.

## 사용되지 않는 API 제거 {#removed-deprecated-apis}

- CSS 파일의 기본 내보내기 (예: `import style from './foo.css'`): 이 대신 `?inline` 쿼리를 사용
- `import.meta.globEager`: 이 대신 `import.meta.glob('*', { eager: true })`를 사용
- `ssr.format: 'cjs`' 및 `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))

## 고급 {#advanced}

플러그인/도구 개발자에게만 영향을 미치는 변경 사항입니다.

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)

이 외로, 몇몇 사용자에게만 영향을 미치는 변경 사항도 있습니다.

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - 빌드 시 최상위 `this`가 기본적으로 `globalThis`로 재작성되었는데, 이 동작은 이제 제거되었습니다.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - 내부 가상 모듈의 id에 확장자(`.js`)가 추가되었습니다.

## v3에서 마이그레이션하기 {#migration-from-v3}

먼저 [v3에서 마이그레이션하기 가이드](./migration-from-v3.md)를 확인하여 앱을 Vite v4로 이전하는 데 필요한 변경 사항을 확인하고, 그다음 이 페이지의 변경 사항을 진행하세요.