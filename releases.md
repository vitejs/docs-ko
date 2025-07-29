# 릴리스 {#releases}

Vite 릴리스는 [시멘틱 버저닝](https://semver.org/)을 따릅니다. 최신 안정 버전은 [Vite npm 패키지 페이지](https://www.npmjs.com/package/vite)에서 확인할 수 있습니다.

이전 릴리스의 전체 변경 사항은 [GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)에서 확인할 수 있습니다.

## 릴리스 주기 {#release-cycle}

Vite는 정해진 릴리스 주기가 없습니다.

- **패치** 릴리스는 필요할 때(보통 매주)마다 배포됩니다.
- **마이너** 릴리스는 새로운 기능을 포함하며, 필요할 때(보통 2개월 단위)마다 배포됩니다. 베타 프리 릴리스 단계를 거칩니다.
- **메이저** 릴리스는 일반적으로 [Node.js EOL 일정](https://endoflife.date/nodejs)에 맞춰 진행되며, 미리 공지됩니다. 이러한 릴리스는 생태계와 장기적인 논의와 함께, 알파 및 베타 프리 릴리스 단계(보통 매년)를 모두 거칩니다.

The Vite version ranges that are supported by the Vite team are automatically determined by:

- **최신 마이너 버전** 은 정기적으로 수정 사항이 반영됩니다.
- **직전 메이저 버전** (최신 마이너 버전만 해당) 및 **직전 마이너 버전** 은 중요한 수정 및 보안 패치를 지원받습니다.
- **이전 두 메이저 버전** (최신 마이너 버전만 해당) 및 **이전 두 마이너 버전** 은 보안 패치를 지원받습니다.
- 그 외 이전 모든 버전은 지원되지 않습니다.

예를 들어, Vite 최신 버전이 5.3.10인 경우:

- `vite@5.3`은 5.3.10에 존재하는 정기 수정 사항이 포함되어 있습니다.
- 중요한 수정 및 보안 패치는 `vite@4` 및 `vite@5.2`로 백포트됩니다.
- 보안 패치도 `vite@3` 및 `vite@5.1`로 백포트됩니다.
- `vite@2` 및 `vite@5.0`은 더 이상 지원하지 않습니다. 필요하다면 더 높은 버전을 사용해야 합니다.

따라서 정기적인 Vite 업데이트를 권장합니다. 메이저 버전 업데이트 시에는 [마이그레이션 가이드](https://ko.vite.dev/guide/migration.html)를 참고해 주세요. Vite 팀은 새 버전에 대한 품질을 보장하기 위해 생태계 내 주요 프로젝트와 긴밀하게 협력하고 있습니다. 새로운 Vite 버전은 출시 전 [vite-ecosystem-ci 프로젝트](https://github.com/vitejs/vite-ecosystem-ci)를 통해 테스트하기에, Vite를 사용하는 생태계 내 프로젝트 대부분은 출시 직후 이를 신속하게 지원하거나 마이그레이션을 제공할 수 있습니다.

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

## 프리 릴리스​ {#pre-releases}

마이너 릴리스는 일반적으로 정해지지 않은 횟수의 베타 릴리스를 거칩니다. 메이저 릴리스는 알파 단계와 베타 단계를 거칩니다.

프리 릴리스는 초기 사용자와 생태계 유지 관리자가 통합 및 안정성 테스트를 수행하고 피드백을 제공할 수 있도록 합니다. 따라서 프리 릴리스는 프로덕션 환경에서 사용하지 않아야 합니다. 모든 프리 릴리스는 불안정하며, 릴리스 사이에 중요한 변경 사항이 적용될 수도 있습니다. 또한 프리 릴리스는 항상 정확한 버전을 지정해 사용해주세요.

## 사용 중단 {#deprecations}

더 나은 대안으로 대체된 기능은 마이너 릴리스에서 주기적으로 사용이 중단됩니다. 사용이 중단된 기능은 타입이나 경고 로그와 함께 계속 작동은 하지만, 다음 메이저 릴리스에서 제거됩니다. 사용이 중단된 기능에 대한 목록과 마이그레이션 가이드는 각 메이저 버전의 [마이그레이션 가이드](https://ko.vite.dev/guide/migration.html)에서 확인할 수 있습니다.

## 실험적 기능 {#experimental-features}

일부 기능은 Vite의 안정 버전이 출시될 때 실험적 기능으로 표시됩니다. 실험적 기능의 목표는 사용자가 프로덕션 환경에서 테스트하여 피드백을 제공받을 수 있도록 하는 것이며, 이렇게 수집된 피드백은 최종 설계에 영향을 미칠 수 있습니다. 다만 실험적 기능 자체는 불안정한 것으로 간주되며, 통제된 방식으로만 사용해야 합니다. 또한 이러한 기능은 마이너 버전 간에 변경될 수 있으므로 사용자는 이를 사용할 때 Vite 버전을 고정해야 합니다. 이러한 실험적 기능에 대해서는 [GitHub Discussion](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedbac)을 만들 예정입니다.