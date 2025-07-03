---
title: Vite 4.0이 출시되었습니다!
author:
  name: The Vite Team
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.0이 출시되었습니다!
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Vite 4 릴리스 발표
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.0이 출시되었습니다! {#vite-4-0-is-out}

_2022년 12월 9일_ - [Vite 5.0 발표](./announcing-vite5.md)도 확인해보세요

Vite 3가 5개월 전에 [릴리스되었습니다](./announcing-vite3.md). 그 이후로 주간 npm 다운로드 수가 100만 건에서 250만 건으로 증가했습니다. 생태계도 성숙해졌으며 계속해서 성장하고 있습니다. 올해 [Jamstack Conf 설문조사](https://twitter.com/vite_js/status/1589665610119585793)에서 커뮤니티 사용률이 14%에서 32%로 급증했으며 9.7점의 높은 만족도를 유지했습니다. [Astro 1.0](https://astro.build/), [Nuxt 3](https://v3.nuxtjs.org/), 그리고 혁신하고 협력하는 다른 Vite 기반 프레임워크들의 안정적인 릴리스를 보았습니다: [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/). Storybook은 [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/)의 주요 기능 중 하나로 Vite에 대한 일급 지원을 발표했습니다. Deno도 이제 [Vite를 지원합니다](https://www.youtube.com/watch?v=Zjojo9wdvmY). [Vitest](https://vitest.dev) 채택이 폭발적으로 증가하고 있으며, 곧 Vite npm 다운로드의 절반을 차지할 것입니다. Nx도 생태계에 투자하고 있으며 [공식적으로 Vite를 지원합니다](https://nx.dev/packages/vite).

[![Vite 4 생태계](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

Vite와 관련 프로젝트들이 경험한 성장을 보여주는 사례로, Vite 생태계는 10월 11일 [ViteConf 2022](https://viteconf.org/2022/replay)에서 모였습니다. 주요 웹 프레임워크와 도구들의 대표자들이 혁신과 협력의 이야기를 들려주었습니다. 그리고 상징적인 움직임으로, Rollup 팀은 바로 그 날 [Rollup 3](https://rollupjs.org) 릴리스를 선택했습니다.

오늘, Vite [팀](https://vite.dev/team)은 생태계 파트너들의 도움으로 빌드 시점에 Rollup 3로 구동되는 Vite 4의 릴리스를 발표하게 되어 기쁩니다. 저희는 이 새로운 메이저 버전을 위한 원활한 업그레이드 경로를 보장하기 위해 생태계와 함께 작업했습니다. Vite는 이제 [Rollup 3](https://github.com/vitejs/vite/issues/9870)를 사용하며, 이를 통해 Vite의 내부 에셋 처리를 단순화하고 많은 개선사항을 가져올 수 있었습니다. [Rollup 3 릴리스 노트는 여기에서](https://github.com/rollup/rollup/releases/tag/v3.0.0) 확인하세요.

![Vite 4 발표 커버 이미지](/og-image-announcing-vite4.png)

빠른 링크:

- [문서](/)
- [마이그레이션 가이드](https://v4.vite.dev/guide/migration.html)
- [변경 로그](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

다른 언어의 문서:

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)

최근에 Vite를 사용하기 시작했다면 [Why Vite 가이드](https://vite.dev/guide/why.html)를 읽고 [시작하기](https://vite.dev/guide/)와 [기능 가이드](https://vite.dev/guide/features)를 확인해보시기를 권합니다. 참여하고 싶으시다면 [GitHub](https://github.com/vitejs/vite)에서 기여를 환영합니다. 거의 [700명의 협력자](https://github.com/vitejs/vite/graphs/contributors)가 Vite에 기여했습니다. [Twitter](https://twitter.com/vite_js)와 [Mastodon](https://webtoo.ls/@vite)에서 업데이트를 팔로우하거나 [Discord 커뮤니티](http://chat.vite.dev/)에서 다른 사람들과 협력하세요.

## Vite 4로 체험해보기 시작하기 {#start-playing-with-vite-4}

`pnpm create vite`를 사용하여 선호하는 프레임워크로 Vite 프로젝트를 스캐폴딩하거나, [vite.new](https://vite.new)를 사용하여 온라인에서 시작 템플릿을 열어 Vite 4로 체험해보세요.

`pnpm create vite-extra`를 실행하여 다른 프레임워크와 런타임(Solid, Deno, SSR, 라이브러리 스타터)의 템플릿에 접근할 수도 있습니다. `create vite-extra` 템플릿은 `create vite`를 실행할 때 `Others` 옵션에서도 사용할 수 있습니다.

Vite 스타터 템플릿은 다양한 프레임워크로 Vite를 테스트하는 플레이그라운드로 사용되도록 의도되었다는 점에 유의하세요. 다음 프로젝트를 구축할 때는 각 프레임워크에서 권장하는 스타터에 접근하는 것을 권합니다. 일부 프레임워크는 이제 `create vite`에서 자신들의 스타터로 리디렉션하기도 합니다(Vue의 경우 `create-vue`와 `Nuxt 3`, Svelte의 경우 `SvelteKit`).

## 개발 중 SWC를 사용하는 새로운 React 플러그인 {#new-react-plugin-using-swc-during-development}

[SWC](https://swc.rs/)는 이제 특히 React 프로젝트의 맥락에서 [Babel](https://babeljs.io/)의 성숙한 대체재입니다. SWC의 React Fast Refresh 구현은 Babel보다 훨씬 빠르며, 일부 프로젝트에서는 이제 더 나은 대안입니다. Vite 4부터 서로 다른 트레이드오프를 가진 두 개의 플러그인이 React 프로젝트에 사용할 수 있습니다. 저희는 이 시점에서 두 접근법 모두 지원할 가치가 있다고 믿으며, 앞으로 두 플러그인 모두의 개선사항을 계속 탐구할 것입니다.

### @vitejs/plugin-react {#vitejs-plugin-react}

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)는 esbuild와 Babel을 사용하는 플러그인으로, 작은 패키지 공간으로 빠른 HMR을 달성하고 Babel 변환 파이프라인을 사용할 수 있는 유연성을 제공합니다.

### @vitejs/plugin-react-swc (새로움) {#vitejs-plugin-react-swc-new}

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)는 빌드 중에는 esbuild를 사용하지만 개발 중에는 Babel을 SWC로 대체하는 새로운 플러그인입니다. 비표준 React 확장이 필요하지 않은 대규모 프로젝트의 경우, 콜드 스타트와 Hot Module Replacement(HMR)가 상당히 빨라질 수 있습니다.

## 브라우저 호환성 {#browser-compatibility}

현대 브라우저 빌드는 이제 더 넓은 ES2020 호환성을 위해 기본적으로 `safari14`를 대상으로 합니다. 이는 현대 빌드가 이제 [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)를 사용할 수 있고 [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)가 더 이상 트랜스파일되지 않는다는 것을 의미합니다. 더 오래된 브라우저를 지원해야 한다면 평소처럼 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)를 추가할 수 있습니다.

## CSS를 문자열로 가져오기 {#importing-css-as-a-string}

Vite 3에서는 `.css` 파일의 기본 export를 가져오는 것이 CSS의 이중 로딩을 야기할 수 있었습니다.

```ts
import cssString from './global.css'
```

이 이중 로딩은 `.css` 파일이 내보내지고 CSS 문자열이 애플리케이션 코드에서도 사용될 가능성이 높기 때문에 발생할 수 있었습니다 — 예를 들어, 프레임워크 런타임에 의해 주입되는 경우. Vite 4부터 `.css` 기본 export는 [더 이상 사용되지 않습니다](https://github.com/vitejs/vite/issues/11094). 이 경우 `?inline` 쿼리 접미사 수정자를 사용해야 하며, 이는 가져온 `.css` 스타일을 내보내지 않습니다.

```ts
import stuff from './global.css?inline'
```

[마이그레이션 가이드](https://v4.vite.dev/guide/migration.html)에서 자세히 알아보세요.

## 환경 변수 {#environment-variables}

Vite는 이제 `dotenv` 16과 `dotenv-expand` 9를 사용합니다(이전에는 `dotenv` 14와 `dotenv-expand` 5). `#` 또는 `` ` ``를 포함하는 값이 있다면 따옴표로 감싸야 합니다.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

자세한 내용은 [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md)와 [`dotenv-expand` 변경 로그](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md)를 참조하세요.

## 기타 기능 {#other-features}

- CLI 단축키 (개발 중 `h`를 눌러 모든 단축키 보기) ([#11228](https://github.com/vitejs/vite/pull/11228))
- 의존성 사전 번들링 시 patch-package 지원 ([#10286](https://github.com/vitejs/vite/issues/10286))
- 더 깔끔한 빌드 로그 출력 ([#10895](https://github.com/vitejs/vite/issues/10895))과 브라우저 개발자 도구에 맞춰 `kB`로 전환 ([#10982](https://github.com/vitejs/vite/issues/10982))
- SSR 중 개선된 오류 메시지 ([#11156](https://github.com/vitejs/vite/issues/11156))

## 패키지 크기 감소 {#reduced-package-size}

Vite는 특히 문서와 재현을 위한 플레이그라운드 사용 사례에서 설치 속도를 높이기 위해 공간을 중요하게 생각합니다. 그리고 다시 한 번, 이 메이저 버전은 Vite의 패키지 크기 개선을 가져왔습니다. Vite 4 설치 크기는 vite 3.2.5에 비해 23% 작습니다(14.1MB vs 18.3MB).

## Vite 코어 업그레이드 {#upgrades-to-vite-core}

[Vite 코어](https://github.com/vitejs/vite)와 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)는 메인테이너와 협력자에게 더 나은 경험을 제공하고 Vite 개발이 생태계의 성장에 대처할 수 있도록 확장되도록 계속 발전하고 있습니다.

### 코어에서 분리된 프레임워크 플러그인 {#framework-plugins-out-of-core}

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue)와 [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react)는 Vite의 첫 번째 버전부터 Vite 코어 모노레포의 일부였습니다. 이는 변경사항을 만들 때 코어와 플러그인을 함께 테스트하고 릴리스하면서 긴밀한 피드백 루프를 얻는 데 도움이 되었습니다. [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)를 통해 독립적인 리포지토리에서 개발되는 이러한 플러그인들과 이 피드백을 얻을 수 있으므로, Vite 4부터 [Vite 코어 모노레포에서 분리되었습니다](https://github.com/vitejs/vite/pull/11158). 이는 Vite의 프레임워크 독립적인 스토리에 의미가 있으며 각 플러그인을 유지 관리하는 독립적인 팀을 구축할 수 있게 해줍니다. 버그를 신고하거나 기능을 요청할 것이 있다면 앞으로 새로운 리포지토리에 이슈를 생성해주세요: [`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue)와 [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### vite-ecosystem-ci 개선사항 {#vite-ecosystem-ci-improvements}

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)는 [대부분의 주요 다운스트림 프로젝트](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests)의 CI 상태에 대한 온디맨드 상태 보고서를 제공하여 Vite의 CI를 확장합니다. 저희는 Vite의 main 브랜치에 대해 주 3회 vite-ecosystem-ci를 실행하고 회귀를 도입하기 전에 시기적절한 보고서를 받습니다. Vite 4는 곧 Vite를 사용하는 대부분의 프로젝트와 호환될 것이며, 이들은 이미 필요한 변경사항이 포함된 브랜치를 준비했고 앞으로 며칠 내에 릴리스할 예정입니다. 또한 댓글에서 `/ecosystem-ci run`을 사용하여 PR에서 온디맨드로 vite-ecosystem-ci를 실행할 수 있어 main에 도달하기 전에 [변경사항의 효과](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064)를 알 수 있습니다.

## 감사의 말 {#acknowledgments}

Vite 4는 Vite 기여자들의 수많은 시간의 작업 없이는 불가능했을 것입니다. 그들 중 많은 이들이 다운스트림 프로젝트와 플러그인의 메인테이너들이며, [Vite 팀](/team)의 노력도 있었습니다. 저희 모두는 Vite를 사용하는 모든 프레임워크와 앱을 위해 Vite의 DX를 다시 한 번 개선하기 위해 함께 작업했습니다. 이렇게 활기찬 생태계를 위한 공통 기반을 개선할 수 있게 되어 감사합니다.

또한 Vite 팀을 후원하는 개인과 회사들, 그리고 Vite의 미래에 직접 투자하는 회사들에게도 감사드립니다: [@antfu7](https://twitter.com/antfu7)의 Vite와 생태계에 대한 작업은 [Nuxt Labs](https://nuxtlabs.com/)에서의 그의 업무의 일부이며, [Astro](https://astro.build)는 [@bluwyoo](https://twitter.com/bluwyoo)의 Vite 코어 작업에 자금을 지원하고 있으며, [StackBlitz](https://stackblitz.com/)는 [@patak_dev](https://twitter.com/patak_dev)를 Vite에서 풀타임으로 작업하도록 고용했습니다.

## 다음 단계 {#next-steps}

저희의 즉각적인 초점은 가능한 회귀로 인한 중단을 피하기 위해 새로 열린 이슈를 트리아징하는 것입니다. 참여하여 Vite 개선에 도움을 주고 싶으시다면 이슈 트리아징부터 시작하는 것을 제안합니다. [Discord](https://chat.vite.dev)에 참여하여 `#contributing` 채널에 연락하세요. `#docs` 스토리를 다듬고 다른 사람들을 `#help`하세요. Vite의 채택이 계속 성장함에 따라 다음 사용자들을 위한 도움이 되고 환영받는 커뮤니티를 계속 구축해야 합니다.

Vite를 선택하여 프레임워크를 구동하고 앱을 개발하는 모든 사람의 DX를 계속 개선할 수 있는 많은 열린 전선이 있습니다. 앞으로 나아가세요!