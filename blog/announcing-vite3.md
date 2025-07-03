---
title: Vite 3.0이 출시되었습니다!
author:
  name: The Vite Team
date: 2022-07-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 3.0이 출시되었습니다!
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite3.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite3
  - - meta
    - property: og:description
      content: Vite 3 릴리스 발표
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 3.0이 출시되었습니다! {#vite-3-0-is-out}

_2022년 7월 23일_ - [Vite 4.0 발표](./announcing-vite4.md)도 확인해보세요

작년 2월, [Evan You](https://twitter.com/youyuxi)가 Vite 2를 릴리스했습니다. 그 이후로 Vite의 채택은 멈추지 않고 성장하여 주당 100만 건 이상의 npm 다운로드를 기록하고 있습니다. 릴리스 후 방대한 생태계가 빠르게 형성되었습니다. Vite는 웹 프레임워크에서 새로운 혁신 경쟁을 이끌고 있습니다. [Nuxt 3](https://v3.nuxtjs.org/)는 기본적으로 Vite를 사용합니다. [SvelteKit](https://kit.svelte.dev/), [Astro](https://astro.build/), [Hydrogen](https://hydrogen.shopify.dev/), [SolidStart](https://docs.solidjs.com/quick-start)는 모두 Vite로 구축되었습니다. [Laravel은 이제 기본적으로 Vite를 사용하기로 결정했습니다](https://laravel.com/docs/9.x/vite). [Vite Ruby](https://vite-ruby.netlify.app/)는 Vite가 Rails DX를 어떻게 개선할 수 있는지 보여줍니다. [Vitest](https://vitest.dev)는 Jest의 Vite 네이티브 대안으로 진전을 이루고 있습니다. Vite는 [Cypress](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test)와 [Playwright](https://playwright.dev/docs/test-components)의 새로운 컴포넌트 테스팅 기능을 뒷받침하고 있으며, Storybook은 [Vite를 공식 빌더로](https://github.com/storybookjs/builder-vite) 채택했습니다. 그리고 [목록은 계속됩니다](https://patak.dev/vite/ecosystem.html). 이러한 프로젝트 대부분의 메인테이너들이 Vite 코어 자체를 개선하는 데 참여하여 Vite [팀](https://vite.dev/team) 및 다른 기여자들과 긴밀히 협력하고 있습니다.

![Vite 3 발표 커버 이미지](/og-image-announcing-vite3.png)

오늘, v2 출시로부터 16개월 후 Vite 3의 릴리스를 발표하게 되어 기쁩니다. 저희는 [Node.js의 EOL](https://nodejs.org/en/about/releases/)에 맞춰 최소 매년 새로운 Vite 메이저 버전을 릴리스하기로 결정했으며, 생태계 프로젝트들을 위한 간단한 마이그레이션 가이드와 함께 Vite의 API를 정기적으로 검토할 기회를 갖기로 했습니다.

빠른 링크:

- [문서](/)
- [마이그레이션 가이드](https://v3.vite.dev/guide/migration.html)
- [변경 로그](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-2022-07-13)

Vite를 처음 접하신다면 [Why Vite 가이드](https://vite.dev/guide/why.html)를 읽어보시기를 권합니다. 그런 다음 [시작하기](https://vite.dev/guide/)와 [기능 가이드](https://vite.dev/guide/features)를 확인하여 Vite가 제공하는 것들을 살펴보세요. 언제나 그렇듯이 [GitHub](https://github.com/vitejs/vite)에서의 기여를 환영합니다. 지금까지 [600명 이상의 협력자](https://github.com/vitejs/vite/graphs/contributors)가 Vite 개선에 도움을 주었습니다. [Twitter](https://twitter.com/vite_js)에서 업데이트를 팔로우하거나 [Discord 채팅 서버](http://chat.vite.dev/)에서 다른 Vite 사용자들과 토론에 참여하세요.

## 새로운 문서 {#new-documentation}

[vite.dev](https://vite.dev)로 이동하여 새로운 v3 문서를 즐겨보세요. Vite는 이제 새로운 [VitePress](https://vitepress.vuejs.org) 기본 테마를 사용하며, 다른 기능들과 함께 멋진 다크 모드를 제공합니다.

[![Vite 문서 첫 페이지](../images/v3-docs.png)](https://vite.dev)

생태계의 여러 프로젝트들이 이미 이 테마로 마이그레이션했습니다([Vitest](https://vitest.dev), [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/), [VitePress](https://vitepress.vuejs.org/) 자체 포함).

Vite 2 문서에 접근해야 한다면 [v2.vite.dev](https://v2.vite.dev)에서 온라인으로 계속 이용할 수 있습니다. 또한 새로운 [main.vite.dev](https://main.vite.dev) 서브도메인이 있으며, 여기서는 Vite의 main 브랜치에 대한 각 커밋이 자동으로 배포됩니다. 이는 베타 버전을 테스트하거나 코어 개발에 기여할 때 유용합니다.

이제 이전의 중국어 및 일본어 번역에 추가하여 공식 스페인어 번역도 있습니다:

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)

## Create Vite 스타터 템플릿 {#create-vite-starter-templates}

[create-vite](/guide/#trying-vite-online) 템플릿은 좋아하는 프레임워크로 Vite를 빠르게 테스트할 수 있는 훌륭한 도구였습니다. Vite 3에서는 모든 템플릿이 새로운 문서에 맞춘 새로운 테마를 얻었습니다. 온라인에서 열어보고 지금 Vite 3으로 체험해보세요:

<div class="stackblitz-links">
<a target="_blank" href="https://vite.new"><img width="75" height="75" src="../images/vite.svg" alt="Vite logo"></a>
<a target="_blank" href="https://vite.new/vue"><img width="75" height="75" src="../images/vue.svg" alt="Vue logo"></a>
<a target="_blank" href="https://vite.new/svelte"><img width="60" height="60" src="../images/svelte.svg" alt="Svelte logo"></a>
<a target="_blank" href="https://vite.new/react"><img width="75" height="75" src="../images/react.svg" alt="React logo"></a>
<a target="_blank" href="https://vite.new/preact"><img width="65" height="65" src="../images/preact.svg" alt="Preact logo"></a>
<a target="_blank" href="https://vite.new/lit"><img width="60" height="60" src="../images/lit.svg" alt="Lit logo"></a>
</div>

<style>
.stackblitz-links {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .stackblitz-links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
.stackblitz-links > a {
  width: 70px;
  height: 70px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.stackblitz-links > a:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>

이제 테마가 모든 템플릿에서 공유됩니다. 이는 이러한 스타터들이 Vite로 시작하기 위한 최소한의 템플릿이라는 범위를 더 잘 전달하는 데 도움이 됩니다. 린팅, 테스팅 설정 및 기타 기능을 포함한 더 완전한 솔루션의 경우, [create-vue](https://github.com/vuejs/create-vue) 및 [create-svelte](https://github.com/sveltejs/kit)와 같은 일부 프레임워크를 위한 공식 Vite 기반 템플릿이 있습니다. [Awesome Vite](https://github.com/vitejs/awesome-vite#templates)에는 커뮤니티가 관리하는 템플릿 목록이 있습니다.

## 개발 개선사항 {#dev-improvements}

### Vite CLI {#vite-cli}

<pre style="background-color: var(--vp-code-block-bg);padding:2em;border-radius:8px;max-width:100%;overflow-x:auto;">
  <span style="color:lightgreen"><b>VITE</b></span> <span style="color:lightgreen">v3.0.0</span>  <span style="color:gray">ready in <b>320</b> ms</span>

  <span style="color:lightgreen"><b>➜</b></span>  <span style="color:white"><b>Local</b>:</span>   <span style="color:cyan">http://127.0.0.1:5173/</span>
  <span style="color:green"><b>➜</b></span>  <span style="color:gray"><b>Network</b>: use --host to expose</span>
</pre>

CLI의 미적 개선사항 외에도, 기본 개발 서버 포트가 이제 5173이고 프리뷰 서버가 4173에서 수신 대기한다는 것을 알 수 있습니다. 이 변경은 Vite가 다른 도구들과의 충돌을 피할 수 있도록 보장합니다.

### 개선된 WebSocket 연결 전략 {#improved-websocket-connection-strategy}

Vite 2의 문제점 중 하나는 프록시 뒤에서 실행할 때 서버를 구성하는 것이었습니다. Vite 3는 기본 연결 스키마를 변경하여 대부분의 시나리오에서  작동하도록 했습니다. 이러한 모든 설정은 이제 [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue)를 통해 Vite 생태계 CI의 일부로 테스트됩니다.

### 콜드 스타트 개선사항 {#cold-start-improvements}

Vite는 이제 초기 정적으로 가져온 모듈을 크롤링하는 동안 플러그인이 의존성을 주입하더라도, 콜드 스타트 시 전체 페이지 리로드가 발생하지 않도록 방지합니다([#8869](https://github.com/vitejs/vite/issues/8869)).

<details>
  <summary><b>자세히 알아보기</b></summary>

Vite 2.9에서는 스캐너와 옵티마이저가 모두 백그라운드에서 실행되었습니다. 스캐너가 모든 의존성을 찾는 최선의 시나리오에서는 콜드 스타트에서 리로드가 필요하지 않았습니다. 하지만 스캐너가 의존성을 놓친 경우, 새로운 최적화 단계와 그 다음 리로드가 필요했습니다. Vite는 v2.9에서 새로 최적화된 청크가 브라우저가 가진 것과 호환되는지 감지하여 이러한 리로드 중 일부를 피할 수 있었습니다. 하지만 공통 의존성이 있는 경우, 하위 청크가 변경될 수 있어 중복된 상태를 피하기 위해 리로드가 필요했습니다. Vite 3에서는 정적 가져오기의 크롤링이 완료될 때까지 최적화된 의존성이 브라우저에 전달되지 않습니다. 누락된 의존성이 있는 경우(예: 플러그인에 의해 주입된 경우) 빠른 최적화 단계가 실행되고, 그 후에만 번들된 의존성이 전송됩니다. 따라서 이러한 경우에는 더 이상 페이지 리로드가 필요하지 않습니다.

</details>

<img style="background-color: var(--vp-code-block-bg);padding:4%;border-radius:8px;" width="100%" height="auto" src="../images/vite-3-cold-start.svg" alt="Vite 2.9와 Vite 3 최적화 전략을 비교하는 두 그래프">

### import.meta.glob {#import-meta-glob}

`import.meta.glob` 지원이 다시 작성되었습니다. [Glob Import 가이드](/guide/features.html#glob-import)에서 새로운 기능들을 읽어보세요:

[다중 패턴](/guide/features.html#multiple-patterns)을 배열로 전달할 수 있습니다

```js
import.meta.glob(['./dir/*.js', './another/*.js'])
```

특정 파일을 무시하기 위한 [부정 패턴](/guide/features.html#negative-patterns)(`!`로 시작하는)이 이제 지원됩니다

```js
import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

[명명된 가져오기](/guide/features.html#named-imports)를 지정하여 트리 쉐이킹을 개선할 수 있습니다

```js
import.meta.glob('./dir/*.js', { import: 'setup' })
```

[사용자 정의 쿼리](/guide/features.html#custom-queries)를 전달하여 메타데이터를 첨부할 수 있습니다

```js
import.meta.glob('./dir/*.js', { query: { custom: 'data' } })
```

[즉시 가져오기](/guide/features.html#glob-import)는 이제 플래그로 전달됩니다

```js
import.meta.glob('./dir/*.js', { eager: true })
```

### 미래 표준과 WASM Import 정렬 {#aligning-wasm-import-with-future-standards}

WebAssembly 가져오기 API가 미래 표준과의 충돌을 피하고 더 유연하게 만들기 위해 수정되었습니다:

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

[WebAssembly 가이드](/guide/features.html#webassembly)에서 자세히 알아보세요

## 빌드 개선사항 {#build-improvements}

### 기본적으로 ESM SSR 빌드 {#esm-ssr-build-by-default}

생태계의 대부분 SSR 프레임워크는 이미 ESM 빌드를 사용하고 있었습니다. 따라서 Vite 3는 ESM을 SSR 빌드의 기본 형식으로 만듭니다. 이를 통해 이전의 [SSR 외부화 휴리스틱](https://vite.dev/guide/ssr.html#ssr-externals)을 간소화하여 기본적으로 의존성을 외부화할 수 있습니다.

### 개선된 상대 Base 지원 {#improved-relative-base-support}

Vite 3는 이제 상대 base(`base: ''` 사용)를 적절히 지원하여 빌드된 에셋을 다시 빌드하지 않고 다른 base에 배포할 수 있습니다. 이는 빌드 시점에 base를 알 수 없는 경우, 예를 들어 [IPFS](https://ipfs.io/)와 같은 콘텐츠 주소 지정 가능한 네트워크에 배포할 때 유용합니다.

## 실험적 기능 {#experimental-features}

### 빌드된 에셋에 대한 세밀한 경로 제어 (실험적) {#built-asset-paths-fine-grained-control-experimental}

이것만으로는 충분하지 않은 다른 배포 시나리오들이 있습니다. 예를 들어, 생성된 해시된 에셋을 공용 파일과 다른 CDN에 배포해야 하는 경우, 빌드 시점에 경로 생성에 대한 더 세밀한 제어가 필요합니다. Vite 3는 빌드된 파일 경로를 수정하는 실험적 API를 제공합니다. 자세한 내용은 [빌드 고급 Base 옵션](/guide/build.html#advanced-base-options)을 확인하세요.

### 빌드 시점의 Esbuild 의존성 최적화 (실험적) {#esbuild-deps-optimization-at-build-time-experimental}

개발과 빌드 시점의 주요 차이점 중 하나는 Vite가 의존성을 처리하는 방식입니다. 빌드 시점에는 [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs)를 사용하여 CJS 전용 의존성(React와 같은)을 가져올 수 있습니다. 개발 서버를 사용할 때는 대신 esbuild를 사용하여 의존성을 사전 번들링하고 최적화하며, CJS 의존성을 가져오는 사용자 코드를 변환하는 동안 인라인 상호 운용 스키마가 적용됩니다. Vite 3 개발 중에 [빌드 시점에도 esbuild를 사용하여 의존성을 최적화](https://v3.vite.dev/guide/migration.html#using-esbuild-deps-optimization-at-build-time)할 수 있도록 필요한 변경사항을 도입했습니다. 그러면 [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs)를 피할 수 있어 개발과 빌드 시점이 동일한 방식으로 작동하게 됩니다.

Rollup v3가 앞으로 몇 달 안에 출시될 예정이고, 우리는 또 다른 Vite 메이저로 후속 작업을 진행할 예정이므로, v3 범위를 줄이고 Vite와 생태계가 빌드 시점의 새로운 CJS 상호 운용 접근법과 관련된 잠재적 문제를 해결할 시간을 더 주기 위해 이 모드를 선택 사항으로 만들기로 결정했습니다. 프레임워크들은 Vite 4 이전에 자신들의 속도에 맞춰 빌드 시점에 esbuild 의존성 최적화를 기본으로 사용하도록 전환할 수 있습니다.

### HMR 부분 수용 (실험적) {#hmr-partial-accept-experimental}

[HMR 부분 수용](https://github.com/vitejs/vite/pull/7324)에 대한 옵트인 지원이 있습니다. 이 기능은 동일한 모듈에서 여러 바인딩을 내보내는 프레임워크 컴포넌트에 대해 더 세밀한 HMR을 가능하게 할 수 있습니다. [이 제안에 대한 토론](https://github.com/vitejs/vite/discussions/7309)에서 자세히 알아볼 수 있습니다.

## 번들 크기 감소 {#bundle-size-reduction}

Vite는 배포 및 설치 용량을 중요하게 생각합니다. 새 앱의 빠른 설치는 하나의 기능입니다. Vite는 대부분의 의존성을 번들링하고 가능한 곳에서는 현대적이고 가벼운 대안을 사용하려고 합니다. 이러한 지속적인 목표를 계속하여, Vite 3 배포 용량은 v2보다 30% 작습니다.

|             | 배포 용량 | 설치 용량 |
| ----------- | :----------: | :----------: |
| Vite 2.9.14 |    4.38MB    |    19.1MB    |
| Vite 3.0.0  |    3.05MB    |    17.8MB    |
| 감소   |     -30%     |     -7%      |

부분적으로, 이 감소는 대부분의 사용자가 필요로 하지 않는 일부 의존성을 선택 사항으로 만든 것으로 가능했습니다. 먼저, [Terser](https://github.com/terser/terser)는 더 이상 기본적으로 설치되지 않습니다. 이 의존성은 Vite 2에서 이미 esbuild를 JS와 CSS 모두의 기본 미니파이어로 만들었기 때문에 더 이상 필요하지 않았습니다. `build.minify: 'terser'`를 사용한다면 설치해야 합니다(`npm add -D terser`). 또한 [node-forge](https://github.com/digitalbazaar/forge)를 모노레포에서 제거하고, 자동 https 인증서 생성 지원을 새로운 플러그인으로 구현했습니다: [`@vitejs/plugin-basic-ssl`](https://v3.vite.dev/guide/migration.html#automatic-https-certificate-generation). 이 기능은 로컬 저장소에 추가되지 않는 신뢰할 수 없는 인증서만 생성하므로, 추가된 크기를 정당화하지 못했습니다.

## 버그 수정 {#bug-fixing}

최근 Vite 팀에 합류한 [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red)가 주도한 트리아징 마라톤이 있었습니다. 지난 3개월 동안 Vite 열린 이슈는 770개에서 400개로 줄었습니다. 그리고 이 감소는 새로 열린 PR이 역대 최고치를 기록하는 동안 달성되었습니다. 동시에 [@haoqunjiang](https://twitter.com/haoqunjiang)도 [Vite 이슈의 포괄적인 개요](https://github.com/vitejs/vite/discussions/8232)를 큐레이션했습니다.

[![Vite의 열린 이슈와 풀 리퀘스트 그래프](../images/v3-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

[![Vite의 새로운 이슈와 풀 리퀘스트 그래프](../images/v3-new-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

## 호환성 참고사항 {#compatibility-notes}

- Vite는 더 이상 EOL에 도달한 Node.js 12 / 13 / 15를 지원하지 않습니다. 이제 Node.js 14.18+ / 16+가 필요합니다.
- Vite는 이제 ESM으로 배포되며, 호환성을 위해 ESM 엔트리에 대한 CJS 프록시가 있습니다.
- 현대 브라우저 베이스라인은 이제 [네이티브 ES 모듈](https://caniuse.com/es6-module), [네이티브 ESM 동적 가져오기](https://caniuse.com/es6-module-dynamic-import), [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) 기능을 지원하는 브라우저를 대상으로 합니다.
- SSR 및 라이브러리 모드의 JS 파일 확장자는 이제 형식과 패키지 타입에 따라 출력 JS 엔트리와 청크에 대해 유효한 확장자(`js`, `mjs`, 또는 `cjs`)를 사용합니다.

[마이그레이션 가이드](https://v3.vite.dev/guide/migration.html)에서 자세히 알아보세요.

## Vite 코어 업그레이드 {#upgrades-to-vite-core}

Vite 3를 작업하면서 [Vite 코어](https://github.com/vitejs/vite) 협력자들의 기여 경험도 개선했습니다.

- 단위 및 E2E 테스트가 [Vitest](https://vitest.dev)로 마이그레이션되어 더 빠르고 안정적인 DX를 제공합니다. 이 이동은 생태계의 중요한 인프라 프로젝트에 대한 도그푸딩 역할도 합니다.
- VitePress 빌드가 이제 CI의 일부로 테스트됩니다.
- Vite가 생태계의 나머지를 따라 [pnpm 7](https://pnpm.io/)로 업그레이드되었습니다.
- 플레이그라운드가 packages 디렉터리에서 [`/playgrounds`](https://github.com/vitejs/vite/tree/main/playground)로 이동되었습니다.
- 패키지와 플레이그라운드가 이제 `"type": "module"`입니다.
- 플러그인이 이제 [unbuild](https://github.com/unjs/unbuild)를 사용하여 번들링되며, [plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)와 [plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)가 TypeScript로 이동되었습니다.

## 생태계가 v3에 준비되었습니다 {#the-ecosystem-is-ready-for-v3}

우리는 생태계의 프로젝트들과 긴밀히 협력하여 Vite 기반 프레임워크들이 Vite 3에 준비되도록 했습니다. [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)를 통해 생태계의 주요 플레이어들의 CI를 Vite의 main 브랜치에 대해 실행하고 회귀를 도입하기 전에 시기적절한 보고서를 받을 수 있습니다. 오늘의 릴리스는 곧 Vite를 사용하는 대부분의 프로젝트와 호환될 것입니다.

## 감사의 말 {#acknowledgments}

Vite 3는 [Vite 팀](/team) 구성원들이 생태계 프로젝트 메인테이너들 및 Vite 코어의 다른 협력자들과 함께 작업한 총합적인 노력의 결과입니다.

Vite 3에 기능을 구현하고, 수정하고, 피드백을 제공하고, 참여해주신 모든 분들께 감사드립니다:

- Vite 팀 구성원들 [@youyuxi](https://twitter.com/youyuxi), [@patak_dev](https://twitter.com/patak_dev), [@antfu7](https://twitter.com/antfu7), [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), [@haoqunjiang](https://twitter.com/haoqunjiang), [@poyoho](https://github.com/poyoho), [@Shini_92](https://twitter.com/Shini_92), [@retropragma](https://twitter.com/retropragma).
- [@benmccann](https://github.com/benmccann), [@danielcroe](https://twitter.com/danielcroe), [@brillout](https://twitter.com/brillout), [@sheremet_va](https://twitter.com/sheremet_va), [@userquin](https://twitter.com/userquin), [@enzoinnocenzi](https://twitter.com/enzoinnocenzi), [@maximomussini](https://twitter.com/maximomussini), [@IanVanSchooten](https://twitter.com/IanVanSchooten), [Astro 팀](https://astro.build/), 그리고 v3를 형성하는 데 도움을 준 생태계의 모든 다른 프레임워크 및 플러그인 메인테이너들.
- vite-ecosystem-ci에 대한 작업을 해주신 [@dominikg](https://github.com/dominikg).
- [pnpm](https://pnpm.io/)에 대한 작업과 우리가 지원이 필요할 때의 반응성을 보여주신 [@ZoltanKochan](https://twitter.com/ZoltanKochan).
- HMR 부분 수용 지원을 해주신 [@rixo](https://github.com/rixo).
- Vite 3 릴리스를 위해 테마를 준비해주신 [@KiaKing85](https://twitter.com/KiaKing85)와 VitePress 내부 작업을 해주신 [@\_brc_dd](https://twitter.com/_brc_dd).
- 새로운 스페인어 번역을 해주신 [@CodingWithCego](https://twitter.com/CodingWithCego)와 중국어 및 일본어 번역 팀의 [@ShenQingchuan](https://twitter.com/ShenQingchuan), [@hiro-lapis](https://github.com/hiro-lapis) 및 번역된 문서를 최신 상태로 유지해주신 다른 분들.

또한 Vite 팀을 후원하는 개인과 회사들, 그리고 Vite 개발에 투자하는 회사들에게도 감사드립니다: [@antfu7](https://twitter.com/antfu7)의 Vite 및 생태계에 대한 작업 중 일부는 [Nuxt Labs](https://nuxtlabs.com/)에서의 그의 업무의 일부이며, [StackBlitz](https://stackblitz.com/)는 [@patak_dev](https://twitter.com/patak_dev)를 Vite에서 풀타임으로 작업하도록 고용했습니다.

## 다음은 무엇인가요 {#what-s-next}

우리는 앞으로 몇 달 동안 Vite 위에 구축된 모든 프로젝트들의 원활한 전환을 보장하는 데 집중할 것입니다. 따라서 첫 번째 마이너 버전들은 새로 열린 이슈에 집중하여 트리아징 노력을 계속하는 데 중점을 둘 것입니다.

Rollup 팀은 [다음 메이저 작업](https://twitter.com/lukastaegert/status/1544186847399743488)을 진행하고 있으며, 앞으로 몇 달 안에 릴리스될 예정입니다. Rollup 플러그인 생태계가 업데이트할 시간을 가진 후, 우리는 새로운 Vite 메이저로 후속 작업을 진행할 것입니다. 이는 올해 더 중요한 변경사항을 도입할 또 다른 기회를 제공할 것이며, 이번 릴리스에서 도입된 일부 실험적 기능들을 안정화하는 데 활용할 수 있습니다.

Vite 개선에 도움을 주고 싶으시다면, 이슈 트리아징을 도와주시는 것이 참여하는 가장 좋은 방법입니다. [Discord](https://chat.vite.dev)에 참여하여 `#contributing` 채널을 찾아보세요. 또는 `#docs`, `#help` 다른 사람들을 도와주거나 플러그인을 만드는 것에 참여하세요. 우리는 이제 막 시작했습니다. Vite의 DX를 계속 개선할 수 있는 많은 열린 아이디어들이 있습니다.