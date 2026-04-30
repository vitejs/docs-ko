# 릴리스 {#releases}

Vite 릴리스는 [시멘틱 버저닝](https://semver.org/)을 따릅니다. 최신 안정 버전은 [Vite npm 패키지 페이지](https://www.npmjs.com/package/vite)에서 확인할 수 있습니다.

이전 릴리스의 전체 변경 사항은 [GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)에서 확인할 수 있습니다.

## 릴리스 주기 {#release-cycle}

Vite는 정해진 릴리스 주기가 없습니다.

- **패치** 릴리스는 필요할 때(보통 매주)마다 배포됩니다.
- **마이너** 릴리스는 항상 새로운 기능을 포함하며, 필요할 때마다 배포됩니다. 마이너 릴리스에는 항상 베타 프리 릴리스 단계가 있습니다(보통 2개월마다).
- **메이저** 릴리스는 일반적으로 [Node.js EOL 일정](https://endoflife.date/nodejs)에 맞춰 진행되며, 미리 공지됩니다. 이러한 릴리스는 생태계와 장기적인 논의를 거치며, 알파 및 베타 프리 릴리스 단계가 있습니다(보통 매년).

## 지원되는 버전 {#supported-versions}

요약하면, 현재 지원되는 Vite 버전은 다음과 같습니다:

<SupportedVersions />

<br>

지원되는 버전 범위는 자동으로 다음과 같이 결정됩니다:

- **최신 마이너 버전** 은 정기적으로 수정 사항이 반영됩니다.
- **직전 메이저 버전** (최신 마이너 버전만 해당) 및 **직전 마이너 버전** 은 중요한 수정 및 보안 패치를 지원받습니다.
- **이전 두 메이저 버전** (최신 마이너 버전만 해당) 및 **이전 두 마이너 버전** 은 보안 패치를 지원받습니다.
- 그 외 이전 모든 버전은 지원되지 않습니다.

정기적인 Vite 업데이트를 권장합니다. 각 메이저 버전으로 업데이트할 때는 [마이그레이션 가이드](https://vite.dev/guide/migration.html)를 확인해 주세요. Vite 팀은 새 버전에 대한 품질을 보장하기 위해 생태계 내 주요 프로젝트와 긴밀하게 협력하고 있습니다. 새로운 Vite 버전은 출시 전 [vite-ecosystem-ci 프로젝트](https://github.com/vitejs/vite-ecosystem-ci)를 통해 테스트합니다. Vite를 사용하는 대부분의 프로젝트는 새 버전이 출시되는 즉시 빠르게 지원하거나 마이그레이션할 수 있을 것입니다.

## 시멘틱 버저닝 예외 사항 {#semantic-versioning-edge-cases}

### TypeScript 정의 {#typescript-definitions}

Vite 마이너 버전 간 TypeScript 정의에 대한 호환되지 않는 변경 사항이 포함될 수 있습니다. 이유는 다음과 같습니다:

- TypeScript 자체에서 마이너 버전 간 호환되지 않는 변경 사항이 존재하는 경우가 있으며, 이 경우 최신 버전의 TypeScript 지원을 위해 타입을 수정해야 할 수 있습니다.
- 최신 버전의 TypeScript에서만 사용할 수 있는 기능을 채택해야 하는 경우가 있으며, 이 경우 TypeScript의 최소 요구 버전을 올려야 할 수 있습니다.
- TypeScript를 사용하는 경우, 현재 마이너 버전을 고정하도록 semver 범위를 정의하고 새로운 Vite 마이너 버전이 릴리스되면 이를 수동으로 업그레이드할 수 있습니다.

### esbuild {#esbuild}

[esbuild](https://esbuild.github.io/)는 1.0.0 이전 버전이기에, 때때로 새로운 기능과 성능 개선을 위해 포함해야 하는 중요한 변경 사항이 있을 수 있습니다. Vite 마이너 버전에서는 esbuild 버전이 변경될 수 있습니다.

### Node.js 비 LTS 버전 {#nodejs-non-lts-versions}

LTS가 아닌 Node.js 버전(홀수)은 Vite CI의 대상으로 테스트되지 않지만, [EOL](https://endoflife.date/nodejs) 이전까지는 여전히 작동합니다.

## 프리 릴리스 {#pre-releases}

마이너 릴리스는 일반적으로 정해지지 않은 횟수의 베타 릴리스를 거칩니다. 메이저 릴리스는 알파 단계와 베타 단계를 거칩니다.

프리 릴리스는 생태계의 초기 사용자와 유지 관리자가 통합 및 안정성 테스트를 수행하고 피드백을 제공할 수 있도록 합니다. 프리 릴리스는 프로덕션 환경에서 사용하지 마세요. 모든 프리 릴리스는 불안정한 것으로 간주되며, 그 사이에 중요한 변경 사항이 포함될 수 있습니다. 프리 릴리스를 사용할 때는 항상 정확한 버전으로 고정하세요.

## 사용 중단 {#deprecations}

마이너 릴리스에서는 더 나은 대안으로 대체된 기능을 주기적으로 사용 중단합니다. 사용 중단된 기능은 타입 또는 로그 경고와 함께 계속 작동합니다. 해당 기능은 사용 중단 상태가 된 뒤 다음 메이저 릴리스에서 제거됩니다. 각 메이저 버전의 [마이그레이션 가이드](https://vite.dev/guide/migration.html)에는 이러한 제거 사항과 업그레이드 경로가 문서화됩니다.

## 실험적 기능 {#experimental-features}

일부 기능은 Vite의 안정 버전에서 릴리스될 때 실험적 기능으로 표시됩니다. 실험적 기능은 최종 설계에 영향을 줄 수 있도록 실제 사용 경험을 수집하게 해줍니다. 목표는 사용자가 프로덕션 환경에서 테스트하여 피드백을 제공할 수 있도록 하는 것입니다. 실험적 기능 자체는 불안정한 것으로 간주되며, 통제된 방식으로만 사용해야 합니다. 이러한 기능은 마이너 버전 간에 변경될 수 있으므로, 사용자는 이에 의존할 때 Vite 버전을 고정해야 합니다. 각 실험적 기능에 대해 [GitHub discussion](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedback)을 만들 예정입니다.
