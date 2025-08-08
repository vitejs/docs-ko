# 주요 변경 사항 {#breaking-changes}

API 지원 중단, 제거, 그리고 변경 사항을 포함한 Vite 주요 변경 사항 목록입니다. 아래 변경 사항 대부분은 Vite [`future` 옵션](/config/shared-options.html#future)을 통해 선택적으로 적용할 수 있습니다.

## 계획된 변경 사항 {#planned}

이러한 변경 사항들은 Vite의 다음 메이저 버전에서 적용될 예정입니다. 가능한 경우 지원 중단 또는 사용 관련 경고를 통해 안내할 예정이며, 프레임워크와 플러그인 개발자, 그리고 사용자들에게 이러한 변경 사항을 적용하도록 요청하고 있습니다.

- [훅에서 `this.environment` 사용하기](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 플러그인 훅](/changes/hotupdate-hook)
- [`ModuleRunner` API를 사용하는 SSR](/changes/ssr-using-modulerunner)

## 검토 중인 변경 사항 {#considering}

아래 변경 사항들은 현재 검토 중이며, 대부분 사용 패턴을 개선하기 위한 실험적인 API입니다. 여기에 나열되지 않은 변경 사항도 있으므로, 전체 목록은 [Vite GitHub Discussions의 Experimental 레이블](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=label%3Aexperimental+category%3AFeedback)을 확인해 주세요.

그리고 아직은 전환하는 것을 권장하지 않습니다. 이러한 API들은 피드백을 수집하기 위해 Vite에 포함되었습니다. 제안을 확인하고, 여러분의 사용 사례에서는 어떻게 동작하는지 GitHub Discussions에서 알려주시기 바랍니다.

- [환경별 API로 마이그레이션](/changes/per-environment-apis)
- [빌드 중 공유되는 플러그인](/changes/shared-plugins-during-build)

## 과거 변경 사항 {#past}

아래 변경 사항들은 이미 완료되었거나 되돌려졌습니다. 현재 메이저 버전에서는 더 이상 관련이 없습니다.

- _아직 과거 변경 사항이 없습니다_