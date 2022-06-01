# 프로덕션 버전으로 빌드하기 {#building-for-production}

앱을 어느정도 완성하셨나요? 프로덕션 버전으로 빌드하고자 한다면 `vite build` 명령을 실행해주세요. 빌드 시 기본적으로 `<root>/index.html` 파일이 빌드를 위한 진입점(Entry point)으로 사용되며, 정적 호스팅을 위한 형태로 진행됩니다. 추가적으로, GitHub Pages와 같은 정적 호스팅 서비스를 위한 빌드 방법을 알고싶다면 [정적 웹 페이지로 배포하기](./static-deploy) 섹션을 참고해주세요.

## 브라우저 지원 현황 {#browser-compatibility}

빌드된 프로덕션 버전의 경우 모던 JavaScript를 지원하는 브라우저에서 동작한다고 가정합니다.

빌드된 프로덕션 버전은 모던 JavaScript를 지원하는 환경에서 동작한다고 가정합니다. 따라서 Vite는 기본적으로 [네이티브 ES 모듈](https://caniuse.com/es6-module), [네이티브 ESM의 동적 Import](https://caniuse.com/es6-module-dynamic-import), 그리고 [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta)를 지원하는 브라우저를 타깃으로 하고 있습니다:

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

만약 JavaScript 타깃을 지정하고자 한다면, [`build.target` 설정](/config/#build-target)을 이용해주세요. 다만 버전은 최소한 `es2015` 이상이어야 합니다.

위에서 언급되는 *'기본적으로'* 라는 말의 의미를 잠깐 설명하자면, Vite는 오로지 구분 변환만 진행할 뿐 **폴리필을 다루지 않는다는 말** 입니다. 따라서 만약 폴리필을 생각해야 할 경우, User Agent를 기반으로 자동으로 폴리필 번들을 생성해주는 [Polyfill.io](https://polyfill.io/v3/)를 이용해주세요.

레거시 브라우저의 경우 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 이용할 수 있습니다. 이 플러그인을 사용하면 자동으로 레거시 버전에 대한 청크를 생성하게 되고, 이를 통해 레거시 브라우저 또한 Vite으로 빌드된 앱을 이용할 수 있게 됩니다. 참고로, 생성된 레거시 청크는 브라우저가 ESM을 지원하지 않는 경우에만 불러오게 됩니다.

## Public Base Path {#public-base-path}

- [에셋 가져오기](./assets) 섹션과 관련이 있는 내용입니다.

만약 배포하고자 하는 디렉터리가 루트 디렉터리가 아닌가요? 간단히 [`base` 설정](/config/#base)을 이용해 프로젝트의 루트가 될 디렉터리를 명시해 줄 수 있습니다. 또는 `vite build --base=/my/public/path` 명령과 같이 커맨드 라인에서도 지정이 가능합니다.

JS(`import`), CSS(`url()`), 그리고 `.html` 파일에서 참조되는 에셋 파일의 URL들은 빌드 시 이 Base Path를 기준으로 가져올 수 있도록 자동으로 맞춰지게 됩니다.

만약 동적으로 에셋의 URL을 생성해야 하는 경우라면, `import.meta.env.BASE_URL`을 이용해주세요. 이 상수는 빌드 시 Public Base Path로 변환되어 이를 이용해 동적으로 가져오려는 에셋에 대한 URL을 생성할 수 있습니다. 다만 정확히 `import.meta.env.BASE_URL`과 동일한 문자열에 대해 치환하는 방식이며, `import.meta.env['BASE_URL']`과 같은 경우 Public Base Path로 치환되지 않는다는 것을 유의해주세요.

## 빌드 커스터마이즈하기 {#customizing-the-build}

빌드와 관련된 커스터마이즈는 [build 설정](/config/#build-options)을 통해 가능합니다. 특별히 알아두어야 할 것이 하나 있는데, [Rollup 옵션](https://rollupjs.org/guide/en/#big-list-of-options)을 `build.rollupOptions`에 명시해 사용이 가능합니다.

```js
// vite.config.js
module.exports = defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
    }
  }
})
```

예를 들어, 여러 Rollup 빌드 결과(Output)를 위해 빌드 플러그인을 등록할 수도 있습니다.

## 청크를 만드는 방식 {#chunking-strategy}

`build.rollupOptions.output.manualChunks`를 사용해 청크를 분할하는 방식을 구성할 수 있습니다(자세한 사항은 [Rollup 문서](https://rollupjs.org/guide/en/#outputmanualchunks)를 참고해주세요). Vite 2.8 까지는 청크를 만들 때 기본적으로 `index`와 `vendor`를 기준으로 분할했습니다. 이 방식은 일부 SPA를 대상으로는 잘 동작했으나, Vite가 지원하고자 하는 모든 사례에 대해서 범용적으로 적용하기는 어려웠습니다. 따라서 Vite 2.9부터 `manualChunks`는 더 이상 기본적으로 수정하지 않습니다. 만약 계속 `manualChunks`를 수정하기 원한다면 `splitVendorChunkPlugin`을 사용해주세요.

```js
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
module.exports = defineConfig({
  plugins: [splitVendorChunkPlugin()]
})
```

이러한 방식은 사용자 정의 로직을 사용한 구성이 필요한 경우를 대비해 `splitVendorChunk({ cache: SplitVendorChunkCache })` 팩토리 함수로도 제공됩니다. 이 때, 빌드 감시 모드가 정상적으로 작동하기 위해서는 `cache.reset()`을 `buildStart` 훅에서 호출해야 합니다.

## 파일 변경 시 다시 빌드하기 {#rebuild-on-files-changes}

`vite build --watch` 명령을 통해 Rollup Watcher를 활성화 할 수 있습니다. 또는, `build.watch` 옵션에서 [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)를 직접 명시할 수도 있습니다.

```js
// vite.config.js
module.exports = defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/guide/en/#watch-options
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

```js
// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
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

## 라이브러리 모드 {#library-mode}

만약 브라우저 기반의 라이브러리를 개발하고 있다면, 라이브러리 갱신 시마다 테스트 페이지에서 이를 불러오는 데 많은 시간을 소모할 것입니다. Vite는 `index.html`을 이용해 좀 더 나은 개발 환경(경험)을 마련해줍니다.

라이브러리 배포 시점에서, [`build.lib` 설정 옵션](/config/#build-lib)을 이용해보세요. 또한 라이브러리에 포함하지 않을 디펜던시를 명시할 수도 있습니다. `vue`나 `react` 같이 말이죠.

```js
// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // 적절한 확장자가 추가됩니다.
      fileName: 'my-lib'
    },
    rollupOptions: {
      // 라이브러리에 포함하지 않을 디펜던시를 명시해주세요
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

패키지의 진입점이 되는 파일에는 패키지의 사용자가 `import` 할 수 있도록 `export` 구문이 포함되게 됩니다:

```js
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

위와 같은 Rollup 설정과 함께 `vite build` 명령을 실행하게 되면, `es` 및 `umd` 두 가지의 포맷으로 번들링 과정이 진행되게 됩니다(이에 대해 조금 더 자세히 알고 싶다면 `build.lib` 설정을 참고해주세요).

```
$ vite build
building for production...
[write] my-lib.es.mjs 0.08kb, brotli: 0.07kb
[write] my-lib.umd.js 0.30kb, brotli: 0.16kb
```

`package.json`에는 아래와 같이 사용할 라이브러리를 명시해주세요.

```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.mjs",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.mjs",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```
