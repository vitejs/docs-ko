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