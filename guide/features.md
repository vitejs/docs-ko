# 지원하는 기능들 {#features}

기본적으로 vite는 여타 정적 파일 서버와 크게 다르지 않습니다. 다만, vite는 네이티브 ESM 말고도 기존 번들러에서 제공하던 기능을 대부분 지원한다는 차이점이 있습니다.

## NPM을 이용한 디펜던시 `import` 그리고 사전 번들링 {#npm-dependency-resolving-and-pre-building}

다음 코드는 네이티브 ES에서 정상적으로 실행되지 않습니다:

```js
import { someMethod } from 'my-dep'
```

모듈의 위치를 찾을 수 없기 때문인데, vite는 다음을 기준으로 모듈을 가져오기 때문에 위 코드 역시 정상적으로 실행됩니다.

1. Vite를 통해 ESM 스타일로 [사전에 번들링 된](./dep-pre-bundling) CommonJS 및 UMD\* 모듈. 이 과정은 [Esbuild](https://esbuild.github.io/)를 통해 이루어지며, JavaScript 기반의 다른 번들러보다 빠른 콜드-스타트가 가능합니다. (\* Universal Module Definition: CommonJS와 AMD 스타일의 모듈을 둘 다 지원하는 모듈 형태)

2. `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd`와 같이 URL을 이용해 ESM을 지원하는 브라우저에서 모듈을 가져올 수 있도록 `import` 구문을 수정.

참고로, **디펜던시는 반드시 캐시됩니다.**

vite는 HTTP 헤더를 이용해 요청한 디펜던시를 브라우저에서 캐싱하도록 합니다. 만약 디펜던시의 수정 또는 디버깅이 필요하다면 [여기](./dep-pre-bundling#browser-cache)를 참고해주세요.

## Hot Module Replacement {#hot-module-replacement}

vite는 기본적으로 ESM를 통해 [HMR API](./api-hmr)를 제공합니다. HMR 기능이 있는 프레임워크는 API를 활용하여 페이지를 다시 로드하거나 애플리케이션 상태를 날려버리지 않고 즉각적이고 정확한 업데이트를 제공할 수 있습니다. vite는 [Vue Single File Components](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue), [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) 또는 [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite)과 같은 First-party HMR\* 모듈을 제공하고 있습니다. (\* Vite에서 직접 제공하는 HMR 모듈)

물론, [`create-vite`](./)에서 제공하는 템플릿 안에는 HMR 모듈이 포함되어 있기 때문에 굳이 위와 같은 방법을 따르지 않아도 됩니다.

## TypeScript {#typescript}

vite는 `.ts` 파일에 대한 컴파일링 및 Import 역시 지원합니다.

### 트랜스파일만 수행 {#transpile-only}

Vite는 `.ts` 파일에 대해서 **트랜스파일링만** 수행하며, 타입 검사는 IDE와 빌드 프로세스에서 수행된다고 가정합니다.

Vite가 변환 과정의 일부로 타입 검사를 수행하지 않는 이유는 두 작업이 기본적으로 다르기 때문입니다. 트랜스파일링은 파일 단위로 작동할 수 있으며, 이는 Vite의 온디맨드 컴파일 모델과 완벽하게 일치합니다. 이에 반해 타입 검사는 전체 모듈 그래프에 대한 탐색이 필요합니다. Vite의 변환 파이프 라인에 타입 검사를 추가하게 된다면, 결국 Vite의 속도 이점은 사라지게 될 것입니다.

Vite의 역할은 소스 모듈을 가능한 빠르게 브라우저에서 실행할 수 있는 형태로 변환하는 것입니다. 따라서 이를 위해 Vite의 변환 파이프 라인에서 정적 분석 검사를 분리하는 것을 권장합니다. 이러한 원칙은 ESLint와 같은 다른 정적 분석 검사에도 적용됩니다.

- 프로덕션 빌드를 위해서는 Vite의 빌드 명령어에 `tsc --noEmit`을 추가로 실행할 수 있습니다.

- 개발 중 IDE에서 제공하는 힌트 이상의 기능이 필요하다면, 별도의 프로세스에서 `tsc --noEmit --watch`를 실행해주세요. 만약 브라우저에서 직접 타입 에러를 확인하고 싶다면 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)를 사용하는 것을 권장합니다.

Vite의 TypeScript 컴파일링은 [Esbuild](https://github.com/evanw/esbuild)를 이용하며, TypeScript 소스 코드를 JavaScript 소스 코드로 변환하는 작업에 대해 `tsc` 대비 약 20~30배 정도 빠른 퍼포먼스를 보이고 있습니다. (HMR은 50ms 미만)

참고로 타입만을 가져오는 경우 잘못 번들링이 될 수 있으며, 이는 [타입 전용 Imports와 Exports](https://www.typescriptlang.org/ko/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)를 사용하여 이 문제를 우회할 수 있습니다:

```ts
import type { T } from 'only/types'
export type { T }
```

### 타입스크립트 컴파일러 옵션 {#typescript-compiler-options}

`tsconfig.json` 파일 내 `compilerOptions` 설정들의 값을 조작할 때는 특별한 주의가 필요합니다.

#### `isolatedModules` {#isolatedmodules}

`true`로 설정해주세요.

`esbuild`는 타입에 대한 정보 없이 변환(Transpilation)만을 수행하기에, const enum 또는 암시적으로 타입만을 가져오는 것과 같은 특정 기능을 지원하지 않습니다.

이를 감지하기 위해 `tsconfig.json` 내 `compilerOptions` 설정을 `"isolatedModules": true`와 같이 설정해줘야만 하며, 이 설정으로 TS가 위와 같은 상황에서 작동하지 않는 기능들에 대해 경고할 수 있게 됩니다.

그러나 [`vue`](https://github.com/vuejs/core/issues/1228)와 같은 일부 라이브러리는 `"isolatedModules": true`로 설정할 경우 타입 체크가 정상적으로 동작하지 않습니다. 이러한 경우에는 해당 모듈이 이슈를 수정할 때 까지 `"skipLibCheck": true`를 사용해 오류가 발생되지 않도록 해주세요.

#### `useDefineForClassFields` {#usedefineforclassfields}

Vite 2.5.0 부터는 TypeScript의 변환 대상이 `ESNext` 또는 `ES2022` 이상인 경우, 기본 값을 `true`로 설정합니다. 이는 [`tsc` 버전 4.3.2 이상](https://github.com/microsoft/TypeScript/pull/42663) 및 ECMAScript 표준을 따르도록 하는 설정입니다.

그러나 다른 프로그래밍 언어나 이전 버전의 TypeScript를 사용하던 사람들에게는 직관적이지 않은 내용일 수 있습니다. 이에 대한 자세한 정보는 [TypeScript 3.7 릴리스 노트](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier)를 참고할 수 있습니다.

또한, [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties)나 [Vue 클래스 컴포넌트 8.X](https://github.com/vuejs/vue-class-component/issues/465)와 같은 대부분의 라이브러리는 `"useDefineForClassFields": true`인 것으로 가정하고 동작합니다. 따라서 만약 클래스의 필드에 크게 의존하는 라이브러리를 사용하는 경우라면, 이러한 라이브러리를 사용하는 것에 대해 옵션을 수정하는 경우 상당한 주의를 기울어야 합니다.

다만 [`lit-element`](https://github.com/lit/lit-element/issues/1030)를 포함해 일부 라이브러리는 아직 이 새로운 기본값이 적용되지 않았습니다. 이러한 경우에는 `useDefineForClassFields`의 값을 `false`로 설정해주세요.

#### 빌드 결과에 영향을 미치는 또 다른 컴파일러 옵션들 {#other-compiler-options-affecting-the-build-result}

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)

다만 `"isolatedModules": true`로 마이그레이션 할 수 없다면, [rollup-plugin-friendly-type-imports](https://www.npmjs.com/package/rollup-plugin-friendly-type-imports)와 같은 써드 파티 플러그인을 사용하는 방법도 있습니다. 그러나 이러한 접근 방식은 Vite에서 공식적으로 지원하는 방법은 아닙니다.

### Client Types {#client-types}

vite는 기본적으로 Node.js API 기반의 타입 시스템을 차용하고 있습니다. 따라서 클라이언트 측의 환경을 위해 Shim을 구성하고자 한다면 아래와 같이 `d.ts` 선언 파일을 추가해주세요.

```typescript
/// <reference types="vite/client" />
```

또는 `tsconfig` 내 `compilerOptions.types` 옵션에 `vite/client`를 명시해 줄 수도 있습니다.

이를 통해 다음에 대한 Shim이 제공됩니다.

- `.svg`와 같은 에셋
- Vite를 통해 주입되는 `import.meta.env`에 명시된 [환경 변수](./env-and-mode#env-variables) 타입들
- `import.meta.hot`에 명시된 [HMR API](./api-hmr) 타입들

::: tip
기본 타입을 재정의하기 위해서는, 타이핑이 포함된 타입 정의 파일을 만든 뒤 `vite/client` 위에 해당 타입 파일에 대한 참조를 추가해야 합니다.

가령 `*.svg`의 기본적인 import 결과를 React 컴포넌트로 만들기 위해서는 다음과 같이 작업해야 합니다:

- `vite-env-override.d.ts` (타이핑을 포함하는 파일):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- `vite/client`에 대한 참조를 포함하는 파일:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## Vue {#vue}

vite는 기본적으로 Vue를 지원하고 있습니다.

- Vue 3 SFC: [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Vue 3 JSX: [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Vue 2.7: [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Vue <2.7: [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)


## JSX {#jsx}

`.jsx`와 `.tsx` 역시 사용이 가능합니다. 마찬가지로 [esbuild](https://esbuild.github.io)를 이용해 컴파일링합니다.

기존에 Vue를 사용했던 개발자들은 Vue 3에서 제공하고 있는 API(HMR, 글로벌 컴포넌트, 디렉티브 및 슬롯 등)를 위해 [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)를 사용해야 합니다.

물론 React나 Vue를 사용하지 않는다 해도, [`esbuild` 옵션](/config/shared-options.md#esbuild)을 이용해 `jsxFactory`나 `jsxFragment`를 커스터마이징 할 수 있습니다. Preact를 예로 들어보자면 다음과 같습니다.

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

`.css` 파일을 Import 할 때, 기본적으로 HMR을 위해 `<style>` 태그로 변환되어 불러와지게 됩니다. 물론 String 타입의 모듈로 가져올 수도 있구요.

```js
import style from './style.css'

console.log(style) // 정의한 CSS를 문자열로 가져옵니다.
```

### CSS `@import` 그리고 URL 재정의(Rebasing) {#import-inlining-and-rebasing}

vite는 `postcss-import`를 이용해 CSS의 `@import`를 처리합니다. 또한, CSS `url()`로 참조되는 모든 리소스들(다른 디렉터리에 존재한다 해도)에 대해 별다른 설정 없이 자동으로 Base를 맞추어주는 재정의(Rebasing) 작업 역시 진행해주고 말이죠.

별칭을 이용한 `@import`도 지원하며, URL 재정의나 별칭은 CSS 말고도 Sass와 Less에서도 [사용이 가능합니다](#css-pre-processors).

### PostCSS {#postcss}

만약 프로젝트에 [PostCSS 설정 파일](https://github.com/postcss/postcss-load-config)이 존재한다면, vite는 이를 이용해 모든 CSS 파일에 해당 설정을 적용합니다.

참고로 CSS의 최소화는 PostCSS 이후에 진행되며, [`build.cssTarget`](/config/build-options.md#build-csstarget) 옵션을 이용해 설정할 수 있습니다.

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

참고로, CSS 모듈에 대한 동작 방식을 입맛대로 수정할 수 있습니다. [`css.modules` 옵션](/config/shared-options.md#css-modules) 옵션을 참고해주세요.

가령 `css.modules.localsConvention` 옵션을 camelCase로 설정하게 되면(`localsConvention: 'camelCaseOnly'`), 아래와 같이 가져올 수 있게 됩니다.

```js
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS Pre-processors {#css-pre-processors}

vite는 모던 브라우저만을 타깃으로 하기에, 표준을 준수하도록 [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)과 같은 CSSWG 초안을 구현한 PostCSS 플러그인과 함께 네이티브 CSS 변수를 사용하도록 권고하고 있습니다.

다시 말해, vite는 기본적으로 `.scss`, `.sass`, `.less`, `.styl`, `.stylus`와 CSS 전처리기가 필요한 파일을 지원하지 않습니다. 다만 필요한 경우 어렵지 않게 설치해 바로 사용할 수 있습니다.

```bash
# .scss 그리고 .sass
npm add -D sass

# .less
npm add -D less

# .styl 그리고 .stylus
npm add -D stylus
```

Vue 싱글 파일 컴포넌트를 사용하는 경우, 설치 후 별 다른 설정 없이도 `<style lang="sass">`와 같은 CSS 전처리기를 바로 사용할 수 있습니다.

Sass나 Less에서의 `@import` 별칭 또한 Vite에서 사용이 가능합니다. `url()`로 참조되는 파일들 역시 자동으로 올바른 URL을 갖도록 재정의되고 말이죠.

다만 Stylus의 경우 API 충돌로 인해 Vite의 `@import` 별칭과 URL 재정의 기능이 제공되지 않습니다.

물론 전처리된 CSS 역시 `style.module.scss`와 같이 CSS 모듈처럼 사용이 가능합니다. 똑같이 파일 확장자에 `.module`만 붙여주세요.

### 페이지 내 CSS 주입 비활성화하기 {#disabling-css-injection-into-the-page}

CSS 콘텐츠의 자동 주입은 `?inline` 쿼리 매개변수를 통해 비활성화 할 수 있습니다. 이 경우 처리된 CSS 문자열은 평소와 같이 모듈의 `default export`로 반환되나, 스타일은 페이지에 주입되지 않습니다.

```js
import styles from './foo.css' // 페이지에 스타일이 추가됨
import otherStyles from './bar.css?inline' // 페이지에 스타일이 추가되지 않음
```

## 정적 에셋 {#static-assets}

정적 에셋을 Import 하는 경우, 이에 대한 Public URL이 반환됩니다.

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
// 필드를 지정해 가져오기 (트리-쉐이킹 됩니다.)
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

이렇게 가져온 `modules`를 순회하여 각 모듈에 접근할 수 있게 됩니다.

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

기본적으로 `import.meta.glob` 함수를 이용하면, 동적(Dynamic) Import를 이용해 파일의 청크를 가져옵니다. 만약 동적으로 Import하는 것이 아니라 직접 모듈을 가져오고자 한다면, 두 번 째 인자로 `{ eager: true }` 객체를 전달해주세요.

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
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

### Glob Import As {#glob-import-as}

`import.meta.glob` 역시 [문자열 형태로 에셋 가져오기](https://vitejs-kr.github.io/guide/assets.html#importing-asset-as-string) 기능과 유사하게 파일을 가져올 수 있습니다. 이는 [Import Reflection](https://github.com/tc39/proposal-import-reflection) 구문을 사용합니다:

```js
const modules = import.meta.glob('./dir/*.js', { as: 'raw' })
```

위 코드는 다음과 같이 변환됩니다:

```js
// Vite를 통해 변환된 코드
const modules = {
  './dir/foo.js': 'export default "foo"\n',
  './dir/bar.js': 'export default "bar"\n'
}
```

URL을 통해 에셋을 가져오고자 한다면 `{ as: 'url' }`을 전달해주세요.

### Glob 패턴 배열 {#multiple-patterns}

첫 번째 인자는 Glob 패턴의 배열로 전달할 수 있습니다.

```js
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### 네거티브 Glob 패턴 {#negative-patterns}

`!` 접두사를 이용해 네거티브 Glob 패턴도 나타낼 수 있습니다. Glob 패턴 매칭 결과에서 일부 파일을 무시하고자 하는 경우, 첫 번째 인수에 제외할 네거티브 Glob 패턴을 추가해주세요:

```js
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// 아래는 Vite에 의해 생성되는 코드입니다.
const modules = {
  './dir/foo.js': () => import('./dir/foo.js')
}
```

#### Named Imports {#named-imports}

`import` 옵션을 이용해 모듈의 일부만 가져올 수도 있습니다.

```ts
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// 아래는 Vite에 의해 생성되는 코드입니다.
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup)
}
```

`eager`와 같이 사용하면 모듈에 대한 트리 셰이킹도 가능합니다.

```ts
const modules = import.meta.glob('./dir/*.js', { import: 'setup', eager: true })
```

```ts
// 아래는 Vite에 의해 생성되는 코드입니다:
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

`default export`를 가져오고자 하는 경우에는 `import` 옵션 값을 `default`로 설정해주세요.

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true
})
```

```ts
// 아래는 Vite에 의해 생성되는 코드입니다:
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

#### 커스텀 쿼리 {#custom-queries}

`query` 옵션은 다른 모듈을 가져올 때 사용하는 커스텀 쿼리를 지정할 수 있도록 합니다.

```ts
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true }
})
```

```ts
// 아래는 Vite에 의해 생성되는 코드입니다:
const modules = {
  './dir/foo.js': () => import('./dir/foo.js?foo=bar&bar=true'),
  './dir/bar.js': () => import('./dir/bar.js?foo=bar&bar=true'),
}
```

### Glob Import 유의 사항 {#glob-import-caveats}

Glob 패턴과 관련하여 다음의 사항을 유의해주세요:

- 이 기능들은 Vite에서 제공하는 기능입니다. (ES 표준이나 웹 브라우저에서 제공하는 기능이 아니에요.)
- Glob 패턴 사용 시, 상대 경로(`./`) 또는 절대 경로(`/`) 또는 [`resolve.alias` 옵션](/config/shared-options.md#resolve-alias)을 통해 별칭으로 지정된 경로 만을 이용해야 합니다.
- Glob 패턴 매칭은 [`fast-glob`](https://github.com/mrmlnc/fast-glob)을 이용합니다. 자세한 것은 [지원하는 Glob 패턴 목록](https://github.com/mrmlnc/fast-glob#pattern-syntax)을 참고해주세요.
- `import.meta.glob`으로 전달되는 모든 인자는 **리터럴 값을 전달해야 합니다**. 변수나 표현식을 사용할 수 없습니다.

## 동적 Import {#dynamic-import}

[Glob Import](#glob-import)와 마찬가지로 Vite는 변수를 사용한 동적인 Import도 지원합니다.

```ts
const module = await import(`./dir/${file}.js`)
```

변수 `file`은 깊이가 1인 파일에 대해서만 나타낼 수 있습니다. 가령 `file`이 `foo/bar`인 경우에는 Import가 실패하게 됩니다. 좀 더 다양한 기능이 필요한 경우에는 [Glob Import](#glob-import) 기능을 사용해주세요.

## WebAssembly {#webassembly}

사전에 컴파일 된 `.wasm` 파일 역시 `?init` 쿼리를 이용해 Import가 가능합니다. 불러와진 Wasm 모듈의 `export default`로 Wasm 인스턴스를 `Promise` 형태로 반환하는 초기화 함수가 들어가 있으며, 이를 호출하는 방식으로 사용이 가능합니다:

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
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

프로덕션 빌드 시 `assetsInlineLimit` 옵션\*의 값보다 작은 `.wasm` 파일은 Base64 문자열 포맷으로 변환됩니다. 그렇지 않은 경우, `dist` 디렉터리에 파일이 복사되어 요청(Fetch) 시 불러오는 방식으로 동작하게 됩니다. (\* [`assetsInlineLimit` doc](/config/build-options.md#build-assetsinlinelimit))

::: warning
[WebAssembly를 위한 ES 모듈 제안 사항](https://github.com/WebAssembly/esm-integration)은 현재 지원되지 않습니다. 이 대신 [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) 또는 기타 커뮤니티 플러그인을 사용해 이를 처리하세요.
:::

## Web Workers {#web-workers}

### 생성자를 통해 가져오기 {#import-with-constructors}

웹 워커 스크립트는 [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) 및 [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker)를 통해서도 가져올 수 있습니다. 접미사를 사용하는 방식에 비해 이는 표준에 좀 더 가까우며, 일반적으로 워커를 사용할 때 **권장되는** 방식입니다.

```ts
const url = new URL('./worker.js', import.meta.url)
const worker = new Worker(url)
```

"모듈" 타입의 워커를 생성할 수 있도록 생성자에 옵션을 전달할 수도 있습니다:

```ts
const url = new URL('./worker.js', import.meta.url)
const worker = new Worker(url, {
  type: 'module'
})
```

### 쿼리 접미사를 통해 가져오기 {#import-with-query-suffixes}

웹 워커 스크립트는 `?worker` 또는 `?sharedworker` 접미사를 붙여 가져올 수 있습니다. 모듈의 `export default` 로는 워커의 생성자가 들어가게 됩니다.

```js
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

물론, `import` 대신 `importScripts()` 함수\*를 이용할 수도 있습니다. 다만 이 경우 개발 환경에서는 브라우저의 네이티브 API에만 의존하여 크롬에서만 동작한다는 것을 유의해주세요. 물론 프로덕션 빌드 시 다양한 브라우저를 지원하도록 컴파일됩니다. (\* [`importScripts()` MDN doc](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts))

마지막으로, 기본적으로 워커의 경우 프로덕션 빌드 분리된 청크로 컴파일됩니다. 만약 분리된 청크가 아니라 Base64 포맷의 문자열로 이를 사용하고자 한다면, `inline` 쿼리를 이용해주세요:

```js
import MyWorker from './worker?worker&inline'
```

만약 워커를 URL로 검색하고자 한다면, `url` 쿼리를 추가해주세요:

```js
import MyWorker from './worker?worker&url'
```

모든 워커에 대한 번들링 설정은 [워커 옵션](/config/worker-options.md)을 참고해주세요.

## 빌드 최적화 {#build-optimizations}

> 아래는 추가적인 설정 없이 기본적으로 빌드 프로세스에 적용되는 기능들에 대한 목록입니다. 물론, 필요 시 각각의 기능들에 대한 비활성화가 가능합니다.

### CSS 코드 분리 {#css-code-splitting}

vite는 비동기적으로 불러와지는 청크 내에 CSS 코드가 포함된 경우, 이를 자동으로 추출해 파일로 분리합니다. 이후 해당 청크를 불러올 때 `<link>` 태그를 이용해 분리된 CSS 코드를 불러오게끔 하며, CSS가 모두 계산된 후에 청크를 렌더하도록 합니다. 굳이 왜 이렇게 복잡한 과정을 거칠까요? 바로 이 과정을 통해 CSS가 렌더링될 때 화면이 잠깐 반짝이는 [FOUC 현상](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.)을 회피할 수 있게 되기 때문입니다.

물론, 모든 CSS가 그냥 일반적인 각각의 파일로 저장된 경우라면 굳이 이러한 기능을 사용할 필요가 없습니다. 이러한 경우 [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) 옵션의 값을 `false`로 설정해 비활성화가 가능합니다.

### Preload Directives Generation {#preload-directives-generation}

vite는 빌드 시 Direct Import 구문에 대해 `<link ref="modulepreload">` 디렉티브\*를 이용해 미리 모듈을 캐싱하도록 자동으로 변환합니다. 덕분에 해당 모듈을 필요로 하는 경우 이를 바로 사용할 수 있게 됩니다. (\* `modulepreload`: 더 자세한 내용은 [MDN doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/modulepreload) 또는 [Google developers](https://developers.google.com/web/updates/2017/12/modulepreload) 문서를 참고해주세요.)

### Async Chunk Loading Optimization {#async-chunk-loading-optimization}

빌드 시, 때때로 Rollup은 "공통(Common)" 청크 파일을 생성합니다. 보통 두 개 이상의 모듈에서 공유되는 청크가 이러한데, 이를 Dynamic Import를 이용해 불러오는 경우 다음과 같은 상황이 발생됩니다. (\* 브라우저는 `A`와 `B` 모듈을 필요로 하며(Dynamic Import), `A`와 `B` 모듈은 공통적으로 모듈 `C`를 필요로 하는 경우(Direct Import)입니다.)

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

최적화되지 않은 경우, 먼저 비동기적으로 `A` 청크가 불러와지게 되고, `A` 청크가 모두 파싱된 후에서야 `C` 청크가 필요하다는 사실을 알게 되기에 다음과 같은 네트워크 왕복이 필요합니다.

```
Entry ---> A ---> C
```

vite는 Preload 스텝을 이용해 `A`를 가져올 때 `C` 청크를 **병렬적(Parallel)으로** 가져올 수 있도록 Dynamic Import 구문을 자동으로 재작성합니다.

```
Entry ---> (A + C)
```

vite는 모든 Direct Import 구문에 대해 Preload 하도록 함으로써, 쓸 데 없이 낭비되는 네트워크 왕복을 줄이도록 구성합니다.
