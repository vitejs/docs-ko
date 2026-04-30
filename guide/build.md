# 프로덕션 빌드 {#building-for-production}

프로덕션에 앱을 배포할 때가 되었다면, 간단히 `vite build` 명령을 실행해주세요. 기본적으로 `<root>/index.html`을 빌드 진입점으로 사용하며, 정적 호스팅 서비스에서 제공하기에 적합한 애플리케이션 번들을 생성합니다. 많이 사용하는 서비스에 대한 가이드는 [정적 웹 페이지로 배포하기](./static-deploy)를 확인해 주세요.

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~037q?via=vite" title="프로덕션 빌드">Scrimba에서 인터랙티브 강의 보기</ScrimbaLink>

## 브라우저 지원 현황 {#browser-compatibility}

기본적으로 프로덕션 번들은 [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available 타겟에 포함된 모던 브라우저를 가정합니다. 기본 브라우저 지원 범위는 다음과 같습니다:

<!-- Search for the `ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET` constant for more information -->

- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

타깃을 직접 지정하고자 한다면 [`build.target` 설정](/config/build-options.md#build-target)을 이용할 수 있습니다. 다만 가장 낮은 타깃은 `es2015` 이며, 이보다 더 낮은 타깃으로 설정하더라도 Vite는 최소한 [네이티브 ESM 동적 임포트](https://caniuse.com/es6-module-dynamic-import)와 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)를 지원하는 브라우저에서 동작한다고 가정합니다:

<!-- Search for the `defaultEsbuildSupported` constant for more information -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

알아두어야 할 사항은, Vite는 오로지 구문 변환만 진행할 뿐 **기본적으로 폴리필을 다루지 않는다는 점** 입니다. 만약 폴리필이 필요하다면, 브라우저 UserAgent 문자열을 기반으로 폴리필 번들을 자동 생성해 주는 https://cdnjs.cloudflare.com/polyfill/ 을 이용해 주세요.

레거시 브라우저는 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)를 통해 지원할 수 있습니다. 이 플러그인은 레거시 청크와 이에 대응하는 ES 언어 기능 폴리필을 자동으로 생성합니다. 레거시 청크는 네이티브 ESM을 지원하지 않는 브라우저에서만 조건부로 로드됩니다.

## Public Base Path {#public-base-path}

- [에셋 가져오기](./assets) 섹션과 관련이 있는 내용입니다.

중첩된 공개 경로 아래에 프로젝트를 배포하는 경우, 간단히 [`base` 설정 옵션](/config/shared-options.md#base)을 지정하면 모든 에셋 경로가 그에 맞게 다시 작성됩니다. 이 옵션은 `vite build --base=/my/public/path/`와 같이 커맨드 라인 플래그로도 지정할 수 있습니다.

JS(`import`), CSS(`url()`), 그리고 `.html` 파일에서 참조되는 에셋 파일의 URL들은 빌드 시 이 Base Path를 기준으로 가져올 수 있도록 자동으로 맞춰지게 됩니다.

만약 동적으로 에셋의 URL을 생성해야 하는 경우라면, `import.meta.env.BASE_URL`을 이용해주세요. 이 상수는 빌드 시 Public Base Path로 변환되어 이를 이용해 동적으로 가져오려는 에셋에 대한 URL을 생성할 수 있습니다. 다만 정확히 `import.meta.env.BASE_URL`과 동일한 문자열에 대해 치환하는 방식이며, `import.meta.env['BASE_URL']`과 같은 경우 Public Base Path로 치환되지 않는다는 것을 유의해주세요.

더욱 상세한 설정이 필요하다면 [Base 옵션 상세 설정](#advanced-base-options) 섹션을 참고해주세요.

### 상대 경로 Base {#relative-base}

만약 Base 경로를 미리 알 수 없는 경우라면, `"base": "./"` 또는 `"base": ""` 설정을 통해 상대 경로 Base를 사용할 수 있습니다. 이렇게 하면 생성되는 모든 URL이 각 파일을 기준으로 상대 경로가 됩니다.

:::warning 상대 경로 Base 사용 시 오래된 브라우저 지원

상대 경로 Base를 사용하기 위해서는 `import.meta`를 지원하는 브라우저가 필요합니다. [`import.meta`를 지원하지 않는 브라우저](https://caniuse.com/mdn-javascript_operators_import_meta)를 지원해야 한다면, [`legacy` 플러그인](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)을 사용해 주세요.

:::

## 빌드 커스터마이즈하기 {#customizing-the-build}

빌드는 여러 [build 설정 옵션](/config/build-options.md)을 통해 커스터마이즈할 수 있습니다. 특히 `build.rolldownOptions`를 통해 내부 [Rolldown 옵션](https://rolldown.rs/reference/)을 직접 조정할 수 있습니다:

```js [vite.config.js]
export default defineConfig({
  build: {
    rolldownOptions: {
      // https://rolldown.rs/reference/
    },
  },
})
```

예를 들어, 빌드 중에만 적용되는 플러그인을 사용해 여러 Rolldown 출력을 지정할 수 있습니다.

## 청크를 만드는 방식 {#chunking-strategy}

[`build.rolldownOptions.output.codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting)을 사용해 청크를 분할하는 방식을 구성할 수 있습니다([Rolldown 문서](https://rolldown.rs/in-depth/manual-code-splitting)를 참고해 주세요). 프레임워크를 사용하는 경우, 청크 분할 방식 구성은 해당 프레임워크 문서를 참고해 주세요.

## 로드 에러 처리하기 {#load-error-handling}

Vite는 동적 임포트에 실패했을 때 `vite:preloadError` 이벤트를 발생시킵니다. `event.payload`에는 원본 임포트 에러가 포함되어 있으며, `event.preventDefault()`를 호출하면 에러가 발생하지 않습니다.

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // 예: 페이지 새로고침
})
```

새로운 배포가 시작되면 호스팅 서비스에서 이전에 배포된 에셋을 삭제할 가능성이 있습니다. 그 결과, 새로운 배포 이전에 사이트를 방문했던 사용자는 임포트 에러를 마주할 수 있습니다. 이 에러는 사용자의 기기에 존재하는 에셋이 만료되었음에도, 이에 대응하는 이전의 청크를 임포트하려고 하기 때문에 발생합니다. 위 이벤트는 이러한 상황을 해결하는 데 사용이 가능합니다. 이 경우 이전 에셋이 계속 참조되지 않도록 HTML 파일에 `Cache-Control: no-cache`를 설정해야 합니다.

## 파일 변경 시 다시 빌드하기 {#rebuild-on-files-changes}

`vite build --watch` 명령으로 rollup watcher를 활성화할 수 있습니다. 또는 `build.watch` 옵션에서 내부 [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch)를 직접 조정할 수도 있습니다:

```js [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rolldown.rs/reference/InputOptions.watch
    },
  },
})
```

`--watch` 플래그가 활성화된 상태에서는 번들링될 파일이 변경되면 다시 빌드됩니다. 설정 파일과 그 디펜던시를 변경한 경우에는 빌드 명령을 다시 시작해야 한다는 점에 유의하세요.

## Multi-Page App {#multi-page-app}

아래와 같은 구조의 소스 코드를 갖고 있다고 가정해봅시다.

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

개발 시에는 `/nested/`로 이동하거나 링크하기만 하면 됩니다 - 일반적인 정적 파일 서버처럼 예상한 대로 동작합니다.

빌드 시에는 여러 `.html` 파일을 진입점으로 지정하기만 하면 됩니다:

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'nested/index.html'),
      },
    },
  },
})
```

다른 루트를 지정하더라도 입력 경로를 해석할 때 `import.meta.dirname`은 여전히 `vite.config.js` 파일이 위치한 폴더를 가리킨다는 점을 기억하세요. 따라서 `resolve`의 인자에 `root` 엔트리도 추가해야 합니다.

HTML 파일의 경우, Vite는 `rolldownOptions.input` 객체에 지정된 엔트리 이름을 무시하고, dist 폴더에 HTML 에셋을 생성할 때 파일의 해석된 id를 대신 따릅니다. 이는 개발 서버가 작동하는 방식과 일관된 구조를 보장합니다.

## 라이브러리 모드 {#library-mode}

만약 브라우저 기반의 라이브러리를 개발하고 있다면, 실제 라이브러리를 임포트하는 테스트/데모 페이지에서 대부분의 시간을 보내고 있을 가능성이 큽니다. Vite는 `index.html`을 이용해 좀 더 나은 개발 경험을 마련해줍니다.

라이브러리 배포를 위해 번들링할 때가 되면, [`build.lib` 설정 옵션](/config/build-options.md#build-lib)을 사용하세요. 또한 라이브러리에 번들링하고 싶지 않은 디펜던시를 `vue` 또는 `react`처럼 반드시 외부화해야 합니다:

::: code-group

```js twoslash [vite.config.js (single entry)]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      // 적절한 확장자가 추가됩니다
      fileName: 'my-lib',
    },
    rolldownOptions: {
      // 라이브러리에 번들링되면 안 되는 디펜던시는
      // 반드시 외부화해 주세요
      external: ['vue'],
      output: {
        // UMD 빌드에서 사용할 전역 변수를 제공합니다
        // 외부화된 디펜던시용입니다
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

```js twoslash [vite.config.js (multiple entries)]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(import.meta.dirname, 'lib/main.js'),
        secondary: resolve(import.meta.dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rolldownOptions: {
      // 라이브러리에 번들링되면 안 되는 디펜던시는
      // 반드시 외부화해 주세요
      external: ['vue'],
      output: {
        // UMD 빌드에서 사용할 전역 변수를 제공합니다
        // 외부화된 디펜던시용입니다
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

:::

패키지의 진입점이 되는 파일에는 패키지의 사용자가 `import` 할 수 있도록 `export` 구문이 포함되게 됩니다:

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

이러한 설정으로 `vite build` 명령을 실행하면 라이브러리 배포를 위한 Rollup 프리셋이 사용되며, 두 가지 번들 포맷을 생성합니다:

- `es` 및 `umd` (진입점이 하나인 경우)
- `es` 및 `cjs` (진입점이 다수인 경우)

참고로 이 포맷은 [`build.lib.formats`](/config/build-options.md#build-lib) 옵션으로 설정할 수 있습니다.

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

라이브러리에 권장되는 `package.json`은 다음과 같습니다:

::: code-group

```json [package.json (single entry)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

```json [package.json (multiple entries)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

:::

### CSS 지원 {#css-support}

만약 라이브러리에서 CSS를 임포트하는 경우, 빌드된 JS 파일과 함께 단일 CSS 파일로 번들링됩니다. 예를 들어 `dist/my-lib.css`와 같이 말이죠. 파일 이름은 기본적으로 `build.lib.fileName`을 따르지만, [`build.lib.cssFileName`](/config/build-options.md#build-lib)을 통해 변경할 수도 있습니다.

사용자가 CSS 파일을 임포트할 수 있도록 `package.json`에 CSS 파일을 익스포트할 수도 있습니다:

```json {12}
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

::: tip 파일 확장자
`package.json`에 `"type": "module"`이 명시되어 있지 않으면 Vite는 Node.js 호환성을 위해 다른 파일 확장자를 생성합니다. 즉, `.js`는 `.mjs`가 되고, `.cjs`는 `.js`가 됩니다.
:::

::: tip 환경 변수
라이브러리 모드에서 모든 [`import.meta.env.*`](./env-and-mode.md)는 프로덕션용으로 빌드 시 정적으로 대체됩니다. 그러나 `process.env.*`는 그렇지 않기에 라이브러리를 사용하는 측에서 이를 동적으로 변경할 수 있습니다. 만약 이 역시 정적으로 대체되길 원한다면 `define: { 'process.env.NODE_ENV': '"production"' }`을 사용하거나, 번들러와 런타임과의 호환성을 위해 [`esm-env`](https://github.com/benmccann/esm-env)을 사용할 수 있습니다.
:::

::: warning 심화 활용법
라이브러리 모드는 브라우저 지향 및 JS 프레임워크 라이브러리를 위한 간단하고 명확한 설정을 포함합니다. 제작 중이신 라이브러리가 브라우저 대상이 아니거나 고도의 빌드 플로우가 요구된다면 [tsdown](https://tsdown.dev/) 또는 [Rolldown](https://rolldown.rs/)을 직접 사용할 수 있습니다.
:::

## Base 옵션 상세 설정 {#advanced-base-options}

::: warning
실험적인 기능입니다. [피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13834).
:::

고급 사용 사례에서는 배포된 에셋과 public 파일이 서로 다른 경로에 있을 수 있습니다. 예를 들어 서로 다른 캐시 전략을 사용하기 위한 경우입니다.
사용자는 세 가지 다른 경로로 배포하도록 선택할 수 있습니다:

- 생성된 엔트리 HTML 파일 (SSR 중 처리될 수 있음)
- 생성된 해시 에셋 (JS, CSS, 및 이미지와 같은 기타 파일 타입)
- 복사된 [public 파일](assets.md#the-public-directory)

이러한 시나리오에서는 하나의 정적인 [base](#public-base-path)만으로는 충분하지 않습니다. Vite는 `experimental.renderBuiltUrl`을 사용해 빌드 중 고급 base 옵션을 실험적으로 지원합니다.

```ts twoslash
import type { UserConfig } from 'vite'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
// ---cut-after---
}
```

해시된 에셋과 public 파일이 함께 배포되지 않는 경우, 함수에 전달된 두 번째 `context` 매개변수에 포함된 에셋 `type`을 사용해 각 그룹의 옵션을 독립적으로 정의할 수 있습니다.

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostId, hostType, type }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    } else if (path.extname(hostId) === '.js') {
      return {
        runtime: `window.__assetsPath(${JSON.stringify(filename)})`
      }
    } else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  },
},
// ---cut-after---
}
```

전달되는 `filename`은 디코딩된 URL이며, 함수가 URL 문자열을 반환하는 경우에도 디코딩된 URL이어야 한다는 점에 유의하세요. Vite는 URL을 렌더링할 때 인코딩을 자동으로 처리합니다. `runtime`이 포함된 객체가 반환되는 경우에는 런타임 코드가 있는 그대로 렌더링되므로, 필요한 곳에서 인코딩을 직접 처리해야 합니다.
