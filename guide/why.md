# Vite를 사용해야 하는 이유

## 이런 문제점이 있었어요

브라우저에서 ESM(ES Modules)을 지원하기 전까지는, JavaScript 모듈화를 네이티브 레벨에서 진행할 수 없었습니다. 따라서 개발자들은 "번들링(Bundling)\*"이라는 우회적인 방법을 사용할 수 밖에 없었죠. (\* 번들링: 모듈화된 소스 코드를 브라우저에서 실행할 수 있는 파일로 한데 묶어 연결해주는 작업)

[Webpack](https://webpack.js.org/), [Rolup](https://rollupjs.org) 그리고 [Parcel](https://parceljs.org/)과 같은 도구는 이런 번들링 작업을 진행해줌으로써 프런트엔드 개발자의 생산성을 크게 향상시켰습니다.

하지만, 1000개의 JavaScript 모듈이 된 거대한 프로젝트라면 어떨까요? 실제로 이러한 상황을 어렵지 않게 마주할 수 있으며, 이 경우 Webpack과 같은 JavaScript 기반의 도구는 병목 현상이 발생하곤 합니다. (혹시, 개발 서버를 실행하는 데 있어 비합리적으로 긴 시간을 기다려 본 적이 있나요? 또는 HMR을 사용할 때 편집한 코드가 브라우저에 반영되기까지 수 초 이상이 소요되어 답답했던 적이 있나요?)

Vite는 이러한 것에 초점을 맞춰, 브라우저에서 지원하는 ES Modules(ESM) 및 네이티브 언어로 작성된 JavaScript 도구 등을 활용해 문제를 해결하고자 합니다.

### 지루할 정도로 길었던 서버 구동

When cold-starting the dev server, a bundler-based build setup has to eagerly crawl and build your entire application before it can be served.

Cold-Starting\* 방식으로 개발 서버를 구동할 때, 번들러 기반의 도구의 경우 애플리케이션 내 모든 소스 코드에 대해 크롤링 및 빌드 작업을 마쳐야지만이 실제 페이지를 제공할 수 있습니다. (\* Cold-Starting: )

Vite improves the dev server start time by first dividing the modules in an application into two categories: **dependencies** and **source code**.

- **Dependencies** are mostly plain JavaScript that do not change often during development. Some large dependencies (e.g. component libraries with hundreds of modules) are also quite expensive to process. Dependencies may also be shipped in various module formats (e.g. ESM or CommonJS).

  Vite [pre-bundles dependencies](./dep-pre-bundling) using [esbuild](https://esbuild.github.io/). Esbuild is written in Go and pre-bundles dependencies 10-100x faster than JavaScript-based bundlers.

- **Source code** often contains non-plain JavaScript that needs transforming (e.g. JSX, CSS or Vue/Svelte components), and will be edited very often. Also, not all source code needs to be loaded at the same time (e.g. with route-based code-splitting).

  Vite serves source code over [native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This is essentially letting the browser taking over part of the job of a bundler: Vite only needs to transform and serve source code on demand, as the browser requests them. Code behind conditional dynamic imports are only processed if actually used on the current screen.

  ![bundler based dev server](/images/bundler.png)

  ![esm based dev server](/images/esm.png)

### Slow Updates

When a file is edited in a bundler-based build setup, it is inefficient to rebuild the whole bundle for obvious reasons: the update speed will degrade linearly with the size of the app.

Some bundler dev server runs the bundling in memory so that it only needs to invalidate part of its module graph when a file changes, but it still needs to re-construct the entire bundle and reload the web page. Reconstructing the bundle can be expensive, and reloading the page blows away the current state of the application. This is why some bundlers support Hot Module Replacement (HMR): allowing a module to "hot replace" itself without affecting the rest of the page. This greatly improves DX - however, in practice we've found that even HMR update speed deteriorates significantly as the size of the application grows.

In Vite, HMR is performed over native ESM. When a file is edited, Vite only needs to precisely invalidate the chain between the edited module and its closest HMR boundary (most of the time only the module itself), making HMR updates consistently fast regardless of the size of your application.

Vite also leverages HTTP headers to speed up full page reloads (again, let the browser do more work for us): source code module requests are made conditional via `304 Not Modified`, and dependency module requests are strongly cached via `Cache-Control: max-age=31536000,immutable` so they don't hit the server again once cached.

Once you experience how fast Vite is, we highly doubt you'd be willing to put up with bundled development again.

## Why Bundle for Production

Even though native ESM is now widely supported, shipping unbundled ESM in production is still inefficient (even with HTTP/2) due to the additional network round trips caused by nested imports. To get the optimal loading performance in production, it is still better to bundle your code with tree-shaking, lazy-loading and common chunk splitting (for better caching).

Ensuring optimal output and behavioral consistency between the dev server and the production build isn't easy. This is why Vite ships with a pre-configured [build command](./build) that bakes in many [performance optimizations](./features#build-optimizations) out of the box.

## Why Not Bundle with esbuild?

While `esbuild` is blazing fast and is already a very capable bundler for libraries, some of the important features needed for bundling _applications_ are still work in progress - in particular code-splitting and CSS handling. For the time being, Rollup is more mature and flexible in these regards. That said, we won't rule out the possibility of using `esbuild` for production build when it stabilizes these features in the future.

## How is Vite Different from X?

You can check out the [Comparisons](./comparisons) section for more details on how Vite differs from other similar tools.
