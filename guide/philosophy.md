# 프로젝트 철학 {#project-philosophy}

## 간결하고 확장가능한 코어 {#lean-extendable-core}

Vite는 [Vite 코어](https://github.com/vitejs/vite)를 가볍고 장기적으로 유지보수하기 쉬운 상태로 유지하면서, 웹 앱을 빌드할 때 가장 흔히 쓰이는 패턴을 기본적으로 지원하는 것을 목표로 합니다. 다양한 사용 사례를 지원하는 가장 좋은 방법은 플러그인이 기반으로 삼을 수 있는 강력한 기본 요소와 API를 제공하는 것이라고 믿으며, Vite 확장성을 높이기 위해 코어도 적극적으로 확장하고 있습니다. [Vite의 플러그인 시스템](./api-plugin.md)은 Rollup 플러그인 API의 상위 집합을 기반으로 하며, [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) 같은 플러그인과 잘 유지보수되는 [많은 플러그인](https://registry.vite.dev/plugins)이 여러분의 요구를 충족합니다. Vite의 번들러인 [Rolldown](https://rolldown.rs/)은 Rollup 플러그인 인터페이스와의 호환성을 유지하므로, 플러그인은 Vite와 일반 Rollup 프로젝트 모두에서 사용할 수 있는 경우가 많습니다.

## 모던 웹으로 나아가기 {#pushing-the-modern-web}

Vite는 모던 코드를 작성할 수 있도록 유도하고 있습니다. 예를 들어 다음과 같습니다:

- 소스 코드는 ESM으로만 작성할 수 있으며, ESM이 아닌 디펜던시는 정상적으로 동작할 수 있도록 [ESM으로 사전 번들링](./dep-pre-bundling)해야 합니다.
- 웹 워커는 최신 표준을 따르기 위해 [`new Worker` 구문](./features#web-workers)으로 작성하는 것이 권장됩니다.
- Node.js 모듈은 브라우저에서 사용할 수 없습니다.

이러한 패턴은 새로운 기능을 추가할 때 미래 지향적인 API를 만들 수 있도록 도와주지만, 다른 빌드 툴과는 호환되지 않을 수 있습니다.

## 성능에 대한 실용적인 접근 {#a-pragmatic-approach-to-performance}

Vite는 [시작](./why.md)부터 성능에 집중해 왔습니다. 개발 서버 아키텍처는 프로젝트가 커져도 빠르게 유지되는 HMR을 제공합니다. Vite는 많은 작업이 필요한 부분을 구현하기 위해 [Oxc 툴체인](https://oxc.rs/)과 [Rolldown](https://rolldown.rs/) 같은 네이티브 도구를 기반으로 하면서도, 속도와 유연성의 균형을 위해 나머지 코드는 JS로 유지합니다. 필요한 경우 프레임워크 플러그인은 [Babel](https://babeljs.io/)을 활용해 사용자 코드를 컴파일합니다. Rolldown의 Rollup 플러그인 호환성 덕분에 Vite는 폭넓은 플러그인 생태계를 활용할 수 있습니다.

## Vite를 기반으로 프레임워크 구축하기 {#building-frameworks-on-top-of-vite}

Vite는 사용자가 직접 사용할 수도 있지만, 프레임워크를 만들기 위한 도구로 사용할 때 특히 빛납니다. Vite 코어는 프레임워크에 구애받지 않지만, 각 UI 프레임워크를 위한 완성도 높은 플러그인이 있습니다. [JS API](./api-javascript.md)를 통해 앱 프레임워크 작성자는 Vite 기능을 사용해 사용자에게 맞춤형 경험을 제공할 수 있습니다. Vite는 보통 더 높은 수준의 도구에 포함되지만 현대적인 웹 프레임워크를 만드는 데 기본이 되는 [SSR 기본 요소](./ssr.md)도 지원합니다. 또한 Vite 플러그인은 프레임워크 간 공유 방법을 제공해 전체 그림을 완성합니다. Vite는 [Ruby](https://vite-ruby.netlify.app/)와 [Laravel](https://laravel.com/docs/vite) 같은 [백엔드 프레임워크](./backend-integration.md)와 함께 사용할 때도 잘 맞습니다.

## 활발한 생태계 {#an-active-ecosystem}

Vite의 진화는 프레임워크와 플러그인의 관리자, 사용자, 그리고 Vite 팀 간의 협력으로 이루어집니다. 만약 진행 중인 프로젝트가 Vite를 채택한다면, Vite의 코어 개발에 적극적으로 참여해 볼 것을 권장합니다. 우리는 각 릴리스에서 이전 버전으로의 회귀를 최소화하기 위해 생태계의 주요 프로젝트와 긴밀하게 협력하고 있으며, [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)와 같은 도구도 활용하고 있습니다. 특히 이 도구를 통해 PR에서 Vite를 사용해 주요 프로젝트의 CI를 실행할 수 있는데, 이는 해당 릴리스의 여파를 명확하게 파악할 수 있도록 도와줍니다. 우리는 사용자에게 영향을 미치기 전에 버그를 수정하고, 프로젝트가 릴리스와 함께 다음 버전으로 업데이트할 수 있도록 최선을 다하고 있습니다. 만약 여러분이 Vite를 사용하고 있다면, [Vite의 Discord](https://chat.vite.dev)에서 우리와 함께 프로젝트에 참여해 보세요.
