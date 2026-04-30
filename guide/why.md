# Vite를 사용해야 하는 이유 {#why-vite}

웹 애플리케이션의 규모와 복잡성이 커지면서, 이를 빌드하는 데 사용되는 도구들은 그 속도를 따라가는 데 어려움을 겪었습니다. 대규모 프로젝트를 다루는 개발자들은 고통스러울 정도로 느린 개발 서버 시작, 답답한 핫 업데이트, 긴 프로덕션 빌드 시간을 경험해 왔습니다. 각 세대의 빌드 도구는 이전 세대보다 개선되었지만, 이러한 문제들은 계속 남아 있었습니다.

Vite는 이를 해결하기 위해 만들어졌습니다. 기존 접근 방식을 점진적으로 개선하는 대신, 개발 중에 코드를 어떻게 제공해야 하는지 다시 생각했습니다. 이후 Vite는 여러 메이저 버전을 거치며, 브라우저의 네이티브 ES modules 활용부터 완전히 Rust 기반인 툴체인 채택까지, 생태계의 새로운 역량에 맞춰 진화해 왔습니다.

오늘날 Vite는 많은 프레임워크와 도구를 구동합니다. Vite의 아키텍처는 특정 접근 방식 하나에 고정되기보다 웹 플랫폼과 함께 진화하도록 설계되어 있어, 장기적으로 기반으로 삼을 수 있는 토대가 됩니다.

## 기원 {#the-origins}

Vite가 처음 만들어졌을 때, 브라우저는 [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)(ESM)을 폭넓게 지원하기 시작했습니다. 이는 JavaScript 파일을 먼저 하나의 파일로 번들링하는 도구 없이 직접 로드하는 방식입니다. 전통적인 빌드 도구(흔히 _번들러_라고 부릅니다)는 브라우저에 무엇이든 표시되기 전에 전체 애플리케이션을 미리 처리했습니다. 앱이 클수록 기다리는 시간도 길어졌습니다.

Vite는 다른 접근 방식을 택했습니다. 작업을 두 부분으로 나누었습니다.

- **디펜던시**(거의 변경되지 않는 라이브러리)는 빠른 네이티브 도구를 사용해 한 번 [사전 번들링](./dep-pre-bundling.md)되므로, 즉시 준비됩니다.
- **소스 코드**(자주 변경되는 애플리케이션 코드)는 네이티브 ESM을 통해 온디맨드로 제공됩니다. 브라우저는 현재 페이지에 필요한 것만 로드하고, Vite는 각 파일이 요청될 때 변환합니다.

