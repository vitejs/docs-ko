# 에셋 가져오기 {#static-asset-handling}

- 관련 항목: [Public Base Path](./build#public-base-path)
- 관련 항목: [`assetsInclude` 설정 옵션](/config/shared-options.md#assetsinclude)

## URL을 통해 에셋 가져오기 {#importing-asset-as-url}

정적 에셋을 가져오게 되면 에셋에 접근할 수 있는 URL이 반환됩니다.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

예를 들어 `imgUrl` 객체는 개발 시 `/src/img.png` 값으로 할당되지만, 프로덕션에서는 `/assets/img.2d8efhg.png`와 같은 값이 할당됩니다.

Webpack의 `file-loader`와 비슷한데, 하나 차이점이 있다면 Vite는 절대 경로와 상대 경로 둘 다 사용할 수 있습니다.

- `url()`로 참조되는 CSS의 경우 동일한 방식으로 동작합니다.

- 만약 Vue 플러그인을 사용한다면, [Vue SFC](https://v3.vuejs.org/guide/single-file-component.html) 에셋의 경우 자동으로 변환되어 가져와집니다.

- 일반적인 이미지, 미디어, 폰트 파일 타입은 자동으로 에셋 목록에 포함됩니다. 물론 [`assetsInclude` 옵션](/config/shared-options.md#assetsinclude)을 이용해 더 많은 파일 타입을 포함하도록 할 수 있습니다.

- 참조된 에셋은 빌드 에셋 그래프의 일부 요소로 포함되며, 파일 이름이 해싱되거나 최적화를 위해 플러그인으로 처리될 수 있습니다.

- [`assetsInlineLimit` 옵션](/config/shared-options.md#assetsinlinelimit)의 값보다 작은 에셋 파일의 경우, Base64 포맷의 데이터 URL 문자열로 가져옵니다.

- Git LFS 자리 표시자는 파일 내용을 포함하지 않기에 인라인에서 자동으로 제외됩니다. 만약 이 역시 인라인에 포함하고자 한다면 빌드하기 전 Git LFS를 통해 파일을 다운로드해주세요.

- TypeScript의 경우, 기본적으로 정적 에셋 가져오기를 유효한 모듈로 인식하지 않습니다. 이를 해결하려면 [`vite/client`](./features#client-types)를 포함해주세요.

::: tip `url()`을 통해 SVG 인라이닝하기
JS를 통해 직접 `url()`로 SVG URL을 전달하는 경우, 변수는 반드시 큰따옴표로 감싸져야 합니다.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.svg'
document.getElementById('hero-img').style.background = `url("${imgUrl}")`
```

:::

### 접미사를 이용해 URL로 에셋 가져오기 {#explicit-url-imports}

Assets that are not included in the internal list or in `assetsInclude`, can be explicitly imported as a URL using the `?url` suffix. This is useful, for example, to import [Houdini Paint Worklets](https://developer.mozilla.org/en-US/docs/Web/API/CSS/paintWorklet_static).

```js twoslash
import 'vite/client'
// ---cut---
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### 명시적인 인라인 처리 {#explicit-inline-handling}

에셋은 `?inline` 또는 `?no-inline` 접미사를 사용해 인라인 처리 여부를 명시적으로 지정하여 가져올 수 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl1 from './img.svg?no-inline'
import imgUrl2 from './img.png?inline'
```

### 문자열 형태로 에셋 가져오기 {#importing-asset-as-string}

`?raw` 접미사를 붙여 가져오는 에셋은 문자열 형태로 가져와지게 됩니다.

```js twoslash
import 'vite/client'
// ---cut---
import shaderString from './shader.glsl?raw'
```

### 스크립트를 Worker로 가져오기 {#importing-script-as-a-worker}

스크립트는 웹 워커로 가져올 수 있는데, 이 때는 `?worker` 접미사를 이용합니다.

```js twoslash
import 'vite/client'
// ---cut---
// 프로덕션 빌드 시에는 청크로 분리됩니다.
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js twoslash
import 'vite/client'
// ---cut---
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js twoslash
import 'vite/client'
// ---cut---
// `inline` 접미사는 Base64 포맷의 문자열로 에셋을 가져옵니다.
import InlineWorker from './shader.js?worker&inline'
```

좀 더 자세한 사항은 [웹 워커 섹션](./features#web-workers)을 참고해주세요.

## `public` 디렉터리 {#the-public-directory}

아래와 같은 에셋은:

- `robots.txt`와 같이 소스 코드에서 참조되지 않는 에셋
- 해싱을 거치지 않고 항상 같은 이름을 가져야 하는 에셋
- ...또는 URL을 얻기 위해 `import` 할 필요 없는 에셋

`public` 디렉터리 아래에 에셋을 위치시키세요. 이 곳에 위치한 에셋은 개발 시 `/` 경로에, 배포 시 `dist` 디렉터리에 위치하게 됩니다.

만약 `<root>/public` 이 아닌 다른 디렉터리를 사용하고자 하는 경우, [`publicDir` 옵션](/config/shared-options.md#publicdir)을 이용할 수 있습니다.

참고로 `public` 디렉터리에 위치해 있는 에셋을 가져오고자 하는 경우, 항상 루트를 기준으로 하는 절대 경로로 가져와야 합니다. (예: `public/icon.png` 에셋은 소스 코드에서 `/icon.png`으로 접근이 가능)

## new URL(url, import.meta.url) {#new-url-url-import-meta-url}

네이티브 ESM의 API 중 하나인 [import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)은 현재 모듈의 URL을 보여주는 기능입니다. [URL 생성자](https://developer.mozilla.org/en-US/docs/Web/API/URL)와 함께 사용하면, 정적 에셋의 전제 URL을 확인할 수 있게 됩니다.

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

위 코드는 네이티브 ESM을 지원하는 모던 브라우저에서 동작합니다. 물론, Vite는 위 동작을 자동으로 수행해주기에 따로 처리할 필요는 없습니다.

참고로 위 코드는 템플릿 리터럴을 이용해 동적으로 생성되는 URL에서도 동작합니다.

```js
function getImageUrl(name) {
  // note that this does not include files in subdirectories
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

프로덕션 빌드 시, Vite는 번들링 및 에셋 해싱 후에도 해당 에셋에 대한 URL을 올바르게 가리키기 위해 필요한 변환 작업을 수행합니다.

```js
// Vite는 아래 코드를 변환하지 않음
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: details 동작 방식

Vite는 `getImageUrl` 함수를 다음과 같이 변환합니다:

```js
import __img0png from './dir/img0.png'
import __img1png from './dir/img1.png'

function getImageUrl(name) {
  const modules = {
    './dir/img0.png': __img0png,
    './dir/img1.png': __img1png,
  }
  return new URL(modules[`./dir/${name}.png`], import.meta.url).href
}
```

:::

::: warning SSR과 함께 사용하지 마세요!
`import.meta.url`은 브라우저와 Node.js 간 서로 다른 의미를 갖기 때문에, 이 패턴은 서버-사이드 렌더링(SSR)에 Vite를 사용하는 경우 동작하지 않습니다. 또한 서버 번들은 클라이언트 호스트의 URL을 미리 결정할 수 없습니다.
:::