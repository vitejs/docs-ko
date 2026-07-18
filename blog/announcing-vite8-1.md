---
title: Vite 8.1이 출시되었습니다!
author:
  name: The Vite Team
date: 2026-06-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 8.1 발표
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-1.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-1
  - - meta
    - property: og:description
      content: Vite 8.1 릴리스 발표

  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.1이 출시되었습니다! {#vite-8-1-is-out}

_2026년 6월 23일_

![Vite 8.1 발표 커버 이미지](/og-image-announcing-vite8-1.webp)

Vite 8은 지난 3월 [출시되었으며](./announcing-vite8.md), [Rolldown](https://rolldown.rs/) 기반의 단일 통합 번들러를 통해 추가 개선의 길을 열었습니다. 현재 주간 다운로드 수는 4,160만 회로, Vite 7의 전체 다운로드 수에 거의 도달했습니다. 업그레이드 회귀를 해결하는 한편 새로운 기능을 개발해 왔으며, Vite 8.1 릴리스를 발표하게 되어 기쁩니다.

빠른 링크:

- [문서](/)
- 번역: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [GitHub 변경 사항](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

[vite.new](https://vite.new)를 사용해 Vite 8.1을 온라인에서 체험하거나, `pnpm create vite`를 실행해 선호하는 프레임워크로 Vite 앱을 로컬에서 스캐폴딩하세요. 자세한 정보는 [시작하기 가이드](/guide/)를 확인하세요.

Vite 개선에 참여해 주시기를 바랍니다. [Vite Core에 기여한 1,200명 이상의 사람들](https://github.com/vitejs/vite/graphs/contributors)과 함께하거나, Vite의 디펜던시, 생태계 플러그인과 프로젝트에 기여할 수 있습니다. 자세한 내용은 [기여 가이드](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)에서 확인하세요. 시작하기 좋은 방법은 [이슈 분류](https://github.com/vitejs/vite/issues), [PR 리뷰](https://github.com/vitejs/vite/pulls), 열린 이슈를 기반으로 한 테스트 PR 전송, [Discussions](https://github.com/vitejs/vite/discussions)나 Vite Land의 [도움말 포럼](https://discord.com/channels/804011606160703521/1019670660856942652)에서 다른 사람을 돕는 것입니다. 질문이 있다면 [Discord 커뮤니티](https://chat.vite.dev)에 참여해 [#contributing 채널](https://discord.com/channels/804011606160703521/804439875226173480)에서 Vite 팀과 이야기하세요.

[Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), 또는 [Mastodon](https://webtoo.ls/@vite)에서 Vite를 팔로우하여 최신 소식을 받고 Vite 위에 구축하는 다른 사람들과 소통하세요.

## 기능 {#features}

### 실험적 전체 번들링 모드 {#experimental-bundled-dev-mode}

전체 번들링 모드를 이제 실험적으로 사용할 수 있습니다. 이전에는 "Full Bundle Mode"라고 불렀습니다. 모듈 수 때문에 어려움을 겪는 대규모 애플리케이션의 성능을 개선하는 모드입니다.

React 컴포넌트 10,000개를 로드하는 앱으로 실시한 초기 테스트에서 전체 번들링 모드는 번들하지 않는 개발 서버와 비교해 시작 속도가 약 15배, 전체 페이지 리로드 속도가 10배 빨랐고, 애플리케이션 크기와 관계없이 HMR은 즉각적으로 유지되었습니다. 실제 애플리케이션을 대상으로 한 초기 테스트에서도 비슷한 개선을 확인했습니다. Linear 팀은 콜드 스타트 렌더링이 최대 3배, 전체 리로드가 약 40% 빨라졌고 네트워크 요청은 10배 줄었습니다.

::: details 왜 전체 번들링 모드인가요?

Vite는 번들하지 않는 개발 서버 방식으로 잘 알려져 있으며, 이 방식은 Vite가 처음 등장했을 때 속도와 인기를 얻은 주된 이유였습니다. 처음에는 전통적인 번들링 없이 개발 서버 성능의 한계를 어디까지 끌어올릴 수 있는지 알아보는 실험이었습니다.

그러나 프로젝트의 규모와 복잡성이 커지면서 Vite의 번들하지 않는 개발 방식이 개발 중 성능을 떨어뜨릴 수 있다는 사실이 분명해졌습니다. 각 모듈을 개별적으로 가져오므로 브라우저는 많은 요청을 처리해야 하고, 이로 인해 시작과 새로고침 오버헤드가 증가합니다. 이러한 영향은 대규모 애플리케이션에서 특히 두드러지며, 개발자가 네트워크 프록시 뒤에 있을 때 더 심해져 새로고침이 느려지고 개발자 경험이 나빠집니다.

전체 번들링 모드는 프로덕션뿐 아니라 개발 중에도 번들링된 파일을 제공해 두 방식의 장점을 결합합니다:

- 대규모 애플리케이션에서도 빠른 시작
- 페이지 새로고침 시 네트워크 오버헤드 감소
- ESM 출력에서 효율적인 HMR 유지

:::

현재 브라우저 측과 기본 플러그인, 주요 기능에 중점을 두고 있습니다. 서드 파티 플러그인을 사용한다면 이 모드에서 동작하지 않을 수 있습니다. 세부 기능도 동작하지 않을 수 있습니다. 지원 범위를 넓히는 한편, 플러그인 측에서 필요할 수 있는 변경 사항을 명확히 설명하는 문서를 준비하고 있습니다. 로드맵에 대한 자세한 내용은 [설계 문서](https://github.com/vitejs/vite/discussions/22746)를 참고하세요.

이 모드를 활성화하려면 `--experimental-bundle`을 전달하거나 `vite.config.js`에 `experimental.bundledDev: true`를 추가하세요:

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },
})
```

[논의](https://github.com/vitejs/vite/discussions/22747)에 피드백을 공유해 주세요.

### 실험적 청크 임포트 맵 {#experimental-chunk-import-map}

출력 번들에서 청크의 임포트 구문은 해당 청크의 해시를 포함합니다. 청크 내용이 바뀌면 새 청크가 로드되도록 하기 위함입니다. 하지만 변경된 청크를 임포트하는 청크의 해시도 바뀌며, 변경 사항은 그 청크를 전이적으로 임포트하는 모든 청크로 연쇄됩니다.

```dot
digraph chunk_hash_cascade {
  rankdir=TB
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.25,0.12" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  utils [label="utils.[e5f6 → 88xx].js\ncontent edited" fillcolor="${#fcf4dc|#38301a}" color="${#e0a800|#d4a72c}"]
  page  [label="page.[c3d4 → 77yy].js\nre-hashed by cascade" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]
  entry [label="entry.[a1b2 → 99zz].js\nre-hashed by cascade" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]

  entry -> page  [label="  imports (embeds hash)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
  page  -> utils [label="  imports (embeds hash)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
}
```

실험적 청크 임포트 맵 기능은 임포트 맵을 활용해 이 문제를 해결하고 캐시 효율을 높입니다. 이 기능은 [Rolldown의 기능](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap)을 기반으로 하지만, Vite 고유 기능 지원을 추가합니다. 이 기능을 연구하고 초기에 구현한 [Taisei Mima](https://github.com/bhbs)에게 깊이 감사드립니다!

현재 `experimental.renderBuiltUrl`은 이 옵션과 함께 동작하지 않습니다.

자세한 내용은 [가이드](/guide/features#chunk-import-map-optimization)와 [옵션 문서](/config/build-options#build-chunkimportmap)를 참고하세요. [논의](https://github.com/vitejs/vite/discussions/22703)에 피드백을 공유해 주세요.

### Wasm ESM 통합 지원 {#wasm-esm-integration-support}

[Wasm ESM 통합 제안](https://github.com/WebAssembly/esm-integration/blob/main/proposals/esm-integration/README.md)을 이제 Vite에서 지원합니다. wasm 파일을 임포트하고 내보낸 함수를 직접 사용할 수 있습니다:

```ts
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

제안이 초기 단계에 있을 때 vite-plugin-wasm을 만들고 유지보수했으며, 구현을 Vite 코어에 반영해 준 [Menci](https://github.com/Menci)에게 깊이 감사드립니다!

자세한 내용은 [가이드](/guide/features#esm-integration)를 참고하세요.

### Lightning CSS 기본 사용에 한 걸음 더 가까이 {#one-step-closer-to-use-lightning-css-by-default}

PostCSS는 지원하지만 Lightning CSS에는 없던 기능을 추가하기 위해 Lightning CSS 팀과 협력했습니다. Vite 8.1은 이제 다음 두 기능을 제공합니다:

- CSS 파일에서 임포트한 외부 CSS 파일 허용 ([lightningcss#479](https://github.com/parcel-bundler/lightningcss/issues/479))
- 플러그인의 파일 디펜던시 등록 ([lightningcss#877](https://github.com/parcel-bundler/lightningcss/issues/877))

다음 메이저 릴리스에서 기본 CSS 전처리기를 Lightning CSS로 변경하는 방안을 검토 중입니다. [`css.transformer: 'lightningcss'`](/config/shared-options#css-transformer) 설정을 사용해 보시고 [논의](https://github.com/vitejs/vite/discussions/13835)에 피드백을 공유해 주세요.

### `import.meta.glob`의 대소문자 구분 없는 일치 {#case-insensitive-matching-for-import-meta-glob}

`import.meta.glob`은 이제 `caseSensitive` 옵션을 지원해 대소문자를 구분하지 않고 파일을 일치시킬 수 있습니다.

```ts
// ./dir/Module1.js와 일치
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

### 커스텀 HTML 요소와 속성의 에셋 탐색 {#asset-discovery-for-custom-html-elements-and-attributes}

이전에는 Vite가 미리 정의된 요소와 속성에서만 에셋을 탐색했습니다. 이제 [`html.additionalAssetSources`](/config/shared-options#html-additionalassetsources) 옵션으로 요소와 속성을 더 추가할 수 있습니다.

```html
<html-import src="./some/other/file.html"></html-import>
<img
  src="/layout-default.png"
  data-src-dark="/layout-dark.png"
  data-src-light="/layout-light.png"
/>
```

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  html: {
    additionalAssetSources: {
      'html-import': {
        srcAttributes: 'src',
      },
      img: {
        srcAttributes: ['data-src-dark', 'data-src-light'],
      },
    },
  },
})
```

## 기타 변경 사항 {#other-changes}

그 밖의 기능과 버그 수정은 [변경 사항](https://github.com/vitejs/vite/blob/v8.1.0/packages/vite/CHANGELOG.md)에서 확인하세요.

## 감사의 말 {#acknowledgments}

Vite 8.1은 기여자 커뮤니티, 생태계 유지보수자, [Vite 팀](/team) 덕분에 만들어졌습니다. Vite는 [Bolt](https://bolt.new/) 및 [Nuxt Labs](https://nuxtlabs.com/)와의 파트너십으로 [VoidZero](https://voidzero.dev)가 제공합니다. 또한 [Vite의 GitHub Sponsors](https://github.com/sponsors/vitejs)와 [Vite의 Open Collective](https://opencollective.com/vite)의 후원자들에게도 감사드립니다.
