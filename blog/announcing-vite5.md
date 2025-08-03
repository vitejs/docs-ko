# SSR Using `ModuleRunner` API
# Move to Per-environment APIs
author:
  name: The Vite Team
date: 2023-11-16
sidebar: false
head:
  - - meta
## Review Your Browser Setup
      content: website
  - - meta
    - property: og:title
      content: Vite 5.0이 출시되었습니다!
## Environments and Frameworks
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite5.png
Note Vite supports using ES modules syntax in the config file even if the project is not using native Node ESM, e.g. `"type": "module"` in `package.json`. In this case, the config file is auto pre-processed before load.
    - property: og:url
- [Move to Per-environment APIs](/changes/per-environment-apis)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared Plugins During Build](/changes/shared-plugins-during-build)
      content: Vite 5 릴리스 발표
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.0이 출시되었습니다! {#vite-5-0-is-out}

_2023년 11월 16일_

![Vite 5 발표 커버 이미지](/og-image-announcing-vite5.png)

Vite 4가 거의 1년 전에 [릴리스되었고](./announcing-vite4.md), 생태계에 견고한 기반을 제공했습니다. 프로젝트들이 공유 인프라를 기반으로 계속 구축하면서 주간 npm 다운로드 수는 250만 건에서 750만 건으로 급증했습니다. 프레임워크들은 지속적으로 혁신을 이어갔으며, [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/) 등을 비롯해 새로운 프레임워크들이 합류하여 생태계를 더욱 강화했습니다. [RedwoodJS](https://redwoodjs.com/)와 [Remix](https://remix.run/)가 Vite로 전환하면서 React 생태계에서의 추가 도입 가능성을 열었습니다. [Vitest](https://vitest.dev)는 Vite보다도 빠른 속도로 성장을 지속했습니다. Vitest 팀은 열심히 작업하고 있으며 곧 [Vitest 1.0을 릴리스할 예정](https://github.com/vitest-dev/vitest/issues/3596)입니다. [Storybook](https://storybook.js.org), [Nx](https://nx.dev), [Playwright](https://playwright.dev)와 같은 다른 도구들과 함께 사용할 때의 Vite 경험은 계속 개선되었고, [Deno](https://deno.com)와 [Bun](https://bun.sh)에서 Vite 개발이 작동하는 등 환경 면에서도 마찬가지였습니다.

We had the second edition of [ViteConf](https://viteconf.org/23/replay) a month ago, hosted by [StackBlitz](https://stackblitz.com). Like last year, most of the projects in the ecosystem got together to share ideas and connect to keep expanding the commons. We're also seeing new pieces complement the meta-framework tool belt like [Volar](https://volarjs.dev/) and [Nitro](https://nitro.build/). The Rollup team released [Rollup 4](https://rollupjs.org) that same day, a tradition Lukas started last year.

6개월 전 Vite 4.3이 [릴리스되었습니다](./announcing-vite4.md). 이 릴리스는 개발 서버 성능을 크게 개선했습니다. 하지만 여전히 개선할 여지가 충분합니다. ViteConf에서 [Evan You는 호환 가능한 API를 가진 Rollup의 Rust 포트인 Rolldown 작업에 대한 Vite의 장기 계획을 공개했습니다](https://www.youtube.com/watch?v=hrdwQHoAp0M). 준비가 되면 Vite 코어에서 이를 사용하여 Rollup과 esbuild의 작업을 모두 담당할 예정입니다. 이는 빌드 성능 향상(그리고 나중에는 Vite 자체의 성능에 민감한 부분을 Rust로 이동하면서 개발 성능도)과 개발과 빌드 간의 불일치를 크게 줄이는 것을 의미합니다. Rolldown은 현재 초기 단계에 있으며 팀은 연말 이전에 코드베이스를 오픈소스화할 준비를 하고 있습니다. 기대해 주세요!

오늘, 우리는 Vite의 여정에서 또 다른 큰 이정표를 기록합니다. Vite [팀](/team), [기여자들](https://github.com/vitejs/vite/graphs/contributors), 그리고 생태계 파트너들이 Vite 5의 릴리스를 발표하게 되어 기쁩니다. Vite는 이제 [Rollup 4](https://github.com/vitejs/vite/pull/14508)를 사용하며, 이는 이미 빌드 성능에서 큰 향상을 나타냅니다. 그리고 개발 서버 성능 프로파일을 개선할 수 있는 새로운 옵션들도 있습니다.
## Plugins Config
Vite 5는 API 정리(더 이상 사용되지 않는 기능 제거)에 집중하고 여러 기능을 간소화하여 오랫동안 지속된 문제들을 해결했습니다. 예를 들어 `define`이 정규식 대신 적절한 AST 교체를 사용하도록 전환했습니다. 또한 Vite를 미래에 대비하는 단계를 계속 밟고 있습니다(이제 Node.js 18+가 필요하며, [CJS Node API는 더 이상 사용되지 않습니다](/guide/migration#deprecate-cjs-node-api)).

빠른 링크:

- [문서](/)
- [마이그레이션 가이드](/guide/migration)
- [변경 로그](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

다른 언어의 문서:

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)
- [Português](https://pt.vite.dev/)
- [한국어](https://ko.vite.dev/)
- [Deutsch](https://de.vite.dev/) (새로운 번역!)

Vite를 처음 사용하신다면 먼저 [시작하기](/guide/)와 [기능](/guide/features) 가이드를 읽어보시기를 권합니다.

우리가 여기까지 올 수 있도록 도움을 준 [850명 이상의 Vite 코어 기여자들](https://github.com/vitejs/vite/graphs/contributors)과 Vite 플러그인, 통합, 도구, 번역의 메인테이너와 기여자들에게 감사드립니다. Vite를 함께 발전시켜 나갈 수 있도록 여러분의 지속적인 참여를 기다립니다. [기여 가이드](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)에서 자세히 알아보실 수 있습니다. 시작하려면 [이슈 트리아징](https://github.com/vitejs/vite/issues), [PR 리뷰](https://github.com/vitejs/vite/pulls), 열린 이슈를 기반으로 한 실패 테스트 PR 전송, [Discussions](https://github.com/vitejs/vite/discussions)와 Vite Land의 [도움말 포럼](https://discord.com/channels/804011606160703521/1019670660856942652)에서 다른 사람들 돕기를 권합니다. 그 과정에서 많은 것을 배우고 프로젝트에 추가 기여할 수 있는 원활한 길을 갖게 될 것입니다. 궁금한 점이 있으시면 [Discord 커뮤니티](http://chat.vite.dev/)에 참여하여 [#contributing 채널](https://discord.com/channels/804011606160703521/804439875226173480)에서 인사해 주세요.

최신 소식을 받아보려면 [X](https://twitter.com/vite_js) 또는 [Mastodon](https://webtoo.ls/@vite)에서 팔로우해 주세요.

## Vite 5로 빠르게 시작하기 {#quick-start-with-vite-5}

선호하는 프레임워크로 Vite 프로젝트를 시작하려면 `pnpm create vite`명령어를 사용하거나, [vite.new](https://vite.new)에서  체험할 수 있는 시작 템플릿을 열어보세요. `pnpm create vite-extra`를 실행하여 다른 프레임워크와 런타임(Solid, Deno, SSR, 라이브러리 스타터)의 템플릿에 접근할 수도 있습니다. `create vite-extra` 템플릿은 `create vite`를 실행할 때 `Others` 옵션에서도 사용할 수 있습니다.

Vite 스타터 템플릿은 다양한 프레임워크로 Vite를 테스트하는 플레이그라운드로 사용되도록 의도되었다는 점에 유의하세요. 다음 프로젝트를 구축할 때는 각 프레임워크에서 권장하는 스타터를 사용하시기를 권합니다. 일부 프레임워크는 이제 `create vite`에서 자신들의 스타터로 리디렉션하기도 합니다(Vue의 경우 `create-vue`와 `Nuxt 3`, Svelte의 경우 `SvelteKit`).

## Node.js 지원 {#node-js-support}

Vite는 더 이상 EOL에 도달한 Node.js 14 / 16 / 17 / 19를 지원하지 않습니다. 이제 Node.js 18 / 20+가 필요합니다.

## 성능 {#performance}

Rollup 4의 빌드 성능 개선 외에도, [https://vite.dev/guide/performance](/guide/performance)에서 일반적인 성능 문제를 식별하고 해결하는 데 도움이 되는 새로운 가이드가 있습니다.

Vite 5는 또한 시작 시간을 개선하는 새로운 기능인 [server.warmup](/guide/performance.html#warm-up-frequently-used-files)을 도입했습니다. 이를 통해 서버가 시작되자마자 사전 변환되어야 하는 모듈 목록을 정의할 수 있습니다. [`--open` 또는 `server.open`](/config/server-options.html#server-open)을 사용할 때, Vite는 앱의 진입점이나 열기 위해 제공된 URL도 자동으로 워밍업합니다.

## 주요 변경사항 {#main-changes}

- [Vite는 이제 Rollup 4로 구동됩니다](/guide/migration#rollup-4)
- [CJS Node API는 더 이상 사용되지 않습니다](/guide/migration#deprecate-cjs-node-api)
- [`define`과 `import.meta.env.*` 교체 전략 재작업](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [SSR 외부화된 모듈 값이 이제 프로덕션과 일치합니다](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins`는 이제 함수입니다](/guide/migration#worker-plugins-is-now-a-function)
- [`.`을 포함하는 경로가 index.html로 폴백할 수 있도록 허용](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [개발과 프리뷰 HTML 서빙 동작 정렬](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [매니페스트 파일이 이제 기본적으로 `.vite` 디렉터리에 생성됩니다](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [CLI 단축키에 추가 `Enter` 키 입력이 필요합니다](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [`experimentalDecorators`와 `useDefineForClassFields` TypeScript 동작 업데이트](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [`--https` 플래그와 `https: true` 제거](/guide/migration#remove-https-flag-and-https-true)
- [`resolvePackageEntry`와 `resolvePackageData` API 제거](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [이전에 더 이상 사용되지 않는 API 제거](/guide/migration#removed-deprecated-apis)
- [플러그인과 도구 작성자에게 영향을 주는 고급 변경사항에 대해 자세히 읽어보기](/guide/migration#advanced)

## Vite 5로 마이그레이션 {#migrating-to-vite-5}

우리는 생태계 파트너들과 협력하여 이 새로운 메이저 버전으로의 원활한 마이그레이션을 보장했습니다. 다시 한 번, [vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48)가 회귀를 피하면서 더 과감한 변경을 할 수 있도록 도와주는 데 중요한 역할을 했습니다. 다른 생태계들이 프로젝트와 다운스트림 메인테이너 간의 협업을 개선하기 위해 유사한 체계를 채택하는 것을 보게 되어 기쁩니다.

대부분의 프로젝트에서 Vite 5로의 업데이트는 간단할 것입니다. 하지만 업그레이드하기 전에 [상세한 마이그레이션 가이드](/guide/migration)를 검토하시기를 권합니다.

Vite 코어의 전체 변경사항 목록이 포함된 저수준 분석은 [Vite 5 변경 로그](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)에서 확인할 수 있습니다.

## 감사의 말 {#acknowledgments}

Vite 5는 우리 커뮤니티의 기여자들, 다운스트림 메인테이너들, 플러그인 작성자들, 그리고 [Vite 팀](/team)의 오랜 시간에 걸친 작업의 결과입니다. 이번 메이저 릴리스 과정을 이끌어준 [Bjorn Lu](https://twitter.com/bluwyoo)에게 큰 박수를 보냅니다.

또한 Vite 개발을 후원하는 개인과 회사들에게도 감사드립니다. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build)는 Vite 팀 멤버를 고용하여 Vite에 지속적으로 투자하고 있습니다. [Vite의 GitHub Sponsors](https://github.com/sponsors/vitejs), [Vite의 Open Collective](https://opencollective.com/vite), [Evan You의 GitHub Sponsors](https://github.com/sponsors/yyx990803)의 후원자들에게 박수를 보냅니다. Vite로 전환한 후 골드 후원자가 되어 다시 기여해준 [Remix](https://remix.run/)에 특별한 감사를 표합니다.
- [Move to Per-environment APIs](/changes/per-environment-apis)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared Plugins During Build](/changes/shared-plugins-during-build)
## Plugin / Framework Authors Guide
              text: 'Move to Per-environment APIs',
              text: 'SSR Using ModuleRunner API',
              text: 'Shared Plugins During Build',