---
title: 'Vite 8 베타: Rolldown 기반 Vite'
author:
  name: The Vite Team
date: 2025-12-03
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 8 베타 발표
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-beta.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-beta
  - - meta
    - property: og:description
      content: Vite 8 베타 릴리스 발표
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8 베타: Rolldown 기반 Vite {#vite-8-beta-the-rolldown-powered-vite}

_2025년 12월 3일_

![Vite 8 베타 발표 커버 이미지](/og-image-announcing-vite8-beta.webp)

요약: [Rolldown](https://rolldown.rs/)으로 구동되는 Vite 8의 첫 번째 베타가 공개되었습니다. Vite 8은 훨씬 더 빠른 프로덕션 빌드를 제공하며, 앞으로의 개선 가능성도 넓힙니다. `vite`를 `8.0.0-beta.0` 버전으로 업그레이드하고 [마이그레이션 가이드](/guide/migration)를 읽어 새 릴리스를 사용해볼 수 있습니다.

---

Vite 8의 첫 번째 베타를 공개하게 되어 기쁩니다. 이번 릴리스는 기반 툴체인을 통합하고, 눈에 띄는 빌드 성능 개선과 함께 더 일관된 동작을 제공합니다. Vite는 이제 기존의 esbuild와 Rollup 조합을 대체하여 [Rolldown](https://rolldown.rs/)을 번들러로 사용합니다.

## 웹을 위한 새로운 번들러 {#a-new-bundler-for-the-web}

Vite는 이전에 개발 빌드와 프로덕션 빌드의 서로 다른 요구를 충족하기 위해 두 개의 번들러를 사용했습니다.

1. 개발 중 빠른 컴파일을 위한 esbuild
2. 프로덕션 빌드의 번들링, 청크 분할, 최적화를 위한 Rollup

이 접근 방식 덕분에 Vite는 파싱과 번들링을 다시 만드는 대신 개발자 경험과 오케스트레이션에 집중할 수 있었습니다. 하지만 별도의 번들링 파이프라인 두 개를 유지하면서 불일치가 생겼습니다. 변환 파이프라인이 분리되고, 플러그인 시스템이 달랐으며, 개발과 프로덕션의 번들링 동작을 맞추기 위한 글루 코드도 점점 늘어났습니다.

이를 해결하기 위해 [VoidZero 팀](https://voidzero.dev)은 Vite에서 사용하는 것을 목표로 한 차세대 번들러 **Rolldown**을 만들었습니다. Rolldown은 다음을 위해 설계되었습니다.

- **성능**: Rolldown은 Rust로 작성되어 네이티브 속도로 동작합니다. esbuild 수준의 성능을 제공하며 [**Rollup보다 10-30배 빠릅니다**](https://github.com/rolldown/benchmarks).
- **호환성**: Rolldown은 Rollup 및 Vite와 동일한 플러그인 API를 지원합니다. 대부분의 Vite 플러그인은 Vite 8에서 별도 설정 없이 동작합니다.
- **더 많은 기능**: Rolldown은 전체 번들링 모드, 더 유연한 청크 분할 제어, 모듈 수준 영속 캐시, Module Federation 등 Vite를 위한 더 고급 기능을 제공합니다.

## 툴체인 통합 {#unifying-the-toolchain}

Vite의 번들러 교체가 미치는 영향은 성능을 넘어섭니다. 번들러는 파서, 리졸버, 트랜스포머, 미니파이어를 활용합니다. Rolldown은 이러한 목적을 위해 VoidZero가 이끄는 또 다른 프로젝트인 Oxc를 사용합니다.

**즉, Vite는 같은 팀이 유지보수하는 엔드 투 엔드 툴체인의 진입점이 됩니다. 빌드 도구(Vite), 번들러(Rolldown), 컴파일러(Oxc)가 하나의 흐름으로 이어집니다.**

이 정렬은 스택 전반의 동작 일관성을 보장하고, JavaScript가 계속 진화함에 따라 새로운 언어 명세를 빠르게 채택하고 대응하도록 합니다. 또한 이전에는 Vite만으로 할 수 없었던 다양한 개선을 실현합니다. 예를 들어 Oxc의 의미 분석을 활용해 Rolldown에서 더 나은 트리 셰이킹을 수행할 수 있습니다.

## Vite가 Rolldown으로 마이그레이션한 방법 {#how-vite-migrated-to-rolldown}

Rolldown 기반 Vite로의 마이그레이션은 기반을 바꾸는 변화입니다. 그래서 Vite 팀은 안정성과 생태계 호환성을 희생하지 않도록 신중한 단계를 거쳐 구현했습니다.

먼저 별도의 `rolldown-vite` 패키지를 [기술 프리뷰로 릴리스](https://voidzero.dev/posts/announcing-rolldown-vite)했습니다. 이를 통해 Vite의 안정 버전에 영향을 주지 않고 얼리 어답터와 함께 작업할 수 있었습니다. 얼리 어답터들은 Rolldown의 성능 향상을 경험하는 동시에 값진 피드백을 제공했습니다. 주요 사례는 다음과 같습니다.

- Linear의 프로덕션 빌드 시간이 46초에서 6초로 줄었습니다.
- Ramp는 빌드 시간을 57% 줄였습니다.
- Mercedes-Benz.io는 빌드 시간을 최대 38%까지 줄였습니다.
- Beehiiv는 빌드 시간을 64% 줄였습니다.

다음으로 주요 Vite 플러그인을 `rolldown-vite`에 대해 검증하는 테스트 스위트를 구성했습니다. 이 CI 작업은 특히 SvelteKit, react-router, Storybook 같은 프레임워크와 메타 프레임워크에서 회귀와 호환성 문제를 일찍 잡는 데 도움이 되었습니다.

마지막으로 개발자가 Rollup 및 esbuild 옵션에서 해당하는 Rolldown 옵션으로 마이그레이션할 수 있도록 호환성 레이어를 만들었습니다.

그 결과 누구나 Vite 8로 부드럽게 마이그레이션할 수 있는 경로가 마련되었습니다.

## Vite 8 베타로 마이그레이션 {#migrating-to-vite-8-beta}

Vite 8은 핵심 빌드 동작을 다루기 때문에, Vite 팀은 구성 API와 플러그인 훅을 바꾸지 않는 데 집중했습니다. 업그레이드를 돕기 위해 [마이그레이션 가이드](/guide/migration)를 만들었습니다.

사용 가능한 업그레이드 경로는 두 가지입니다.

1. **직접 업그레이드:** `package.json`의 `vite`를 업데이트하고 평소처럼 dev 및 build 명령을 실행합니다.
2. **점진적 마이그레이션:** Vite 7에서 `rolldown-vite` 패키지로 마이그레이션한 다음 Vite 8로 이동합니다. 이렇게 하면 Vite의 다른 변경 없이 Rolldown에 한정된 비호환성이나 문제를 식별할 수 있습니다. (규모가 크거나 복잡한 프로젝트에 권장)

> [!IMPORTANT]
> 특정 Rollup 또는 esbuild 옵션에 의존하고 있다면 Vite 설정을 일부 조정해야 할 수 있습니다. 자세한 지침과 예시는 [마이그레이션 가이드](/guide/migration)를 참고하세요.
> 안정 버전이 아닌 모든 메이저 릴리스와 마찬가지로, 업그레이드 후에는 모든 것이 예상대로 동작하는지 충분히 테스트하는 것이 좋습니다. 발견한 [이슈](https://github.com/vitejs/rolldown-vite/issues)는 꼭 보고해주세요.

Astro, Nuxt, Vitest처럼 Vite를 디펜던시로 사용하는 프레임워크나 도구를 사용한다면, 패키지 매니저에 따라 조금씩 다른 방식으로 `package.json`에서 `vite` 디펜던시를 오버라이드해야 합니다.

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "8.0.0-beta.0"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

:::

이 오버라이드를 추가한 뒤 디펜던시를 다시 설치하고, 평소처럼 개발 서버를 시작하거나 프로젝트를 빌드하세요.

## Vite 8의 추가 기능 {#additional-features-in-vite-8}

Rolldown과 함께 제공되는 것 외에도 Vite 8에는 다음이 포함됩니다.

- **내장 tsconfig `paths` 지원:** 개발자는 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths)를 `true`로 설정해 활성화할 수 있습니다. 이 기능은 약간의 성능 비용이 있으며 기본적으로 활성화되어 있지 않습니다.
- **`emitDecoratorMetadata` 지원:** Vite 8은 이제 TypeScript의 [`emitDecoratorMetadata` 옵션](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)을 자동으로 내장 지원합니다. 자세한 내용은 [기능](/guide/features.md#emitdecoratormetadata) 페이지를 참고하세요.

## 앞으로의 계획 {#looking-ahead}

속도는 언제나 Vite를 정의하는 특징이었습니다. Rolldown, 나아가 Oxc와의 통합은 JavaScript 개발자가 Rust의 속도에서 이점을 얻는다는 뜻입니다. Vite 8로 업그레이드하면 Rust를 사용하는 것만으로도 성능 향상을 기대할 수 있습니다.

또한 곧 Vite의 전체 번들링 모드를 제공할 예정이라 기대가 큽니다. 이 모드는 대규모 프로젝트에서 Vite 개발 서버 속도를 크게 개선합니다. 예비 결과에 따르면 개발 서버 시작은 3배 빨라지고, 전체 리로드는 40% 빨라지며, 네트워크 요청은 10배 줄어듭니다.

Vite를 정의하는 또 다른 특징은 플러그인 생태계입니다. JavaScript 개발자가 익숙한 언어인 JavaScript로 Vite를 계속 확장하고 사용자화하면서도 Rust의 성능 향상에서 이점을 얻기를 바랍니다. Vite 팀은 VoidZero 팀과 협력해 이러한 Rust 기반 시스템에서 JavaScript 플러그인 사용을 가속화하고 있습니다.

현재 실험 중인 향후 최적화는 다음과 같습니다.

- [**Raw AST transfer**](https://github.com/oxc-project/oxc/issues/2409). JavaScript 플러그인이 Rust가 생성한 AST에 최소한의 오버헤드로 접근하게 합니다.
- [**Native MagicString transforms**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring). 로직은 JavaScript에 두고 계산은 Rust에서 수행하는 간단한 커스텀 변환입니다.

## **연락하기** {#connect-with-us}

Vite 8 베타를 사용해보셨다면 피드백을 듣고 싶습니다! 문제를 보고하거나 경험을 공유해주세요.

- **Discord**: 실시간 논의를 위해 [커뮤니티 서버](https://chat.vite.dev/)에 참여하세요.
- **GitHub**: [GitHub discussions](https://github.com/vitejs/vite/discussions)에서 피드백을 공유하세요.
- **Issues**: 버그와 회귀는 [rolldown-vite 저장소](https://github.com/vitejs/rolldown-vite/issues)에 보고하세요.
- **Wins**: 개선된 빌드 시간을 [rolldown-vite-perf-wins 저장소](https://github.com/vitejs/rolldown-vite-perf-wins)에 공유하세요.

모든 보고와 재현 사례에 감사드립니다. 이는 안정적인 8.0.0 릴리스로 나아가는 데 큰 도움이 됩니다.
