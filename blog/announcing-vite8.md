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
      content: Announcing Vite 8
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8
  - - meta
    - property: og:description
      content: Vite 8 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.0이 출시되었습니다! {#vite-8-0-is-out}

_2026년 3월 12일_

![Vite 8 발표 커버 이미지](/og-image-announcing-vite8.webp)

Vite 8의 안정 버전 릴리스를 발표하게 되어 기쁩니다! Vite가 처음 출시되었을 때, 저희는 개발 중 속도를 위해 esbuild를, 최적화된 프로덕션 빌드를 위해 Rollup을 사용하는 두 번들러 전략을 실용적으로 선택했습니다. 그 선택은 수년간 좋은 결과를 가져왔습니다. Rollup과 esbuild 유지보수자들께 깊이 감사드립니다. 그들이 없었다면 Vite는 성공하지 못했을 것입니다. 오늘, 그 선택은 하나로 수렴합니다: Vite 8은 [Rolldown](https://rolldown.rs/)을 단일 통합 Rust 기반 번들러로 제공하여, 완전한 플러그인 호환성을 유지하면서 최대 10-30x 더 빠른 빌드를 제공합니다. 이는 Vite 2 이후 가장 중요한 아키텍처 변경입니다.

Vite는 이제 주간 6,500만 회 다운로드되고 있으며, 생태계는 릴리스마다 계속 성장하고 있습니다. 개발자가 계속 확장되는 플러그인 환경을 탐색할 수 있도록, Vite, Rolldown, Rollup용 플러그인의 검색 가능한 디렉터리인 [registry.vite.dev](https://registry.vite.dev)도 출시했습니다. 이 디렉터리는 npm에서 매일 플러그인 데이터를 수집합니다.

빠른 링크:

- [문서](/)
- 번역: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [마이그레이션 가이드](/guide/migration)
- [GitHub 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

[vite.new](https://vite.new)를 사용해 Vite 8을 온라인으로 체험하거나, `pnpm create vite`를 실행해 선호하는 프레임워크로 Vite 앱을 로컬에서 스캐폴딩하세요. 자세한 정보는 [시작하기 가이드](/guide/)를 확인해 주세요.

저희는 여러분이 Vite 개선에 참여해 주시기를 바랍니다([Vite Core의 1.2K명 이상의 기여자](https://github.com/vitejs/vite/graphs/contributors)에 합류), Vite의 디펜던시, 또는 생태계의 플러그인과 프로젝트에 참여해 주세요. 자세한 내용은 [기여 가이드](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)에서 확인하세요. 시작하기 좋은 방법은 [이슈 분류](https://github.com/vitejs/vite/issues), [PR 리뷰](https://github.com/vitejs/vite/pulls), 열린 이슈를 기반으로 한 테스트 PR 전송, [Discussions](https://github.com/vitejs/vite/discussions)나 Vite Land의 [도움 포럼](https://discord.com/channels/804011606160703521/1019670660856942652)에서 다른 사람들 지원입니다. 질문이 있으시면, [Discord 커뮤니티](https://chat.vite.dev)에 참여하여 [#contributing 채널](https://discord.com/channels/804011606160703521/804439875226173480)에서 저희와 대화하세요.

[Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), 또는 [Mastodon](https://webtoo.ls/@vite)에서 저희를 팔로우해 최신 소식을 받고 Vite 위에서 구축하는 다른 사람들과 소통하세요.

## Rolldown 기반 Vite {#the-rolldown-powered-vite}

### 문제 {#the-problem}

초기 버전부터 Vite는 서로 다른 요구를 처리하기 위해 두 개의 별도 번들러에 의존했습니다. [esbuild](https://esbuild.github.io/)는 개발 경험을 즉각적으로 느끼게 해준 빠른 개발 중 컴파일(디펜던시 사전 번들링과 TypeScript/JSX 변환)을 처리했습니다. [Rollup](https://rollupjs.org/)은 프로덕션 번들링, 청크 분할, 최적화를 처리했으며, 풍부한 플러그인 API로 전체 Vite 플러그인 생태계를 뒷받침했습니다.

이 이중 번들러 접근 방식은 수년간 Vite에 잘 맞았습니다. 이를 통해 저희는 파싱과 번들링을 처음부터 다시 만드는 대신 개발 경험과 오케스트레이션에 집중할 수 있었습니다. 하지만 트레이드오프도 있었습니다. 두 개의 별도 변환 파이프라인은 두 개의 별도 플러그인 시스템을 의미했고, 두 파이프라인을 동기화 상태로 유지하기 위한 연결 코드가 점점 더 많이 필요해졌습니다. 일관되지 않은 모듈 처리와 관련된 엣지 케이스가 시간이 지나며 누적되었고, 한 파이프라인에서의 정합성 수정은 다른 파이프라인에 차이를 도입할 위험이 있었습니다.

### 해결책 {#the-solution}

[Rolldown](https://rolldown.rs/)은 이러한 과제를 정면으로 해결하기 위해 [VoidZero](https://voidzero.dev) 팀이 만든 Rust 기반 번들러입니다. Rolldown은 세 가지 목표로 설계되었습니다:

- **성능:** Rust로 작성된 Rolldown은 네이티브 속도로 동작합니다. 벤치마크에서 esbuild의 성능 수준에 맞먹으며 [Rollup보다 10-30x 빠릅니다](https://github.com/rolldown/benchmarks).
- **호환성:** Rolldown은 Rollup 및 Vite와 동일한 플러그인 API를 지원합니다. 대부분의 기존 Vite 플러그인은 Vite 8에서 즉시 작동합니다.
- **고급 기능:** 하나의 통합 번들러는 이중 번들러 설정으로는 어렵거나 불가능했던 기능을 열어줍니다. 여기에는 전체 번들 모드, 더 유연한 청크 분할, 모듈 수준 영구 캐싱, Module Federation 지원이 포함됩니다.

### 안정화까지의 여정 {#the-journey-to-stable}

Rolldown으로의 마이그레이션은 신중하고 커뮤니티 중심으로 진행되었습니다. 먼저 안정 버전 Vite에 영향을 주지 않고 얼리 어답터가 Rolldown 통합을 테스트할 수 있도록 별도의 [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) 패키지를 기술 프리뷰로 릴리스했습니다. 얼리 어답터의 피드백은 매우 값졌습니다. 그들은 다양한 형태와 규모의 실제 코드베이스에서 통합을 검증하며, 더 넓은 릴리스 전에 해결할 수 있는 엣지 케이스와 호환성 문제를 드러냈습니다. 또한 핵심 Vite 플러그인과 프레임워크를 새 번들러에 대해 검증하는 전용 CI 스위트를 구축해, 회귀를 조기에 포착하고 마이그레이션 경로에 대한 신뢰를 높였습니다.

2025년 12월, 저희는 Rolldown을 완전히 통합한 [Vite 8 베타](/blog/announcing-vite8-beta)를 출시했습니다. 베타 기간 동안 Rolldown 자체도 베타에서 릴리스 후보로 발전했으며, Vite 커뮤니티의 테스트와 피드백을 바탕으로 지속적으로 개선되었습니다.

### 실제 환경에서의 성능 {#real-world-performance}

`rolldown-vite`의 프리뷰 및 베타 단계 동안 여러 회사에서 프로덕션 빌드 시간이 측정 가능하게 단축되었다고 보고했습니다:

- **Linear:** 프로덕션 빌드 시간이 46초에서 6초로 감소
- **Ramp:** 빌드 시간 57% 단축
- **Mercedes-Benz.io:** 빌드 시간 최대 38% 단축
- **Beehiiv:** 빌드 시간 64% 단축

대규모 프로젝트에서는 그 영향이 특히 두드러질 수 있으며, Rolldown이 계속 발전함에 따라 더 많은 개선을 기대하고 있습니다.

### 통합 툴체인 {#a-unified-toolchain}

Vite 8을 통해 Vite는 긴밀히 협업하는 팀들이 만든 엔드투엔드 툴체인의 진입점이 됩니다: 빌드 도구(Vite), 번들러(Rolldown), 컴파일러([Oxc](https://oxc.rs/))입니다. 이 정렬은 파싱과 해석부터 변환과 축소화까지 전체 스택에서 일관된 동작을 보장합니다. 또한 JavaScript가 진화함에 따라 새로운 언어 명세를 빠르게 도입할 수 있음을 의미합니다. 그리고 레이어 전반에 깊이 통합함으로써, Rolldown에서 더 나은 트리 셰이킹을 위해 Oxc의 의미 분석을 활용하는 등 이전에는 닿기 어려웠던 최적화를 추구할 수 있습니다.

### 커뮤니티에 감사드립니다 {#thank-you-to-the-community}

이 모든 것은 더 넓은 커뮤니티 없이는 불가능했을 것입니다. 저희는 `rolldown-vite`를 일찍 테스트하고, 상세한 버그 리포트를 제출하고, 호환성 문제를 해결하기 위해 저희와 함께 작업해준 프레임워크 팀들([SvelteKit](https://svelte.dev/docs/kit/introduction), [React Router](https://reactrouter.com/), [Storybook](https://storybook.js.org/), [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), 그리고 많은 다른 팀들)에 깊은 감사를 전하고 싶습니다. 또한 베타를 사용해 보고, 빌드 시간 개선 결과를 공유하고, 이 릴리스를 다듬는 데 도움이 된 거친 부분들을 보고해준 모든 개발자에게도 똑같이 감사드립니다. 실제 프로젝트에서 마이그레이션을 테스트해 주신 여러분 덕분에 Rolldown으로의 전환이 더 매끄럽고 신뢰할 수 있게 되었습니다.

## Node.js 지원 {#node-js-support}

Vite 8은 Node.js 20.19+, 22.12+를 요구하며, 이는 Vite 7과 동일한 요구 사항입니다. 이러한 범위는 Node.js가 플래그 없이 `require(esm)`을 지원하도록 보장하여 Vite를 ESM 전용으로 배포할 수 있게 합니다.

## 추가 기능 {#additional-features}

Rolldown 통합 외에도 Vite 8에는 몇 가지 주목할 만한 기능이 포함되어 있습니다:

- **통합 Devtools:** Vite 8에는 디버깅과 분석을 위한 개발자 도구인 [Vite Devtools](https://devtools.vite.dev/)를 활성화하는 [`devtools`](/config/shared-options#devtools) 옵션이 포함되어 있습니다. Vite Devtools는 개발 서버에서 직접 Vite 기반 프로젝트에 대한 더 깊은 인사이트를 제공합니다.

- **내장 tsconfig `paths` 지원:** 개발자는 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths)를 `true`로 설정해 TypeScript 경로 별칭 해석을 활성화할 수 있습니다. 이는 작은 성능 비용이 있으며 기본적으로 활성화되지 않습니다.

- **`emitDecoratorMetadata` 지원:** Vite 8은 이제 TypeScript의 `emitDecoratorMetadata` 옵션에 대한 내장 자동 지원을 제공하여 외부 플러그인이 필요하지 않게 합니다. 자세한 내용은 [기능](/guide/features.md#emitdecoratormetadata) 페이지를 참고하세요.

- **Wasm SSR 지원:** 이제 [`.wasm?init` 임포트](/guide/features#webassembly)가 SSR 환경에서 작동하며, Vite의 WebAssembly 기능을 서버 사이드 렌더링으로 확장합니다.

- **브라우저 콘솔 전달:** Vite 8은 브라우저 콘솔 로그와 오류를 개발 서버 터미널로 전달할 수 있습니다. 이는 코딩 에이전트와 작업할 때 특히 유용하며, 런타임 클라이언트 오류가 CLI 출력에 표시됩니다. [`server.forwardConsole`](/config/server-options.md#server-forwardconsole)로 활성화할 수 있으며, 코딩 에이전트가 감지되면 자동으로 활성화됩니다.

## `@vitejs/plugin-react` v6 {#vitejs-plugin-react-v6}

Vite 8과 함께 `@vitejs/plugin-react` v6도 릴리스합니다. 이 플러그인은 React Refresh 변환에 Oxc를 사용합니다. Babel은 더 이상 디펜던시가 아니며 설치 크기도 더 작아졌습니다.

[React Compiler](https://react.dev/learn/react-compiler)가 필요한 프로젝트를 위해, v6는 `@rolldown/plugin-babel`과 함께 작동하는 `reactCompilerPreset` 헬퍼를 제공하여 기본 설정에 부담을 주지 않으면서 명시적으로 옵트인할 수 있는 경로를 제공합니다.

자세한 내용은 [릴리스 노트](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0)를 참고하세요.

v5도 여전히 Vite 8에서 작동하므로, Vite를 업그레이드한 후 플러그인을 업그레이드할 수 있습니다.

## 향후 계획 {#looking-ahead}

Rolldown 통합은 개선과 최적화의 가능성을 열어줍니다. 다음은 저희가 앞으로 작업 중인 내용입니다:

- **전체 번들 모드** (실험적 기능): 이 모드는 프로덕션 빌드와 유사하게 개발 중에도 모듈을 번들링합니다. 초기 결과에서는 개발 서버 시작이 3x 빨라지고, 전체 리로드가 40% 빨라지며, 네트워크 요청이 10x 줄었습니다. 이는 번들링하지 않는 개발 방식이 확장성 한계에 부딪히는 대규모 프로젝트에서 특히 큰 효과가 있습니다.

- [**Raw AST 전송**](https://github.com/oxc-project/oxc/issues/2409): JavaScript 플러그인이 Rust에서 생성한 AST에 최소한의 직렬화 오버헤드로 접근할 수 있게 하여, Rust 내부와 JS 플러그인 코드 사이의 성능 격차를 줄입니다.

- [**네이티브 MagicString 변환**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring): 로직은 JavaScript에 있지만 문자열 조작 계산은 Rust에서 실행되는 커스텀 변환을 가능하게 합니다.

- **Environment API 안정화**: 저희는 Environment API를 안정화하기 위해 작업하고 있습니다. 생태계는 더 잘 협업하기 위해 정기 회의를 시작했습니다.

## 설치 크기 {#install-size}

저희는 Vite의 설치 크기 변화에 대해 투명하게 공유하고자 합니다. Vite 8 자체는 Vite 7보다 약 15 MB 더 큽니다. 이는 두 가지 주요 원인에서 비롯됩니다:

- **lightningcss에서 ~10 MB**: 이전에 선택적 peer 디펜던시였던 lightningcss는 이제 기본적으로 더 나은 CSS 축소화를 제공하기 위해 일반 디펜던시가 되었습니다.
- **Rolldown에서 ~5 MB**: Rolldown 바이너리는 주로 바이너리 크기보다 속도를 우선하는 성능 최적화 때문에 esbuild + Rollup보다 큽니다.

Rolldown이 성숙해짐에 따라 설치 크기를 줄이기 위한 모니터링과 작업을 계속하겠습니다.

## Vite 8로 마이그레이션 {#migrating-to-vite-8}

대부분의 프로젝트에서 Vite 8로 업그레이드는 순조롭게 진행될 것입니다. 저희는 기존 `esbuild` 및 `rollupOptions` 설정을 대응하는 Rolldown 및 Oxc 설정으로 자동 변환하는 호환성 레이어를 만들었으므로, 많은 프로젝트는 설정 변경 없이 작동할 것입니다.

규모가 크거나 더 복잡한 프로젝트에는 점진적인 마이그레이션 경로를 권장합니다: 먼저 Vite 7에서 `vite`를 `rolldown-vite` 패키지로 전환해 Rolldown 관련 문제를 분리한 다음, Vite 8로 업그레이드하세요. 이 두 단계 접근 방식은 문제가 번들러 변경에서 비롯된 것인지, 아니면 다른 Vite 8 변경에서 비롯된 것인지 식별하기 쉽게 합니다.

업그레이드하기 전에 상세한 [마이그레이션 가이드](/guide/migration)를 검토해 주세요. 전체 변경 사항 목록은 [Vite 8 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)에 있습니다.

## Rollup과 esbuild에 감사드립니다 {#thank-you-rollup-and-esbuild}

Vite가 Rolldown으로 전환하면서, Vite를 가능하게 만든 두 프로젝트에 깊은 감사를 전하고자 합니다.

Rollup은 처음부터 Vite의 프로덕션 번들러였습니다. 우아한 플러그인 API 설계는 매우 잘 고안된 것으로 입증되어 Rolldown이 이를 자신의 API로 채택했으며, Vite의 전체 플러그인 생태계는 Rollup이 마련한 토대 위에 존재합니다. Rollup 아키텍처의 품질과 세심함은 Vite가 확장성을 바라보는 방식을 형성했습니다. Rollup을 만들어주신 [Rich Harris](https://github.com/Rich-Harris)와, 이를 유지보수하고 발전시켜 웹 도구 생태계에 오래 지속되는 영향을 남긴 [Lukas Taegert-Atkinson](https://github.com/lukastaegert) 및 Rollup 팀께 감사드립니다.

esbuild는 초기부터 Vite의 놀랍도록 빠른 개발 경험을 뒷받침했습니다: 수백 밀리초가 아닌 몇 밀리초 만에 완료되는 디펜던시 사전 번들링, TypeScript 및 JSX 변환이 그 예입니다. esbuild는 빌드 도구가 몇 자릿수 더 빨라질 수 있음을 증명했고, 그 속도는 Rust 및 Go 기반 도구의 한 세대 전체에 영감을 준 기준이 되었습니다. 우리 모두에게 무엇이 가능한지 보여주신 [Evan Wallace](https://github.com/evanw)께 감사드립니다.

이 두 프로젝트가 없었다면 Vite는 오늘날과 같은 모습으로 존재하지 못했을 것입니다. Rolldown과 함께 앞으로 나아가는 지금도 Rollup과 esbuild의 영향은 Vite의 DNA에 깊이 새겨져 있으며, 이들이 생태계에 기여한 모든 것에 감사드립니다. Vite가 기반으로 삼는 모든 프로젝트와 사람들에 대해서는 [감사의 말](/acknowledgements) 페이지에서 더 자세히 알아볼 수 있습니다.

## 감사의 말 {#acknowledgments}

Vite 8은 광범위한 기여자 커뮤니티, 다운스트림 유지보수자, 플러그인 작성자의 도움을 받아 [sapphi-red](https://github.com/sapphi-red)와 [Vite Team](/team)이 이끌었습니다. Rolldown 기반 Vite 8을 가능하게 만들기 위해 긴밀히 협업해 준 [Rolldown team](https://rolldown.rs/team)에 감사드립니다. 또한 `rolldown-vite` 프리뷰와 Vite 8 베타 기간에 참여한 모든 분께 특히 감사드립니다. 여러분의 테스트, 버그 리포트, 피드백은 Rolldown 마이그레이션을 가능하게 했고, 이 릴리스를 저희가 자랑스럽게 여길 수 있는 결과물로 만들었습니다.

Vite는 [Bolt](https://bolt.new/) 및 [NuxtLabs](https://nuxtlabs.com/)와의 파트너십으로 [VoidZero](https://voidzero.dev)에서 제공합니다. 또한 [Vite의 GitHub Sponsors](https://github.com/sponsors/vitejs)와 [Vite의 Open Collective](https://opencollective.com/vite)의 후원자들에게도 감사드립니다.
