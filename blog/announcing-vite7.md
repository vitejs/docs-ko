---
title: Vite 7.0이 출시되었습니다!
author:
  name: The Vite Team
date: 2025-06-24
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 7
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite7.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite7
  - - meta
    - property: og:description
      content: Vite 7 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 7.0이 출시되었습니다! {#vite-7-0-is-out}

_2025년 6월 24일_

![Vite 7 발표 커버 이미지](/og-image-announcing-vite7.png)

Vite 7의 출시를 공유하게 되어 기쁩니다! Evan You가 Vite 저장소에 첫 커밋을 보낸 지 5년이 지났으며, 그 이후로 프론트엔드 생태계가 얼마나 많이 변화했는지는 아무도 예측할 수 없었습니다. 이제 대부분의 현대적인 프론트엔드 프레임워크와 도구들이 함께 작업하며, Vite의 공유 인프라 위에 구축되고 있습니다. 그리고 더 높은 수준에서 공유함으로써 더 빠른 속도로 혁신할 수 있게 되었습니다. Vite는 이제 주간 3,100만 회 다운로드되고 있으며, 이전 메이저 릴리스 이후 지난 7개월 동안 1,400만 회 증가했습니다.

올해, 저희는 여러 큰 발걸음을 내딛고 있습니다. 우선, [ViteConf](https://viteconf.org)가 대면으로 진행됩니다! Vite 생태계가 10월 9-10일 암스테르담에서 모입니다! [JSWorld](https://jsworldconference.com/)가 [Bolt](https://bolt.new), [VoidZero](https://voidzero.dev), Vite 코어 팀과 파트너십으로 주최합니다! 저희는 세 번의 놀라운 [ViteConf 온라인 에디션](https://www.youtube.com/@viteconf/playlists)을 가졌으며, 실제로 만날 수 있기를 기대하고 있습니다. [ViteConf 사이트](https://viteconf.org)에서 연사들을 확인하고 티켓을 구매하세요!

그리고 [VoidZero](https://voidzero.dev/posts/announcing-voidzero-inc)는 JavaScript 생태계를 위한 오픈 소스 통합 개발 툴체인 구축이라는 사명에서 계속해서 상당한 진전을 이루고 있습니다. 지난 1년 동안, VoidZero 팀은 Vite의 코어를 현대화하는 더 넓은 노력의 일환으로 Rust 기반 차세대 번들러인 [Rolldown](https://rolldown.rs/)을 작업해왔습니다. 기본 `vite` 패키지 대신 `rolldown-vite` 패키지를 사용하여 오늘 Rolldown 기반 Vite를 체험해볼 수 있습니다. Rolldown이 향후 Vite의 기본 번들러가 될 예정이므로 이는 드롭인 대체재입니다. 전환하면 특히 대규모 프로젝트에서 빌드 시간이 단축됩니다. [Rolldown-vite 발표 블로그 포스트](https://voidzero.dev/posts/announcing-rolldown-vite)와 저희 [마이그레이션 가이드](https://vite.dev/rolldown)에서 더 자세히 읽어보세요.

VoidZero와 [NuxtLabs](https://nuxtlabs.com/) 간의 파트너십을 통해, Anthony Fu는 Vite DevTools 생성 작업을 하고 있습니다. 이는 모든 Vite 기반 프로젝트와 프레임워크에 대해 더 깊고 통찰력 있는 디버깅과 분석을 제공할 것입니다. [VoidZero와 NuxtLabs가 Vite Devtools에서 힘을 합치다 블로그 포스트](https://voidzero.dev/posts/voidzero-nuxtlabs-vite-devtools)에서 더 자세히 읽어보실 수 있습니다.

빠른 링크:

- [문서](/)
- 새로운 번역: [فارسی](https://fa.vite.dev/)
- 다른 번역: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [마이그레이션 가이드](/guide/migration)
- [GitHub 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

[vite.new](https://vite.new)를 사용하여 Vite 7을 온라인으로 체험하거나 `pnpm create vite`를 실행하여 선호하는 프레임워크로 Vite 앱을 로컬에서 스캐폴딩하세요. 자세한 정보는 [시작하기 가이드](/guide/)를 확인하세요.

Vite 개선에 도움을 주시기 바랍니다([Vite Core의 1,100명 이상의 기여자](https://github.com/vitejs/vite/graphs/contributors)에 합류), 저희 의존성, 또는 생태계의 플러그인과 프로젝트에 참여해주세요. 자세한 내용은 [기여 가이드](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)에서 확인하세요. 시작하기 좋은 방법은 [이슈 분류](https://github.com/vitejs/vite/issues), [PR 리뷰](https://github.com/vitejs/vite/pulls), 열린 이슈를 기반으로 한 테스트 PR 전송, [Discussions](https://github.com/vitejs/vite/discussions)나 Vite Land의 [도움 포럼](https://discord.com/channels/804011606160703521/1019670660856942652)에서 다른 사람들 지원입니다. 질문이 있으시면, [Discord 커뮤니티](http://chat.vite.dev/)에 참여하여 [#contributing 채널](https://discord.com/channels/804011606160703521/804439875226173480)에서 저희와 대화하세요.

[Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), 또는 [Mastodon](https://webtoo.ls/@vite)에서 저희를 팔로우하여 최신 소식을 받고 Vite 위에 구축하는 다른 사람들과 소통하세요.

## Node.js 지원 {#node-js-support}

Vite는 이제 Node.js 20.19+, 22.12+가 필요합니다. 2025년 4월 말에 [EOL](https://endoflife.date/nodejs)에 도달한 Node.js 18 지원을 중단했습니다.

저희는 Node.js가 플래그 없이 `require(esm)`을 지원하도록 이러한 새로운 범위를 요구합니다. 이를 통해 Vite JavaScript API가 CJS 모듈에서 require되는 것을 방지하지 않으면서 Vite 7.0을 ESM 전용으로 배포할 수 있습니다. 생태계에서 ESM의 현재 상태에 대한 자세한 검토는 Anthony Fu의 [ESM 전용으로 이동](https://antfu.me/posts/move-on-to-esm-only)을 확인하세요.

## 기본 브라우저 타겟이 Baseline Widely Available로 변경 {#default-browser-target-changed-to-baseline-widely-available}

[Baseline](https://web-platform-dx.github.io/web-features/)은 오늘날 핵심 브라우저 세트에서 어떤 웹 플랫폼 기능이 작동하는지에 대한 명확한 정보를 제공합니다. Baseline Widely Available은 해당 기능이 잘 확립되어 있고 많은 디바이스와 브라우저 버전에서 작동하며, 적어도 30개월 동안 브라우저에서 사용 가능했음을 나타냅니다.

Vite 7에서는 기본 브라우저 타겟이 `'modules'`에서 새로운 기본값인 `'baseline-widely-available'`로 변경됩니다. 브라우저 세트는 각 메이저마다 Baseline Widely available 기능과 호환되는 최소 브라우저 버전 목록에 맞춰 업데이트됩니다. Vite 7.0에서 `build.target`의 기본 브라우저 값이 변경됩니다:

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

이 변경은 향후 릴리스에서 기본 브라우저 타겟에 예측 가능성을 추가합니다.

## Vitest {#vitest}

Vitest 사용자의 경우, Vite 7.0은 Vitest 3.2부터 지원됩니다. Vitest 팀이 Vite 테스트 스토리를 어떻게 계속 개선하고 있는지에 대해서는 [Vitest 3.2 릴리스 블로그 포스트](https://vitest.dev/blog/vitest-3-2.html)에서 더 자세히 읽어보실 수 있습니다.

## Environment API {#environment-api}

Vite 6는 [새로운 실험적 Environment API](https://vite.dev/blog/announcing-vite6.html#experimental-environment-api)로 새로운 기능을 추가한 Vite 2 이후 가장 중요한 메이저 릴리스였습니다. 저희는 생태계가 새로운 API가 그들의 프로젝트에 어떻게 맞는지 검토하고 피드백을 제공하는 동안 새로운 API를 실험적으로 유지하고 있습니다. Vite 위에 구축하고 계시다면, 새로운 API를 테스트하고 [여기 열린 피드백 토론](https://github.com/vitejs/vite/discussions/16358)에서 저희에게 연락하시기 바랍니다.

Vite 7에서는 플러그인이 환경 구축을 조정할 수 있도록 새로운 `buildApp` 훅을 추가했습니다. [프레임워크를 위한 Environment API 가이드](/guide/api-environment-frameworks.html#environments-during-build)에서 더 자세히 읽어보세요.

새로운 API를 테스트하고 새로운 기능을 안정화하는 데 도움을 준 팀들에게 감사드립니다. 예를 들어, Cloudflare 팀은 Cloudflare Vite 플러그인의 1.0 릴리스와 React Router v7에 대한 공식 지원을 발표했습니다. 그들의 플러그인은 런타임 제공자를 위한 Environment API의 잠재력을 보여줍니다. 그들의 접근 방식과 향후 단계에 대해서는 ["그냥 Vite를 사용하세요"… Workers 런타임과 함께](https://blog.cloudflare.com/introducing-the-cloudflare-vite-plugin/)에서 더 자세히 알아보세요.

## Vite 7로 마이그레이션 {#migrating-to-vite-7}

Vite 7은 Vite 6에서 원활한 업데이트가 되어야 합니다. 저희는 Sass 레거시 API 지원과 프로젝트에 영향을 주지 않아야 하는 `splitVendorChunkPlugin` 같은 이미 지원 중단된 기능들을 제거하고 있습니다. 업그레이드하기 전에 [상세한 마이그레이션 가이드](/guide/migration)를 검토하시기 바랍니다.

전체 변경사항 목록은 [Vite 7 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)에서 확인하실 수 있습니다.

## 감사의 말 {#acknowledgments}

Vite 7은 광범위한 기여자 커뮤니티, 다운스트림 유지보수자들, 플러그인 작성자들의 도움으로 [Vite 팀](/team)이 제작했습니다. `rolldown-vite`와 이번 릴리스에 대한 놀라운 작업을 해준 [sapphi-red](https://github.com/sapphi-red)에게 특별히 감사드립니다. Vite는 [Bolt](https://bolt.new/)와 [Nuxt Labs](https://nuxtlabs.com/)와의 파트너십으로 [VoidZero](https://voidzero.dev)에서 제공합니다. 또한 [Vite의 GitHub Sponsors](https://github.com/sponsors/vitejs)와 [Vite의 Open Collective](https://opencollective.com/vite)의 후원자들에게도 감사드립니다.
