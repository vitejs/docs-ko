# 프로젝트 철학 {#project-philosophy}

## 간결하고 확장가능한 코어 {#lean-extendable-core}

Vite aims to support the most common patterns to build Web apps out-of-the-box, while keeping [Vite core](https://github.com/vitejs/vite) lean and maintainable long-term. We believe the best way to support diverse use cases is to provide strong primitives and APIs that plugins can build on, and we actively expand the core to make Vite more extensible. [Vite's plugin system](./api-plugin.md) is based on a superset of Rollup's plugin API, and it enables plugins like [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) and the many [well maintained plugins](https://registry.vite.dev/plugins) available to cover your needs. Vite's bundler, [Rolldown](https://rolldown.rs/), maintains compatibility with Rollup's plugin interface, so plugins can often be used across both Vite and plain Rollup projects.

## 모던 웹으로 나아가기 {#pushing-the-modern-web}

Vite는 모던 코드를 작성할 수 있도록 유도하고 있습니다. 예를 들어 다음과 같습니다:

- 소스 코드는 ESM으로만 작성할 수 있으며, ESM이 아닌 디펜던시는 정상적으로 동작할 수 있도록 [ESM으로 사전 번들링](./dep-pre-bundling)해야 합니다.
- 웹 워커는 최신 표준을 따르기 위해 [`new Worker` 구문](./features#web-workers)으로 작성하는 것이 권장됩니다.
- Node.js 모듈은 브라우저에서 사용할 수 없습니다.

이러한 패턴은 새로운 기능을 추가할 때 미래 지향적인 API를 만들 수 있도록 도와주지만, 다른 빌드 툴과는 호환되지 않을 수 있습니다.

## 성능에 대한 실용적인 접근 {#a-pragmatic-approach-to-performance}

Vite has been focused on performance since its [origins](./why.md). Its dev server architecture allows HMR that stays fast as projects scale. Vite is based on native tools that include the [Oxc toolchain](https://oxc.rs/) and [Rolldown](https://rolldown.rs/) to implement intensive tasks but keeps the rest of the code in JS to balance speed with flexibility. When needed, framework plugins will tap into [Babel](https://babeljs.io/) to compile user code. Thanks to Rolldown's Rollup plugin compatibility, Vite has access to a wide ecosystem of plugins.

## Vite를 기반으로 프레임워크 구축하기 {#building-frameworks-on-top-of-vite}

Although Vite can be used by users directly, it shines as a tool to create frameworks. Vite core is framework agnostic, but there are polished plugins for each UI framework. Its [JS API](./api-javascript.md) allows App Framework authors to use Vite features to create tailored experiences for their users. Vite includes support for [SSR primitives](./ssr.md), usually present in higher-level tools but fundamental to building modern web frameworks. And Vite plugins complete the picture by offering a way to share between frameworks. Vite is also a great fit when paired with [Backend frameworks](./backend-integration.md) like [Ruby](https://vite-ruby.netlify.app/) and [Laravel](https://laravel.com/docs/vite).

## 활발한 생태계 {#an-active-ecosystem}

Vite의 진화는 프레임워크와 플러그인의 관리자, 사용자, 그리고 Vite 팀 간의 협력으로 이루어집니다. 만약 진행 중인 프로젝트가 Vite를 채택한다면, Vite의 코어 개발에 적극적으로 참여해 볼 것을 권장합니다. 우리는 각 릴리스에서 이전 버전으로의 회귀를 최소화하기 위해 생태계의 주요 프로젝트와 긴밀하게 협력하고 있으며, [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)와 같은 도구도 활용하고 있습니다. 특히 이 도구를 통해 PR에서 Vite를 사용해 주요 프로젝트의 CI를 실행할 수 있는데, 이는 해당 릴리스의 여파를 명확하게 파악할 수 있도록 도와줍니다. 우리는 사용자에게 영향을 미치기 전에 버그를 수정하고, 프로젝트가 릴리스와 함께 다음 버전으로 업데이트할 수 있도록 최선을 다하고 있습니다. 만약 여러분이 Vite를 사용하고 있다면, [Vite의 Discord](https://chat.vite.dev)에서 우리와 함께 프로젝트에 참여해 보세요.