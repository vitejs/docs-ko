# 다른 빌드 도구와의 차이점 {#comparisons-with-other-no-bundler-solutions}

## WMR {#wmr}

Preact 팀의 [WMR](https://github.com/preactjs/wmr)은 유사한 기능 세트를 제공하며, Rollup의 플러그인 인터페이스에 대한 Vite 2.0의 지원은 그것에 영감을 받았습니다.

WMR은 주로 [Preact](https://preactjs.com/) 프로젝트를 위해 설계되었으며, 사전 렌더링과 같은 보다 통합된 기능을 제공합니다. 범위 측면에서는 Preact 자체와 같이 컴팩트한 크기를 강조하는 Preact 메타 프레임워크에 더 가깝습니다. Preact를 사용한다면, WMR은 보다 더 미세하게 조정된 경험을 제공할 것입니다. 그러나 WMR이 다른 프레임워크에 대한 지원 우선순위를 정할 것 같지는 않습니다.

## @web/dev-server {#web-dev-server}

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (이전 `es-dev-server`)는 훌륭한 프로젝트이며, 이는 Vite 1.0의 Koa 기반 서버 설정에 영감을 주었습니다.

`@web/dev-server`는 범위 측면에서 약간 낮은 수준입니다. 공식 프레임워크 통합을 제공하지 않으며 프로덕션 빌드를 위한 Rollup 구성을 수동으로 설정해야 합니다.

전반적으로 Vite는 더 독창적인 작업 흐름를 제공하는 것을 목표로 하는, 보다 독단적이고 높은 수준의 도구입니다. 즉, `@web` 총합 프로젝트에는 Vite 사용자에게도 도움을 줄 수 있는 다른 많은 훌륭한 도구가 포함되어 있습니다.

## Snowpack {#snowpack}

[Snowpack](https://www.snowpack.dev/)은 Vite와 유사하게 번들링을 하지 않는 네이티브 ESM 개발 서버입니다. 다만 이 프로젝트는 더 이상 관리되지 않으며, Snowpack 팀은 현재 Vite를 통해 제공되는 정적 사이트 빌더인 [Astro](https://astro.build/)를 만들고 있습니다. Astro 팀은 Vite 생태계에서 활발하게 활동하고 있으며, Vite를 개선하는 데 도움을 주고 있습니다.

다른 세부 구현 사항을 제외하고, 두 프로젝트는 기존 도구에 비해 기술적 이점 측면에서 많은 부분을 공유했습니다. Snowpack v1(현재는 [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall))에서 Vite의 디펜던시 사전 번들링에 대한 영감을 얻기도 했습니다. 두 프로젝트 간 주요한 차이점은 [다른 빌드 도구와의 차이점 (Vite v2)](./comparisons-v2.md)를 참고해주세요.