# Rolldown 통합 {#rolldown-integration}

Vite는 빌드 성능과 기능을 개선하기 위해, Rust 기반 JavaScript 번들러인 [Rolldown](https://rolldown.rs)을 통합할 계획입니다.

<YouTubeVideo videoId="RRjfm8cMveQ" />

## Rolldown이란 무엇인가요? {#what-is-rolldown}

Rolldown은 Rust로 작성된 현대적이고 성능이 뛰어난 JavaScript 번들러입니다. Rollup을 대체하기 위해 설계되었으며, 기존 생태계와 호환성을 유지하면서 유의미한 성능 향상을 제공하고자 합니다.

Rolldown은 세 가지 핵심 원칙이 있습니다:

- **속도**: 최대 성능을 위해 Rust 기반 설계
- **호환성**: 기존 Rollup 플러그인과 호환
- **최적화**: esbuild와 Rollup을 뛰어넘는 기능 제공

## Vite가 Rolldown으로 마이그레이션하는 이유 {#why-vite-is-migrating-to-rolldown}

1. **통합**: Vite는 현재 디펜던시 사전 번들링에는 esbuild를, 프로덕션 빌드에는 Rollup을 사용합니다. 이를 Rolldown 하나로 통합해 복잡성을 줄이고자 합니다.

2. **성능**: Rust 기반으로 구현된 Rolldown은 JavaScript 기반 번들러보다 성능상 많은 이점이 있습니다. 프로젝트 크기와 복잡성에 따라 특정 벤치마크가 달라질 수는 있지만, 초기 테스트에서는 Rollup에 비해 유의미한 속도 향상을 보여주었습니다.

3. **추가 기능**: 고급 청크 분할 제어, 내장 HMR, 모듈 페더레이션 등 Rollup이나 esbuild에서 제공하지 않는 기능들을 Rolldown에서 도입합니다.

Rolldown을 개발하게 된 동기에 대해 더 알고자 한다면, [Rolldown이 만들어진 이유](https://rolldown.rs/guide/#why-rolldown)를 참고해 주세요.

## `rolldown-vite` 이점 {#benefits-of-trying-rolldown-vite}

- 특히 대규모 프로젝트에서 훨씬 더 빠른 빌드 성능
- Vite 번들링의 미래를 만들어가는 데 도움이 되는 귀중한 피드백 제공
- 향후 공식 Rolldown 통합을 위해 프로젝트 준비

## Rolldown 시작하기 {#how-to-try-rolldown}

현재 Rolldown 기반 Vite는 `rolldown-vite`라는 별도 패키지로 제공하고 있습니다. 만약 `vite`를 직접 디펜던시로 명시해 사용하고 있다면, 패키지 내 `package.json`에서 `vite` 패키지를 `rolldown-vite`에 대한 별칭으로 등록할 수 있습니다. 기존 코드를 수정하지 않고 간단히 대체가 가능합니다:

```json
{
  "dependencies": {
    "vite": "^7.0.0" // [!code --]
    "vite": "npm:rolldown-vite@latest" // [!code ++]
  }
}
```

Vitepress나 다른 메타 프레임워크와 같이 Vite를 피어 디펜던시로 사용하고 있다면, `package.json` 파일에서 `vite` 디펜던시를 오버라이드해야 합니다. 사용중인 패키지 매니저에 따라 방법이 조금 다릅니다:

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

:::

오버라이드를 추가한 후 디펜던시를 재설치한 뒤, 평소처럼 개발 서버를 시작하거나 프로젝트 빌드를 수행해 주세요. 추가적인 설정 변경은 필요하지 않습니다.

## 알려진 제약 사항 {#known-limitations}

Rolldown은 Rollup 대체 목적으로 설계되었지만, 아직 구현 중인 기능과 의도적인 동작 차이가 있습니다. 자세한 목록은 정기적으로 업데이트되는 [이 GitHub PR](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667)을 참고해 주세요.

### 옵션 검증 경고 {#option-validation-warnings}

Rolldown은 알 수 없거나 유효하지 않은 옵션이 전달될 때 경고를 출력합니다. Rollup에서 사용할 수 있는 일부 옵션이 Rolldown에서 지원되지 않기 때문에, 사용자나 메타 프레임워크에서 설정한 옵션에 따라 경고가 발생할 수 있습니다. 다음은 이러한 경고 메시지의 예시입니다:

> Warning validate output options.
>
> - For the "generatedCode". Invalid key: Expected never but received "generatedCode".

이러한 옵션을 직접 전달하지 않은 경우, 사용 중인 프레임워크에서 수정해야 합니다.

### API 차이점 {#api-differences}

#### `manualChunks`에서 `advancedChunks`로 {#manualchunks-to-advancedchunks}

Rolldown은 Rollup에서도 제공되는 `manualChunks` 옵션을 지원하지만, 이는 지원 중단으로 표시되어 있습니다. 대신 Rolldown은 webpack의 `splitChunk`와 더 유사한 [`advancedChunks` 옵션](https://rolldown.rs/guide/in-depth/advanced-chunks#advanced-chunks)을 통해 더 세밀한 설정을 제공합니다:

```js
// Old configuration (Rollup)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}

// New configuration (Rolldown)
export default {
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }]
        }
      }
    }
  }
}
```

## 성능 {#performance}

`rolldown-vite`는 추가적인 설정 없이도 원활한 전환이 가능하도록 기존 생태계에 대한 호환성을 보장하고 있습니다. 추가적인 성능 향상이 필요하다면, 더 빠른 Rust 기반 내부 플러그인과 관련 커스텀 설정을 사용해 보세요.

## 네이티브 플러그인 활성화 {#enabling-native-plugins}

Rolldown과 Oxc 덕분에 별칭(alias)이나 resolve 플러그인과 같은 다양한 Vite 내부 플러그인들이 Rust로 전환되었습니다. 다만 현재 시점에서는 플러그인 동작이 JavaScript 버전과 다를 수 있기 때문에, 기본적으로 비활성화되어 있습니다.

이를 테스트하려면 Vite 설정에서 `experimental.enableNativePlugin` 옵션을 `true`로 설정해 주세요.

### Oxc의 React refresh 변환 활용하기 {#utilizing-oxc-s-react-refresh-transform}

`@vitejs/plugin-react` v5.0.0+는 Oxc의 React refresh 변환을 사용합니다. (React 컴파일러를 포함해) Babel 플러그인을 사용하지 않는다면, 이제 전체 변환이 Oxc에 의해 수행되며 `@vitejs/plugin-react` 업데이트 외에 다른 변경 없이도 빌드 성능이 향상됩니다.

SWC 플러그인과 커스텀 SWC 옵션 없이 `@vitejs/plugin-react-swc`를 사용하고 있다면, Oxc를 활용하기 위해 `@vitejs/plugin-react` 플러그인으로 전환할 수 있습니다.

::: details `@vitejs/plugin-react-oxc` 플러그인은 지원 중단됨

이전에는 Oxc의 React refresh 변환을 활용하기 위해 `@vitejs/plugin-react-oxc`를 사용할 것을 권장했습니다. 그러나 `rolldown-vite`로 더 쉽게 전환할 수 있도록 구현을 `@vitejs/plugin-react`에 병합했습니다. `@vitejs/plugin-react-oxc`는 이제 지원이 중단되며 더 이상 업데이트되지 않습니다.

:::

### `withFilter` 래퍼 {#withfilter-wrapper}

플러그인 개발자는 [훅 필터 기능](#hook-filter-feature)을 통해 Rust와 JavaScript 런타임 간 통신 오버헤드를 줄일 수 있습니다.
플러그인 중 일부가 아직 이 기능을 사용하지 않더라도, `withFilter` 래퍼를 사용하면 이 이점을 활용할 수 있습니다. 직접 플러그인에 필터를 적용하는 형태입니다.

```js
// 프로젝트 내 vite.config.ts
import { withFilter, defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    // `.svg?react`로 끝나는 파일에 대해서만 `svgr` 플러그인 로드
    withFilter(
      svgr({
        /*...*/
      }),
      { load: { id: /\.svg\?react$/ } },
    ),
  ],
})
```

## 보고된 이슈 {#reporting-issues}

실험적인 통합 단계이므로 이슈가 발생할 수 있습니다. 문제가 발생하면 **Vite 리포지토리가 아닌** [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) 리포지토리에 보고해 주세요.

[이슈 생성](https://github.com/vitejs/rolldown-vite/issues/new) 시, 적절한 이슈 템플릿을 따라 필요한 내용을 입력해 주세요:

- 이슈에 대한 가장 작은 재현 방법
- 실행 환경 세부 정보 (OS, Node 버전, 패키지 관리자)
- 관련 오류 메시지 또는 로그

실시간으로 논의하고 문제를 해결하기 위해 [Rolldown 디스코드](https://chat.rolldown.rs/)에 참여할 수도 있습니다.

## 버전 관리 정책 {#version-policy}

`rolldown-vite` 버전 관리 정책은 메이저 및 마이너 버전을 기존 Vite 패키지와 일치시키는 형태로 운영됩니다. 이러한 동기화를 통해 특정 Vite 마이너 릴리스에 포함된 기능은 이에 대응하는 `rolldown-vite` 마이너 릴리스에도 포함됩니다. 다만 패치 버전은 두 프로젝트 간 동기화되지 않는다는 점에 유의하세요. 특정 Vite 변경사항이 `rolldown-vite`에도 포함되었는지 확인하려면 [`rolldown-vite` 변경 사항](https://github.com/vitejs/rolldown-vite/blob/rolldown-vite/packages/vite/CHANGELOG.md)을 참고해 주세요.

`rolldown-vite`는 실험적인 프로젝트입니다. 이러한 성격으로 인해 패치 버전 내에서도 호환성이 깨지는 변경사항이 도입될 수 있습니다. 또한 `rolldown-vite`는 가장 최신 마이너 버전에 대해서만 패치 업데이트가 제공됩니다. 중요한 보안 및 버그 수정이라도 이전 메이저나 마이너 버전에는 패치가 적용되지 않습니다.

## 향후 계획 {#future-plans}

`rolldown-vite` 패키지는 Rolldown 통합에 대한 피드백 수집과 안정화를 위한 임시 솔루션입니다. 향후 이 기능은 Vite 리포지토리에 다시 병합될 예정입니다.

`rolldown-vite`를 사용하고, 피드백 및 이슈 리포트를 통해 개발에 기여해 주세요.

그리고 향후 Vite에 "전체 번들 모드(Full Bundle Mode)"가 도입될 예정입니다. 이 모드에서 _프로덕션과 개발 모드 모두_ 번들링된 파일을 제공할 계획입니다.

### 왜 전체 번들 모드를 도입하나요? {#why-introducing-a-full-bundle-mode}

Vite는 번들링 과정이 없는 개발 서버 방식으로 잘 알려져 있으며, Vite가 처음 출시되었을 때 속도와 인기가 있었던 주된 이유였습니다. 이 접근 방식은 원래 전통적인 번들링 없이 개발 서버 성능 한계를 얼마나 끌어올릴 수 있는지 알아보기 위한 실험이었습니다.

그러나 프로젝트 규모와 복잡성이 증가하며 두 가지 주요 과제가 발생했습니다:

1. **개발/프로덕션 불일치**: 개발 환경에서 번들링되지 않은 JavaScript와 번들링된 프로덕션 빌드 간 차이로 인해 런타임 동작이 달라집니다. 이에 따라 프로덕션에서만 발생하는 문제가 생길 수 있으며, 디버깅이 더 어려워질 수 있습니다.

2. **개발 환경 성능 저하**: 번들링 없는 접근 방식은 각 모듈을 개별적으로 가져오기에 많은 네트워크 요청이 발생합니다. 이는 _프로덕션 환경에서는 영향이 없지만_, 개발 서버를 시작할 때와 개발 중 페이지를 다시 불러올 때 상당한 오버헤드를 발생시킵니다. 특히 수백 또는 수천 개 요청을 처리해야 하는 대규모 애플리케이션에서 이러한 현상이 두드러지게 나타납니다. 또한 개발자가 네트워크 프록시를 사용하면 병목 현상이 더욱 심각해져, 새로 고침 시간이 느려지고 개발자 경험이 저하됩니다.

Rolldown 덕분에 독보적인 Vite 성능을 유지하면서도 개발과 프로덕션 환경을 통합할 기회가 생겼습니다. 전체 번들 모드는 프로덕션뿐만 아니라 개발 환경에서도 번들링된 파일을 제공하며, 이를 통해 두 환경에 대한 장점들을 결합할 수 있게 되었습니다:

- 대규모 애플리케이션에 대해서도 빠르게 시작 가능
- 개발과 프로덕션 간 일관된 동작
- 페이지 새로 고침 시 네트워크 오버헤드 감소
- ESM 기반 효율적인 HMR 유지

전체 번들 모드가 도입되면, 처음에는 옵션(Opt-in)으로 제공될 예정입니다. Rolldown 통합과 마찬가지로, 피드백을 수집하고 안정성을 확보한 후 기본값으로 만들고자 합니다.

## Plugin / Framework Authors Guide

::: tip
이 섹션은 주로 플러그인 및 프레임워크 개발자에게 관련이 있습니다. 일반 사용자라면 건너뛰어도 됩니다.
:::

### 주요 변경 사항 개요 {#overview-of-major-changes}

- 빌드에 Rolldown 사용 (이전에는 Rollup 사용)
- 최적화 도구로 Rolldown 사용 (이전에는 esbuild 사용)
- CommonJS 지원은 Rolldown에서 처리 (이전에는 @rollup/plugin-commonjs 사용)
- 하위 호환 구문 변환(Syntax lowering)에 Oxc 사용 (이전에는 esbuild 사용)
- CSS 축소화에 기본적으로 Lightning CSS 사용 (이전에는 esbuild 사용)
- JS 축소화에 기본적으로 Oxc 미니파이어 사용 (이전에는 esbuild 사용)
- 설정 번들링에 Rolldown 사용 (이전에는 esbuild 사용)

### `rolldown-vite` 감지하기 {#detecting-rolldown-vite}

::: warning
일반적으로 플러그인은 `rolldown-vite`나 `vite` 둘 중 무엇으로 실행되는지 감지할 필요가 없으며, 조건부 분기 없이 두 환경 모두에 대해 일관된 동작을 해야 합니다.
:::

`rolldown-vite`에서 다른 동작이 필요한 경우, `rolldown-vite`가 사용되는지 확인하는 방법은 두 가지가 있습니다:

`this.meta.rolldownVersion` 존재 여부 확인:

```js
const plugin = {
  resolveId() {
    if (this.meta.rolldownVersion) {
      // rolldown-vite용 로직
    } else {
      // rollup-vite용 로직
    }
  },
}
```

::: tip

Vite 7.0.0부터 `this.meta`는 모든 훅에서 사용할 수 있습니다. 이전 버전에서는 `config` 훅과 같은 Vite 전용 훅에서 `this.meta`를 사용할 수 없었습니다.

:::

<br>

`rolldownVersion` 익스포트 존재 여부 확인:

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // rolldown-vite용 로직
} else {
  // rollup-vite용 로직
}
```

`vite`를 (피어 디펜던시가 아닌)디펜던시로 지정한 경우, `rolldownVersion` 익스포트 방식이 코드 어디에서든 사용할 수 있기에 더욱 유용합니다.

### Rolldown에서 옵션 검증 무시하기 {#ignoring-option-validation-in-rolldown}

[위에서 언급했듯이](#option-validation-warnings), Rolldown은 알 수 없거나 유효하지 않은 옵션이 전달될 때 경고를 출력합니다.

이는 [앞서 설명했듯](#detecting-rolldown-vite) `rolldown-vite` 실행 여부 확인을 통해 조건부로 옵션을 전달하는 방식으로 해결할 수 있습니다.

### `transformWithEsbuild`는 `esbuild`를 별도로 설치해야 함 {#transformwithesbuild-requires-esbuild-to-be-installed-separately}

Vite 자체에서 더 이상 `esbuild`를 사용하지 않기 때문에, `esbuild`는 이제 선택적 피어 디펜던시가 되었습니다. 플러그인에서 `transformWithEsbuild`를 사용하는 경우, 플러그인 디펜던시에 `esbuild`를 추가하거나 사용자가 직접 설치해야 합니다.

권장되는 마이그레이션 방법은 `esbuild` 대신 Oxc를 사용하는 새로 익스포트된 `transformWithOxc` 함수를 사용하는 것입니다.

### `esbuild` 옵션을 위한 호환성 레이어 {#compatibility-layer-for-esbuild-options}

Rolldown-Vite는 `esbuild` 옵션을 Oxc나 `rolldown` 옵션으로 변환하는 호환성 레이어를 제공합니다. [ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md)에서 테스트한 바와 같이, 이는 간단한 `esbuild` 플러그인을 포함해 많은 경우에서 작동합니다.
다만 **향후에는 `esbuild` 옵션 지원을 제거할 예정**이므로, 해당하는 Oxc 또는 `rolldown` 옵션을 사용해 보시기 바랍니다.
호환성 레이어가 설정한 옵션은 `configResolved` 훅에서 확인할 수 있습니다.

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
},
```

### 훅 필터 기능 {#hook-filter-features}

Rolldown은 Rust와 JavaScript 런타임 간 통신 오버헤드를 줄이기 위해 [훅 필터 기능](https://rolldown.rs/guide/plugin-development#plugin-hook-filters)을 도입했습니다. 이를 사용해 플러그인 성능을 향상시킬 수 있습니다.
훅 필터 기능은 Rollup 4.38.0+ 및 Vite 6.3.0+ 에서도 지원합니다. Rollup 4.38.0 미만이나 Vite 6.3.0 미만 버전과 호환되는 플러그인을 만들고자 한다면, 외부 필터 설정과 별개로 훅 함수 내부에서도 동일한 필터링 로직을 구현해야 합니다. (자세한 내용은 [Rolldown 훅 필터 기능 문서](https://rolldown.rs/guide/plugin-development#plugin-hook-filters)를 참고해 주세요 - 옮긴이)

::: tip

[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils)는 `exactRegex`나 `prefixRegex`와 같은 훅 필터를 위한 유틸리티들을 익스포트합니다.

:::

### `load` 또는 `transform` 훅에서 콘텐츠를 JavaScript로 변환하기 {#converting-content-to-javascript-in-load-or-transform-hooks}

`load` 또는 `transform` 훅에서 타입이 다른 콘텐츠를 JavaScript로 변환하는 경우, 반환값에 `moduleType: 'js'`를 추가해야 할 수 있습니다.

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

이는 [Rolldown이 JavaScript가 아닌 모듈을 지원하며](https://rolldown.rs/guide/in-depth/module-types), 명시적으로 지정하지 않는 한 확장자에서 모듈 타입을 추론하기 때문입니다.