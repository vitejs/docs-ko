# Vite를 사용해야 하는 이유 {#why-vite}

## 이런 문제점이 있었어요 {#the-problems}

브라우저에서 ESM(ES Modules)을 지원하기 전까지, JavaScript 모듈화를 네이티브 레벨에서 진행할 수 없었습니다. 그래서 소스 모듈을 브라우저에서 실행할 수 있는 파일로 크롤링, 처리 및 연결하는 "번들링(Bundling)"이라는 해결 방법을 사용해야 했습니다.

[Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org) 그리고 [Parcel](https://parceljs.org/)과 같은 도구는 이런 번들링 작업을 진행해줌으로써 프런트엔드 개발자의 생산성을 크게 향상시켰습니다.

하지만 애플리케이션이 점점 더 발전함에 따라 처리해야 하는 JavaScript 모듈의 개수도 극적으로 증가하고 있습니다. 심지어 수천 개의 모듈이 존재하는 것도 대규모 프로젝트에서는 그리 드문 일이 아닙니다. 이러한 상황에서 JavaScript 기반의 도구는 성능 병목 현상이 발생되었고, 종종 개발 서버를 가동하는 데 비합리적으로 오랜 시간을 기다려야 한다거나 HMR을 사용하더라도 변경된 파일이 적용될 때 까지 수 초 이상 소요되곤 했습니다. 이와 같은 느린 피드백 루프는 개발자의 생산성과 행복에 적지 않은 영향을 줄 수 있습니다.

Vite는 이러한 것에 초점을 맞춰, 브라우저에서 지원하는 ES Modules(ESM) 및 네이티브 언어로 작성된 JavaScript 도구 등을 활용해 문제를 해결하고자 합니다.

### 지루할 정도로 길었던 서버 구동 {#slow-server-start}

콜드 스타트 방식으로 개발 서버를 구동할 때, 번들러 기반의 도구의 경우 애플리케이션 내 모든 소스 코드에 대해 크롤링 및 빌드 작업을 마쳐야지만이 실제 페이지를 제공할 수 있습니다.

vite는 애플리케이션의 모듈을 **디펜던시**와 **소스 코드** 두 가지 카테고리로 나누어 개발 서버의 시작 시간을 개선합니다.

- **디펜던시**: 개발 시 그 내용이 바뀌지 않을 일반적인 JavaScript 소스 코드입니다. 기존 번들러로는 컴포넌트 라이브러리와 같이 몇 백 개의 JavaScript 모듈을 갖고 있는 매우 큰 디펜던시에 대한 번들링 과정이 매우 비효율적이었고 많은 시간을 필요로 했습니다.

  Vite [사전 번들링](./dep-pre-bundling.md) 기능은 [Esbuild](https://esbuild.github.io/)를 사용하고 있습니다. Go로 작성된 Esbuild는 Webpack, Parcel과 같은 기존의 번들러 대비 10-100배 빠른 속도를 제공합니다.

- **소스 코드**: JSX, CSS 또는 Vue/Svelte 컴포넌트와 같이 컴파일링이 필요하고, 수정 또한 매우 잦은 Non-plain JavaScript 소스 코드는 어떻게 할까요? (물론 이들 역시 특정 시점에서 모두 불러올 필요는 없습니다.)

  vite는 [Native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)을 이용해 소스 코드를 제공합니다. 이것은 본질적으로 브라우저가 번들러의 작업의 일부를 차지할 수 있도록 합니다. vite는 브라우저가 요청하는 대로 소스 코드를 변환하고 제공하기만 하면 됩니다. 조건부 동적 import 이후의 코드는 현재 화면에서 실제로 사용되는 경우에만 처리됩니다.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />
<svg-image :svg="esmSvg" />

### 느렸던 소스 코드 갱신 {#slow-updates}

기존의 번들러 기반으로 개발을 진행할 때, 소스 코드를 업데이트 하게 되면 번들링 과정을 다시 거쳐야 했었습니다. 따라서 서비스가 커질수록 소스 코드 갱신 시간 또한 선형적으로 증가하게 됩니다.

일부 번들러는 메모리에서 작업을 수행하여 실제로 갱신에 영향을 받는 파일들만을 새롭게 번들링하도록 했지만, 결국 처음에는 모든 파일에 대한 번들링을 수행해야 했습니다. "모든 파일"을 번들링 하고, 이를 다시 웹 페이지에서 불러오는 것이 얼마나 비효율적인 것인지 느껴지시나요? 이러한 이슈를 우회하고자 HMR(Hot Module Replacement) 이라는 대안이 나왔으나, 이 역시 명확한 해답은 아니었습니다.

물론, vite는 HMR을 지원합니다. 이는 번들러가 아닌 ESM을 이용하는 것입니다. 어떤 모듈이 수정되면 vite는 그저 수정된 모듈과 관련된 부분만을 교체할 뿐이고, 브라우저에서 해당 모듈을 요청하면 교체된 모듈을 전달할 뿐입니다. 전 과정에서 완벽하게 ESM을 이용하기에, 앱 사이즈가 커져도 HMR을 포함한 갱신 시간에는 영향을 끼치지 않습니다.

또한 vite는 HTTP 헤더를 활용하여 전체 페이지의 로드 속도를 높입니다. 필요에 따라 소스 코드는 `304 Not Modified`로, 디펜던시는 `Cache-Control: max-age=31536000,immutable`을 이용해 캐시됩니다. 이렇게 함으로써 요청 횟수를 최소화하여 페이지 로딩을 빠르게 만들어 줍니다.

이렇게나 빠른 Vite를 사용하지 않을 이유가 있나요?

## 배포 시 번들링 과정이 필요한 이유 {#why-bundle-for-production}

이제 기본적으로 ESM이 대부분의 환경에서 지원되지만, 프로덕션에서 번들 되지 않은 ESM을 가져오는 것은 중첩된 import로 인한 추가 네트워크 통신으로 인해 여전히 비효율적입니다(HTTP/2를 사용하더라도). 프로덕션 환경에서 최적의 로딩 성능을 얻으려면 트리 셰이킹, 지연 로딩 및 청크 파일 분할(더 나은 캐싱을 위해)을 이용하여 번들링 하는 것이 더 좋습니다.

개발 서버와 프로덕션 빌드 간에 최적의 출력과 동작 일관성을 보장하는 것은 쉽지 않습니다. 이것이 바로 Vite가 미리 설정된 [빌드 커맨드](./build.md)를 이용하고, [빌드 최적화](./features.md#build-optimizations)를 진행하는 이유입니다.

## 왜 번들링 시에는 Esbuild를 사용하지 않나요? {#why-not-bundle-with-esbuild}

Vite는 [개발 환경에서 일부 디펜던시를 사전 번들링](./dep-pre-bundling.md)하기 위해 esbuild를 사용하지만, 프로덕션 빌드를 위한 번들러로는 사용하지 않습니다.

Vite의 현재 플러그인 API는 `esbuild`를 번들러로 사용하는 것과 호환되지 않습니다. `esbuild`가 더 빠르지만, Vite가 Rollup의 유연한 플러그인 API 및 인프라를 적극적으로 채택한 것은 생태계에서의 성공에 큰 기여를 했습니다. 현재로서는 Rollup이 성능 대 유연성 트레이드오프에서 더 나은 선택이라고 믿습니다.

Rollup은 [v4에서 파서를 SWC로 전환](https://github.com/rollup/rollup/pull/5073)하는 등 성능 개선을 위해 노력해 왔습니다. 또한 Rollup의 Rust 포팅인 Rolldown을 만드는 작업이 진행 중입니다. Rolldown이 준비되면 Rollup과 esbuild를 모두 대체하여 빌드 성능을 크게 향상시키고 개발과 빌드 사이의 불일치를 제거할 수 있습니다. [Evan You의 ViteConf 2023 키노트](https://youtu.be/hrdwQHoAp0M)에서 자세한 내용을 확인할 수 있습니다.

## Vite는 다른 번들링하지 않는 빌드 툴과 어떤 관계가 있나요? {#how-vite-relates-to-other-unbundled-build-tools}

Preact 팀이 제공하는 [WMR](https://github.com/preactjs/wmr)은 비슷한 기능을 제공하고자 했습니다. Vite 개발 및 빌드를 위한 범용 Rollup 플러그인 API는 여기에서 영감을 받았습니다. 다만 WMR은 더 이상 관리되지 않습니다. Preact 팀은 Vite와 함께 [@preactjs/preset-vite](https://github.com/preactjs/preset-vite) 플러그인 사용을 권장하고 있습니다.

[Snowpack](https://www.snowpack.dev/)도 번들링을 하지 않는 네이티브 ESM 개발 서버로, Vite와 매우 유사한 영역에 있었습니다. Vite에서 제공하는 디펜던시 사전 번들링 기능 역시 Snowpack v1(현재는 [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall))에서 영감을 받았습니다. 마찬가지로 Snowpack은 더 이상 관리되지 않고 있습니다. Snowpack 팀은 현재 Vite를 기반으로 한 정적 사이트 빌더인 [Astro](https://astro.build/)를 개발하고 있습니다.

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/)(이전에는 `es-dev-server`)는 훌륭한 프로젝트로, 이로부터 Vite 1.0 Koa 기반 서버 설정에 대한 영감을 받았었습니다. `@web`라는 우산 아래에 있는 프로젝트는 활발하게 유지보수되고 있으며, Vite 사용자에게도 도움이 될 수 있는 많은 우수한 도구들을 포함하고 있습니다.