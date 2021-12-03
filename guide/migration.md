# v1에서 마이그레션하기 {#migrating-from-v1}

## 설정 바꾸기 {#config-options-change}

- 아래의 옵션들은 제거되었으며, [플러그인](./api-plugin)을 통해 구현해야 합니다.

  - `resolvers`
  - `transforms`
  - `indexHtmlTransforms`

- `jsx`와 `enableEsbuild`는 제거되었습니다. 이 대신 새로운 [`esbuild`](/config/#esbuild) 옵션을 사용해주세요.

- [CSS 관련 옵션](/config/#css-modules)은 이제 `css` 아래에 위치합니다.

- 모든 [빌드별 옵션](/config/#build-options)는 이제 `build` 아래에 위치합니다.

  - `rollupInputOptions`와 `rollupOutputOptions`는 [`build.rollupOptions`](/config/#build-rollupoptions)로 대체되었습니다.
  - `esbuildTarget`은 이제 [`build.target`](/config/#build-target) 입니다.
  - `emitManifest`는 이제 [`build.manifest`](/config/#build-manifest) 입니다.
  - 아래의 빌드 옵션은 제거되었으나, 플러그인 훅(Hook) 또는 기타 옵션을 통해 가져올 수 있습니다.
    - `entry`
    - `rollupDedupe`
    - `emitAssets`
    - `emitIndex`
    - `shouldPreload`
    - `configureBuild`

- 모든 [서버별 옵션](/config/#server-options)은 이제 `server` 아래에 위치합니다.

  - `hostname`은 이제 [`server.host`](/config/#server-host) 입니다.
  - `httpsOptions`는 제거되었습니다. 대신, [`server.https`](/config/#server-https)가 직접 옵션 객체를 받을 수 있도록 구성되어 있습니다.
  - `chokidarWatchOptions`는 이제 [`server.watch`](/config/#server-watch) 입니다.

- [`assetsInclude`](/config/#assetsinclude)는 이제 함수 대신 `string | RegExp | (string | RegExp)[]` 타입으로 설정됩니다.

- 모든 Vue 옵션은 제거되었으며, Vue 플러그인에 옵션을 전달하도록 구성해야 합니다.

## 별칭 동작 변경 {#alias-behavior-change}

[`alias`](/config/#resolve-alias)는 이제 `@rollup/plugin-alias`로 전달되고, 더 이상 경로의 시작과 끝에 슬래시가 필요하지 않습니다. 따라서, 1.0 스타일의 디렉터리 별칭 키 끝에 있는 슬래시는 제거해주세요:

```diff
- alias: { '/@foo/': path.resolve(__dirname, 'some-special-dir') }
+ alias: { '/@foo': path.resolve(__dirname, 'some-special-dir') }
```

조금 더 세부적으로 구성하고자 한다면, `[{ find: RegExp, replacement: string }]` 형태로 이용할 수도 있습니다.

## Vue 지원 {#vue-support}

Vite 2.0 코어는 이제 특정 프레임워크에 종속적이지 않습니다. Vue는 이제 [`@vitejs/plugin-vue`](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)를 통해 제공되며, 간단하게 설치하고 아래와 같이 Vite 설정에 추가하기만 하면 됩니다.

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()]
})
```

### 커스텀 블록 변환 {#custom-blocks-transforms}

커스텀 플러그인을 사용해 아래와 같이 Vue 커스텀 블록을 변환(Transform)할 수 있습니다:

```ts
// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const vueI18nPlugin = {
  name: 'vue-i18n',
  transform(code, id) {
    if (!/vue&type=i18n/.test(id)) {
      return
    }
    if (/\.ya?ml$/.test(id)) {
      code = JSON.stringify(require('js-yaml').load(code.trim()))
    }
    return `export default Comp => {
      Comp.i18n = ${code}
    }`
  }
}

export default defineConfig({
  plugins: [vue(), vueI18nPlugin]
})
```

## React 지원 {#react-support}

React의 Fast Refresh는 이제 [`@vitejs/plugin-react-refresh`](https://github.com/vitejs/vite/tree/main/packages/plugin-react-refresh) 플러그인을 통해 지원됩니다.

## HMR API 변경 {#hmr-api-change}

`import.meta.hot.acceptDeps()`는 더 이상 사용되지 않습니다. 또한 [`import.meta.hot.accept()`](./api-hmr#hot-accept-deps-cb)는 이제 하나 이상의 디펜던시를 받을 수 있도록 구성되었습니다.

## 매니페스트 포맷 변경 {#manifest-format-change}

이제 빌드 매니페스트는 아래와 같은 포맷을 사용합니다:

```json
{
  "index.js": {
    "file": "assets/index.acaf2b48.js",
    "imports": [...]
  },
  "index.css": {
    "file": "assets/index.7b7dbd85.css"
  }
  "asset.png": {
    "file": "assets/asset.0ab0f9cd.png"
  }
}
```

JS 청크 파일의 경우, 사전 로드 지시문(Preload Directives)을 렌더링하는 데 사용할 수 있도록 가져와진(Imported) 청크도 나열됩니다.

## 플러그인 개발자를 위해 {#for-plugin-authors}

Vite 2는 Rollup 플러그인을 확장하는 완전히 재설계된 플러그인 인터페이스를 사용합니다. 이와 관련된 내용은 새로운 [플러그인 개발 가이드](./api-plugin)를 참고해주세요.

아래는 v1 플러그인을 v2로 마이그레이션하는 방법에 대한 몇 가지 지침 사항입니다:

- `resolvers` -> [`resolveId`](https://rollupjs.org/guide/en/#resolveid) 훅을 이용
- `transforms` -> [`transform`](https://rollupjs.org/guide/en/#transform) 훅을 이용
- `indexHtmlTransforms` -> [`transformIndexHtml`](./api-plugin#transformindexhtml) 훅을 이용
- 가상(Virtual) 파일 제공 -> [`resolveId`](https://rollupjs.org/guide/en/#resolveid) + [`load`](https://rollupjs.org/guide/en/#load) 훅을 이용
- `alias`, `define` 또는 기타 설정 옵션 추가 -> [`config`](./api-plugin#config) 훅을 이용

대부분의 로직은 미들웨어가 아닌 플러그인 훅을 통해 이루어져야 하기 때문에, 미들웨어의 필요성은 크게 줄어들게 됩니다. 또한 Vite의 내부 서버는 이제 Koa가 아닌 [connect](https://github.com/senchalabs/connect)의 인스턴스입니다.
