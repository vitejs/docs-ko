# Vite를 사용해야 하는 이유 {#why-vite}

웹 애플리케이션의 규모와 복잡도가 커지면서, 이를 빌드하는 데 사용되는 도구들은 그 변화를 따라잡는 데 어려움을 겪어 왔습니다. 대규모 프로젝트를 다루는 개발자들은 매우 느린 개발 서버 시작, 굼뜬 핫 업데이트, 긴 프로덕션 빌드 시간을 경험해 왔습니다. 빌드 도구는 세대가 바뀔 때마다 개선되었지만, 이러한 문제는 계속 남아 있었습니다.

Vite는 이 문제를 해결하기 위해 만들어졌습니다. 기존 접근 방식을 점진적으로 개선하는 대신, 개발 중 코드가 어떻게 제공되어야 하는지를 다시 생각했습니다. 이후 Vite는 여러 메이저 버전을 거치며 브라우저의 네이티브 ES 모듈 활용부터 완전한 Rust 기반 툴체인 도입까지, 생태계의 새로운 기능에 맞춰 계속 발전해 왔습니다.

오늘날 Vite는 많은 프레임워크와 도구의 기반이 되고 있습니다. Vite의 아키텍처는 특정 접근 방식에 고정되기보다 웹 플랫폼과 함께 발전하도록 설계되어, 장기적으로 의지할 수 있는 기반이 됩니다.

## 시작점 {#the-origins}

Vite가 처음 만들어졌을 때, 브라우저는 JavaScript 파일을 먼저 하나의 파일로 번들링하는 도구 없이 직접 로드할 수 있는 방식인 [ES 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)(ESM)을 막 폭넓게 지원하기 시작했습니다. 기존 빌드 도구(흔히 _번들러_ 라고 부릅니다)는 브라우저에 무언가를 보여주기 전에 애플리케이션 전체를 먼저 처리했습니다. 앱이 클수록 기다리는 시간도 길어졌습니다.

Vite는 다른 접근 방식을 택했습니다. 작업을 두 부분으로 나눴습니다:

- **디펜던시**(거의 변경되지 않는 라이브러리)는 빠른 네이티브 도구로 한 번 [사전 번들링](./dep-pre-bundling.md)되어 즉시 사용할 수 있습니다.
- **소스 코드**(자주 변경되는 애플리케이션 코드)는 네이티브 ESM을 통해 온디맨드로 제공됩니다. 브라우저는 현재 페이지에 필요한 것만 로드하고, Vite는 요청된 각 파일을 변환합니다.

