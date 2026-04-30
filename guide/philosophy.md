# 프로젝트 철학 {#project-philosophy}

## 간결하고 확장가능한 코어 {#lean-extendable-core}

Vite는 [Vite 코어](https://github.com/vitejs/vite)를 장기적으로 간결하고 유지 관리 가능한 상태로 유지하면서, 웹 앱을 빌드하는 데 가장 일반적인 패턴을 기본적으로 지원하는 것을 목표로 합니다. 다양한 사용 사례를 지원하는 가장 좋은 방법은 플러그인이 기반으로 삼을 수 있는 강력한 프리미티브와 API를 제공하는 것이라고 믿으며, Vite를 더 확장 가능하게 만들기 위해 코어를 적극적으로 확장하고 있습니다. [Vite의 플러그인 시스템](./api-plugin.md)은 Rollup의 플러그인 API의 상위 집합을 기반으로 하며, [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)와 같은 플러그인과 여러분의 요구 사항을 충족할 수 있는 수많은 [잘 관리되는 플러그인](https://registry.vite.dev/plugins)을 사용할 수 있게 합니다. Vite의 번들러인 [Rolldown](https://rolldown.rs/)은 Rollup의 플러그인 인터페이스와의 호환성을 유지하므로, 플러그인을 Vite와 일반 Rollup 프로젝트 모두에서 사용할 수 있는 경우가 많습니다.

## 모던 웹으로 나아가기 {#pushing-the-modern-web}

Vite는 모던 코드를 작성할 수 있도록 유도하고 있습니다. 예를 들어 다음과 같습니다:

- 소스 코드는 ESM으로만 작성할 수 있으며, ESM이 아닌 디펜던시는 정상적으로 동작할 수 있도록 [ESM으로 사전 번들링](./dep-pre-bundling)해야 합니다.
- 웹 워커는 최신 표준을 따르기 위해 [`new Worker` 구문](./features#web-workers)으로 작성하는 것이 권장됩니다.
- Node.js 모듈은 브라우저에서 사용할 수 없습니다.

이러한 패턴은 새로운 기능을 추가할 때 미래 지향적인 API를 만들 수 있도록 도와주지만, 다른 빌드 툴과는 호환되지 않을 수 있습니다.

## 성능에 대한 실용적인 접근 {#a-pragmatic-approach-to-performance}

Vite는 [개발 초기부터](./why.md) 성능에 초점을 맞추어 왔습니다. 개발 서버 아키텍처는 프로젝트가 확장되어도 빠른 HMR을 유지할 수 있도록 도와줍니다. Vite는 집약적인 작업을 구현하기 위해 [Oxc toolchain](https://oxc.rs/)과 [Rolldown](https://rolldown.rs/)을 포함한 네이티브 툴을 기반으로 하지만, 나머지 코드는 JS로 유지해 속도와 유연성의 균형을 맞춥니다. 필요한 경우, 프레임워크 플러그인은 사용자 코드를 컴파일하기 위해 [Babel](https://babeljs.io/)을 활용합니다. Rolldown의 Rollup 플러그인 호환성 덕분에, Vite는 폭넓은 플러그인 생태계를 활용할 수 있습니다.

## Vite를 기반으로 프레임워크 구축하기 {#building-frameworks-on-top-of-vite}

Vite는 직접 사용할 수도 있지만, 프레임워크를 만드는 도구로서도 빛을 발합니다. Vite의 코어가 프레임워크에 구애받는 것이 아님에도 불구하고, 각 UI 프레임워크에 대한 완성도 높은 플러그인이 존재합니다. [JS API](./api-javascript.md)를 통해 애플리케이션 프레임워크 개발자는 Vite 기능을 사용하여 사용자에게 맞춤화된 경험을 제공할 수 있습니다. Vite는 최신 웹 프레임워크 구축에 필수적이지만 일반적으로 더 높은 수준의 도구에 존재하는 [SSR 프리미티브](./ssr.md) 지원을 포함합니다. 또한 Vite 플러그인은 프레임워크 간에 공유할 수 있는 방법을 제공함으로써 이러한 모든 것을 완성합니다. Vite는 [Ruby](https://vite-ruby.netlify.app/)와 [Laravel](https://laravel.com/docs/vite)과 같은 [백엔드 프레임워크](./backend-integration.md)와 함께 사용할 때도 매우 좋은 선택입니다.

## 활발한 생태계 {#an-active-ecosystem}

Vite의 진화는 프레임워크와 플러그인의 관리자, 사용자, 그리고 Vite 팀 간의 협력으로 이루어집니다. 만약 진행 중인 프로젝트가 Vite를 채택한다면, Vite의 코어 개발에 적극적으로 참여해 볼 것을 권장합니다. 우리는 각 릴리스에서 이전 버전으로의 회귀를 최소화하기 위해 생태계의 주요 프로젝트와 긴밀하게 협력하고 있으며, [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)와 같은 도구도 활용하고 있습니다. 특히 이 도구를 통해 선택된 PR에서 Vite를 사용해 주요 프로젝트의 CI를 실행할 수 있는데, 이는 릴리스에 대해 생태계가 어떻게 반응할지 명확한 상태를 파악할 수 있도록 도와줍니다. 우리는 사용자에게 영향을 미치기 전에 회귀를 수정하고, 프로젝트가 릴리스되는 즉시 다음 버전으로 업데이트할 수 있도록 최선을 다하고 있습니다. 만약 여러분이 Vite를 사용하고 있다면, [Vite의 Discord](https://chat.vite.dev)에 참여해 프로젝트에 함께 기여해 보세요.
