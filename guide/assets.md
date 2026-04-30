# 정적 에셋 처리 {#static-asset-handling}

- 관련 항목: [Public Base Path](./build#public-base-path)
- 관련 항목: [`assetsInclude` 설정 옵션](/config/shared-options.md#assetsinclude)

## URL을 통해 에셋 가져오기 {#importing-asset-as-url}

정적 에셋을 가져오면, 해당 에셋이 제공될 때 해석된 공개 URL이 반환됩니다.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

예를 들어 `imgUrl`은 개발 시 `/src/img.png`가 되고, 프로덕션 빌드에서는 `/assets/img.2d8efhg.png`가 됩니다.

동작은 webpack의 `file-loader`와 비슷합니다. 차이점은 임포트가 절대 공개 경로(개발 중에는 프로젝트 루트 기준) 또는 상대 경로를 사용할 수 있다는 점입니다.

- `url()`로 참조되는 CSS의 경우 동일한 방식으로 동작합니다.

- 만약 Vue 플러그인을 사용한다면, [Vue SFC](https://v3.vuejs.org/guide/single-file-component.html) 에셋의 경우 자동으로 변환되어 가져와집니다.

- 일반적인 이미지, 미디어, 폰트 파일 타입은 자동으로 에셋 목록에 포함됩니다. 물론 [`assetsInclude` 옵션](/config/shared-options.md#assetsinclude)을 이용해 더 많은 파일 타입을 포함하도록 할 수 있습니다.

- 참조된 에셋은 빌드 에셋 그래프의 일부 요소로 포함되며, 파일 이름이 해싱되거나 최적화를 위해 플러그인으로 처리될 수 있습니다.

- [`assetsInlineLimit` 옵션](/config/build-options.md#build-assetsinlinelimit)의 값보다 바이트 크기가 작은 에셋은 Base64 데이터 URL로 인라인됩니다.

- Git LFS 자리 표시자는 자신이 나타내는 파일의 내용을 포함하지 않으므로 인라인에서 자동으로 제외됩니다. 인라인하려면 빌드하기 전에 Git LFS를 통해 파일 내용을 다운로드해야 합니다.

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

Vite 내부적으로 설정된 목록이나 `assetsInclude`에 포함되지 않은 에셋도 `?url` 접미사를 사용해 명시적으로 URL로서 가져올 수 있습니다. 이는 [Houdini Paint Worklets](https://developer.mozilla.org/en-US/docs/Web/API/CSS/paintWorklet_static)를 가져올 때와 같은 상황에서 유용합니다.

```js twoslash
import 'vite/client'
// ---cut---
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### 명시적인 인라인 처리 {#explicit-inline-handling}

에셋은 `?inline` 또는 `?no-inline` 접미사를 각각 사용해 인라인 처리 여부를 명시적으로 지정하여 가져올 수 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl1 from './img.svg?no-inline'
import imgUrl2 from './img.png?inline'
```

### 문자열 형태로 에셋 가져오기 {#importing-asset-as-string}

에셋은 `?raw` 접미사를 사용해 문자열로 가져올 수 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
import shaderString from './shader.glsl?raw'
```

### 스크립트를 Worker로 가져오기 {#importing-script-as-a-worker}

스크립트는 `?worker` 또는 `?sharedworker` 접미사를 사용해 웹 워커로 가져올 수 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
// 프로덕션 빌드에서는 별도의 청크입니다.
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
// Base64 문자열로 인라인됩니다.
import InlineWorker from './shader.js?worker&inline'
```

좀 더 자세한 사항은 [웹 워커 섹션](./features.md#web-workers)을 참고해주세요.

## `public` 디렉터리 {#the-public-directory}

다음과 같은 에셋이 있다면:

- 소스 코드에서 절대 참조되지 않는 에셋(예: `robots.txt`)
- 정확히 같은 파일 이름을 유지해야 하는 에셋(해싱 없음)
- ...또는 URL을 얻기 위해 먼저 에셋을 가져오고 싶지 않은 경우

프로젝트 루트 아래의 특별한 `public` 디렉터리에 에셋을 배치할 수 있습니다. 이 디렉터리의 에셋은 개발 중에는 루트 경로 `/`에서 제공되고, dist 디렉터리의 루트로 그대로 복사됩니다.

디렉터리는 기본적으로 `<root>/public`이지만, [`publicDir` 옵션](/config/shared-options.md#publicdir)을 통해 설정할 수 있습니다.

참고로 `public` 에셋은 항상 루트 절대 경로로 참조해야 합니다. 예를 들어 `public/icon.png`는 소스 코드에서 `/icon.png`로 참조해야 합니다.

::: tip 임포트와 `public` 디렉터리 중 선택하기

일반적으로 `public` 디렉터리가 제공하는 보장이 꼭 필요한 경우가 아니라면 **에셋을 임포트하는 방식**을 선호하세요.

:::

## new URL(url, import.meta.url) {#new-url-url-import-meta-url}

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)은 현재 모듈의 URL을 노출하는 네이티브 ESM 기능입니다. 네이티브 [URL 생성자](https://developer.mozilla.org/en-US/docs/Web/API/URL)와 함께 사용하면, JavaScript 모듈의 상대 경로를 사용해 정적 에셋의 완전히 해석된 URL을 얻을 수 있습니다.

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

이 코드는 모던 브라우저에서 네이티브로 동작합니다. 실제로 개발 중에는 Vite가 이 코드를 전혀 처리할 필요가 없습니다!

이 패턴은 템플릿 리터럴을 통한 동적 URL도 지원합니다.

```js
function getImageUrl(name) {
  // note that this does not include files in subdirectories
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

프로덕션 빌드 시, Vite는 번들링 및 에셋 해싱 후에도 URL이 올바른 위치를 가리키도록 필요한 변환을 수행합니다. 하지만 URL 문자열은 분석할 수 있도록 정적이어야 합니다. 그렇지 않으면 코드는 그대로 남게 되며, `build.target`이 `import.meta.url`을 지원하지 않는 경우 런타임 오류가 발생할 수 있습니다.

```js
// Vite will not transform this
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

::: warning SSR과 함께 동작하지 않습니다
이 패턴은 `import.meta.url`이 브라우저와 Node.js에서 서로 다른 의미를 가지므로, 서버 사이드 렌더링에 Vite를 사용하는 경우 동작하지 않습니다. 또한 서버 번들은 클라이언트 호스트 URL을 미리 결정할 수 없습니다.
:::
