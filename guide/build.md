# 배포 버전으로 빌드하기

앱을 어느정도 완성하셨나요? 배포 버전으로 빌드하고자 한다면 `vite build` 명령을 실행해주세요. 빌드 시 기본적으로 `<root>/index.html` 파일이 빌드를 위한 진입점(Entry point)으로 사용되며, 정적 호스팅을 위한 형태로 진행됩니다. 추가적으로, GitHub Pages와 같은 정적 호스팅 서비스를 위한 빌드 방법을 알고싶다면 [정적 사이트 배포하기](./static-deploy) 섹션을 참고해주세요.

## 브라우저 지원 현황

빌드된 배포 버전의 경우, 모던 JavaScript를 지원하는 브라우저를 타깃으로 합니다. 따라서 *기본적으로* 모든 코드는 [네이티브 ESM 태그를 지원하는 브라우저](https://caniuse.com/es6-module)를 타깃으로 변환됩니다.

- Chrome >=61
- Firefox >=60
- Safari >=11
- Edge >=16

물론 [Dynamic Import 폴리필](https://github.com/GoogleChromeLabs/dynamic-import-polyfill)은 자동으로 포함됩니다.

만약 JavaScript 타깃을 지정하고자 한다면, [`build.target` 설정](/config/#build-target)을 이용해주세요. 다만 버전은 최소한 `es2015` 이상이어야 합니다.

Note that by default, Vite only handles syntax transforms and **does not cover polyfills by default**. You can check out [Polyfill.io](https://polyfill.io/v3/) which is a service that automatically generates polyfill bundles based on the user's browser UserAgent string.

위에서 언급되는 *'기본적으로'* 라는 말의 의미를 잠깐 설명하자면, Vite은

레거시 브라우저의 경우 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 이용할 수 있습니다. 이 플러그인을 사용하면 자동으로 레거시 버전에 대한 청크를 생성하게 되고, 이를 통해 레거시 브라우저 또한 Vite으로 빌드된 앱을 이용할 수 있게 됩니다. 참고로, 생성된 레거시 청크는 브라우저가 ESM을 지원하지 않는 경우에만 불러오게 됩니다.

## Public Base Path

- [에셋 가져오기](./assets) 섹션과 관련이 있는 내용입니다.

만약 배포하고자 하는 디렉터리가 루트 디렉터리가 아닌가요? 간단히 [`base` 설정](/config/#base)을 이용해 프로젝트의 루트가 될 디렉터리를 명시해 줄 수 있습니다. 또는 `vite build --base=/my/public/path` 명령과 같이 커맨드 라인에서도 지정이 가능합니다.

JS-imported asset URLs, CSS `url()` references, and asset references in your `.html` files are all automatically adjusted to respect this option during build.

The exception is when you need to dynamically concatenate URLs on the fly. In this case, you can use the globally injected `import.meta.env.BASE_URL` variable which will be the public base path. Note this variable is statically replaced during build so it must appear exactly as-is (i.e. `import.meta.env['BASE_URL']` won't work).

## 빌드 커스터마이즈하기

빌드와 관련된 커스터마이즈는 [build 설정](/config/#build-options)을 통해 가능합니다. 특별히 알아두어야 할 것이 하나 있는데, [Rollup 옵션](https://rollupjs.org/guide/en/#big-list-of-options)을 `build.rollupOptions`에 명시해 사용이 가능합니다.

```js
// vite.config.js
module.exports = {
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
    }
  }
}
```

For example, you can specify multiple Rollup outputs with plugins that are only applied during build.

예를 들어,

## Multi-Page App

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

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
}
```

## Library 모드

만약 브라우저 기반의 라이브러리를 개발하고 있다면, 라이브러리 갱신 시마다 테스트 페이지에서 이를 불러오는 데 많은 시간을 소모할 것입니다. Vite은 `index.html`을 이용해 좀 더 나은 개발 환경(경험)을 마련해줍니다.

When it is time to bundle your library for distribution, use the [`build.lib` config option](/config/#build-lib). Make sure to also externalize any dependencies that you do not want to bundle into your library, e.g. `vue` or `react`:

```js
// vite.config.js
const path = require('path')

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'MyLib'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
}
```

Running `vite build` with this config uses a Rollup preset that is oriented towards shipping libraries and produces two bundle formats: `es` and `umd` (configurable via `build.lib`):

```
$ vite build
building for production...
[write] my-lib.es.js 0.08kb, brotli: 0.07kb
[write] my-lib.umd.js 0.30kb, brotli: 0.16kb
```

Recommended `package.json` for your lib:

```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```