이는 애플리케이션 크기와 관계없이 개발 서버가 거의 즉시 시작된다는 뜻이었습니다. 파일을 수정하면 Vite는 네이티브 ESM 기반 [Hot Module Replacement](./features.md#hot-module-replacement)(HMR)를 사용해 전체 페이지를 다시 로드하거나 재빌드를 기다리지 않고, 해당 모듈만 브라우저에서 업데이트했습니다.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw' // 번들러 SVG
import esmSvg from '../images/esm.svg?raw' // ESM 그림
</script>
<svg-image :svg="bundlerSvg" />

_번들 기반 개발 서버에서는 애플리케이션 전체가 번들링된 뒤에야 제공될 수 있습니다._

<svg-image :svg="esmSvg" />

_ESM 기반 개발 서버에서는 브라우저가 요청하는 시점에 모듈이 온디맨드로 제공됩니다._

Vite가 이 접근 방식을 처음 시도한 도구는 아니었습니다. [Snowpack](https://www.snowpack.dev/)은 번들링하지 않는 개발 방식을 개척했고, Vite의 디펜던시 사전 번들링에 영감을 주었습니다. Preact 팀의 [WMR](https://github.com/preactjs/wmr)은 개발과 빌드 모두에서 동작하는 범용 플러그인 API에 영감을 주었습니다. [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/)는 Vite 1.0의 서버 아키텍처에 영향을 주었습니다. Vite는 이러한 아이디어 위에 만들어졌고, 이를 계속 발전시켰습니다.

번들링하지 않은 ESM은 개발 중에는 잘 동작하지만, 중첩된 임포트로 인해 네트워크 왕복이 추가되므로 프로덕션에 그대로 배포하기에는 여전히 비효율적입니다. 최적화된 프로덕션 빌드에 [번들링이 여전히 필요한 이유](https://rolldown.rs/in-depth/why-bundlers)가 여기에 있습니다.

## 생태계와 함께 성장하기 {#growing-with-the-ecosystem}

Vite가 성숙해지면서 프레임워크들은 Vite를 빌드 레이어로 채택하기 시작했습니다. Rollup의 컨벤션을 기반으로 한 [플러그인 API](./api-plugin.md)는 프레임워크가 Vite 내부 구현을 우회하지 않고도 자연스럽게 통합되도록 했습니다. [Nuxt](https://nuxt.com/), [SvelteKit](https://svelte.dev/docs/kit), [Astro](https://astro.build/), [React Router](https://reactrouter.com/), [Analog](https://analogjs.org/), [SolidStart](https://start.solidjs.com/) 등이 Vite를 기반으로 선택했습니다. [Vitest](https://vitest.dev/)와 [Storybook](https://storybook.js.org/) 같은 도구도 Vite 위에 만들어져, Vite의 역할은 앱 번들링을 넘어 확장되었습니다. [Laravel](https://laravel.com/docs/vite)과 [Ruby on Rails](https://vite-ruby.netlify.app/) 같은 백엔드 프레임워크도 프런트엔드 에셋 파이프라인에 Vite를 통합했습니다.

이 성장은 한 방향으로만 이루어진 것이 아니었습니다. Vite가 생태계를 형성한 만큼, 생태계도 Vite를 형성했습니다. Vite 팀은 Vite의 모든 변경 사항을 주요 생태계 프로젝트와 함께 테스트하는 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)를 운영합니다. 생태계의 건강성은 나중에 생각하는 요소가 아니라 릴리스 프로세스의 일부입니다.

## 통합된 툴체인 {#a-unified-toolchain}

Vite는 원래 내부적으로 두 개의 별도 도구에 의존했습니다. 개발 중 빠른 컴파일에는 [esbuild](https://esbuild.github.io/)를, 프로덕션 빌드의 철저한 최적화에는 [Rollup](https://rollupjs.org/)을 사용했습니다. 이 방식은 동작했지만, 두 파이프라인을 유지하면서 서로 다른 변환 동작, 분리된 플러그인 시스템, 둘을 맞추기 위한 점점 늘어나는 연결 코드 같은 불일치가 생겼습니다.

[Rolldown](https://rolldown.rs/)은 이 둘을 하나의 번들러로 통합하기 위해 만들어졌습니다. 네이티브 속도를 위해 Rust로 작성되었고, 생태계가 이미 의존하던 동일한 플러그인 API와 호환됩니다. 파싱, 변환, 축소화에는 [Oxc](https://oxc.rs/)를 사용합니다. 이를 통해 Vite는 빌드 도구, 번들러, 컴파일러가 함께 유지보수되고 하나의 단위로 발전하는 엔드투엔드 툴체인을 갖게 됩니다.

그 결과 개발부터 [프로덕션](./build.md)까지 하나의 일관된 파이프라인이 만들어졌습니다. 마이그레이션은 신중하게 진행되었습니다. 먼저 [기술 프리뷰](https://voidzero.dev/posts/announcing-rolldown-vite)를 제공해 초기 사용자들이 변경 사항을 검증하도록 했고, 생태계 CI가 호환성 문제를 일찍 잡아냈으며, 호환성 레이어가 기존 설정을 보존했습니다.

## Vite가 향하는 곳 {#where-vite-is-heading}

Vite의 아키텍처는 계속 발전하고 있습니다. 다음과 같은 여러 노력이 Vite의 미래를 만들어 가고 있습니다:

- **전체 번들링 모드**: Vite가 만들어졌을 때는 개발 중 번들링을 수행할 만큼 충분히 빠르면서 HMR과 플러그인 기능까지 갖춘 도구가 없었기 때문에, 번들링하지 않은 ESM이 적절한 절충안이었습니다. Rolldown은 이 전제를 바꿉니다. 매우 큰 코드베이스는 번들링되지 않은 네트워크 요청이 많아 페이지 로드가 느려질 수 있으므로, 팀은 개발 서버가 프로덕션과 유사하게 코드를 번들링해 네트워크 오버헤드를 줄이는 모드를 탐색하고 있습니다.

- **Environment API**: "client"와 "SSR"만을 두 빌드 타깃으로 취급하는 대신, [Environment API](./api-environment-instances.md)는 프레임워크가 각자의 모듈 해석 및 실행 규칙을 가진 커스텀 환경(엣지 런타임, 서비스 워커, 기타 배포 타깃)을 정의하도록 합니다. 코드가 어디서, 어떻게 실행되는지가 계속 다양해지는 만큼 Vite의 모델도 함께 확장됩니다.

- **JavaScript와 함께 진화하기**: Oxc와 Rolldown이 Vite와 긴밀히 협업하므로, upstream 디펜던시를 기다리지 않고도 새로운 언어 기능과 표준을 전체 툴체인에 빠르게 도입할 수 있습니다.

Vite의 목표는 마지막 도구가 되는 것이 아니라, 웹 플랫폼과 그 위에서 무언가를 만드는 개발자들과 함께 계속 진화하는 도구가 되는 것입니다.
