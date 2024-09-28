# 프로젝트 철학 {#project-philosophy}

## 간결하고 확장가능한 코어 {#lean-extendable-core}

Vite는 모든 사용 사례를 다루지 않습니다. 대부분의 상황에서 보편적으로 사용할 수 있는 웹 앱 빌드 패턴을 지원하는 것이 Vite의 목표이지만, 프로젝트를 장기적으로 유지하고 관리할 수 있도록 [Vite 코어](https://github.com/vitejs/vite)는 간결한 상태를 유지하고자 합니다. 사용자가 필요로 하는 기능은 충분히 [Vite의 Rollup 기반 플러그인 시스템](./api-plugin.md)을 이용해 가능하기에, 이로 구현할 수 있는 기능은 일반적으로 Vite 코어에 추가되지 않습니다. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)와 같은 플러그인은 Vite 코어로 무엇을 구현할 수 있는지를 보여주는 좋은 예시이며, 이처럼 [잘 관리되는 플러그인](https://github.com/vitejs/awesome-vite#plugins)을 이용해 개발 요구 사항을 충족할 수 있을 것입니다. 또한 Vite는 Rollup 프로젝트와 긴밀하게 협력하여 플러그인을 일반적인 Rollup 그리고 Vite 프로젝트 모두에서 사용할 수 있게끔 구성했으며, 필요한 확장 기능을 플러그인 API에 가능한 한 많이 도입하고자 노력하고 있습니다.

## 모던 웹으로 나아가기 {#pushing-the-modern-web}

Vite는 모던 코드를 작성할 수 있도록 유도하고 있습니다. 예를 들어 다음과 같습니다:

- 소스 코드는 ESM으로만 작성할 수 있으며, ESM이 아닌 디펜던시는 정상적으로 동작할 수 있도록 [ESM으로 사전 번들링](./dep-pre-bundling)해야 합니다.
- 웹 워커는 최신 표준을 따르기 위해 [`new Worker` 구문](./features#web-workers)으로 작성하는 것이 권장됩니다.
- Node.js 모듈은 브라우저에서 사용할 수 없습니다.

이러한 패턴은 새로운 기능을 추가할 때 미래 지향적인 API를 만들 수 있도록 도와주지만, 다른 빌드 툴과는 호환되지 않을 수 있습니다.

## 성능에 대한 실용적인 접근 {#a-pragmatic-approach-to-performance}

Vite는 [개발 초기부터](./why.md) 성능에 초점을 맞추어 왔습니다. 개발 서버 아키텍처는 프로젝트가 확장되어도 빠른 HMR을 유지할 수 있도록 도와줍니다. 성능 집약적인 작업은 [esbuild](https://esbuild.github.io/)와 [SWC](https://github.com/vitejs/vite-plugin-react-swc) 같은 네이티브 툴을 사용해 구현하지만, 그 외의 코드는 JS로 유지해 속도와 유연성의 균형을 맞추었습니다. 다만 필요한 경우, 프레임워크 플러그인은 사용자 코드를 컴파일하기 위해 [Babel](https://babeljs.io/)을 사용할 수도 있습니다. 빌드 타임에는 현재 [Rollup](https://rollupjs.org/)을 사용하는데, 이는 네이티브 툴을 사용해 얻을 수 있는 퍼포먼스보다 더 효율적인 번들 크기와 광범위한 플러그인 생태계가 존재한다는 것을 더 중요하게 생각하기 때문입니다. 이처럼 Vite는 최대한 API를 안정적으로 유지하되, DX를 개선할 수 있는 새로운 라이브러리가 등장하면 이를 사용해 내부적으로 계속 발전할 것입니다.

## Vite를 기반으로 프레임워크 구축하기 {#building-frameworks-on-top-of-vite}

Vite는 직접 사용할 수도 있지만, 프레임워크를 만드는 도구로서도 빛을 발합니다. Vite의 코어가 프레임워크에 구애받는 것이 아님에도 불구하고, 각 UI 프레임워크에 대한 완성도 높은 플러그인이 존재합니다. 애플리케이션 프레임워크 개발자는 [JS API](./api-javascript.md)를 통해 Vite의 기능들을 활용하여 사용자에게 맞춤화된 경험을 제공할 수 있으며, 최신 웹 프레임워크 구축에 필수적이지만 일반적으로 높은 수준의 도구에서만 지원하는  [기본적인 SSR 기능들](./ssr.md) 역시 지원하고 있습니다. 또한 Vite 플러그인은 프레임워크 간에 공유할 수 있는 방법을 제공함으로써 이러한 모든 것을 완성합니다. Vite는 [Ruby](https://vite-ruby.netlify.app/)와 [Laravel](https://laravel.com/docs/10.x/vite)과 같은 [백엔드 프레임워크](./backend-integration.md)와 함께 사용할 때도 매우 좋은 선택입니다.

## 활발한 생태계 {#an-active-ecosystem}

Vite의 진화는 프레임워크와 플러그인의 관리자, 사용자, 그리고 Vite 팀 간의 협력으로 이루어집니다. 만약 진행 중인 프로젝트가 Vite를 채택한다면, Vite의 코어 개발에 적극적으로 참여해 볼 것을 권장합니다. 우리는 각 릴리스에서 이전 버전으로의 회귀를 최소화하기 위해 생태계의 주요 프로젝트와 긴밀하게 협력하고 있으며, [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)와 같은 도구도 활용하고 있습니다. 특히 이 도구를 통해 PR에서 Vite를 사용해 주요 프로젝트의 CI를 실행할 수 있는데, 이는 해당 릴리스의 여파를 명확하게 파악할 수 있도록 도와줍니다. 우리는 사용자에게 영향을 미치기 전에 버그를 수정하고, 프로젝트가 릴리스와 함께 다음 버전으로 업데이트할 수 있도록 최선을 다하고 있습니다. 만약 여러분이 Vite를 사용하고 있다면, [Vite의 Discord](https://chat.vitejs.dev)에서 우리와 함께 프로젝트에 참여해 보세요.