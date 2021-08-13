# 지원하는 기능들 {#features}

기본적으로 vite는 여타 정적 파일 서버와 크게 다르지 않습니다. 다만, vite는 네이티브 ESM 말고도 기존 번들러에서 제공하던 기능을 대부분 지원한다는 차이점이 있습니다.

## NPM을 이용한 디펜던시 `import` 그리고 Pre-Bundling {#npm-dependency-resolving-and-pre-building}

다음 코드는 네이티브 ES에서 정상적으로 실행되지 않습니다:

```js
import { someMethod } from 'my-dep'
```

모듈의 위치를 찾을 수 없기 때문인데, vite는 다음을 기준으로 모듈을 가져오기 때문에 위 코드 역시 정상적으로 실행됩니다.

1. Vite를 통해 ESM 스타일로 [미리 번들링 된](./dep-pre-bundling) CommonJS 및 UMD\* 모듈. 이 과정은 [Esbuild](https://esbuild.github.io/)를 통해 이루어지며, JavaScript 기반의 다른 번들러보다 빠른 Cold-starting이 가능합니다. (\* Universal Module Definition: CommonJS와 AMD 스타일의 모듈을 둘 다 지원하는 모듈 형태)

2. `/node_modules/.vite/my-dep.js?v=f3sf2ebd`와 같이 URL을 이용해 ESM을 지원하는 브라우저에서 모듈을 가져올 수 있도록 `import` 구문을 수정.

참고로, **디펜던시는 반드시 캐시됩니다.**

vite는 HTTP 헤더를 이용해 요청한 디펜던시를 브라우저에서 캐싱하도록 합니다. 만약 디펜던시의 수정 또는 디버깅이 필요하다면 [여기](./dep-pre-bundling#browser-cache)를 참고해주세요.

## Hot Module Replacement {#hot-module-replacement}

vite는 이용해 네이티브 ESM 기반의 [HMR API](./api-hmr)을 제공합니다. HRM을 이용하는 프레임워크는 애플리케이션을 다시 시작하지 않고도 일부 컨텐츠만을 갱신할 수 있다는 장점이 있는데, vite는 [Vue Single File Components](https://github.com/vitejs/vite/tree/main/packages/plugin-vue), [React Fast Refresh](https://github.com/vitejs/vite/tree/main/packages/plugin-react-refresh) 또는 [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite)과 같은 First-party HMR\* 모듈을 제공하고 있습니다. (\* Vite에서 직접 제공하는 HMR 모듈)

물론, [`create-vite`](./)에서 제공하는 템플릿 안에는 HMR 모듈이 포함되어 있기 때문에 굳이 위와 같은 방법을 따르지 않아도 됩니다.

## TypeScript {#typescript}

vite는 `.ts` 파일에 대한 컴파일링 및 Import 역시 지원합니다.

단, 타입 체킹은 오로지 IDE 또는 빌드 프로세스에만 의존하며, Vite 자체에서는 `.ts` 파일에 대한 **타입 체킹 작업을 진행하지 않습니다**. 타입 체킹이 필요하다면 필요하다면 `tsc --noEmit`\*을 빌드 스크립트에 넣어주세요. 만약 `*.vue` 소스 코드를 작성중이라면, `vue-tsc`를 설치해 `vue-tsc --noEmit`을 빌드 스크립트에 넣어서 타입 체킹을 하도록 설정할 수 있습니다. (\* `--noEmit`: 컴파일링 없이 타입 체킹만을 수행하는 옵션)

Vite의 TypeScript 컴파일링은 [Esbuild](https://github.com/evanw/esbuild)를 이용하며, TypeScript 소스 코드를 JavaScript 소스 코드로 변환하는 작업에 대해 `tsc` 대비 약 20~30배 정도 빠른 퍼포먼스를 보이고 있습니다. (HMR은 50ms 미만)

이렇게 `esbuild`는 타입의 정보 없이 트랜스파일링만 진행하기에, 각 모듈이 안전한지 확인(경고)이 필요하다면 이를 활성화 할 수 있도록 `tsconfig.json` 파일 내 `compilerOptions` 설정을 `"isolatedModules": true`\*와 같이 구성해줘야 합니다. (\* `isolatedModules`: [ts.transpileModule](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function)과 같은 API를 사용해 각각의 파일로 트랜스파일링 시 해당 모듈이 안전한지 여부를 알려주는 옵션 ([Docs: Isolated Modules -
isolatedModules](https://www.typescriptlang.org/tsconfig#isolatedModules)))

### Client Types {#client-types}

vite는 기본적으로 Node.js API 기반의 타입 시스템을 차용하고 있습니다. 따라서 Client-side의 환경을 위해 Shim을 구성하고자 한다면, `d.ts` 선언 파일을 추가해주세요.

```typescript
/// <reference types="vite/client" />
```

또는, `tsconfig` 내 `compilerOptions.types` 옵션에 `vite/client`를 명시해 줄 수도 있습니다.

이를 통해 다음에 대한 Shim이 제공됩니다.

- `.svg`와 같은 에셋
- Vite를 통해 주입되는 `import.meta.env`에 명시된 [환경 변수](./env-and-mode#env-variables) 타입들
- `import.meta.hot`에 명시된 [HMR API](./api-hmr) 타입들

## Vue {#vue}

vite는 기본적으로 Vue를 지원하고 있습니다.

- Vue 3 SFC : [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)
- Vue 3 JSX : [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)
- Vue 2 : [underfin/vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)

## JSX {#jsx}

`.jsx`와 `.tsx` 역시 사용이 가능합니다. 마찬가지로 [ESBuild](https://esbuild.github.io)를 이용해 컴파일링하며, React 16 스타일의 JSX를 기본적으로 지원합니다. React 17 스타일의 JSX는 [현재 작업 중에 있습니다](https://github.com/evanw/esbuild/issues/334).

기존에 Vue를 사용했던 개발자들은 Vue 3에서 제공하고 있는 API(HRM, 글로벌 컴포넌트, 디렉티브 및 슬롯 등)를 위해 [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)를 사용해야 합니다.

물론 React나 Vue를 사용하지 않는다 해도, [`esbuild` 옵션](/config/#esbuild)을 이용해 `jsxFactory`나 `jsxFragment`를 커스터마이징 할 수 있습니다. Preact를 예로 들어보자면 다음과 같습니다.

```js
// vite.config.js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

자세한 사항은 [esbuild 문서](https://esbuild.github.io/content-types/#jsx)를 참고해주세요.

참고로, Vite에서만 제공되는 옵션인 `jsxInject`를 이용해 JSX에 대한 헬퍼를 사용할 수도 있습니다.

```js
// vite.config.js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

## CSS {#css}

`.css` 파일을 Import 할 때, 기본적으로 HRM을 위해 `<style>` 태그로 변환되어 불러와지게 됩니다. 물론 String 타입의 모듈로 Import할 수도 있구요.

```js
import style from './style.css'

console.log(style) // 정의한 CSS를 문자열로 가져옵니다.
```

### CSS `@import` 그리고 URL 재정의(Rebasing) {#import-inlining-and-rebasing}

vite는 `postcss-import`를 이용해 CSS의 `@import`를 처리합니다. 또한, CSS `url()`로 참조되는 모든 리소스들(다른 디렉터리에 존재한다 해도)에 대해 별다른 설정 없이 자동으로 Base를 맞추어주는 재정의(Rebasing) 작업 역시 진행해주고 말이죠.

별칭을 이용한 `@import`도 지원하며, URL 재정의나 별칭은 CSS 말고도 Sass와 Less에서도 [사용이 가능합니다](#css-pre-processors).

### PostCSS {#postcss}

만약 프로젝트에 [PostCSS 설정 파일](https://github.com/postcss/postcss-load-config)이 존재한다면, vite는 이를 이용해 모든 CSS 파일에 해당 설정을 적용합니다.

### CSS Modules {#css-modules}

`.module.css` 확장자로 끝나는 모든 CSS 파일들은 [CSS 모듈 파일](https://github.com/css-modules/css-modules)로 취급되며, 일반적인 JavaScript 모듈처럼 사용이 가능합니다.

```css
/* example.module.css */
.red {
  color: red;
}
```

```js
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

참고로, CSS 모듈에 대한 동작 방식을 입맛대로 수정할 수 있습니다. [`css.modules` 옵션](/config/#css-modules) 옵션을 참고해주세요.

가령 `css.modules.localsConvention` 옵션을 camelCase로 설정하게 되면(`localsConvention: 'camelCaseOnly'`), 아래와 같이 Import 할 수 있게 됩니다.

```js
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS Pre-processors {#css-pre-processors}

vite는 모던 브라우저만을 타깃으로 하기에, 표준을 준수하도록 [postcss-nesting](https://github.com/jonathantneal/postcss-nesting)과 같은 CSSWG 초안을 구현한 PostCSS 플러그인과 함께 네이티브 CSS 변수를 사용하도록 권고하고 있습니다.

다시 말해, vite는 기본적으로 `.scss`, `.sass`, `.less`, `.styl`, `.stylus`와 CSS 전처리기가 필요한 파일을 지원하지 않습니다. 다만 필요한 경우 어렵지 않게 설치해 바로 사용할 수 있습니다.

```bash
# .scss 그리고 .sass
npm install -D sass

# .less
npm install -D less

# .styl 그리고 .stylus
npm install -D stylus
```

Vue 싱글 파일 컴포넌트를 사용하는 경우, 설치 후 별 다른 설정 없이도 `<style lang="sass">`와 같은 CSS 전처리기를 바로 사용할 수 있습니다.

Sass나 Less에서의 `@import` 별칭 또한 Vite에서 사용이 가능합니다. `url()`로 참조되는 파일들 역시 자동으로 올바른 URL을 갖도록 재정의되고 말이죠.

다만 Stylus의 경우 API 충돌로 인해 Vite의 `@import` 별칭과 URL 재정의 기능이 제공되지 않습니다.

물론 전처리된 CSS 역시 `style.module.scss`와 같이 CSS 모듈처럼 사용이 가능합니다. 똑같이 파일 확장자에 `.module`만 붙여주세요.

## 정적 에셋 {#static-assets}

정적(Static) 에셋을 Import 하는 경우, 이에 대한 Public URL이 반환됩니다.

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

URL 쿼리를 이용해 에셋을 가져올 때 어떻게 이를 가져올 것인지 명시할 수도 있습니다.

```js
// URL로 에셋 가져오기
import assetAsURL from './asset.js?url'
```

```js
// String 타입으로 에셋 가져오기
import assetAsString from './shader.glsl?raw'
```

```js
// 웹 워커 가져오기
import Worker from './worker.js?worker'
```

```js
// Base64 포맷의 문자열 형태로 웹 워커 가져오기
import InlineWorker from './worker.js?worker&inline'
```

좀 더 자세히 알고 싶다면, [정적 에셋 핸들링하기](./assets) 섹션을 참고해주세요.

## JSON {#json}

JSON 파일은 바로 Import가 가능합니다. 물론, 가져올 필드를 지정할 수도 있습니다.

```js
// 객체 형태로 가져오기
import json from './example.json'
// 필드를 지정해 가져오기
import { field } from './example.json'
```

## Glob Import {#glob-import}

vite는 `import.meta.glob` 함수를 이용해 여러 모듈을 한 번에 가져올 수 있도록 지원하고 있습니다. 이 때, Glob 패턴\*을 이용합니다. (\* [Glob 패턴 Wikipedia](https://en.wikipedia.org/wiki/Glob_(programming)))

```js
const modules = import.meta.glob('./dir/*.js')
```

위 코드는 아래와 같이 변환됩니다.

```js
// Vite를 통해 변환된 코드
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```

이렇게 Import한 `modules`를 순회하여 각 모듈에 접근할 수 있게 됩니다.

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

기본적으로 `import.meta.glob` 함수를 이용하면, Dynamic Import를 이용해 Lazy하게 파일의 청크를 가져옵니다. 만약 동적(Dynamic)으로 Import하는 것이 아닌 직접 모듈을 가져오고자 한다면, `import.meta.globEager` 함수를 이용해주세요.

```js
const modules = import.meta.globEager('./dir/*.js')
```

위 코드는 아래와 같이 변환됩니다.

```js
// Vite를 통해 변환된 코드
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

추가적으로, Glob 패턴과 관련하여 다음의 사항을 유의해주세요.

- 이 기능들은 Vite에서 제공하는 기능입니다. (ES 표준이나 웹 브라우저에서 제공하는 기능이 아니에요.)
- Glob 패턴 사용 시, 상대 경로(`./`) 또는 절대 경로(`/`)만을 이용해야 합니다.
- Glob 패턴 매칭은 `fast-glob`을 이용합니다. 자세한 것은 [지원하는 Glob 패턴 목록](https://github.com/mrmlnc/fast-glob#pattern-syntax)을 참고해주세요.

## WebAssembly {#web-assembly}

컴파일 된 `.wasm` 파일 역시 Import가 가능합니다. Wasm 파일의 `export default`로 Wasm 인스턴스에서 Export한 객체를 `Promise` 형태로 반환하는 초기화 함수가 들어가 있으며, 이를 호출하는 방식으로 사용이 가능합니다.

```js
import init from './example.wasm'

init().then((exports) => {
  exports.test()
})
```

참고로 초기화 함수를 호출할 때 `imports` 옵션을 사용할 수 있는데, 이 값은 `WebAssembly.instantiate` 함수\*의 두 번째 인자 값으로 전달됩니다. (\* [`WebAssembly.instantiate` MDN doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate))

```js
init({
  imports: {
    someFunc: () => {
      /* ... */
    }
  }
}).then(() => {
  /* ... */
})
```

배포 버전으로 빌드 시 `assetsInlineLimit` 옵션\*의 값보다 작은 `.wasm` 파일은 Base64 문자열 포맷으로 변환됩니다. 그렇지 않은 경우, `dist` 디렉터리에 파일이 복사되어 요청(Fetch) 시 불러오는 방식으로 동작하게 됩니다. (\* [`assetsInlineLimit` doc](/config/#build-assetsinlinelimit))

## Web Workers {#web-workers}

웹 워커의 경우 `?worker` 또는 `?sharedworker` 문자열을 붙여 Import 할 수 있습니다. 모듈의 `export default`로는 워커의 생성자가 들어가게 됩니다.

```js
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

물론, `import` 대신 `importScripts()` 함수\*를 이용할 수도 있습니다. 다만 이 경우 개발 환경에서는 브라우저의 네이티브 API에만 의존하여 크롬에서만 동작한다는 것을 유의해주세요. 물론 배포 환경으로 빌드 시 다양한 브라우저를 지원하도록 컴파일됩니다. (\* [`importScripts()` MDN doc](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts))

마지막으로, 기본적으로 워커의 경우 배포 시 분리된 청크로 컴파일됩니다. 만약 분리된 청크가 아니라 Base64 포맷의 문자열로 이를 사용하고자 한다면, `inline` 쿼리를 이용해주세요.

```js
import MyWorker from './worker?worker&inline'
```

## 빌드 최적화 {#build-optimizations}

> 아래는 추가적인 설정 없이 기본적으로 빌드 프로세스에 적용되는 기능들에 대한 목록입니다. 물론, 필요 시 각각의 기능들에 대한 비활성화가 가능합니다.

### CSS 코드 분리 {#css-code-splitting}

vite는 비동기적으로 불러와지는 청크 내에 CSS 코드가 포함된 경우, 이를 자동으로 추출해 파일로 분리합니다. 이후 해당 청크를 불러올 때 `<link>` 태그를 이용해 분리된 CSS 코드를 불러오게끔 하며, CSS가 모두 계산된 후에 청크를 렌더하도록 합니다. 굳이 왜 이렇게 복잡한 과정을 거칠까요? 바로 이 과정을 통해 CSS가 렌더링될 때 화면이 잠깐 반짝이는 [FOUC 현상](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.)을 회피할 수 있게 되기 때문입니다.

물론, 모든 CSS가 그냥 일반적인 각각의 파일로 저장된 경우라면 굳이 이러한 기능을 사용할 필요가 없습니다. 이러한 경우 [`build.cssCodeSplit`](/config/#build-csscodesplit) 옵션의 값을 `false`로 설정해 비활성화가 가능합니다.

### Preload Directives Generation {#preload-directives-generation}

vite는 빌드 시 Direct Import 구문에 대해 `<link ref="modulepreload">` 디렉티브\*를 이용해 미리 모듈을 캐싱하도록 자동으로 변환합니다. 덕분에 해당 모듈을 필요로 하는 경우 이를 바로 사용할 수 있게 됩니다. (\* `modulepreload`: 더 자세한 내용은 [MDN doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/modulepreload) 또는 [Google developers](https://developers.google.com/web/updates/2017/12/modulepreload) 문서를 참고해주세요.)

### Async Chunk Loading Optimization {#async-chunk-loading-optimization}

빌드 시, 때때로 Rollup은 "공통(Common)" 청크 파일을 생성합니다. 보통 두 개 이상의 모듈에서 공유되는 청크가 이러한데, 이를 Dynamic Import를 이용해 불러오는 경우 다음과 같은 상황이 발생됩니다. (\* 브라우저는 `A`와 `B` 모듈을 필요로 하며(Dynamic Import), `A`와 `B` 모듈은 공통적으로 모듈 `C`를 필요로 하는 경우(Direct Import)입니다.)

![graph](/images/graph.png)

최적화되지 않은 경우, 먼저 비동기적으로 `A` 청크가 불러와지게 되고, `A` 청크가 모두 파싱된 후에서야 `C` 청크가 필요하다는 사실을 알게 되기에 다음과 같은 네트워크 왕복이 필요합니다.

```
Entry ---> A ---> C
```

vite는 Preload 스텝을 이용해 `A`를 가져올 때 `C` 청크를 **병렬적(Parallel)으로** 가져올 수 있도록 Dynamic Import 구문을 자동으로 재작성합니다.

```
Entry ---> (A + C)
```

vite는 모든 Direct Import 구문에 대해 Preload 하도록 함으로써, 쓸 데 없이 낭비되는 네트워크 왕복을 줄이도록 구성합니다.