이는 애플리케이션 규모와 관계없이 개발 서버 시작이 거의 즉시 이루어진다는 뜻이었습니다. 파일을 수정하면, Vite는 네이티브 ESM 기반의 [Hot Module Replacement](./features.md#hot-module-replacement)(HMR)를 사용해 전체 페이지를 새로고침하거나 다시 빌드될 때까지 기다리지 않고 브라우저에서 해당 모듈만 업데이트했습니다.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />

_번들 기반 개발 서버에서는, 애플리케이션 전체가 번들링된 뒤에야 제공될 수 있습니다._

<svg-image :svg="esmSvg" />

_ESM 기반 개발 서버에서는, 브라우저가 요청할 때 모듈이 온디맨드로 제공됩니다._

Vite가 이 접근 방식을 탐구한 첫 번째 도구는 아니었습니다. [Snowpack](https://www.snowpack.dev/)은 번들링하지 않는 개발 방식을 개척했고 Vite의 디펜던시 사전 번들링에 영감을 주었습니다. Preact 팀의 [WMR](https://github.com/preactjs/wmr)은 개발과 빌드 모두에서 작동하는 범용 플러그인 API에 영감을 주었습니다. [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/)는 Vite 1.0의 서버 아키텍처에 영향을 주었습니다. Vite는 이러한 아이디어를 바탕으로 이를 이어 나갔습니다.

번들링하지 않는 ESM은 개발 중에는 잘 작동하지만, 프로덕션에 그대로 배포하는 것은 중첩된 import로 인한 추가 네트워크 왕복 때문에 여전히 비효율적입니다. 이것이 최적화된 프로덕션 빌드에 [번들링이 여전히 필요한 이유](https://rolldown.rs/in-depth/why-bundlers)입니다.

## 생태계와 함께 성장하기 {#growing-with-the-ecosystem}

Vite가 성숙해지면서, 프레임워크들은 Vite를 빌드 레이어로 채택하기 시작했습니다. Rollup의 컨벤션을 기반으로 한 Vite의 [플러그인 API](./api-plugin.md)는 프레임워크가 Vite 내부 구조를 우회하지 않고도 자연스럽게 통합할 수 있게 했습니다. [Nuxt](https://nuxt.com/), [SvelteKit](https://svelte.dev/docs/kit), [Astro](https://astro.build/), [React Router](https://reactrouter.com/), [Analog](https://analogjs.org/), [SolidStart](https://start.solidjs.com/) 등은 Vite를 기반으로 선택했습니다. [Vitest](https://vitest.dev/)와 [Storybook](https://storybook.js.org/) 같은 도구들도 Vite 위에 구축되어, Vite의 범위를 앱 번들링 너머로 확장했습니다. [Laravel](https://laravel.com/docs/vite) 및 [Ruby on Rails](https://vite-ruby.netlify.app/) 같은 백엔드 프레임워크도 프런트엔드 에셋 파이프라인에 Vite를 통합했습니다.

이 성장은 일방향이 아니었습니다. Vite가 생태계를 형성한 만큼, 생태계도 Vite를 형성했습니다. Vite 팀은 모든 Vite 변경 사항을 주요 생태계 프로젝트에 대해 테스트하는 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)를 운영합니다. 생태계의 건강성은 나중에 덧붙이는 고려 사항이 아닙니다. 릴리스 프로세스의 일부입니다.

## 통합된 툴체인 {#a-unified-toolchain}

Vite는 원래 내부적으로 두 개의 별도 도구에 의존했습니다. 개발 중 빠른 컴파일을 위한 [esbuild](https://esbuild.github.io/)와 프로덕션 빌드의 철저한 최적화를 위한 [Rollup](https://rollupjs.org/)입니다. 이는 잘 작동했지만, 두 파이프라인을 유지하는 과정에서 서로 다른 변환 동작, 별도의 플러그인 시스템, 이를 맞추기 위해 늘어나는 연결 코드와 같은 불일치가 생겼습니다.

[Rolldown](https://rolldown.rs/)은 이 둘을 단일 번들러로 통합하기 위해 만들어졌습니다. 네이티브 속도를 위해 Rust로 작성되었고, 생태계가 이미 의존해 온 동일한 플러그인 API와 호환됩니다. Rolldown은 파싱, 변환, 축소화에 [Oxc](https://oxc.rs/)를 사용합니다. 이를 통해 Vite는 빌드 도구, 번들러, 컴파일러가 함께 유지보수되고 하나의 단위로 진화하는 엔드 투 엔드 툴체인을 갖게 됩니다.

그 결과 개발부터 [프로덕션](./build.md)까지 하나의 일관된 파이프라인이 만들어집니다. 마이그레이션은 신중하게 진행되었습니다. 초기 도입자가 변경 사항을 검증할 수 있도록 [기술 프리뷰](https://voidzero.dev/posts/announcing-rolldown-vite)가 먼저 제공되었고, 생태계 CI가 호환성 문제를 일찍 포착했으며, 호환성 레이어가 기존 설정을 보존했습니다.

## Vite가 나아가는 방향 {#where-vite-is-heading}

Vite의 아키텍처는 계속 진화하고 있습니다. 몇 가지 노력이 Vite의 미래를 형성하고 있습니다.

- **Full bundle mode**: Vite가 만들어졌을 때는 개발 중 번들링에 필요한 HMR과 플러그인 역량을 갖추면서도 충분히 빠른 도구가 없었기 때문에, 번들링하지 않는 ESM이 적절한 트레이드오프였습니다. Rolldown은 이를 바꾸고 있습니다. 매우 큰 코드베이스에서는 번들링되지 않은 네트워크 요청 수가 많아 페이지 로드가 느려질 수 있으므로, 팀은 개발 서버가 프로덕션과 비슷하게 코드를 번들링하여 네트워크 오버헤드를 줄이는 모드를 탐구하고 있습니다.

- **Environment API**: "client"와 "SSR"을 유일한 두 빌드 대상으로 취급하는 대신, [Environment API](./api-environment-instances.md)를 통해 프레임워크는 커스텀 환경(edge 런타임, 서비스 워커, 기타 배포 대상)을 정의할 수 있으며, 각 환경은 자체 모듈 해석과 실행 규칙을 가질 수 있습니다. 코드가 실행되는 위치와 방식이 계속 다양해짐에 따라, Vite의 모델도 함께 확장됩니다.

- **JavaScript와 함께 진화하기**: Oxc 및 Rolldown이 Vite와 긴밀히 협력함으로써, upstream 디펜던시를 기다리지 않고도 새로운 언어 기능과 표준을 전체 툴체인에 빠르게 도입할 수 있습니다.

Vite의 목표는 최종 도구가 되는 것이 아니라, 웹 플랫폼과 Vite 위에서 빌드하는 개발자들과 함께 계속 진화하는 도구가 되는 것입니다.
