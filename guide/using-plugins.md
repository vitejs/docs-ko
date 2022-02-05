# 플러그인 사용하기 {#using-plugins}

Vite는 몇 가지 추가적인 Vite 전용 옵션과 함께 잘 설계된 Rollup의 플러그인 인터페이스를 기반으로 하는 플러그인들을 사용하여 확장할 수 있습니다. 이는 Vite 사용자가 필요에 따라 개발 서버나 SSR과 같은 기능들을 확장할 수 있는 것과 동시에, 검증된 Rollup 플러그인 생태계에도 의존할 수 있음을 의미합니다.

## 플러그인 추가하기 {#adding-a-plugin}

플러그인을 사용하려면 프로젝트의 `devDependencies`에 플러그인을 추가하고, `vite.config.js` 설정 파일의 `plugins` 배열에 해당 플러그인을 포함시켜야 합니다. 예를 들어, 레거시 프라우저에 대한 지원을 제공하기 위해 공식 플러그인 중 하나인 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)를 사용하고자 한다면 다음과 같이 할 수 있습니다:

```
$ npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

`plugins`에는 여러 플러그인을 하나의 요소로 묶는 사전 설정도 포함시킬 수 있습니다. 이는 프레임워크 통합과 같은 여러 플러그인을 사용하여 구현되는 복잡한 기능을 구현할 때 유용하게 사용될 수 있습니다. 이 때 전달되는 배열은 내부적으로 Flatten 연산을 거치게 됩니다.

참고로 다른 플러그인을 쉽게 활성화하거나 비활성화 시킬 수 있는 잘못된 플러그인은 무시됩니다.

## 플러그인을 찾는 방법 {#finding-plugins}

:::tip 참고
Vite는 웹 개발 시 일반적으로 필요한 대부분의 기능들을 제공하고 있습니다. 따라서 Vite 또는 호환되는 Rollup 플러그인을 검색하기 전, [지원하는 기능들](../guide/features.md) 섹션을 먼저 확인해주세요. Rollup으로 프로젝트를 구성할 때 필요했던 플러그인 대부분은 이미 Vite에서 자체적으로 제공하고 있습니다.
:::

공식 플러그인에 대한 정보는 [플러그인 섹션](../plugins/)을 참고해주세요. Vite 커뮤니티 플러그인은 [awesome-vite](https://github.com/vitejs/awesome-vite#plugins)에서 볼 수 있습니다. 호환되는 Rollup 플러그인의 경우 [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev)에서 사용법과 함께 제공되고 있습니다. 만약 이 목록에 없다면 [Rollup 플러그인 호환성 섹션](../guide/api-plugin#rollup-plugin-compatibility)을 참고해주세요.

또한 NPM에 Vite 및 Rollup 플러그인을 게시할 때 [컨벤션](./api-plugin.md#conventions)을 따르도록 권고하고 있습니다. 이를 이용해 어렵지 않게 NPM에서 Vite 및 Rollup 플러그인을 검색할 수 있습니다.

- [Vite 플러그인 검색 결과](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity)
- [Rollup 플러그인 검색 결과](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity)

## 플러그인 순서 정하기 {#enforcing-plugin-ordering}

일부 Rollup 플러그인과의 호환을 위해 플러그인 순서를 정하거나 빌드 시에만 플러그인이 동작하도록 구성할 수 있습니다. 이는 Vite 플러그인만을 위한 기능이며, 가령 플러그인 순서를 정하고자 하는 경우 `enforce` 프로퍼티를 이용할 수 있습니다:

- `pre`: Vite의 코어 플러그인보다 먼저 실행하고자 하는 플러그인
- default: Vite의 코어 플러그인 이후에 실행하고자 하는 플러그인
- `post`: Vite의 빌드 플러그인 이후에 실행하고자 하는 플러그인

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre'
    }
  ]
})
```

이에 대해 좀 더 자세한 내용은 [플러그인 API 가이드](./api-plugin.md#plugin-ordering)를 확인해주세요. [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev) 목록에서도 `enforce` 레이블과 사용 지침을 통해 이와 관련된 내용을 확인할 수 있습니다.

## 조건부 플러그인 {#conditional-application}

기본적으로 플러그인은 개발 서버(`'serve'`)와 빌드(`'build'`) 시 모두 동작합니다. 만약 조건부로 동작하기를 원한다면, `apply` 프로퍼티를 이용해 `'build'` 또는 `'serve'` 중에만 플러그인이 동작하도록 할 수 있습니다:

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build'
    }
  ]
})
```

## 플러그인 작성 {#building-plugins}

플러그인 작성에 대한 문서는 [플러그인 API 가이드](./api-plugin.md)를 참고해주세요.
