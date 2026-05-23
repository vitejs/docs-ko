---
title: Vite 8.0이 출시되었습니다!
author:
  name: The Vite Team
date: 2026-03-12
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 8 발표
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8
  - - meta
    - property: og:description
      content: Vite 8 릴리스 발표
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.0이 출시되었습니다! {#vite-8-0-is-out}

_2026년 3월 12일_

![Vite 8 발표 커버 이미지](/og-image-announcing-vite8.webp)

Vite 8의 안정 버전 릴리스를 발표하게 되어 매우 기쁩니다! Vite가 처음 출시되었을 때, Vite 팀은 두 번들러라는 실용적 선택을 했습니다. 개발 중 속도를 위한 esbuild와 최적화된 프로덕션 빌드를 위한 Rollup이었습니다. 그 선택은 수년 동안 훌륭하게 작동했습니다. Rollup과 esbuild 유지보수자들에게 깊이 감사드립니다. 그들이 없었다면 Vite는 성공할 수 없었을 것입니다. 이제 그 흐름은 하나로 합쳐집니다. Vite 8은 단일 통합 Rust 기반 번들러인 [Rolldown](https://rolldown.rs/)을 제공하며, 전체 플러그인 호환성을 유지하면서 최대 10-30배 더 빠른 빌드를 제공합니다. 이는 Vite 2 이후 가장 중요한 아키텍처 변화입니다.

Vite는 이제 주간 6,500만 회 다운로드되고 있으며, 생태계는 릴리스마다 계속 성장하고 있습니다. 계속 확장되는 플러그인 환경을 개발자가 탐색할 수 있도록, Vite, Rolldown, Rollup용 검색 가능한 플러그인 디렉터리 [registry.vite.dev](https://registry.vite.dev)도 출시했습니다. 이 디렉터리는 npm에서 매일 플러그인 데이터를 수집합니다.

빠른 링크:

- [문서](/)
- 번역: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [마이그레이션 가이드](/guide/migration)
- [GitHub 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

[vite.new](https://vite.new)를 사용해 Vite 8을 온라인에서 체험하거나, `pnpm create vite`를 실행해 선호하는 프레임워크로 Vite 앱을 로컬에서 스캐폴딩하세요. 자세한 정보는 [시작하기 가이드](/guide/)를 확인하세요.

Vite 개선에 참여해주시기를 바랍니다. [Vite Core에 기여한 1,200명 이상의 사람들](https://github.com/vitejs/vite/graphs/contributors)과 함께하거나, Vite의 디펜던시, 생태계 플러그인과 프로젝트에 기여할 수 있습니다. 자세한 내용은 [기여 가이드](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)에서 확인하세요. 시작하기 좋은 방법은 [이슈 분류](https://github.com/vitejs/vite/issues), [PR 리뷰](https://github.com/vitejs/vite/pulls), 열린 이슈를 기반으로 한 테스트 PR 전송, [Discussions](https://github.com/vitejs/vite/discussions)나 Vite Land의 [Discord #help 채널](https://discord.com/channels/804011606160703521/1019670660856942652)에서 다른 사람을 돕는 것입니다. 질문이 있다면 [Discord 커뮤니티](https://chat.vite.dev)에 참여해 [#contributing 채널](https://discord.com/channels/804011606160703521/804439875226173480)에서 Vite 팀과 이야기하세요.

[Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), 또는 [Mastodon](https://webtoo.ls/@vite)에서 Vite를 팔로우하여 최신 소식을 받고 Vite 위에 구축하는 다른 사람들과 소통하세요.

## Rolldown 기반 Vite {#the-rolldown-powered-vite}

### 문제 {#the-problem}

초기 버전부터 Vite는 서로 다른 필요를 충족하기 위해 두 개의 별도 번들러를 사용했습니다. [esbuild](https://esbuild.github.io/)는 개발 중 빠른 컴파일(디펜던시 사전 번들링과 TypeScript/JSX 변환)을 처리해 즉각적인 개발 경험을 만들었습니다. [Rollup](https://rollupjs.org/)은 풍부한 플러그인 API로 전체 Vite 플러그인 생태계를 뒷받침하면서 프로덕션 번들링, 청크 분할, 최적화를 처리했습니다.

이 이중 번들러 접근 방식은 수년 동안 Vite에 잘 맞았습니다. 덕분에 Vite 팀은 파싱과 번들링을 처음부터 다시 만드는 대신 개발자 경험과 오케스트레이션에 집중할 수 있었습니다. 하지만 그에 따른 트레이드오프도 있었습니다. 두 개의 별도 변환 파이프라인은 두 개의 별도 플러그인 시스템을 의미했고, 두 파이프라인을 동기화하기 위해 점점 더 많은 글루 코드가 필요했습니다. 일관되지 않은 모듈 처리와 관련된 엣지 케이스가 시간이 지나며 누적되었고, 한 파이프라인에서의 정렬 수정은 다른 파이프라인에 차이를 만들 위험이 있었습니다.

### 해결책 {#the-solution}

[Rolldown](https://rolldown.rs/)은 이러한 과제를 정면으로 해결하기 위해 [VoidZero](https://voidzero.dev) 팀이 만든 Rust 기반 번들러입니다. Rolldown은 세 가지 목표를 염두에 두고 설계되었습니다.

- **성능:** Rust로 작성된 Rolldown은 네이티브 속도로 동작합니다. 벤치마크에서 esbuild 성능에 맞먹으며 [Rollup보다 10-30배 빠릅니다](https://github.com/rolldown/benchmarks).
- **호환성:** Rolldown은 Rollup 및 Vite와 동일한 플러그인 API를 지원합니다. 기존 Vite 플러그인 대부분은 Vite 8에서 별도 설정 없이 동작합니다.
- **고급 기능:** 단일 통합 번들러는 이중 번들러 구성으로는 구현하기 어렵거나 불가능했던 기능을 제공합니다. 여기에는 전체 번들링 모드, 더 유연한 청크 분할, 모듈 수준 영속 캐시, Module Federation 지원이 포함됩니다.

### 안정 버전까지의 여정 {#the-journey-to-stable}

Rolldown으로의 마이그레이션은 신중하고 커뮤니티 중심으로 진행되었습니다. 먼저 별도의 [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) 패키지를 기술 프리뷰로 릴리스하여, 얼리 어답터에게 Vite의 안정 버전에 영향을 주지 않고 Rolldown 통합을 테스트할 기회를 제공했습니다. 초기 사용자들의 피드백은 매우 소중했습니다. 그들은 다양한 형태와 규모의 실제 코드베이스에서 통합을 검증하며, 더 넓은 릴리스 전에 해결할 수 있는 엣지 케이스와 호환성 문제를 드러냈습니다. 또한 새 번들러에 대해 주요 Vite 플러그인과 프레임워크를 검증하는 전용 CI 스위트를 구성해 회귀를 조기에 잡고 마이그레이션 경로에 대한 확신을 쌓았습니다.

2025년 12월에는 Rolldown이 완전히 통합된 [Vite 8 베타](/blog/announcing-vite8-beta)를 릴리스했습니다. 베타 기간 동안 Rolldown 자체도 베타에서 릴리스 후보로 발전했으며, Vite 커뮤니티의 테스트와 피드백을 바탕으로 지속적인 개선이 이루어졌습니다.

### 실제 성능 {#real-world-performance}

`rolldown-vite`의 프리뷰와 베타 단계 동안 여러 회사가 프로덕션 빌드 시간의 측정 가능한 감소를 보고했습니다.

- **Linear:** 프로덕션 빌드 시간이 46초에서 6초로 줄었습니다.
- **Ramp:** 빌드 시간이 57% 줄었습니다.
- **Mercedes-Benz.io:** 빌드 시간이 최대 38% 줄었습니다.
- **Beehiiv:** 빌드 시간이 64% 줄었습니다.

대규모 프로젝트에서는 그 영향이 특히 두드러질 수 있으며, Rolldown이 계속 발전함에 따라 추가 개선도 기대하고 있습니다.

### 통합 툴체인 {#a-unified-toolchain}

Vite 8에서 Vite는 긴밀히 협력하는 팀들이 만드는 엔드 투 엔드 툴체인의 진입점이 됩니다. 빌드 도구(Vite), 번들러(Rolldown), 컴파일러([Oxc](https://oxc.rs/))가 하나의 흐름으로 이어집니다. 이러한 정렬은 파싱과 리졸빙부터 변환과 미니파이까지 전체 스택에서 일관된 동작을 보장합니다. 또한 JavaScript가 진화함에 따라 새 언어 명세를 빠르게 채택할 수 있음을 의미합니다. 그리고 계층 전반을 깊게 통합함으로써, Oxc의 의미 분석을 활용해 Rolldown에서 더 나은 트리 셰이킹을 하는 것처럼 이전에는 닿기 어려웠던 최적화를 추진할 수 있습니다.

### 커뮤니티에 감사드립니다 {#thank-you-to-the-community}

이 모든 것은 더 넓은 커뮤니티 없이는 불가능했습니다. `rolldown-vite`를 일찍 테스트하고, 자세한 버그 리포트를 제출하고, 호환성 문제를 해결하기 위해 함께해준 프레임워크 팀들([SvelteKit](https://svelte.dev/docs/kit/introduction), [React Router](https://reactrouter.com/), [Storybook](https://storybook.js.org/), [Astro](https://astro.build/), [Nuxt](https://nuxt.com/) 및 많은 팀들)에게 깊이 감사드립니다. 베타를 사용해보고, 빌드 시간 개선을 공유하고, 이번 릴리스를 다듬는 데 도움이 된 거친 부분들을 보고해준 모든 개발자에게도 똑같이 감사드립니다. 실제 프로젝트에서 마이그레이션을 테스트하려는 여러분의 의지가 Rolldown으로의 전환을 더 부드럽고 안정적으로 만들었습니다.

## Node.js 지원 {#node-js-support}

Vite 8은 Vite 7과 같은 요구 사항인 Node.js 20.19+, 22.12+를 필요로 합니다. 이 범위는 Node.js가 플래그 없이 `require(esm)`을 지원하도록 보장하며, Vite를 ESM 전용으로 배포하도록 합니다.

## 추가 기능 {#additional-features}

Rolldown 통합 외에도 Vite 8에는 여러 주목할 만한 기능이 포함됩니다.

- **통합 Devtools:** Vite 8은 [Vite Devtools](https://devtools.vite.dev/)를 활성화하기 위한 [`devtools`](/config/shared-options#devtools) 옵션을 제공합니다. Vite Devtools는 디버깅과 분석을 위한 개발자 도구입니다. 개발 서버에서 직접 Vite 기반 프로젝트에 대한 더 깊은 인사이트를 제공합니다.

- **내장 tsconfig `paths` 지원:** 개발자는 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths)를 `true`로 설정해 TypeScript 경로 별칭 해석을 활성화할 수 있습니다. 이는 약간의 성능 비용이 있으며 기본적으로 활성화되어 있지 않습니다.

- **`emitDecoratorMetadata` 지원:** Vite 8은 이제 TypeScript의 `emitDecoratorMetadata` 옵션을 자동으로 내장 지원하므로 외부 플러그인이 필요하지 않습니다. 자세한 내용은 [기능](/guide/features.md#emitdecoratormetadata) 페이지를 참고하세요.

- **Wasm SSR 지원:** [`.wasm?init` imports](/guide/features#webassembly)가 이제 SSR 환경에서도 동작하여 Vite의 WebAssembly 기능을 서버 사이드 렌더링까지 확장합니다.

- **브라우저 콘솔 전달:** Vite 8은 브라우저 콘솔 로그와 오류를 개발 서버 터미널로 전달할 수 있습니다. 런타임 클라이언트 오류가 CLI 출력에 보이기 때문에 코딩 에이전트와 작업할 때 특히 유용합니다. [`server.forwardConsole`](/config/server-options.md#server-forwardconsole)로 활성화할 수 있으며, 코딩 에이전트가 감지되면 자동으로 활성화됩니다.

## `@vitejs/plugin-react` v6 {#vitejs-plugin-react-v6}

Vite 8과 함께 `@vitejs/plugin-react` v6도 릴리스합니다. 이 플러그인은 React Refresh 변환에 Oxc를 사용합니다. Babel은 더 이상 디펜던시가 아니며 설치 크기도 더 작습니다.

[React Compiler](https://react.dev/learn/react-compiler)가 필요한 프로젝트를 위해 v6는 `@rolldown/plugin-babel`과 함께 동작하는 `reactCompilerPreset` 헬퍼를 제공합니다. 이를 통해 기본 설정에 부담을 주지 않으면서 명시적인 옵트인 경로를 제공합니다.

자세한 내용은 [릴리스 노트](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0)를 참고하세요.

v5도 Vite 8에서 계속 동작하므로, Vite를 업그레이드한 뒤 플러그인을 업그레이드할 수 있습니다.

## 앞으로의 계획 {#looking-ahead}

Rolldown 통합은 개선과 최적화의 가능성을 넓힙니다. 다음으로 작업 중인 내용은 다음과 같습니다.

- **전체 번들링 모드**(실험적): 이 모드는 프로덕션 빌드와 비슷하게 개발 중에도 모듈을 번들링합니다. 예비 결과에 따르면 개발 서버 시작은 3배 빨라지고, 전체 리로드는 40% 빨라지며, 네트워크 요청은 10배 줄어듭니다. 이는 번들하지 않는 개발 방식이 확장 한계에 부딪히는 대규모 프로젝트에서 특히 큰 효과가 있습니다.

- [**Raw AST transfer**](https://github.com/oxc-project/oxc/issues/2409): JavaScript 플러그인이 최소한의 직렬화 오버헤드로 Rust가 생성한 AST에 접근하게 하여, Rust 내부와 JS 플러그인 코드 사이의 성능 격차를 줄입니다.

- [**Native MagicString transforms**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring): 로직은 JavaScript에 두고 문자열 조작 계산은 Rust에서 수행하는 커스텀 변환을 지원합니다.

- **Environment API 안정화**: Environment API를 안정화하기 위해 작업하고 있습니다. 생태계는 더 나은 협업을 위해 정기 회의를 시작했습니다.

## 설치 크기 {#install-size}

Vite의 설치 크기 변화에 대해 투명하게 공유하고자 합니다. Vite 8은 Vite 7 자체와 비교해 약 15 MB 더 큽니다. 이는 주로 두 가지 원인에서 비롯됩니다.

- **lightningcss에서 약 10 MB**: 이전에는 선택적 피어 디펜던시였지만, 이제 lightningcss는 더 나은 CSS 미니파이를 기본 제공하기 위해 일반 디펜던시가 되었습니다.
- **Rolldown에서 약 5 MB**: Rolldown 바이너리는 주로 바이너리 크기보다 속도를 우선하는 성능 최적화 때문에 esbuild + Rollup보다 큽니다.

Rolldown이 성숙해짐에 따라 설치 크기를 계속 모니터링하고 줄이기 위해 노력하겠습니다.

## Vite 8로 마이그레이션 {#migrating-to-vite-8}

대부분의 프로젝트에서 Vite 8로 업그레이드하는 과정은 매끄러워야 합니다. 기존 `esbuild`와 `rollupOptions` 구성을 해당하는 Rolldown 및 Oxc 구성으로 자동 변환하는 호환성 레이어를 마련했기 때문에, 많은 프로젝트는 설정 변경 없이 동작할 것입니다.

규모가 크거나 더 복잡한 프로젝트라면 점진적 마이그레이션 경로를 권장합니다. 먼저 Vite 7에서 `vite` 대신 `rolldown-vite` 패키지로 전환해 Rolldown에 특화된 문제를 분리한 다음, Vite 8로 업그레이드하세요. 이 두 단계 접근 방식에서는 문제가 번들러 변경에서 온 것인지, 아니면 다른 Vite 8 변경에서 온 것인지 쉽게 구분됩니다.

업그레이드 전에 자세한 [마이그레이션 가이드](/guide/migration)를 검토하세요. 전체 변경 사항 목록은 [Vite 8 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)에 있습니다.

## Rollup과 esbuild에 감사드립니다 {#thank-you-rollup-and-esbuild}

Vite가 Rolldown으로 이동하면서, Vite의 기반이 된 두 프로젝트에 깊이 감사드립니다.

Rollup은 처음부터 Vite의 프로덕션 번들러였습니다. 우아한 플러그인 API 설계는 Rolldown이 이를 자신의 API로 채택할 만큼 잘 구상되어 있었고, Vite의 전체 플러그인 생태계는 Rollup이 놓은 기반 덕분에 존재합니다. Rollup 아키텍처의 품질과 사려 깊음은 Vite가 확장성을 바라보는 방식을 형성했습니다. Rollup을 만들어준 [Rich Harris](https://github.com/Rich-Harris), 그리고 이를 유지보수하고 웹 툴링 생태계에 오래 남을 영향을 가진 것으로 발전시켜준 [Lukas Taegert-Atkinson](https://github.com/lukastaegert)과 Rollup 팀에 감사드립니다.

esbuild는 초기부터 Vite의 놀라울 정도로 빠른 개발 경험을 뒷받침했습니다. 디펜던시 사전 번들링, TypeScript와 JSX 변환이 수백 밀리초가 아니라 밀리초 단위로 완료되었습니다. esbuild는 빌드 도구가 몇 자릿수나 더 빨라질 수 있음을 증명했고, 그 속도는 Rust와 Go 기반 툴링의 한 세대 전체에 영감을 준 기준이 되었습니다. 우리 모두에게 무엇이 가능한지 보여준 [Evan Wallace](https://github.com/evanw)에게 감사드립니다.

이 두 프로젝트가 없었다면 오늘날의 Vite는 존재하지 않았을 것입니다. Rolldown과 함께 앞으로 나아가더라도 Rollup과 esbuild의 영향은 Vite의 DNA에 깊이 새겨져 있으며, 그들이 생태계에 준 모든 것에 감사드립니다. Vite가 의존하는 모든 프로젝트와 사람들에 대해서는 [감사의 말](/acknowledgements) 페이지에서 더 자세히 알아볼 수 있습니다.

## 감사의 말 {#acknowledgments}

Vite 8은 광범위한 기여자 커뮤니티, 다운스트림 유지보수자, 플러그인 작성자의 도움을 받아 [sapphi-red](https://github.com/sapphi-red)와 [Vite 팀](/team)이 이끌었습니다. Rolldown 기반 Vite 8 구현에 긴밀히 협력해준 [Rolldown 팀](https://rolldown.rs/team)에 감사드립니다. `rolldown-vite` 프리뷰와 Vite 8 베타 기간에 참여해준 모든 분들께도 특히 감사드립니다. 여러분의 테스트, 버그 리포트, 피드백은 Rolldown 마이그레이션의 바탕이 되었고, 이번 릴리스의 완성도를 높였습니다.

Vite는 [Bolt](https://bolt.new/) 및 [NuxtLabs](https://nuxtlabs.com/)와의 파트너십으로 [VoidZero](https://voidzero.dev)가 제공합니다. 또한 [Vite의 GitHub Sponsors](https://github.com/sponsors/vitejs)와 [Vite의 Open Collective](https://opencollective.com/vite)의 후원자들에게도 감사드립니다.
