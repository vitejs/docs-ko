# 프로덕션 빌드 {#building-for-production}

앱을 프로덕션에 배포할 때가 되었다면 `vite build` 명령을 실행하면 됩니다. 기본적으로 `<root>/index.html`을 빌드 진입점으로 사용하며, 정적 호스팅 서비스에서 제공하기에 적합한 애플리케이션 번들을 생성합니다. 인기 있는 서비스별 가이드는 [정적 웹 페이지로 배포하기](./static-deploy)를 확인해 주세요.

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~037q?via=vite" title="Building for Production">Scrimba에서 인터랙티브 강의를 시청하세요</ScrimbaLink>

## 브라우저 호환성 {#browser-compatibility}

기본적으로 프로덕션 번들은 [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available 타깃에 포함된 모던 브라우저를 가정합니다. 기본 브라우저 지원 범위는 다음과 같습니다:

<!-- 자세한 내용은 `ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET` 상수를 검색해 주세요 -->

- Chrome >=111 이상
- Edge >=111 이상
- Firefox >=114 이상
- Safari >=16.4 이상

[`build.target` 설정 옵션](/config/build-options.md#build-target)을 통해 커스텀 타깃을 지정할 수 있으며, 가장 낮은 타깃은 `es2015`입니다. 더 낮은 타깃을 설정하더라도 Vite는 [네이티브 ESM 동적 임포트](https://caniuse.com/es6-module-dynamic-import)와 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)에 의존하므로 다음 최소 브라우저 지원 범위가 필요합니다:

<!-- 자세한 내용은 `defaultEsbuildSupported` 상수를 검색해 주세요 -->

- Chrome >=64 이상
- Firefox >=67 이상
- Safari >=11.1 이상
- Edge >=79 이상

기본적으로 Vite는 구문 변환만 처리하며 **폴리필은 포함하지 않습니다**. 사용자의 브라우저 UserAgent 문자열을 기반으로 폴리필 번들을 자동 생성하는 https://cdnjs.cloudflare.com/polyfill/ 을 확인할 수 있습니다.

레거시 브라우저는 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)를 통해 지원할 수 있습니다. 이 플러그인은 레거시 청크와 대응하는 ES 언어 기능 폴리필을 자동으로 생성합니다. 레거시 청크는 네이티브 ESM을 지원하지 않는 브라우저에서만 조건부로 로드됩니다.

## 공개 기본 경로 {#public-base-path}

- 관련 항목: [에셋 처리](./assets)

프로젝트를 중첩된 공개 경로 아래에 배포한다면 [`base` 설정 옵션](/config/shared-options.md#base)을 지정하면 모든 에셋 경로가 그에 맞게 다시 작성됩니다. 이 옵션은 `vite build --base=/my/public/path/`처럼 커맨드 라인 플래그로도 지정할 수 있습니다.

JS에서 임포트한 에셋 URL, CSS `url()` 참조, `.html` 파일의 에셋 참조는 모두 빌드 중 이 옵션을 따르도록 자동 조정됩니다.

예외는 실행 중 URL을 동적으로 이어 붙여야 하는 경우입니다. 이 경우 전역으로 주입되는 `import.meta.env.BASE_URL` 변수를 사용할 수 있으며, 이 값은 공개 기본 경로입니다. 이 변수는 빌드 중 정적으로 치환되므로 정확히 그대로 나타나야 합니다. 즉, `import.meta.env['BASE_URL']`은 동작하지 않습니다.

더 고급 기본 경로 제어가 필요하다면 [Base 옵션 상세 설정](#advanced-base-options)을 확인해 주세요.

### 상대 경로 base {#relative-base}

기본 경로를 미리 알 수 없다면 `"base": "./"` 또는 `"base": ""`로 상대 기본 경로를 설정할 수 있습니다. 이렇게 하면 생성되는 모든 URL이 각 파일을 기준으로 상대 경로가 됩니다.

:::warning 상대 base 사용 시 오래된 브라우저 지원

상대 base에는 `import.meta` 지원이 필요합니다. [`import.meta`를 지원하지 않는 브라우저](https://caniuse.com/mdn-javascript_operators_import_meta)를 지원해야 한다면 [`legacy` 플러그인](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)을 사용할 수 있습니다.

:::

## 빌드 커스터마이즈하기 {#customizing-the-build}

다양한 [빌드 설정 옵션](/config/build-options.md)을 통해 빌드를 커스터마이즈할 수 있습니다. 특히 `build.rolldownOptions`를 통해 내부 [Rolldown 옵션](https://rolldown.rs/reference/)을 직접 조정할 수 있습니다:

```js [vite.config.js]
export default defineConfig({
  build: {
    rolldownOptions: {
      // https://rolldown.rs/reference/
    },
  },
})
```

예를 들어 빌드 중에만 적용되는 플러그인과 함께 여러 Rolldown 출력을 지정할 수 있습니다.

## 청크 전략 {#chunking-strategy}

[`build.rolldownOptions.output.codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting)을 사용해 청크 분할 방식을 구성할 수 있습니다([Rolldown 문서](https://rolldown.rs/in-depth/manual-code-splitting) 참고). 프레임워크를 사용한다면 청크 분할 구성은 해당 프레임워크 문서를 참고하세요.

## 로드 오류 처리 {#load-error-handling}

Vite는 동적 임포트 로드에 실패하면 `vite:preloadError` 이벤트를 발생시킵니다. `event.payload`에는 원본 임포트 오류가 포함됩니다. `event.preventDefault()`를 호출하면 오류가 throw되지 않습니다.

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // for example, refresh the page
})
```

새 배포가 발생하면 호스팅 서비스가 이전 배포의 에셋을 삭제할 수 있습니다. 그 결과 새 배포 전에 사이트를 방문했던 사용자는 임포트 오류를 만날 수 있습니다. 이는 사용자 기기에서 실행 중인 에셋이 오래되어, 삭제된 이전 청크를 임포트하려 하기 때문에 발생합니다. 이 이벤트는 이러한 상황을 처리하는 데 유용합니다. 이 경우 HTML 파일에 `Cache-Control: no-cache`를 설정해야 합니다. 그렇지 않으면 이전 에셋이 계속 참조될 수 있습니다.

## 파일 변경 시 다시 빌드하기 {#rebuild-on-files-changes}

`vite build --watch`로 watcher를 활성화할 수 있습니다. 또는 `build.watch`를 통해 내부 [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch)를 직접 조정할 수 있습니다:

```js [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rolldown.rs/reference/InputOptions.watch
    },
  },
})
```

`--watch` 플래그가 활성화되면 번들링 대상 파일 변경이 다시 빌드를 트리거합니다. 설정 파일과 그 디펜던시의 변경 사항은 빌드 명령을 다시 시작해야 반영됩니다.

## 멀티 페이지 앱 {#multi-page-app}

다음과 같은 소스 코드 구조가 있다고 가정해 보겠습니다:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

개발 중에는 `/nested/`로 이동하거나 링크하기만 하면 됩니다. 일반 정적 파일 서버처럼 예상대로 동작합니다.

빌드 중에는 여러 `.html` 파일을 진입점으로 지정하기만 하면 됩니다:

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

다른 루트를 지정하더라도 입력 경로를 해석할 때 `import.meta.dirname`은 여전히 `vite.config.js` 파일이 있는 폴더를 가리킨다는 점을 기억하세요. 따라서 `resolve` 인자에 `root` 항목을 추가해야 합니다.

HTML 파일의 경우 Vite는 `rolldownOptions.input` 객체에서 진입점에 부여한 이름을 무시하고, dist 폴더에 HTML 에셋을 생성할 때 파일의 해석된 id를 따릅니다. 이는 개발 서버 동작 방식과 일관된 구조를 보장합니다.

## 라이브러리 모드 {#library-mode}

브라우저 지향 라이브러리를 개발할 때는 실제 라이브러리를 임포트하는 테스트/데모 페이지에서 대부분의 시간을 보내게 됩니다. Vite에서는 이 목적을 위해 `index.html`을 사용해 부드러운 개발 경험을 얻을 수 있습니다.

라이브러리를 배포용으로 번들링할 때는 [`build.lib` 설정 옵션](/config/build-options.md#build-lib)을 사용하세요. 또한 라이브러리에 번들링하고 싶지 않은 디펜던시(예: `vue` 또는 `react`)는 반드시 외부화해야 합니다:

::: code-group

```js twoslash [vite.config.js (single entry)]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      // 적절한 확장자가 추가됩니다.
      fileName: 'my-lib',
    },
    rolldownOptions: {
      // 라이브러리에 번들링하면 안 되는 디펜던시를
      // 반드시 외부화하세요.
      external: ['vue'],
      output: {
        // 외부화된 디펜던시에 대해 UMD 빌드에서 사용할
        // 전역 변수를 제공합니다.
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
      // 라이브러리에 번들링하면 안 되는 디펜던시를
      // 반드시 외부화하세요.
      external: ['vue'],
      output: {
        // 외부화된 디펜던시에 대해 UMD 빌드에서 사용할
        // 전역 변수를 제공합니다.
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

:::

진입 파일은 패키지 사용자가 임포트할 수 있는 익스포트를 포함하게 됩니다:

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

이 설정으로 `vite build`를 실행하면 라이브러리 배포에 맞춘 Rollup 프리셋이 사용되며 두 가지 번들 형식을 생성합니다:

- `es` 및 `umd` (단일 진입점)
- `es` 및 `cjs` (여러 진입점)

형식은 [`build.lib.formats`](/config/build-options.md#build-lib) 옵션으로 구성할 수 있습니다.

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

라이브러리가 CSS를 임포트한다면, 빌드된 JS 파일 옆에 `dist/my-lib.css` 같은 단일 CSS 파일로 번들링됩니다. 이름은 기본적으로 `build.lib.fileName`을 따르지만, [`build.lib.cssFileName`](/config/build-options.md#build-lib)으로 변경할 수도 있습니다.

사용자가 임포트할 수 있도록 `package.json`에서 CSS 파일을 익스포트할 수 있습니다:

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
`package.json`에 `"type": "module"`이 포함되어 있지 않으면, Vite는 Node.js 호환성을 위해 다른 파일 확장자를 생성합니다. `.js`는 `.mjs`가 되고 `.cjs`는 `.js`가 됩니다.
:::

::: tip 환경 변수
라이브러리 모드에서는 프로덕션 빌드 시 모든 [`import.meta.env.*`](./env-and-mode.md) 사용이 정적으로 치환됩니다. 하지만 `process.env.*` 사용은 치환되지 않으므로, 라이브러리 소비자가 이를 동적으로 변경할 수 있습니다. 이것이 바람직하지 않다면 예를 들어 `define: { 'process.env.NODE_ENV': '"production"' }`을 사용해 정적으로 치환하거나, 번들러와 런타임 호환성을 높이기 위해 [`esm-env`](https://github.com/benmccann/esm-env)를 사용할 수 있습니다.
:::

::: warning 고급 사용법
라이브러리 모드는 브라우저 지향 및 JS 프레임워크 라이브러리를 위한 단순하고 의견이 반영된 설정을 포함합니다. 브라우저용이 아닌 라이브러리를 만들거나 고급 빌드 흐름이 필요하다면 [tsdown](https://tsdown.dev/) 또는 [Rolldown](https://rolldown.rs/)을 직접 사용할 수 있습니다.
:::

## Base 옵션 상세 설정 {#advanced-base-options}

::: warning
이 기능은 실험적입니다. [피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13834).
:::

고급 사용 사례에서는 서로 다른 캐시 전략을 사용하기 위해 배포된 에셋과 public 파일이 서로 다른 경로에 있을 수 있습니다.
사용자는 세 가지 다른 경로로 배포하도록 선택할 수 있습니다:

- 생성된 진입 HTML 파일(SSR 중 처리될 수 있음)
- 생성된 해시 에셋(JS, CSS, 이미지 같은 다른 파일 타입)
- 복사된 [public 파일](assets.md#the-public-directory)

이러한 경우에는 하나의 정적 [base](#public-base-path)만으로 충분하지 않습니다. Vite는 `experimental.renderBuiltUrl`을 사용해 빌드 중 고급 base 옵션을 실험적으로 지원합니다.

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

해시 에셋과 public 파일이 함께 배포되지 않는다면, 함수에 전달되는 두 번째 `context` 매개변수에 포함된 에셋 `type`을 사용해 각 그룹의 옵션을 독립적으로 정의할 수 있습니다.

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

전달되는 `filename`은 디코딩된 URL이며, 함수가 URL 문자열을 반환하는 경우 그 값 역시 디코딩되어 있어야 합니다. Vite는 URL을 렌더링할 때 자동으로 인코딩을 처리합니다. `runtime`을 포함한 객체를 반환하는 경우에는 런타임 코드가 그대로 렌더링되므로 필요한 곳에서 직접 인코딩을 처리해야 합니다.
