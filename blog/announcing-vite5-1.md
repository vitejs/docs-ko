---
title: Vite 5.1이 출시되었습니다!
author:
  name: The Vite Team
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5.1
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1이 출시되었습니다! {#vite-5-1-is-out}

_2024년 2월 8일_

![Vite 5.1 발표 커버 이미지](/og-image-announcing-vite5-1.png)

Vite 5는 지난 11월에 [출시되었으며](./announcing-vite5.md), Vite와 생태계에 또 다른 큰 도약을 의미했습니다. 몇 주 전에는 주간 npm 다운로드 1천만 건과 Vite 저장소 기여자 900명을 축하했습니다. 오늘, 저희는 Vite 5.1의 출시를 발표하게 되어 기쁩니다.

빠른 링크: [문서](/), [변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

다른 언어로 된 문서: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)

StackBlitz에서 Vite 5.1을 온라인으로 체험해보세요: [vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts).

Vite를 처음 사용하신다면, 먼저 [시작하기](/guide/) 및 [기능](/guide/features) 가이드를 읽어보시기 바랍니다.

최신 소식을 받아보시려면 [X](https://x.com/vite_js) 또는 [Mastodon](https://webtoo.ls/@vite)에서 저희를 팔로우해주세요.

## Vite Runtime API {#vite-runtime-api}

Vite 5.1은 새로운 Vite Runtime API에 대한 실험적 지원을 추가합니다. 이는 Vite 플러그인으로 먼저 처리하여 모든 코드를 실행할 수 있게 해줍니다. 런타임 구현이 서버에서 분리되어 있기 때문에 `server.ssrLoadModule`과는 다릅니다. 이를 통해 라이브러리와 프레임워크 작성자들이 서버와 런타임 간에 자체적인 통신 계층을 구현할 수 있습니다. 이 새로운 API는 안정화되면 Vite의 현재 SSR 프리미티브를 대체할 예정입니다.

새로운 API는 많은 이점을 제공합니다:

- SSR 중 HMR 지원.
- 서버에서 분리되어 있어 단일 서버를 사용할 수 있는 클라이언트 수에 제한이 없습니다. 각 클라이언트는 자체 모듈 캐시를 가지며(메시지 채널/fetch 호출/직접 함수 호출/웹소켓 등 원하는 방식으로 통신할 수 있습니다).
- node/bun/deno 내장 API에 의존하지 않으므로 어떤 환경에서도 실행할 수 있습니다.
- 자체적인 코드 실행 메커니즘을 가진 도구와 쉽게 통합할 수 있습니다(예를 들어 `new AsyncFunction` 대신 `eval`을 사용하는 러너를 제공할 수 있습니다).

초기 아이디어는 [Pooya Parsa가 제안했고](https://github.com/nuxt/vite/pull/201) [Anthony Fu](https://github.com/antfu)가 [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) 패키지로 구현하여 [Nuxt 3 Dev SSR을 지원하고](https://antfu.me/posts/dev-ssr-on-nuxt) 나중에 [Vitest](https://vitest.dev)의 기반으로도 사용되었습니다. 따라서 vite-node의 일반적인 아이디어는 상당한 시간 동안 실전에서 검증되었습니다. 이는 [Vladimir Sheremet](https://github.com/sheremet-va)에 의한 API의 새로운 반복으로, 그는 이미 Vitest에서 vite-node를 재구현했으며 학습한 내용을 바탕으로 Vite Core에 추가할 때 API를 더욱 강력하고 유연하게 만들었습니다. 이 PR은 1년간 제작되었으며, 생태계 유지보수자들과의 발전과 논의 과정을 [여기서](https://github.com/vitejs/vite/issues/12165) 확인할 수 있습니다.

::: info
Vite Runtime API는 Module Runner API로 발전하여 [Environment API](/guide/api-environment)의 일부로 Vite 6에서 출시되었습니다.
:::

## 기능 {#features}

### `.css?url`에 대한 개선된 지원 {#improved-support-for-css-url}

CSS 파일을 URL로 가져오는 기능이 이제 안정적이고 올바르게 작동합니다. 이는 Remix의 Vite 이전에서 남은 마지막 장애물이었습니다. 참조 ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit`이 이제 콜백을 지원합니다 {#build-assetsinlinelimit-now-supports-a-callback}

사용자는 이제 특정 애셋에 대해 인라인 처리를 선택하거나 제외하기 위해 불린 값을 반환하는 [콜백을 제공](/config/build-options.html#build-assetsinlinelimit)할 수 있습니다. `undefined`가 반환되면 기본 로직이 적용됩니다. 참조 ([#15366](https://github.com/vitejs/vite/issues/15366)).

### 순환 import에 대한 개선된 HMR {#improved-hmr-for-circular-import}

Vite 5.0에서는 순환 import 내의 수락된 모듈이 클라이언트에서 정상적으로 처리될 수 있음에도 불구하고 항상 전체 페이지 새로고침을 유발했습니다. 이제 이 제한이 완화되어 전체 페이지 새로고침 없이 HMR이 적용될 수 있지만, HMR 중에 오류가 발생하면 페이지가 새로고침됩니다. 참조 ([#15118](https://github.com/vitejs/vite/issues/15118)).

### 모든 SSR 패키지를 외부화하는 `ssr.external: true` 지원 {#support-ssr-external-true-to-externalize-all-ssr-packages}

역사적으로 Vite는 연결된 패키지를 제외한 모든 패키지를 외부화했습니다. 이 새로운 옵션은 연결된 패키지를 포함하여 모든 패키지를 강제로 외부화하는 데 사용할 수 있습니다. 이는 모든 패키지가 외부화되는 일반적인 경우를 에뮬레이션하려는 모노레포 내의 테스트나, 임의의 파일을 로드하기 위해 `ssrLoadModule`을 사용할 때 HMR을 신경 쓰지 않으므로 항상 패키지를 외부화하고 싶을 때 유용합니다. 참조 ([#10939](https://github.com/vitejs/vite/issues/10939)).

### 프리뷰 서버에서 `close` 메서드 노출 {#expose-close-method-in-the-preview-server}

프리뷰 서버는 이제 열린 모든 소켓 연결을 포함하여 서버를 적절히 해제하는 `close` 메서드를 노출합니다. 참조 ([#15630](https://github.com/vitejs/vite/issues/15630)).

## 성능 개선 {#performance-improvements}

Vite는 각 릴리스마다 계속 빨라지고 있으며, Vite 5.1은 성능 개선으로 가득합니다. 저희는 [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf)를 사용하여 Vite 4.0부터 모든 마이너 버전에 대해 10K 모듈(25단계 깊이 트리)의 로딩 시간을 측정했습니다. 이는 Vite의 번들 없는 접근 방식의 효과를 측정하는 좋은 벤치마크입니다. 각 모듈은 카운터와 트리의 다른 파일에 대한 import를 가진 작은 TypeScript 파일이므로, 이는 주로 개별 모듈로 요청을 처리하는 데 걸리는 시간을 측정합니다. Vite 4.0에서는 10K 모듈을 로드하는 데 M1 MAX에서 8초가 걸렸습니다. [성능에 집중한 Vite 4.3에서 획기적인 발전](./announcing-vite4-3.md)이 있었고, 6.35초에 로드할 수 있었습니다. Vite 5.1에서는 또 다른 성능 도약을 이뤄냈습니다. Vite는 이제 10K 모듈을 5.35초에 서빙합니다.

![Vite 10K 모듈 로딩 시간 진행 상황](/vite5-1-10K-modules-loading-time.png)

이 벤치마크의 결과는 Headless Puppeteer에서 실행되며 버전을 비교하는 좋은 방법입니다. 하지만 사용자가 경험하는 시간을 나타내지는 않습니다. Chrome의 시크릿 창에서 동일한 10K 모듈을 실행할 때의 결과는 다음과 같습니다:

| 10K 모듈                | Vite 5.0 | Vite 5.1 |
| ----------------------- | :------: | :------: |
| 로딩 시간               |  2892ms  |  2765ms  |
| 로딩 시간 (캐시됨)      |  2778ms  |  2477ms  |
| 전체 새로고침           |  2003ms  |  1878ms  |
| 전체 새로고침 (캐시됨)  |  1682ms  |  1604ms  |

### 스레드에서 CSS 전처리기 실행 {#run-css-preprocessors-in-threads}

Vite는 이제 스레드에서 CSS 전처리기를 실행하는 옵트인 지원을 제공합니다. [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers)를 사용하여 활성화할 수 있습니다. Vuetify 2 프로젝트의 경우, 이 기능을 활성화하면 개발 시작 시간이 40% 단축되었습니다. [PR에서 다른 설정에 대한 성능 비교](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918)가 있습니다. 참조 ([#13584](https://github.com/vitejs/vite/issues/13584)). [피드백 제공하기](https://github.com/vitejs/vite/discussions/15835).

### 서버 콜드 스타트를 개선하는 새로운 옵션 {#new-options-to-improve-server-cold-starts}

대규모 프로젝트에서 도움이 될 수 있는 deps 최적화를 위한 새로운 전략으로 전환하기 위해 `optimizeDeps.holdUntilCrawlEnd: false`를 설정할 수 있습니다. 저희는 향후 이 전략을 기본값으로 전환하는 것을 고려하고 있습니다. [피드백 제공하기](https://github.com/vitejs/vite/discussions/15834). ([#15244](https://github.com/vitejs/vite/issues/15244))

### 캐시된 검사로 더 빠른 리졸빙 {#faster-resolving-with-cached-checks}

`fs.cachedChecks` 최적화가 이제 기본적으로 활성화됩니다. Windows에서 `tryFsResolve`가 ~14배 빨라졌고, triangle 벤치마크에서 id 리졸빙이 전체적으로 ~5배 속도 향상을 얻었습니다. ([#15704](https://github.com/vitejs/vite/issues/15704))

### 내부 성능 개선 {#internal-performance-improvements}

개발 서버에는 여러 점진적인 성능 향상이 있었습니다. 304에서 단축하는 새로운 미들웨어([#15586](https://github.com/vitejs/vite/issues/15586)). 핫 패스에서 `parseRequest`를 피했습니다([#15617](https://github.com/vitejs/vite/issues/15617)). Rollup이 이제 적절히 지연 로드됩니다([#15621](https://github.com/vitejs/vite/issues/15621))

## 지원 중단 {#deprecations}

프로젝트를 장기적으로 유지 관리할 수 있도록 가능한 한 Vite의 API 표면을 계속 줄여나가고 있습니다.

### `import.meta.glob`의 `as` 옵션 지원 중단 {#deprecated-as-option-in-import-meta-glob}

표준이 [Import Attributes](https://github.com/tc39/proposal-import-attributes)로 이동했지만, 현재로서는 `as`를 새로운 옵션으로 교체할 계획이 없습니다. 대신 사용자가 `query`로 전환하는 것을 권장합니다. 참조 ([#14420](https://github.com/vitejs/vite/issues/14420)).

### 실험적 빌드 타임 사전 번들링 제거 {#removed-experimental-build-time-pre-bundling}

Vite 3에서 추가된 실험적 기능인 빌드 타임 사전 번들링이 제거되었습니다. Rollup 4가 파서를 네이티브로 전환하고 Rolldown이 작업 중인 상황에서, 이 기능의 성능과 dev-vs-build 불일치 스토리가 더 이상 유효하지 않습니다. 저희는 dev/build 일관성을 계속 개선하고 싶으며, "개발 중 사전 번들링"과 "프로덕션 빌드"에 Rolldown을 사용하는 것이 앞으로 더 나은 선택이라고 결론지었습니다. Rolldown은 또한 빌드 중 deps 사전 번들링보다 훨씬 더 효율적인 방식으로 캐싱을 구현할 수도 있습니다. 참조 ([#15184](https://github.com/vitejs/vite/issues/15184)).

## 참여하기 {#get-involved}

[Vite Core의 900명의 기여자](https://github.com/vitejs/vite/graphs/contributors)와 생태계를 계속 발전시키는 플러그인, 통합, 도구, 번역의 유지보수자들에게 감사드립니다. Vite를 즐겁게 사용하고 계시다면, 참여하여 저희를 도와주시기 바랍니다. [기여 가이드](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)를 확인하고, [이슈 분류](https://github.com/vitejs/vite/issues), [PR 리뷰](https://github.com/vitejs/vite/pulls), [GitHub Discussions](https://github.com/vitejs/vite/discussions)에서 질문 답변, [Vite Land](https://chat.vite.dev)에서 커뮤니티의 다른 사람들 도움에 참여해보세요.

## 감사의 말 {#acknowledgments}

Vite 5.1은 기여자 커뮤니티, 생태계의 유지보수자들, 그리고 [Vite 팀](/team) 덕분에 가능했습니다. Vite 개발을 후원하는 개인과 기업들에게 감사드립니다. Vite 팀 멤버를 고용한 [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build)에 감사드립니다. 그리고 [Vite의 GitHub Sponsors](https://github.com/sponsors/vitejs), [Vite의 Open Collective](https://opencollective.com/vite), [Evan You의 GitHub Sponsors](https://github.com/sponsors/yyx990803)의 후원자들에게도 감사드립니다.