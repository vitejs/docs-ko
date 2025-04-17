# Rolldown 통합 {#rolldown-integration}

Vite는 빌드 성능과 기능을 개선하기 위해, Rust 기반 JavaScript 번들러인 [Rolldown](https://rolldown.rs)을 통합할 계획입니다.

## Rolldown이란 무엇인가요? {#what-is-rolldown}

Rolldown은 Rust로 작성된 현대적이고 성능이 뛰어난 JavaScript 번들러입니다. Rollup을 대체하기 위해 설계되었으며, 기존 생태계와 호환성을 유지하면서 유의미한 성능 향상을 제공하고자 합니다.

Rolldown은 세 가지 핵심 원칙이 있습니다:

- **속도**: 최대 성능을 위해 Rust 기반 설계
- **호환성**: 기존 Rollup 플러그인과 호환
- **개발자 경험**: Rollup 사용자에게 친숙한 API

## Vite가 Rolldown으로 마이그레이션하는 이유 {#why-vite-is-migrating-to-rolldown}

1. **통합**: Vite는 현재 디펜던시 사전 번들링에는 esbuild를, 프로덕션 빌드에는 Rollup을 사용합니다. 이를 Rolldown 하나로 통합해 복잡성을 줄이고자 합니다.

2. **성능**: Rust 기반으로 구현된 Rolldown은 JavaScript 기반 번들러보다 성능상 많은 이점이 있습니다. 프로젝트 크기와 복잡성에 따라 특정 벤치마크가 달라질 수는 있지만, 초기 테스트에서는 Rollup에 비해 유의미한 속도 향상을 보여주었습니다.

Rolldown을 개발하게 된 동기에 대해 더 알고자 한다면, [Rolldown이 만들어진 이유](https://rolldown.rs/guide/#why-rolldown)를 참고해 주세요.

## `rolldown-vite` 이점 {#benefits-of-trying-rolldown-vite}

- 특히 대규모 프로젝트에서 훨씬 더 빠른 빌드 퍼포먼스 경험
- Vite 번들링의 미래를 만들어가는 데 도움이 되는 귀중한 피드백 제공
- 향후 공식 Rolldown 통합을 위해 프로젝트 준비

## Rolldown 시작하기 {#how-to-try-rolldown}

현재 Rolldown 기반 Vite는 `rolldown-vite`라는 별도 패키지로 제공하고 있습니다. `package.json`에 다음과 같이 패키지 오버라이드를 추가해 사용할 수 있습니다:

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

## 보고된 이슈 {#reporting-issues}

실험적인 통합 단계이므로 이슈가 발생할 수 있습니다. 문제가 발생하면 **Vite 리포지토리가 아닌** [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) 리포지토리에 보고해 주세요.

[이슈 보고](https://github.com/vitejs/rolldown-vite/issues/new) 시, 이슈 템플릿을 따라 아래와 같은 내용을 남겨주세요:

- 이슈에 대한 가장 작은 재현 방법
- 실행 환경 세부 정보 (OS, Node 버전, 패키지 관리자)
- 관련 오류 메시지 또는 로그

그리고 실시간으로 논의하고 문제를 해결하기 위해 [Rolldown 디스코드](https://chat.rolldown.rs/)에 참여해 주세요.

## 향후 계획 {#future-plans}

`rolldown-vite` 패키지는 Rolldown 통합에 대한 피드백 수집과 안정화를 위한 임시 솔루션입니다. 향후 이 기능은 Vite 리포지토리에 다시 병합될 예정입니다.

`rolldown-vite`를 사용해 보시고, 피드백 및 이슈 리포트를 통해 개발에 기여해 주시기 바랍니다.

## 플러그인 / 프레임워크 개발자 가이드 {#plugin-framework-authors-guide}

### 주요 변경 사항 목록 {#the-list-of-big-changes}

- 빌드에 Rolldown 사용 (이전에는 Rollup 사용)
- 최적화 도구로 Rolldown 사용 (이전에는 esbuild 사용)
- CommonJS 지원은 Rolldown에서 처리 (이전에는 @rollup/plugin-commonjs 사용)
- 하위 호환 구문 변환(Syntax lowering)에 Oxc 사용 (이전에는 esbuild 사용)
- CSS 축소화에 기본적으로 Lightning CSS 사용 (이전에는 esbuild 사용)
- JS 축소화에 기본적으로 Oxc 미니파이어 사용 (이전에는 esbuild 사용)
- 설정 번들링에 Rolldown 사용 (이전에는 esbuild 사용)

### rolldown-vite 감지하기 {#detecting-rolldown-vite}

다음 두 가지 방법으로 감지할 수 있습니다

- `this.meta.rolldownVersion` 존재 여부 확인

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

- `rolldownVersion` 익스포트 존재 여부 확인

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // rolldown-vite용 로직
} else {
  // rollup-vite용 로직
}
```

`vite`를 피어 디펜던시가 아닌 디펜던시로 지정한 경우, `rolldownVersion` 익스포트 방식이 코드 어디에서든 사용할 수 있기에 더욱 유용합니다.

### Rolldown에서 옵션 검증 무시하기 {#ignoring-option-validation-in-rolldown}

Rolldown은 알 수 없거나 유효하지 않은 옵션이 전달되는 경우 오류를 발생시킵니다. Rollup에서 사용할 수 있는 일부 옵션이 Rolldown에서 지원되지 않기 때문에, 아래와 같은 오류가 발생할 수 있습니다:

> Error: Failed validate input options.
>
> - For the "preserveEntrySignatures". Invalid key: Expected never but received "preserveEntrySignatures".

이 문제는 앞서 언급한 `rolldown-vite` 실행 여부 확인을 통해 조건부로 옵션을 전달하는 방식으로 해결할 수 있습니다.

또는 `ROLLDOWN_OPTIONS_VALIDATION=loose` 환경 변수로 이 오류를 잠시 무시할 수도 있습니다. 다만, 궁극적으로는 Rolldown에서 지원하지 않는 옵션 사용을 중단해야 합니다.

### `transformWithEsbuild`는 `esbuild`를 별도로 설치해야 함 {#transformwithesbuild-requires-esbuild-to-be-installed-separately}

`esbuild` 대신 Oxc를 사용하는 `transformWithOxc`라는 유사한 함수가 `rolldown-vite`에서 익스포트됩니다.

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

Rolldown은 Rust와 JavaScript 런타임 간 통신 오버헤드를 줄이기 위해 [훅 필터 기능](https://rolldown.rs/guide/plugin-development#plugin-hook-filters)을 도입했습니다. 이를 사용하면 플러그인 성능을 향상시킬 수 있습니다.
훅 필터 기능은 Rollup 4.38.0+ 및 Vite 6.3.0+ 에서도 지원합니다. Rollup 4.38.0 미만이나 Vite 6.3.0 미만 버전과 호환되는 플러그인을 만들고자 한다면, 외부 필터 설정과 별개로 훅 함수 내부에서도 동일한 필터링 로직을 구현해야 합니다. (자세한 내용은 [Rolldown 훅 필터 기능 문서](https://rolldown.rs/guide/plugin-development#plugin-hook-filters)를 참고해 주세요 - 옮긴이)

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

이는 [Rolldown이 JavaScript가 아닌 모듈을 지원](https://rolldown.rs/guide/in-depth/module-types)하고, 명시적으로 지정하지 않는 한 확장자로 모듈 타입을 추론하기 때문입니다. 참고로 `rolldown-vite`는 개발 환경에서 ModuleTypes를 지원하지 않습니다.