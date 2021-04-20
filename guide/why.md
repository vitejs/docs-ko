# Vite를 사용해야 하는 이유

## 이런 문제점이 있었어요

브라우저에서 ESM(ES Modules)을 지원하기 전까지는, JavaScript 모듈화를 네이티브 레벨에서 진행할 수 없었습니다. 따라서 개발자들은 "번들링(Bundling)\*"이라는 우회적인 방법을 사용할 수 밖에 없었죠. (\* 번들링: 모듈화된 소스 코드를 브라우저에서 실행할 수 있는 파일로 한데 묶어 연결해주는 작업)

[Webpack](https://webpack.js.org/), [Rolup](https://rollupjs.org) 그리고 [Parcel](https://parceljs.org/)과 같은 도구는 이런 번들링 작업을 진행해줌으로써 프런트엔드 개발자의 생산성을 크게 향상시켰습니다.

하지만, 1000개의 JavaScript 모듈이 된 거대한 프로젝트라면 어떨까요? 실제로 이러한 상황을 어렵지 않게 마주할 수 있으며, 이 경우 Webpack과 같은 JavaScript 기반의 도구는 병목 현상이 발생하곤 합니다. (개발 서버를 실행하는 데 있어 비합리적으로 긴 시간을 기다려 본 적이 있나요? 또는 HMR을 사용할 때 편집한 코드가 브라우저에 반영되기까지 수 초 이상이 소요되어 답답했던 적이 있나요?)

Vite는 이러한 것에 초점을 맞춰, 브라우저에서 지원하는 ES Modules(ESM) 및 네이티브 언어로 작성된 JavaScript 도구 등을 활용해 문제를 해결하고자 합니다.

### 지루할 정도로 길었던 서버 구동

When cold-starting the dev server, a bundler-based build setup has to eagerly crawl and build your entire application before it can be served.

Cold-Starting\* 방식으로 개발 서버를 구동할 때, 번들러 기반의 도구의 경우 애플리케이션 내 모든 소스 코드에 대해 크롤링 및 빌드 작업을 마쳐야지만이 실제 페이지를 제공할 수 있습니다. (\* Cold-Starting: )

Vite improves the dev server start time by first dividing the modules in an application into two categories: **dependencies** and **source code**.

Vite는 이 문제를 **dependencies** 그리고 **source code** 두 가지 카테고리로 나누어 개발 서버를 시작하도록 함으로써 병목을 줄였죠.

- **Dependencies** are mostly plain JavaScript that do not change often during development. Some large dependencies (e.g. component libraries with hundreds of modules) are also quite expensive to process. Dependencies may also be shipped in various module formats (e.g. ESM or CommonJS).

- **Dependencies**: 개발 시 그 내용이 바뀌지 않을 일반적인(Plain) JavaScript 소스 코드입니다. 컴포넌트 라이브러리와 같이 몇 백 개의 JavaScript 모듈을 갖고 있는 매우 큰 디펜던시의 경우 이 기법을 통해 의미있는 수준의 성능 향상을 보였으며, ESM 또는 CommonJS와 같은 다양한 형태의 모듈 포맷으로 제공되도록 합니다.

  Vite [pre-bundles dependencies](./dep-pre-bundling) using [esbuild](https://esbuild.github.io/). Esbuild is written in Go and pre-bundles dependencies 10-100x faster than JavaScript-based bundlers.

  Vite의 [Pre-bundles dependencies](./dep-pre-bundling)은 [Esbuild](https://esbuild.github.io/)를 사용하고 있습니다. Go로 작성된 Esbuild는 Webpack, Parcel과 같은 기존의 번들러 대비 10-100배 빠른 번들링 속도를 보였죠.

- **Source code** often contains non-plain JavaScript that needs transforming (e.g. JSX, CSS or Vue/Svelte components), and will be edited very often. Also, not all source code needs to be loaded at the same time (e.g. with route-based code-splitting).

- **Source code**: JSX, CSS 또는 Vue/Svelte 컴포넌트와 같이 컴파일링이 필요하고, 수정 또한 매우 잦은 Non-plain JavaScript 소스 코드는 어떻게 할까요? 물론 이들 역시 특정 시점에서 모두 불러올 필요는 없습니다.

  Vite serves source code over [native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This is essentially letting the browser taking over part of the job of a bundler: Vite only needs to transform and serve source code on demand, as the browser requests them. Code behind conditional dynamic imports are only processed if actually used on the current screen.

  Vite는 [Native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)을 이용해 소스 코드를 제공하도록 하고 있습니다. 다시말해, 브라우저가 곧 번들러라는 말이죠. Vite는 그저 브라우저의 판단 아래 특정 소스 코드를 요청하면 이를 전달할 뿐입니다.

  ![번들러 기반의 개발 서버](/images/bundler.png)

  ![ESM 기반의 개발 서버](/images/esm.png)

### Slow Updates

### 느렸던 소스 코드 갱신

When a file is edited in a bundler-based build setup, it is inefficient to rebuild the whole bundle for obvious reasons: the update speed will degrade linearly with the size of the app.

기존 번들러 기반으로 개발을 진행할 때, 소스 코드를 업데이트 하게 되면 번들링 과정을 다시 거쳐야 했었습니다. 따라서 서비스가 커질수록 소스 코드 갱신 시간 또한 선형적으로 증가할 수 밖에 없었죠.

Some bundler dev server runs the bundling in memory so that it only needs to invalidate part of its module graph when a file changes, but it still needs to re-construct the entire bundle and reload the web page. Reconstructing the bundle can be expensive, and reloading the page blows away the current state of the application. This is why some bundlers support Hot Module Replacement (HMR): allowing a module to "hot replace" itself without affecting the rest of the page. This greatly improves DX - however, in practice we've found that even HMR update speed deteriorates significantly as the size of the application grows.

일부 번들러의 경우 메모리 상에서 이를 진행하여 실제로 갱신에 영향을 받는 파일들만을 번들링하게끔 하였으나, 결국 이 역시 모든 파일에 대한 번들링을 진행해야 했었죠. "모든 파일"을 번들링 하고, 이를 다시 웹 페이지에서 불러오는 것이 얼마나 비효율적인 것인지 느껴지시나요? 이러한 이슈를 우회하고자 HMR(Hot Module Replacement)\* 이라는 대안이 나왔으나, 이 역시 명확한 해답은 아니었습니다. (\* HMR: 앱을 종료하지 않고 갱신된 파일만을 교체하는(Replacement) 방식. 다만 마찬가지로 앱 사이즈가 커질수록 선형적으로 갱신에 필요한 시간이 증가한다.)

In Vite, HMR is performed over native ESM. When a file is edited, Vite only needs to precisely invalidate the chain between the edited module and its closest HMR boundary (most of the time only the module itself), making HMR updates consistently fast regardless of the size of your application.

Vite는 물론 HMR을 지원합니다. 번들러가 아닌 ESM을 이용해서 말이죠. 어떤 모듈이 수정되면 Vite는 그저 해당 모듈과 관련된 부분만 교체할 뿐이고, 브라우저에서 해당 모듈을 요청하면 수정된 모듈을 전달할 뿐입니다. 완벽하게 ESM을 이용하죠. 따라서 앱 사이즈가 커져도 HMR을 포함한 갱신 시간에는 영향을 끼치지 않습니다.

Vite also leverages HTTP headers to speed up full page reloads (again, let the browser do more work for us): source code module requests are made conditional via `304 Not Modified`, and dependency module requests are strongly cached via `Cache-Control: max-age=31536000,immutable` so they don't hit the server again once cached.

또한 Vite는 HTTP 헤더를 이용해 갱신 속도를 한층 더 높였습니다. 필요에 따라 소스 코드는 `304 Not Modified`로, 디펜던시는 `Cache-Control: max-age=31536000,immutable`을 이용해 캐시되도록 함으로써 한 번의 요청이라도 덜 하도록 말이죠.

Once you experience how fast Vite is, we highly doubt you'd be willing to put up with bundled development again.

이렇게나 빠른 Vite를 사용하지 않을 이유가 더 이상 있나요?

## Why Bundle for Production

## 배포 시 번들링 과정이 필요한 이유

Even though native ESM is now widely supported, shipping unbundled ESM in production is still inefficient (even with HTTP/2) due to the additional network round trips caused by nested imports. To get the optimal loading performance in production, it is still better to bundle your code with tree-shaking, lazy-loading and common chunk splitting (for better caching).

물론 이렇게나 다양한 이점을 가진 ESM 이지만, 비교적 최근에야 지원되기 시작했기에 사용이 불가능한 브라우저 환경이 있을 수 있습니다. 또한 네트워크를 통해 필요한 시점에 해당 모듈을 요청하기에, HTTP/2를 이용하더라도 오버헤드가 발생될 수 있구요.

Ensuring optimal output and behavioral consistency between the dev server and the production build isn't easy. This is why Vite ships with a pre-configured [build command](./build) that bakes in many [performance optimizations](./features#build-optimizations) out of the box.

따라서, 모든 사용자 경험을 충족시키기 위해서라도 배포 시에는 번들링 과정이 필수적입니다. 이것이 바로 Vite가 미리 설정된 [빌드 커맨드](./build)를 이용하고, [퍼포먼스 최적화](./features#build-optimizations)를 진행하는 이유입니다.

## Why Not Bundle with esbuild?

## 왜 번들링 시에 Esbuild를 사용하지 않나요?

While `esbuild` is blazing fast and is already a very capable bundler for libraries, some of the important features needed for bundling _applications_ are still work in progress - in particular code-splitting and CSS handling. For the time being, Rollup is more mature and flexible in these regards. That said, we won't rule out the possibility of using `esbuild` for production build when it stabilizes these features in the future.

`esbuild`는

## Vite와 다른 번들러 도구의 차이점

[차이점](./comparisons) 섹션에서 Vite와 다른 번들러 도구의 차이점에 대해 자세히 다루고 있습니다.
