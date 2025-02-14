# 프로덕션 빌드 {#building-for-production}

앱을 어느정도 완성하셨나요? 프로덕션으로 빌드하고자 한다면 `vite build` 명령을 실행해주세요. 빌드 시 기본적으로 `<root>/index.html` 파일이 빌드를 위한 진입점으로 사용되며, 정적 호스팅을 위한 형태로 진행됩니다. 추가적으로, GitHub Pages와 같은 정적 호스팅 서비스를 위한 빌드 방법을 알고싶다면 [정적 웹 페이지로 배포하기](./static-deploy) 섹션을 참고해주세요.

## 브라우저 지원 현황 {#browser-compatibility}

기본적으로 프로덕션 빌드는 [네이티브 ES 모듈](https://caniuse.com/es6-module), [네이티브 ESM 동적 임포트](https://caniuse.com/es6-module-dynamic-import), [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta), [null 병합 연산자](https://caniuse.com/mdn-javascript_operators_nullish_coalescing), 그리고 [BigInt](https://caniuse.com/bigint)와 같은 모던 JavaScript를 지원하는 환경에서 동작한다고 가정합니다. 아래는 별다른 설정을 하지 않은 경우 지원하는 브라우저 범위입니다:

<!-- Search for the `ESBUILD_MODULES_TARGET` constant for more information -->

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

타깃을 직접 지정하고자 한다면 [`build.target` 설정](/config/build-options.md#build-target)을 이용할 수 있습니다. 다만 가장 낮은 타깃은 `es2015` 이며, 이보다 더 낮은 타깃으로 설정하더라도 Vite는 최소한 [네이티브 ESM 동적 임포트](https://caniuse.com/es6-module-dynamic-import)와 [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta)를 지원하는 브라우저에서 동작한다고 가정합니다:

<!-- Search for the `defaultEsbuildSupported` constant for more information -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

알아두어야 할 사항은, Vite는 오로지 구문 변환만 진행할 뿐 **기본적으로 폴리필을 다루지 않는다는 점** 입니다. 만약 폴리필이 필요하다면, 브라우저 User Agent를 기반으로 폴리필 번들을 생성해 주는 https://cdnjs.cloudflare.com/polyfill/ 을 이용해 주세요.

레거시 브라우저의 경우 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 이용할 수 있습니다. 이 플러그인을 사용하면 자동으로 레거시 버전에 대한 청크를 생성하게 되고, 이를 통해 레거시 브라우저 또한 Vite으로 빌드된 앱을 이용할 수 있게 됩니다. 참고로, 생성된 레거시 청크는 브라우저가 ESM을 지원하지 않는 경우에만 불러오게 됩니다.

## Public Base Path {#public-base-path}

- [에셋 가져오기](./assets) 섹션과 관련이 있는 내용입니다.

만약 배포하고자 하는 디렉터리가 루트 디렉터리가 아닌가요? 간단히 [`base` 설정](/config/shared-options.md#base)을 이용해 프로젝트의 루트가 될 디렉터리를 명시해 줄 수 있습니다. 또는 `vite build --base=/my/public/path` 명령과 같이 커맨드 라인에서도 지정이 가능합니다.

JS(`import`), CSS(`url()`), 그리고 `.html` 파일에서 참조되는 에셋 파일의 URL들은 빌드 시 이 Base Path를 기준으로 가져올 수 있도록 자동으로 맞춰지게 됩니다.

만약 동적으로 에셋의 URL을 생성해야 하는 경우라면, `import.meta.env.BASE_URL`을 이용해주세요. 이 상수는 빌드 시 Public Base Path로 변환되어 이를 이용해 동적으로 가져오려는 에셋에 대한 URL을 생성할 수 있습니다. 다만 정확히 `import.meta.env.BASE_URL`과 동일한 문자열에 대해 치환하는 방식이며, `import.meta.env['BASE_URL']`과 같은 경우 Public Base Path로 치환되지 않는다는 것을 유의해주세요.

더욱 상세한 설정이 필요하다면 [Base 옵션 상세 설정](#advanced-base-options) 섹션을 참고해주세요.

### 상대 경로 Base {#relative-base}

만약 Base 경로를 미리 알 수 없는 경우라면, `"base": "./"` 또는 `"base": ""` 설정을 통해 상대 경로를 사용할 수 있습니다. 이렇게 하면 모든 에셋의 URL이 상대 경로로 생성됩니다.

:::warning 상대 경로 Base 사용 시 레거시 브라우저 지원

상대 경로 Base를 사용하기 위해서는 `import.meta`를 지원하는 브라우저가 필요합니다. [`import.meta`를 지원하지 않는 브라우저](https://caniuse.com/mdn-javascript_operators_import_meta)를 지원해야 한다면, [`legacy` 플러그인](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)을 사용해 주세요.

:::

## 빌드 커스터마이즈하기 {#customizing-the-build}

빌드와 관련된 커스터마이즈는 [build 설정](/config/build-options.md)을 통해 가능합니다. 특별히 알아두어야 할 것이 하나 있는데, [Rollup 옵션](https://rollupjs.org/configuration-options/)을 `build.rollupOptions`에 명시해 사용이 가능합니다.

```ts [vite.config.js]
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    }
  }
})
```

예를 들어, 여러 Rollup 빌드 결과(Output)를 위해 빌드 플러그인을 등록할 수도 있습니다.

## 청크를 만드는 방식 {#chunking-strategy}

`build.rollupOptions.output.manualChunks`를 사용해 청크를 분할하는 방식을 구성할 수 있습니다([Rollup 문서](https://rollupjs.org/configuration-options/#output-manualchunks)를 참고해 주세요). 프레임워크를 사용하는 경우, 청크 분할 방식 구성은 해당 프레임워크 문서를 참고해 주세요.

## 로드 에러 처리하기 {#load-error-handling}

Vite는 동적 임포트에 실패했을 때 `vite:preloadError` 이벤트를 발생시킵니다. `event.payload`에는 원본 임포트 에러가 포함되어 있으며, `event.preventDefault()`를 호출하면 에러가 발생하지 않습니다.

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // 예: 페이지 새로고침
})
```

새로운 배포가 시작되면 호스팅 서비스에서 이전에 배포된 에셋을 삭제할 가능성이 있습니다. 그 결과, 새로운 배포 이전에 사이트를 방문했던 사용자는 임포트 에러를 마주할 수 있습니다. 이 에러는 사용자의 기기에 존재하는 에셋이 만료되었음에도, 이에 대응하는 이전의 청크를 임포트하려고 하기 때문에 발생합니다. 위 이벤트는 이러한 상황을 해결하는 데 사용이 가능합니다.

## 파일 변경 시 다시 빌드하기 {#rebuild-on-files-changes}

`vite build --watch` 명령을 통해 Rollup Watcher를 활성화 할 수 있습니다. 또는, `build.watch` 옵션에서 [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)를 직접 명시할 수도 있습니다.

```ts [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    }
  }
})
```

`--watch` 플래그가 활성화된 상태에서 `vite.config.js` 또는 번들링 된 파일을 변경하게 되면 다시 빌드가 시작됩니다.

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

개발 시, `/nested/` 디렉터리 아래에 있는 페이지는 간단히 `/nested/`로 참조가 가능합니다. 일반적인 정적 파일 서버와 다르지 않습니다.

빌드 시에는, 사용자가 접근할 수 있는 모든 `.html` 파일에 대해 아래와 같이 빌드 진입점이라 명시해줘야만 합니다.

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

참고로 루트를 변경한다 해도 `__dirname`은 여전히 `vite.config.js` 파일이 위치한 폴더를 가리키고 있다는 것을 유의하세요. 이를 방지하고자 한다면 `resolve`의 인자로 `root` 엔트리를 함께 전달해 줘야 합니다.

HTML 파일의 경우, Vite는 `rollupOptions.input` 객체에 명시된 엔트리의 이름을 무시하고, 대신 dist 폴더에 HTML 에셋을 생성할 때 확인할 수 있는 파일의 id를 사용합니다. 이는 개발 서버가 작동하는 방식과 일관성을 유지할 수 있도록 합니다.

## 라이브러리 모드 {#library-mode}

만약 브라우저 기반의 라이브러리를 개발하고 있다면, 라이브러리 갱신 시마다 테스트 페이지에서 이를 불러오는 데 많은 시간을 소모할 것입니다. Vite는 `index.html`을 이용해 좀 더 나은 개발 환경(경험)을 마련해줍니다.

라이브러리 배포 시점에서, [`build.lib` 설정 옵션](/config/build-options.md#build-lib)을 이용해보세요. 또한 라이브러리에 포함하지 않을 디펜던시를 명시할 수도 있습니다. `vue`나 `react` 같이 말이죠.

::: code-group

```js twoslash [vite.config.js (single entry)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // 적절한 확장자가 추가됩니다.
      fileName: 'my-lib'
    },
    rollupOptions: {
      // 라이브러리에 포함하지 않을
      // 디펜던시를 명시해주세요
      external: ['vue'],
      output: {
        // 라이브러리 외부에 존재하는 디펜던시를 위해
        // UMD(Universal Module Definition) 번들링 시 사용될 전역 변수를 명시할 수도 있습니다.
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

```js twoslash [vite.config.js (multiple entries)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        secondary: resolve(__dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rollupOptions: {
      // 라이브러리에 포함하지 않을
      // 디펜던시를 명시해주세요
      external: ['vue'],
      output: {
        // 라이브러리 외부에 존재하는 디펜던시를 위해
        // UMD 번들링 시 사용될 전역 변수를 명시할 수도 있습니다.
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

`package.json`에는 아래와 같이 사용할 라이브러리를 명시해주세요.

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
라이브러리 모드는 브라우저 지향의 JS 프레임워크 라이브러리를 위한 간단하고 명확한 설정들을 포함합니다. 제작 중이신 라이브러리가 브라우저 대상이 아니거나 고도의 빌드 플로우가 요구된다면 [Rollup](https://rollupjs.org) 또는 [esbuild](https://esbuild.github.io)를 사용해 주세요.
:::

## Base 옵션 상세 설정 {#advanced-base-options}

::: warning
실험적인 기능입니다. [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13834).
:::

이미 배포된 에셋과 Public 디렉터리에 위치한 파일이 서로 다른 경로에 있을 수 있습니다. 이 경우 각각에 대해 다른 캐시 전략을 사용하고자 할 수 있는데, 이 때 Base 옵션에 대한 상세 설정이 필요합니다.
사용자는 세 가지 다른 경로로 배포하도록 선택할 수 있습니다:

- 생성된 HTML 진입점 파일 (SSR을 사용하는 동안 처리될 수 있음)
- 해시화 되어 생성된 에셋 (JS, CSS, 및 이미지와 같은 여러 파일들)
- 복사된 [Public 디렉터리 파일](assets.md#the-public-directory)

이런 상황에서는 하나의 정적인 [base](#public-base-path) 만으로는 충분하지 않습니다. Vite는 실험적으로 `experimental.renderBuiltUrl`를 통해 빌드하는 동안 Base에 대한 상세 설정을 제공하고 있습니다.

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

해시된 에셋과 Public 디렉터리 내 파일이 함께 배포되지 않은 경우, 함수에 전달된 두 번째 `context` 매개변수에 포함된 에셋의 `type` 프로퍼티를 이용해 각 그룹에 대한 동작을 독립적으로 정의할 수 있습니다.

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

Vite는 렌더링 시 자동으로 URL 인코딩을 수행합니다. 따라서 함수로 전달되는 `filename`은 모두 디코딩된 URL이며, 함수에서 반환하는 URL 문자열도 디코딩된 URL이어야 합니다. 다만 `runtime`을 포함한 객체를 반환하는 경우에는 명시된 코드가 그대로 렌더링 되기에 이를 사용하는 곳에서 인코딩을 직접 처리해 줘야 합니다.