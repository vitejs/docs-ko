# 다른 빌드 도구와의 차이점 {#comparisons-with-other-no-bundler-solutions}

## Snowpack {#snowpack}

[Snowpack](https://www.snowpack.dev/)은 Vite와 범위가 매우 유사한 번들없는 기본 ESM 개발 서버입니다. 다른 구현 세부 사항 외에도 두 프로젝트는 기존 도구에 비해 기술적 이점 측면에서 많은 부분을 공유합니다. 또한 Vite의 디펜던시 사전 번들링은 Snowpack v1 (현재 [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall))에서 영감을 받았습니다. 두 프로젝트의 주요 차이점은 다음과 같습니다.

**프로덕션 빌드**

Snowpack의 기본 빌드 출력은 번들로 제공되지 않습니다. 각 파일을 별도의 빌드 된 모듈로 변환한 다음에 실제 번들링을 수행하는 다른 "최적화 프로그램"에 공급할 수 있습니다. 이러한 방식의 장점은 특정 요구 사항에 맞게 다양한 최종 번들러(예 : webpack, Rollup 또는 esbuild) 중에서 선택할 수 있고, 단점은 그것이 다소 단편화된 경험이라는 것입니다. 예를 들면, esbuild 최적화 프로그램은 여전히 불안정합니다. Rollup 최적화 프로그램은 공식적으로 유지 관리되지 않으며, 최적화 프로그램마다 출력 및 구성이 다릅니다.

Vite는 보다 간소화된 경험을 제공하기 위해 하나의 단일 번들러(Rollup)와 함께 더 깊게 통합하는 것을 선택합니다. 또한 Vite는 개발 및 빌드 모두에서 작동하는 [범용 플러그인 API](./api-plugin)를 지원할 수 있습니다.

한층 더 통합된 빌드 프로세스로 인해 Vite는 현재 Snowpack 빌드 최적화 프로그램에서 사용할 수 없는 넓은 범위의 기능을 지원합니다.

- [Multi-Page App](./build#multi-page-app)
- [라이브러리 모드](./build#library-mode)
- [자동 CSS 코드 분할](./features#css-code-splitting)
- [최적화 된 비동기 청크 로딩](./features#async-chunk-loading-optimization)
- [자동으로 polyfill 동적으로 가져오기](./features#dynamic-import-polyfill)
- 듀얼 모던 / 레거시 번들을 생성하고 브라우저 지원을 기반으로 올바른 번들을 자동으로 제공하는 공식 [레거시 모드 플러그인](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

**더 빠른 디펜던시 사전 번들링**

Vite는 디펜던시 사전 번들링을 위해 Rollup 대신 [esbuild](https://esbuild.github.io/)를 사용합니다. 이는 Cold-Starting과 같이 디펜던시를 다시 번들링 해야 하는 경우, 이 성능을 크게 향상시킵니다.

**모노리포 지원**

Vite는 모노리포 설정을 처리하도록 설계되었으며, 사용자가 모노리포기반의 Yarn, Yarn 2 그리고 PNPM을 성공적으로 사용하도록 합니다.

**css 전처리 지원**

Vite는 향상된 `@import` 해상도(별칭 및 npm 디펜던시) 및 [내부 파일에 대한 자동 `url()` 리베이스](./features#import-inlining-and-rebasing)를 포함하여 Sass 및 Less에 대해 보다 세련된 지원을 제공합니다.

**높은 수준의 Vue 지원**

Vite는 처음에 [Vue.js](https://vuejs.org/) 도구의 미래 기반 역할을 하기 위해 만들어졌습니다. 현재 Vite 2.0은 프레임워크에 완전히 독립적이지만, 아직 공식 Vue 플러그인은 템플릿 자산 참조 해결, `<script setup>`, `<style module>`, 사용자 정의 블록 등과 같은 모든 고급 기능을 아우르는 Vue의 단일 파일 컴포넌트 형식에 대한 고수준의 지원을 제공합니다. 또한 Vite는 Vue SFC에 대해 세분화된 HMR을 제공합니다. 예를 들어 SFC의 `<template>` 또는 `<style>`을 업데이트하면 상태를 재설정하지 않고 최신 업데이트를 수행합니다.

## WMR {#wmr}

Preact 팀의 [WMR](https://github.com/preactjs/wmr)은 유사한 기능 세트를 제공하며, Rollup의 플러그인 인터페이스에 대한 Vite 2.0의 지원은 그것에 영감을 받았습니다.

WMR은 주로 [Preact](https://preactjs.com/) 프로젝트를 위해 설계되었으며, 사전 렌더링과 같은 보다 통합된 기능을 제공합니다. 범위 측면에서는 Preact 자체와 같이 컴팩트한 크기를 강조하는 Preact 메타 프레임워크에 더 가깝습니다. Preact를 사용한다면, WMR은 보다 더 미세하게 조정된 경험을 제공할 것입니다. 그러나 WMR이 다른 프레임워크에 대한 지원 우선순위를 정할 것 같지는 않습니다.

## @web/dev-server {#web-dev-server}

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (이전 `es-dev-server`)는 훌륭한 프로젝트이며, 이는 Vite 1.0의 Koa 기반 서버 설정에 영감을 주었습니다.

`@web/dev-server`는 범위 측면에서 약간 낮은 수준입니다. 공식 프레임워크 통합을 제공하지 않으며 프로덕션 빌드를 위한 Rollup 구성을 수동으로 설정해야 합니다.

전반적으로 Vite는 더 독창적인 작업 흐름를 제공하는 것을 목표로 하는, 보다 독단적이고 높은 수준의 도구입니다. 즉, `@web` 총합 프로젝트에는 Vite 사용자에게도 도움을 줄 수 있는 다른 많은 훌륭한 도구가 포함되어 있습니다.
