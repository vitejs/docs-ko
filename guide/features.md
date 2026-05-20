# 지원하는 기능들 {#features}

기본적으로 vite는 여타 정적 파일 서버와 크게 다르지 않습니다. 다만, vite는 네이티브 ESM 말고도 기존 번들러에서 제공하던 기능을 대부분 지원한다는 차이점이 있습니다.

## npm을 이용한 디펜던시 임포트 그리고 사전 번들링 {#npm-dependency-resolving-and-pre-building}

다음 코드는 네이티브 ES에서 정상적으로 실행되지 않습니다:

```js
import { someMethod } from 'my-dep'
```

위 임포트는 브라우저에서 오류를 발생시킵니다. Vite는 제공되는 모든 소스 파일에서 이러한 베어 모듈 임포트를 감지하고 다음을 수행합니다:

1. 페이지 로딩 속도를 개선하고 CommonJS / UMD 모듈을 ESM으로 변환하기 위해 이를 [사전 번들링](./dep-pre-bundling)합니다. 사전 번들링 단계는 [Rolldown](https://rolldown.rs/)으로 수행되며, Vite의 콜드 스타트 시간을 JavaScript 기반 번들러보다 훨씬 빠르게 만듭니다.

2. `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd`와 같이 URL을 이용해 ESM을 지원하는 브라우저에서 모듈을 가져올 수 있도록 `import` 구문을 수정합니다.

참고로, **디펜던시는 반드시 캐시됩니다.**

vite는 HTTP 헤더를 이용해 요청한 디펜던시를 브라우저에서 캐싱하도록 합니다. 만약 디펜던시의 수정 또는 디버깅이 필요하다면 [여기](./dep-pre-bundling#browser-cache)를 참고해주세요.

## 핫 모듈 교체 {#hot-module-replacement}

vite는 기본적으로 ESM를 통해 [HMR API](./api-hmr)를 제공합니다. HMR 기능이 있는 프레임워크는 API를 활용하여 페이지를 다시 로드하거나 애플리케이션 상태를 날려버리지 않고 즉각적이고 정확한 업데이트를 제공할 수 있습니다. vite는 [Vue Single File Components](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue), [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) 또는 [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite)과 같은 First-party HMR 모듈을 제공하고 있습니다.

물론, [`create-vite`](./)에서 제공하는 템플릿 안에는 HMR 모듈이 포함되어 있기 때문에 굳이 위와 같은 방법을 따르지 않아도 됩니다.

## TypeScript {#typescript}

vite는 `.ts` 파일에 대한 컴파일링 및 임포트 역시 지원합니다.

### 트랜스파일만 수행 {#transpile-only}

Vite는 `.ts` 파일에 대해서 **트랜스파일링만** 수행하며, 타입 검사는 IDE와 빌드 프로세스에서 수행된다고 가정합니다.

Vite가 변환 과정의 일부로 타입 검사를 수행하지 않는 이유는 두 작업이 기본적으로 다르기 때문입니다. 트랜스파일링은 파일 단위로 작동할 수 있으며, 이는 Vite의 온디맨드 컴파일 모델과 완벽하게 일치합니다. 이에 반해 타입 검사는 전체 모듈 그래프에 대한 탐색이 필요합니다. Vite의 변환 파이프 라인에 타입 검사를 추가하게 된다면, 결국 Vite의 속도 이점은 사라지게 될 것입니다.

Vite의 역할은 소스 모듈을 가능한 빠르게 브라우저에서 실행할 수 있는 형태로 변환하는 것입니다. 따라서 이를 위해 Vite의 변환 파이프 라인에서 정적 분석 검사를 분리하는 것을 권장합니다. 이러한 원칙은 ESLint와 같은 다른 정적 분석 검사에도 적용됩니다.

- 프로덕션 빌드를 위해서는 Vite의 빌드 명령어에 `tsc --noEmit`을 추가로 실행할 수 있습니다.

- 개발 중 IDE에서 제공하는 힌트 이상의 기능이 필요하다면, 별도의 프로세스에서 `tsc --noEmit --watch`를 실행해주세요. 만약 브라우저에서 직접 타입 에러를 확인하고 싶다면 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)를 사용하는 것을 권장합니다.

Vite는 TypeScript를 JavaScript로 트랜스파일하기 위해 기본 `tsc`보다 빠른 [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer.html)를 사용하며, HMR 업데이트는 50ms 미만으로 브라우저에 반영될 수 있습니다.

참고로 타입만을 가져오는 경우 잘못 번들링이 될 수 있으며, 이는 [타입 전용 Imports와 Exports](https://www.typescriptlang.org/ko/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)를 사용하여 이 문제를 우회할 수 있습니다:

```ts
import type { T } from 'only/types'
export type { T }
```

### 타입스크립트 컴파일러 옵션 {#typescript-compiler-options}

Vite는 `tsconfig.json`의 일부 옵션을 존중하고, 이에 대응하는 Oxc Transformer 옵션을 설정합니다. 각 파일에 대해 Vite는 가장 가까운 상위 디렉터리의 `tsconfig.json`을 사용합니다. 해당 `tsconfig.json`에 [`references`](https://www.typescriptlang.org/tsconfig/#references) 필드가 있다면, Vite는 [`include`](https://www.typescriptlang.org/tsconfig/#include)와 [`exclude`](https://www.typescriptlang.org/tsconfig/#exclude) 필드를 만족하는 참조된 설정 파일을 사용합니다.

Vite 설정과 `tsconfig.json`에 같은 옵션이 모두 설정된 경우, Vite 설정의 값이 우선합니다.

`tsconfig.json` 파일 내 `compilerOptions` 설정들의 값을 조작할 때는 특별한 주의가 필요합니다.

#### `isolatedModules` {#isolatedmodules}

- [TypeScript 문서](https://www.typescriptlang.org/tsconfig#isolatedModules)

`true`로 설정해주세요.

이는 Oxc Transformer가 타입 정보 없이 트랜스파일만 수행하기 때문에, const enum이나 암시적 타입 전용 임포트 같은 일부 기능을 지원하지 않기 때문입니다.

이를 감지하기 위해 `tsconfig.json` 내 `compilerOptions` 설정을 `"isolatedModules": true`와 같이 설정해줘야만 하며, 이 설정으로 TS가 위와 같은 상황에서 작동하지 않는 기능들에 대해 경고합니다.

디펜던시가 `"isolatedModules": true`와 잘 동작하지 않는다면, upstream에서 수정될 때까지 `"skipLibCheck": true`를 사용해 오류를 일시적으로 억제할 수 있습니다.

#### `useDefineForClassFields` {#usedefineforclassfields}

- [TypeScript 문서](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

TypeScript 변환 대상이 `ES2022` 또는 `ESNext` 이상인 경우, 기본값은 `true`가 됩니다. 이는 [TypeScript 4.3.2+ 동작 방식](https://github.com/microsoft/TypeScript/pull/42663)과 동일합니다.
그 외 TypeScript 변환 대상은 기본적으로 `false`로 설정됩니다.

`true`는 표준 ECMAScript 런타임 동작입니다.

클래스 필드에 크게 의존하는 라이브러리를 사용하는 경우, 해당 라이브러리의 의도된 사용법에 주의하세요.
라이브러리 대부분은 `"useDefineForClassFields": true`를 기대하지만, 이를 지원하지 않는 경우 명시적으로 `useDefineForClassFields`를 `false`로 설정할 수 있습니다.

#### `target` {#target}

- [TypeScript 문서](https://www.typescriptlang.org/tsconfig#target)

Vite는 [esbuild](https://esbuild.github.io/)와 동일한 동작을 따라 `tsconfig.json`의 `target` 값을 무시합니다.

개발 시 타깃을 지정하려면 [`oxc.target`](/config/shared-options.html#oxc) 옵션을 사용할 수 있으며, 최소한의 트랜스파일을 위해 기본값은 `esnext`입니다. 빌드에서는 [`build.target`](/config/build-options.html#build-target) 옵션이 `oxc.target`보다 높은 우선순위를 가지며, 필요한 경우 이 옵션도 설정할 수 있습니다.

#### `emitDecoratorMetadata` {#emitdecoratormetadata}

- [TypeScript 문서](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)

이 옵션은 부분적으로만 지원됩니다. 완전한 지원에는 TypeScript 컴파일러의 타입 추론이 필요하지만, 이는 지원되지 않습니다. 자세한 내용은 [Oxc Transformer 문서](https://oxc.rs/docs/guide/usage/transformer/typescript#decorators)를 참고해 주세요.

#### `paths` {#paths}

- [TypeScript 문서](https://www.typescriptlang.org/tsconfig/#paths)

`resolve.tsconfigPaths: true`를 지정하면 Vite가 `tsconfig.json`의 `paths` 옵션을 사용해 import를 해석하도록 할 수 있습니다.

이 기능에는 성능 비용이 있으며, [TypeScript 팀은 외부 도구의 동작을 변경하기 위해 이 옵션을 사용하는 것을 권장하지 않습니다](https://www.typescriptlang.org/tsconfig/#paths:~:text=Note%20that%20this%20feature%20does%20not%20change%20how%20import%20paths%20are%20emitted%20by%20tsc%2C%20so%20paths%20should%20only%20be%20used%20to%20inform%20TypeScript%20that%20another%20tool%20has%20this%20mapping%20and%20will%20use%20it%20at%20runtime%20or%20when%20bundling.). 이 점에 유의하세요.

#### 빌드 결과에 영향을 미치는 또 다른 컴파일러 옵션들 {#other-compiler-options-affecting-the-build-result}

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
Vite 스타터 템플릿은 TypeScript의 특정 버전과 설정만을 지원하는 라이브러리가 있을 수 있기 때문에, 디펜던시에 대한 타입 체크를 수행하지 않기 위해 기본값으로 `"skipLibCheck": "true"`를 설정하고 있습니다. 자세한 내용은 [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688)을 참고해 주세요.
:::

### Client Types {#client-types}


```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client", "some-other-global-lib"]
  }
}
```

[`compilerOptions.types`](https://www.typescriptlang.org/tsconfig#types)가 지정된 경우, 표시되는 모든 `@types` 패키지가 아니라 이 패키지들만 전역 스코프에 포함됩니다. TS 5.9부터는 이 방식을 권장합니다.

::: details triple-slash 디렉티브 사용하기

또는 `d.ts` 선언 파일을 추가할 수 있습니다:

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />
```

:::

`vite/client`는 다음과 같은 타입 심(shim)을 제공합니다:

- `.svg`와 같은 에셋
- `import.meta.env`에 Vite가 주입하는 [환경 변수](./env-and-mode#env-variables)에 대한 타입 정의
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
- `compilerOptions.types`를 사용한다면, 해당 파일이 `tsconfig.json`에 포함되어 있는지 확인하세요:
  ```json [tsconfig.json]
  {
    "include": ["src", "./vite-env-override.d.ts"]
  }
  ```
- triple-slash 디렉티브를 사용한다면, `vite/client`에 대한 참조가 있는 파일(일반적으로 `vite-env.d.ts`)을 업데이트하세요:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## HTML {#html}

HTML 파일은 Vite 프로젝트에서 [중심적인 역할](/guide/#index-html-and-project-root)을 하며, 애플리케이션 진입점으로 사용됩니다. 이를 통해 단일 페이지 및 [다중 페이지 애플리케이션](/guide/build.html#multi-page-app)을 쉽게 구축할 수 있습니다.

프로젝트 루트에 있는 모든 HTML 파일은 해당 디렉터리 경로로 직접 접근할 수 있습니다:

- `<root>/index.html` -> `http://localhost:5173/`
- `<root>/about.html` -> `http://localhost:5173/about.html`
- `<root>/blog/index.html` -> `http://localhost:5173/blog/index.html`

`<script type="module" src>`, `<link href>`와 같이 HTML 요소에서 참조되는 에셋들은 앱의 일부로 번들링됩니다. 지원되는 전체 요소 목록은 다음과 같습니다:

- `<audio src>`
- `<embed src>`
- `<img src>` 및 `<img srcset>`
- `<image href>` and `<image xlink:href>`
- `<input src>`
- `<link href>` 및 `<link imagesrcset>`
- `<object data>`
- `<script type="module" src>`
- `<source src>` 및 `<source srcset>`
- `<track src>`
- `<use href>` 및 `<use xlink:href>`
- `<video src>` 및 `<video poster>`
- `<meta content>`
  - `name` 속성이 `msapplication-tileimage`, `msapplication-square70x70logo`, `msapplication-square150x150logo`, `msapplication-wide310x150logo`, `msapplication-square310x310logo`, `msapplication-config`, 또는 `twitter:image`와 일치하는 경우에만
  - 또는 `property` 속성이 `og:image`, `og:image:url`, `og:image:secure_url`, `og:audio`, `og:audio:secure_url`, `og:video`, 또는 `og:video:secure_url`와 일치하는 경우에만

```html {4-5,8-9}
<!doctype html>
<html>
  <head>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <img src="/src/images/logo.svg" alt="logo" />
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

특정 요소에 대해 HTML 처리를 비활성화하려면 해당 요소에 `vite-ignore` 속성을 추가할 수 있습니다. 이는 외부 에셋이나 CDN을 참조할 때 유용할 수 있습니다.

## 프레임워크 {#frameworks}

모든 모던 프레임워크는 Vite를 지원합니다. 프레임워크 플러그인 대부분은 각 프레임워크 팀에서 관리하지만, Vue와 React용 공식 Vite 플러그인은 vite 조직에서 관리합니다:

- Vue 지원: [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Vue JSX 지원: [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- React 지원: [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)
- SWC를 사용하는 React 지원: [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)
- [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) 지원: [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

자세한 내용은 [플러그인 가이드](/plugins/)를 확인해 주세요.

## JSX {#jsx}

`.jsx`와 `.tsx` 파일은 기본적으로 지원됩니다. JSX 트랜스파일링 역시 [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer/)를 통해 처리됩니다.

선택한 프레임워크는 일반적으로 JSX를 기본적으로 구성해 둡니다. 예를 들어 Vue 사용자는 HMR, 전역 컴포넌트 해석, 디렉티브, 슬롯 등 Vue 3 전용 기능을 제공하는 공식 [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) 플러그인을 사용해야 합니다.

자체 프레임워크와 함께 JSX를 사용하는 경우, [`oxc` 옵션](/config/shared-options.md#oxc)을 사용해 커스텀 `jsxFactory` 및 `jsxFragment`를 구성할 수 있습니다. 예를 들어 Preact 플러그인은 다음과 같이 사용할 수 있습니다:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  oxc: {
    jsx: {
      importSource: 'preact',
    },
  },
})
```

자세한 내용은 [Oxc Transformer 문서](https://oxc.rs/docs/guide/usage/transformer/jsx.html)를 참고해 주세요.

수동 임포트를 피하려면 `jsxInject`(Vite 전용 옵션)를 사용해 JSX 헬퍼를 주입할 수 있습니다:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  oxc: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS {#css}

`.css` 파일을 임포트하면 HMR을 지원하는 `<style>` 태그를 통해 해당 내용이 페이지에 주입됩니다.

### CSS `@import` 그리고 URL 재정의(Rebasing) {#import-inlining-and-rebasing}

Vite는 `postcss-import`를 통해 CSS `@import` 인라이닝을 지원하도록 미리 구성되어 있습니다. CSS `@import`에서도 Vite 별칭이 적용됩니다. 또한 임포트된 파일이 서로 다른 디렉터리에 있더라도 모든 CSS `url()` 참조는 정확성을 보장하기 위해 항상 자동으로 재정의됩니다.

별칭을 이용한 `@import`도 지원하며, URL 재정의나 별칭은 CSS 말고도 Sass와 Less에서도 [사용이 가능합니다](#css-pre-processors).

### PostCSS {#postcss}

만약 프로젝트에 [PostCSS 설정 파일](https://github.com/postcss/postcss-load-config)이 존재한다면, vite는 이를 이용해 모든 CSS 파일에 해당 설정을 적용합니다.

참고로 CSS의 축소화는 PostCSS 이후에 진행되며, [`build.cssTarget`](/config/build-options.md#build-csstarget) 옵션을 이용해 설정할 수 있습니다.

### CSS Modules {#css-modules}

`.module.css` 확장자로 끝나는 모든 CSS 파일들은 [CSS 모듈 파일](https://github.com/css-modules/css-modules)로 취급되며, 일반적인 JavaScript 모듈처럼 사용이 가능합니다.

```css [example.module.css]
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

참고로, CSS 모듈에 대한 동작 방식을 입맛대로 수정할 수 있습니다. [`css.modules` 옵션](/config/shared-options.md#css-modules) 옵션을 참고해주세요.

가령 `css.modules.localsConvention` 옵션을 camelCase로 설정하게 되면(`localsConvention: 'camelCaseOnly'`), 아래와 같이 가져올 수 있게 됩니다.

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS Pre-processors {#css-pre-processors}

vite는 모던 브라우저만을 타깃으로 하기에, 표준을 준수하도록 [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)과 같은 CSSWG 초안을 구현한 PostCSS 플러그인과 함께 네이티브 CSS 변수를 사용하도록 권고하고 있습니다.

그렇지만 Vite는 `.scss`, `.sass`, `.less`, `.styl`, `.stylus` 파일에 대한 기본 지원을 제공합니다. 이를 위해 Vite 전용 플러그인을 설치할 필요는 없지만, 해당 전처리기 자체는 설치해야 합니다:

```bash
# .scss and .sass
npm add -D sass-embedded # or sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

Vue 싱글 파일 컴포넌트를 사용하는 경우, 설치 후 별 다른 설정 없이도 `<style lang="sass">`와 같은 CSS 전처리기를 바로 사용할 수 있습니다.

Vite는 Vite 별칭도 동작할 수 있도록 Sass와 Less에 대한 `@import` 해석을 개선합니다. 또한 Sass/Less 파일 내에서 상대 경로로 루트 및 다른 디렉터리를 대상으로 `url()` 참조를 사용하는 경우, 정확성을 보장하기 위해 자동으로 재정의됩니다. 변수나 보간을 통해 시작되는 `url()` 참조에 대한 재정의는 API 제약으로 인해 지원되지 않습니다.

다만 Stylus의 경우 API 충돌로 인해 Vite의 `@import` 별칭과 URL 재정의 기능이 제공되지 않습니다.

물론 전처리된 CSS 역시 `style.module.scss`와 같이 CSS 모듈처럼 사용이 가능합니다. 똑같이 파일 확장자에 `.module`만 붙여주세요.

### 페이지 내 CSS 주입 비활성화하기 {#disabling-css-injection-into-the-page}

`?inline` 쿼리 매개변수를 사용하면 CSS 내용의 자동 주입을 끌 수 있습니다. 이 경우 처리된 CSS 문자열은 평소처럼 모듈의 기본 익스포트로 반환되지만, 스타일은 페이지에 주입되지 않습니다.

```js twoslash
import 'vite/client'
// ---cut---
import './foo.css' // will be injected into the page
import otherStyles from './bar.css?inline' // will not be injected
```

::: tip 참고
CSS 파일에서의 기본 및 명명된 Import(`import style from './foo.css'`)는 Vite 5에서 제거되었습니다. 이 대신 `?inline` 쿼리를 사용해주세요.
:::

### Lightning CSS {#lightning-css}

Vite는 기본적으로 프로덕션 빌드에서 CSS를 축소화할 때 [Lightning CSS](https://lightningcss.dev/)를 사용합니다. 다만 다른 CSS 처리는 여전히 PostCSS가 사용됩니다.

CSS 처리 전체에 Lightning CSS를 사용하는 실험적 지원도 있습니다. [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer)를 추가해 활성화할 수 있습니다.

이를 구성하려면 [`css.lightningcss`](../config/shared-options.md#css-lightningcss) 설정 옵션에 Lightning CSS 옵션을 전달할 수 있습니다. CSS Modules를 구성하려면 [`css.modules`](../config/shared-options.md#css-modules) 대신 [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html)를 사용해야 합니다. `css.modules`는 PostCSS가 CSS Modules를 처리하는 방식을 구성합니다.

## 정적 에셋 {#static-assets}

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05pq?via=vite" title="Static Assets in Vite">Scrimba에서 인터랙티브 강의를 시청하세요</ScrimbaLink>

정적 에셋을 임포트하면 제공될 때 해석된 공개 URL을 반환합니다:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

특수 쿼리를 사용해 에셋이 로드되는 방식을 변경할 수 있습니다:

```js twoslash
import 'vite/client'
// ---cut---
// 에셋을 명시적으로 URL로 로드합니다(파일 크기에 따라 자동으로 인라인 처리됨).
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// 에셋을 문자열로 로드합니다.
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// Web Worker를 로드합니다.
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// 빌드 시 Web Worker를 base64 문자열로 인라인 처리합니다.
import InlineWorker from './worker.js?worker&inline'
```

자세한 내용은 [정적 에셋 처리](./assets)를 참고해 주세요.

## JSON {#json}

JSON 파일은 직접 임포트할 수 있으며, 명명된 임포트도 지원됩니다:

```js twoslash
import 'vite/client'
// ---cut---
// 전체 객체를 import합니다.
import json from './example.json'
// 루트 필드를 명명된 export로 import합니다. 트리 셰이킹에 도움이 됩니다.
import { field } from './example.json'
```

## Glob Import {#glob-import}

Vite는 특수한 `import.meta.glob` 함수를 통해 파일 시스템에서 여러 모듈을 임포트하는 기능을 지원합니다:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

위 코드는 다음과 같이 변환됩니다:

```js
// Vite가 생성한 코드
const modules = {
  './dir/bar.js': () => import('./dir/bar.js'),
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

그런 다음 `modules` 객체의 키를 순회하여 해당 모듈에 접근할 수 있습니다:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

매칭된 파일은 기본적으로 동적 임포트를 통해 지연 로드되며, 빌드 중 별도 청크로 분리됩니다. 모든 모듈을 직접 임포트하고 싶다면(예: 해당 모듈의 사이드 이펙트가 먼저 적용되어야 하는 경우), 두 번째 인자로 `{ eager: true }`를 전달할 수 있습니다:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

위 코드는 다음과 같이 변환됩니다:

```js
// Vite가 생성한 코드
import * as __vite_glob_0_0 from './dir/bar.js'
import * as __vite_glob_0_1 from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

### 여러 패턴 {#multiple-patterns}

첫 번째 인자는 glob 배열로 전달할 수 있습니다. 예시는 다음과 같습니다:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### 네거티브 패턴 {#negative-patterns}

네거티브 glob 패턴도 지원됩니다(`!` 접두사 사용). 결과에서 일부 파일을 무시하려면 첫 번째 인자에 제외할 glob 패턴을 추가할 수 있습니다:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// Vite가 생성한 코드
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### 명명된 임포트 {#named-imports}

`import` 옵션을 사용해 모듈의 일부만 임포트할 수 있습니다.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// Vite가 생성한 코드
const modules = {
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
}
```

`eager`와 함께 사용하면 해당 모듈에 대해 트리 셰이킹을 활성화할 수도 있습니다.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// Vite가 생성한 코드:
import { setup as __vite_glob_0_0 } from './dir/bar.js'
import { setup as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

기본 익스포트를 임포트하려면 `import`를 `default`로 설정하세요.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// Vite가 생성한 코드:
import { default as __vite_glob_0_0 } from './dir/bar.js'
import { default as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

#### 커스텀 쿼리 {#custom-queries}

`query` 옵션을 사용해 임포트에 쿼리를 제공할 수도 있습니다. 예를 들어 에셋을 [문자열로](/guide/assets.html#importing-asset-as-string) 또는 [URL로](/guide/assets.html#importing-asset-as-url) 임포트할 수 있습니다:

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// Vite가 생성한 코드:
const moduleStrings = {
  './dir/bar.svg': () => import('./dir/bar.svg?raw').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/bar.svg': () => import('./dir/bar.svg?url').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?url').then((m) => m['default']),
}
```

다른 플러그인이 소비할 수 있도록 커스텀 쿼리를 제공할 수도 있습니다:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

#### 기본 경로 {#base-path}

`base` 옵션을 사용해 임포트의 기본 경로를 제공할 수도 있습니다:

```ts twoslash
import 'vite/client'
// ---cut---
const modulesWithBase = import.meta.glob('./**/*.js', {
  base: './base',
})
```

```ts
// Vite가 생성한 코드:
const modulesWithBase = {
  './dir/foo.js': () => import('./base/dir/foo.js'),
  './dir/bar.js': () => import('./base/dir/bar.js'),
}
```

`base` 옵션은 임포터 파일 기준 상대 디렉터리 경로이거나 프로젝트 루트 기준 절대 경로여야 합니다. 별칭과 가상 모듈은 지원되지 않습니다.

상대 경로인 glob만 해석된 `base`를 기준으로 해석됩니다.

`base`가 제공되면 결과 모듈 키는 모두 해당 `base`를 기준으로 상대 경로가 되도록 수정됩니다.

### Glob Import 유의 사항 {#glob-import-caveats}

Glob 패턴과 관련하여 다음의 사항을 유의해주세요:

- 이 기능들은 Vite에서 제공하는 기능입니다. (ES 표준이나 웹 브라우저에서 제공하는 기능이 아니에요.)
- Glob 패턴 사용 시, 상대 경로(`./`) 또는 절대 경로(`/`) 또는 [`resolve.alias` 옵션](/config/shared-options.md#resolve-alias)을 통해 별칭으로 지정된 경로 만을 이용해야 합니다.
- glob 매칭은 [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby)를 통해 수행됩니다. [지원되는 glob 패턴](https://superchupu.dev/tinyglobby/comparison)은 해당 문서를 확인해 주세요.
- `import.meta.glob`으로 전달되는 모든 인자는 **리터럴 값을 전달해야 합니다**. 변수나 표현식을 사용할 수 없습니다.

## 동적 Import {#dynamic-import}

[Glob Import](#glob-import)와 마찬가지로 Vite는 변수를 사용한 동적인 Import도 지원합니다.

```ts
const module = await import(`./dir/${file}.js`)
```

변수는 한 단계 깊이의 파일 이름만 나타낼 수 있습니다. 가령 `file`이 `'foo/bar'`인 경우 임포트는 실패합니다. 더 고급 사용 사례에는 [Glob Import](#glob-import) 기능을 사용할 수 있습니다.

동적 임포트가 번들링되려면 다음 규칙도 충족해야 합니다:

- 임포트는 `./` 또는 `../`로 시작해야 합니다. ``import(`./dir/${foo}.js`)``는 유효하지만, ``import(`${foo}.js`)``는 유효하지 않습니다.
- 임포트는 파일 확장자로 끝나야 합니다. ``import(`./dir/${foo}.js`)``는 유효하지만, ``import(`./dir/${foo}`)``는 유효하지 않습니다.
- 자기 디렉터리로 임포트하는 경우 파일 이름 패턴을 지정해야 합니다. ``import(`./prefix-${foo}.js`)``는 유효하지만, ``import(`./${foo}.js`)``는 유효하지 않습니다.

이 규칙은 번들링할 의도가 없는 파일을 실수로 임포트하지 않도록 적용됩니다. 예를 들어 이 규칙이 없다면 `import(foo)`가 파일 시스템의 모든 항목을 번들링하게 됩니다.

## WebAssembly {#webassembly}

사전에 컴파일 된 `.wasm` 파일 역시 `?init` 쿼리를 이용해 가져올 수 있습니다.
불러와진 모듈의 `export default`는 [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance)의 `Promise`를 반환하는 초기화 함수가 들어가 있습니다:

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

초기화 함수를 호출할 때 `imports` 옵션을 사용할 수도 있는데, 이 값은 [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) 함수의 두 번째 인자인 importObject로 전달됩니다:

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

프로덕션 빌드 시 `assetsInlineLimit` 옵션의 값보다 작은 크기를 갖는 `.wasm` 파일은 Base64 문자열 포맷으로 변환됩니다. 파일의 크기가 그보다 크다면 [정적 에셋](./assets)으로 처리되어 요청(Fetch) 시 이를 가져오는 방식으로 동작합니다.

::: tip 참고
[WebAssembly를 위한 ES 모듈 제안 사항](https://github.com/WebAssembly/esm-integration)은 현재 지원되지 않습니다.
이 대신 [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) 또는 기타 커뮤니티 플러그인을 사용해 이를 처리하세요.
:::

::: warning SSR 빌드에서는 Node.js 호환 런타임만 지원됩니다

파일을 로드하는 범용 방식이 없기 때문에, `.wasm?init`의 내부 구현은 `node:fs` 모듈에 의존합니다. 따라서 이 기능은 SSR 빌드에서 Node.js 호환 런타임에서만 동작합니다.

:::

### WebAssembly 모듈에 접근하기 {#accessing-the-webassembly-module}

여러 번 인스턴스화 하는 등의 이유로 `Module` 객체에 대한 접근이 필요하다면, [URL 접미사를 이용해](./assets#explicit-url-imports) 에셋을 가져오고, 이를 이용해 인스턴스화를 수행해 주세요:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

## Web Workers {#web-workers}

### 생성자로 임포트하기 {#import-with-constructors}

웹 워커 스크립트는 [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)와 [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker)를 사용해 임포트할 수 있습니다. 워커 접미사 방식과 비교하면 이 문법은 표준에 더 가깝고, 워커를 생성하는 **권장** 방식입니다.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

"module" 타입의 워커를 생성할 수 있도록 생성자에 옵션을 전달할 수도 있습니다:

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

워커 탐지는 `new Worker()` 선언 내부에서 직접 `new URL()` 생성자를 사용할 때만 작동합니다. 또한 모든 옵션 매개변수는 정적 값(예: 문자열 리터럴)이어야 합니다.

### 쿼리 접미사를 통해 가져오기 {#import-with-query-suffixes}

웹 워커 스크립트는 `?worker` 또는 `?sharedworker` 접미사를 붙여 임포트할 수 있습니다. 모듈의 `export default`로는 워커의 생성자가 들어가게 됩니다.

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

워커 스크립트에서 `importScripts()` 대신 ESM `import` 구문을 사용할 수도 있습니다. **참고**: 개발 서버에서는 [브라우저 네이티브 API](https://caniuse.com/?search=module%20worker)에 의존하지만, 프로덕션 빌드에서는 다양한 브라우저를 지원하도록 컴파일됩니다.

마지막으로, 기본적으로 워커의 경우 프로덕션 빌드 분리된 청크로 컴파일됩니다. 만약 분리된 청크가 아니라 Base64 포맷의 문자열로 이를 사용하고자 한다면, `inline` 쿼리를 이용해주세요:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

만약 워커를 URL로 검색하고자 한다면, `url` 쿼리를 추가해주세요:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

모든 워커에 대한 번들링 설정은 [워커 옵션](/config/worker-options.md)을 참고해주세요.

## 콘텐츠 보안 정책 (Content Security Policy, CSP) {#content-security-policy-csp}

CSP를 배포하려면 Vite 내부적으로 특정 지시문 또는 구성을 설정해야 합니다.

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value) {#nonce-random}

[`html.cspNonce`](/config/shared-options#html-cspnonce) 옵션이 설정되면, Vite는 스타일시트 및 모듈 프리로드를 위한 `<script>`, `<style>` 그리고 `<link>` 태그에 지정된 nonce 속성을 추가합니다. 이 옵션이 설정되면 Vite는 메타 태그(`<meta property="csp-nonce" nonce="PLACEHOLDER" />`)를 주입합니다.

`property="csp-nonce"` 속성을 가진 메타 태그의 nonce 값은 개발 중 또는 빌드 후 필요에 따라 Vite에서 사용합니다.

:::warning
각 요청마다 자리 표시자를 고유한 값으로 대체해야 합니다. 이를 따르지 않으면 리소스 정책은 쉽게 우회될 수 있습니다. (자세한 내용은 Vite CSP 플레이그라운드의 [vite.config.js 파일](https://github.com/vitejs/vite/blob/1d5eec477e5f1951e024e2105fd4a7ad536cb48b/playground/csp/vite.config.js)을 참고해 주세요. - 옮긴이)
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>) {#data}

빌드 시, Vite는 일정 크기 이하의 에셋을 데이터 URI로 인라인합니다. 관련 지시문(예: [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src), [`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src))에 `data:`를 허용하거나, [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit)으로 설정하여 인라인을 비활성화해야 합니다.

:::warning
[`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)에 `data:`를 허용하지 마세요. 임의 스크립트 삽입을 허용하게 됩니다.
:::

## 라이선스 {#license}

Vite는 [`build.license`](/config/build-options.md#build-license) 옵션을 사용해 빌드에 사용된 모든 디펜던시의 라이선스를 담은 파일을 생성할 수 있습니다. 이 파일을 호스팅하여 앱에서 사용하는 디펜던시를 표시하고 고지할 수 있습니다.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
  },
})
```

이 설정은 다음과 같은 출력이 포함된 `.vite/license.md` 파일을 생성합니다:

```md
# Licenses

The app bundles dependencies which contain the following licenses:

## dep-1 - 1.2.3 (CC0-1.0)

CC0 1.0 Universal

...

## dep-2 - 4.5.6 (MIT)

MIT License

...
```

다른 경로에서 파일을 제공하려면 예를 들어 `{ fileName: 'license.md' }`를 전달하여 `https://example.com/license.md`에서 제공되도록 할 수 있습니다. 자세한 내용은 [`build.license`](/config/build-options.md#build-license) 문서를 참고해 주세요.

## 빌드 최적화 {#build-optimizations}

> 아래는 추가적인 설정 없이 기본적으로 빌드 프로세스에 적용되는 기능들에 대한 목록입니다. 물론, 필요 시 각각의 기능들에 대한 비활성화가 가능합니다.

### CSS 코드 분리 {#css-code-splitting}

vite는 비동기적으로 불러와지는 청크 내에 CSS 코드가 포함된 경우, 이를 자동으로 추출해 파일로 분리합니다. 이후 해당 청크를 불러올 때 `<link>` 태그를 이용해 분리된 CSS 코드를 불러오며, CSS가 모두 계산된 후에 청크를 렌더하도록 합니다. 굳이 왜 이렇게 복잡한 과정을 거칠까요? 바로 이 과정을 통해 CSS가 렌더링될 때 화면이 잠깐 반짝이는 [FOUC 현상](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.)을 회피할 수 있기 때문입니다.

물론, 모든 CSS가 그냥 일반적인 각각의 파일로 저장된 경우라면 굳이 이러한 기능을 사용할 필요가 없습니다. 이러한 경우 [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) 옵션의 값을 `false`로 설정해 비활성화가 가능합니다.

### 프리로드 디렉티브 생성 {#preload-directives-generation}

vite는 빌드 시 Direct Import 구문에 대해 `<link ref="modulepreload">` 디렉티브를 이용해 미리 모듈을 캐싱하도록 자동으로 변환합니다. 덕분에 해당 모듈이 필요할 때 바로 사용할 수 있습니다. (`modulepreload`에 대한 더 자세한 내용은 [MDN doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/modulepreload) 또는 [Google developers](https://developers.google.com/web/updates/2017/12/modulepreload) 문서를 참고해주세요. - 옮긴이)

### 비동기 청크 로딩 최적화 {#async-chunk-loading-optimization}

빌드 시, 때때로 Rollup은 "공통(Common)" 청크 파일을 생성합니다. 보통 두 개 이상의 모듈에서 공유되는 청크가 이러한데, 이를 Dynamic Import를 이용해 불러오는 경우 다음과 같은 상황이 발생됩니다. (브라우저는 `A`와 `B` 모듈을 필요로 하며(Dynamic Import), `A`와 `B` 모듈은 공통적으로 모듈 `C`를 필요로 하는 경우(Direct Import)입니다. - 옮긴이)

<script setup>
import graphSvg from '../images/graph.svg?raw' // 그래프 SVG
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
