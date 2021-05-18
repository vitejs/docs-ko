# 에셋 가져오기

다음 두 개의 주제와 관련있는 섹션입니다.

- [Public Base Path](./build#public-base-path)
- [`assetsInclude` config option](/config/#assetsinclude)

## URL을 통해 에셋 Import 하기

정적 에셋을 Import하게 되면 에셋에 접근할 수 있는 URL이 반환됩니다.

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

예를 들어, `imgUrl` 객체는 개발 시 `/img.png` 값으로 할당되겠으나, 실제 배포 버전에서는 `/assets/img.2d8efhg.png`와 같은 값\*이 할당됩니다. (\* 여기서 `2d8efhg`는 해시 값을 의미합니다.)

Webpack의 `file-loader`와 비슷한데, 하나 차이점이 있다면 Vite은 절대 경로와 상대 경로 둘 다 사용할 수 있습니다.

- `url()`로 참조되는 CSS의 경우 동일한 방식으로 동작합니다.

- 만약 Vue 플러그인을 사용한다면, [Vue SFC](https://v3.vuejs.org/guide/single-file-component.html) 에셋의 경우 자동으로 변환되어 Import 됩니다.

- 일반적인 이미지, 미디어, 폰트 파일 타입은 자동으로 에셋 목록에 포함됩니다. 물론 [`assetsInclude` 옵션](/config/#assetsinclude)을 이용해 더 많은 파일 타입을 포함하도록 할 수 있습니다.

- 참조된 에셋은 빌드 에셋 그래프의 일부 요소로 포함되며, 파일 이름이 해싱되거나 최적화를 위해 플러그인으로 처리될 수 있습니다.

- [`assetsInlineLimimt` 옵션](/config/#assetsinlinelimit)의 값보다 작은 에셋 파일의 경우, Base64 포맷의 데이터 URL\* 문자열로 가져옵니다. (\* [데이터 URL MDN doc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs))

### 접미사를 이용해 URL로 에셋 가져오기

`assetsInclude` 옵션 또는 URL로 가져오도록 Vite 내부적으로 설정된 리스트에 포함되지 않은 에셋의 경우에도 URL 포맷으로 에셋을 가져오도록 지정할 수 있습니다. `?url` 접미사(Suffix)를 붙여 에셋을 가져오면 되는데, 예를 하나 들어보자면 다음과 같습니다.

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### 문자열 형태로 에셋 가져오기

`?raw` 접미사를 붙여 Import하는 에셋은 문자열 형태로 가져와지게 됩니다.

```js
import shaderString from './shader.glsl?raw'
```

### 스크립트를 Worker로 가져오기

스크립트는 웹 워커로 가져올 수 있는데, 이 때는 `?worker` 접미사를 이용합니다.

```js
// 배포 시에는 청크로 분리됩니다.
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// `inline` 접미사는 Base64 포맷의 문자열로 에셋을 가져옵니다.
import InlineWorker from './shader.js?worker&inline'
```

좀 더 자세한 사항은 [웹 워커 섹션](./features#web-workers)을 참고해주세요.

## `public` 디렉터리

다음 에셋의 경우

- `robots.txt`와 같이 소스 코드에서 참조되지 않는 에셋
- 해싱 없이 항상 같은 이름을 갖는 에셋
- 또는 URL을 얻기 위해 굳이 Import 할 필요 없는 에셋

`public` 디렉터리 아래에 에셋을 위치시키세요. 이 곳에 위치한 에셋은 개발 시에 `/` 경로에, 배포 시에는 `dist` 디렉터리에 위치하게 됩니다.

만약 `<root>/public` 디렉터리가 아닌 다른 디렉터리를 사용하고자 하는 경우, [`publicDir` 옵션](/config/#publicdir)을 이용할 수 있습니다.

마지막으로, 다음의 사항을 유의해주세요.

- `public` 디렉터리에 위치해 있는 에셋을 가져오고자 하는 경우, 항상 루트를 기준으로 하는 절대 경로로 가져와야만 합니다. ( `public/icon.png` 에셋은 소스 코드에서 `/icon.png`으로 접근이 가능합니다.)
- `public` 디렉터리에 위치한 에셋은 JavaScript 코드로 가져올 수 없습니다.
