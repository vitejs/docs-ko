---
title: Vite 2.0이 출시되었습니다!
author:
  - name: The Vite Team
sidebar: false
date: 2021-02-16
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 2.0이 출시되었습니다!
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite2
  - - meta
    - property: og:description
      content: Vite 2 릴리스 발표
---

# Vite 2.0이 출시되었습니다! {#announcing-vite-2-0}

_2021년 2월 16일_ - [Vite 3.0 발표](./announcing-vite3.md)도 확인해보세요

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

오늘 Vite 2.0의 공식 릴리스를 발표하게 되어 매우 기쁩니다!

Vite(프랑스어로 "빠르다"는 뜻, `/vit/`로 발음)는 프론트엔드 웹 개발을 위한 새로운 종류의 빌드 도구입니다. 미리 구성된 개발 서버 + 번들러 조합이라고 생각하시면 되지만, 더 가볍고 빠릅니다. 브라우저의 [네이티브 ES 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 지원과 [esbuild](https://esbuild.github.io/)와 같이 네이티브로 컴파일되는 언어로 작성된 도구들을 활용하여 빠르고 현대적인 개발 경험을 제공합니다.

Vite가 얼마나 빠른지 느껴보시려면, Repl.it에서 Vite와 `create-react-app`(CRA)을 사용하여 React 애플리케이션을 부팅하는 [이 영상 비교](https://twitter.com/amasad/status/1355379680275128321)를 확인해보세요.

Vite에 대해 처음 들어보셨고 더 자세히 알고 싶으시다면, [프로젝트의 배경](https://vite.dev/guide/why.html)을 확인해보세요. Vite가 다른 유사한 도구들과 어떻게 다른지 궁금하시다면, [비교](https://v5.vite.dev/guide/comparisons.html)를 확인해보세요.

## 2.0의 새로운 기능 {#what-s-new-in-2-0}

1.0이 RC를 벗어나기 전에 내부를 완전히 리팩터링하기로 결정했기 때문에, 이것은 사실상 Vite의 첫 번째 안정 릴리스입니다. 그렇긴 하지만, Vite 2.0은 이전 버전에 비해 많은 큰 개선사항을 가져왔습니다:

### 프레임워크 독립적인 코어 {#framework-agnostic-core}

Vite의 원래 아이디어는 [Vue 단일 파일 컴포넌트를 네이티브 ESM으로 제공하는 간단한 프로토타입](https://github.com/vuejs/vue-dev-server)으로 시작되었습니다. Vite 1은 그 아이디어의 연속으로 HMR이 그 위에 구현되었습니다.

Vite 2.0은 그 과정에서 배운 것들을 바탕으로 더 견고한 내부 아키텍처로 처음부터 다시 설계되었습니다. 이제 완전히 프레임워크 독립적이며, 모든 프레임워크별 지원은 플러그인에 위임됩니다. 이제 [Vue, React, Preact, Lit Element를 위한 공식 템플릿](https://github.com/vitejs/vite/tree/main/packages/create-vite)이 있으며, Svelte 통합을 위한 커뮤니티 노력도 진행 중입니다.

### 새로운 플러그인 형식 및 API {#new-plugin-format-and-api}

[WMR](https://github.com/preactjs/wmr)에서 영감을 받은 새로운 플러그인 시스템은 Rollup의 플러그인 인터페이스를 확장하며 [많은 Rollup 플러그인](https://vite-rollup-plugins.patak.dev/)과 즉시 호환됩니다. 플러그인은 Rollup 호환 훅을 사용할 수 있으며, Vite 전용 동작을 조정하기 위한 추가적인 Vite 전용 훅과 속성을 가집니다(예: 개발 vs 빌드 구분 또는 HMR의 사용자 정의 처리).

[프로그래매틱 API](https://vite.dev/guide/api-javascript.html)도 Vite 위에 구축된 상위 레벨 도구/프레임워크를 용이하게 하기 위해 크게 개선되었습니다.

### esbuild 기반 의존성 사전 번들링 {#esbuild-powered-dep-pre-bundling}

Vite는 네이티브 ESM 개발 서버이므로, 브라우저 요청 수를 줄이고 CommonJS에서 ESM으로의 변환을 처리하기 위해 의존성을 사전 번들링합니다. 이전에 Vite는 이를 Rollup을 사용하여 수행했지만, 2.0에서는 `esbuild`를 사용하여 10-100배 빠른 의존성 사전 번들링을 구현했습니다. 참고로, React Material UI와 같은 무거운 의존성을 가진 테스트 앱의 콜드 부팅은 M1 기반 MacBook Pro에서 이전에는 28초가 걸렸지만 이제는 약 1.5초가 걸립니다. 전통적인 번들러 기반 설정에서 전환하신다면 비슷한 개선을 기대하실 수 있습니다.

### 일급 CSS 지원 {#first-class-css-support}

Vite는 CSS를 모듈 그래프의 일급 시민으로 취급하며 다음을 즉시 지원합니다:

- **리졸버 성능 향상**: CSS의 `@import`와 `url()` 경로는 별칭과 npm 의존성을 존중하도록 Vite의 리졸버로 향상됩니다.
- **URL 경로 재조정**: `url()` 경로는 파일이 어디서 가져와지든 상관없이 자동으로 재조정됩니다.
- **CSS 코드 분할**: 코드 분할된 JS 청크도 해당하는 CSS 파일을 내보내며, 요청 시 JS 청크와 병렬로 자동 로드됩니다.

### 서버 사이드 렌더링(SSR) 지원 {#server-side-rendering-ssr-support}

Vite 2.0은 [실험적 SSR 지원](https://vite.dev/guide/ssr.html)과 함께 제공됩니다. Vite는 개발 중에 Node.js에서 ESM 기반 소스 코드를 효율적으로 로드하고 업데이트하는 API를 제공하며(거의 서버 사이드 HMR과 같음), 개발 및 SSR 빌드 속도를 향상시키기 위해 CommonJS 호환 의존성을 자동으로 외부화합니다. 프로덕션 서버는 Vite와 완전히 분리될 수 있으며, 동일한 설정을 사전 렌더링/SSG를 수행하도록 쉽게 적응시킬 수 있습니다.

Vite SSR은 저수준 기능으로 제공되며, 상위 레벨 프레임워크들이 이를 내부적으로 활용할 것으로 기대합니다.

### 선택적 레거시 브라우저 지원 {#opt-in-legacy-browser-support}

Vite는 기본적으로 네이티브 ESM 지원이 있는 현대 브라우저를 대상으로 하지만, 공식 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)를 통해 레거시 브라우저 지원을 선택할 수도 있습니다. 이 플러그인은 자동으로 현대/레거시 이중 번들을 생성하고, 브라우저 기능 감지를 기반으로 올바른 번들을 제공하여 이를 지원하는 현대 브라우저에서 더 효율적인 코드를 보장합니다.

## 한번 사용해 보세요! {#give-it-a-try}

다양한 기능이 있지만, Vite로 시작하는 것은 간단합니다! 다음 명령어로 시작하여 단 1분 만에 Vite 기반 앱을 실행할 수 있습니다(Node.js >=12가 있는지 확인하세요):

```bash
npm init @vitejs/app
```

그런 다음, [가이드](https://vite.dev/guide/)를 확인하여 Vite가 즉시 제공하는 것들을 살펴보세요. [GitHub](https://github.com/vitejs/vite)에서 소스 코드를 확인하거나, [Twitter](https://twitter.com/vite_js)에서 업데이트를 팔로우하거나, [Discord 채팅 서버](http://chat.vite.dev/)에서 다른 Vite 사용자들과 토론에 참여할 수도 있습니다.