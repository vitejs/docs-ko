# 퍼포먼스 {#performance}

Vite는 기본적으로 빠르지만, 프로젝트의 요구 사항이 커질수록 성능 문제가 발생할 수 있습니다. 이 가이드는 다음과 같은 일반적인 성능 문제를 식별하고 해결하는 데 도움을 줍니다:

- 느린 서버 시작
- 느린 페이지 로드
- 느린 빌드

## 브라우저 설정 확인하기 {#review-your-browser-setup}

일부 브라우저 확장 프로그램은 요청을 방해하고, 특히 브라우저 개발 도구를 사용할 때 대형 애플리케이션의 시작과 리로드 시간을 느리게 만들 수 있습니다. 이 경우 Vite 개발 서버를 사용하는 동안 확장 프로그램이 없는 개발 전용 프로필을 만들거나 시크릿 모드로 전환하는 것이 좋습니다. 시크릿 모드는 확장 프로그램이 없는 일반 프로필보다 빠를 수도 있습니다.

Vite 개발 서버는 사전 번들링으로 제공하는 디펜던시를 하드 캐싱하고, 소스 코드에 대해 빠르게 304 응답을 할 수 있도록 구현되었습니다. 따라서 브라우저 개발 도구가 열려 있는 동안 캐시를 비활성화되도록 설정하면, 시작 및 전체 페이지 리로드 시간에 큰 영향을 미칠 수 있습니다. Vite 서버로 작업하는 동안 "캐시 사용 안 함(Disable Cache)"이 비활성화되어 있는지 확인해 주세요.

## Vite 플러그인 검토 {#audit-configured-vite-plugins}

Vite의 내부 및 공식 플러그인은 가능한 최소한의 작업을 수행하면서도 더 넓은 생태계와의 호환성을 제공하도록 최적화되어 있습니다. 예를 들어, 코드 변환은 개발 단계에서 정규식을 사용하나, 빌드 단계에서는 구문 분석을 전체적으로 수행하여 정확성을 보장합니다.

그러나 커뮤니티 플러그인의 성능은 Vite가 통제할 수 없으며 이로 인해 개발자 경험에 영향을 줄 수 있습니다. 아래는 추가적인 Vite 플러그인을 사용할 때 주의해야 할 몇 가지 사항입니다:

1. 특정 상황에서만 사용되는 대형 종속성은 Node.js 시작 시간을 줄이기 위해 동적으로 임포트되어야 합니다. 예시: [vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) 및 [vite-plugin-pwa#224](https://github.com/vite-pwa/vite-plugin-pwa/pull/244).

2. `buildStart`, `config`, `configResolved` 훅은 길고 복잡한 작업을 수행해서는 안 됩니다. 이 훅들은 개발 서버가 시작되는 동안 기다려야 하므로, 브라우저에서 사이트에 접근할 수 있는 시간이 지연됩니다.

3. `resolveId`, `load`, `transform` 훅으로 인해 일부 파일이 다른 파일보다 느리게 로드될 수 있습니다. 불가피한 경우도 있지만, 그럼에도 최적화할 수 있는 부분이 있는지 확인하는 것이 좋습니다. 예를 들어, 전체 변환 작업을 수행하기 전에 `code`에 특정 키워드가 포함되어 있는지, 또는 `id`가 특정 확장자와 일치하는지 확인할 수 있습니다.

   파일을 변환하는 데 걸리는 시간이 길어질수록, 브라우저에서 사이트를 로드할 때의 요청 워터폴(순차적으로 요청을 수행하는 것 - 옮긴이)을 더 심각하게 만듭니다.

   `DEBUG="vite:plugin-transform" vite` 또는 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)를 활용해 파일 변환에 걸리는 시간을 확인할 수 있습니다. 비동기 작업은 정확하지 않은 시간을 제공하는 경향이 있기에 이 수치는 대략적인 추정치로 취급해야 하지만, 그래도 더 많은 비용이 드는 연산을 확인할 수 있습니다. Windows 플랫폼에서 환경 변수를 설정하는 방법은 [문서](https://github.com/debug-js/debug?tab=readme-ov-file#windows-command-prompt-notes)를 참고해 주세요.

::: tip 프로파일링
`vite --profile`을 실행하면, 사이트에 접속 후 터미널에서 `p + enter`를 눌러 `.cpuprofile`을 녹화할 수 있습니다. 이후 [speedscope](https://www.speedscope.app)와 같은 도구를 사용해 녹화된 프로파일을 검사하고 병목 지점을 식별할 수 있습니다. [프로파일을 공유해](https://chat.vitejs.dev) Vite 팀이 성능 문제를 식별하는 데 도움을 줄 수도 있습니다.
:::

## 식별 작업 줄이기 {#reduce-resolve-operations}

임포트 경로를 식별하는 것은 최악의 경우 많은 비용이 드는 작업이 될 수 있습니다. Vite가 임포트 경로를 "추측"하는 데 사용하는 [`resolve.extensions`](/config/shared-options.md#resolve-extensions) 옵션을 예로 들 수 있는데, 참고로 이 옵션은 기본적으로 `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`로 설정되어 있습니다.

이 상황에서 `import './Component'`로 `./Component.jsx`를 임포트하는 경우, Vite는 다음과 같은 단계를 거쳐 파일을 식별합니다:

1. `./Component`가 존재하는지 확인, 없음
2. `./Component.mjs`가 존재하는지 확인, 없음
3. `./Component.js`가 존재하는지 확인, 없음
4. `./Component.mts`가 존재하는지 확인, 없음
5. `./Component.ts`가 존재하는지 확인, 없음
6. `./Component.jsx`가 존재하는지 확인, 있음!

이같이 임포트 경로를 식별하기 위해 총 6번의 파일 시스템 작업이 필요합니다. 즉, 암시적인 임포트가 많아질수록 경로를 식별하는 데 더 많은 시간이 필요하게 됩니다.

따라서 `import './Component.jsx'`와 같이 임포트 경로를 명시적으로 지정하는 것이 일반적으로 더 좋습니다. `resolve.extensions`의 목록을 좁혀 전반적인 파일 시스템 작업을 줄일 수도 있지만, 이 경우 `node_modules` 내의 파일에 대해서도 잘 수행되는지 확인해야 합니다.

플러그인 개발자라면 위의 검사 횟수를 줄이기 위해서 필요할 때만 [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve)를 호출하는지 확인하세요.

::: tip TypeScript
TypeScript를 사용한다면, `tsconfig.json`의 `compilerOptions`에 `"moduleResolution": "bundler"`와 `"allowImportingTsExtensions": true`를 추가해 `.ts`와 `.tsx` 확장자를 코드에서 바로 사용할 수 있습니다.
:::

## 배럴 파일 피하기 {#avoid-barrel-files}

배럴 파일은 같은 디렉터리에 있는 다른 파일의 API를 다시 내보내는 파일입니다. 예를 들어 다음과 같습니다:

```js
// src/utils/index.js
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

배럴 파일에 있는 모든 파일이 임포트되고 변환되어야 하므로, `import { slash } from './utils'`와 같이 개별 API만 임포트하는 경우에도 해당 배럴 파일의 모든 파일이 가져와지고 변환되며, 이 중에는 `slash` API와 초기화 시 실행되는 사이드 이펙트가 포함될 수도 있습니다. 이는 초기 페이지 로드 시 필요한 것보다 더 많은 파일을 로드하게 되어 결과적으로 페이지 로드가 느려지게 됩니다.

가능하다면, `import { slash } from './utils/slash.js'`와 같이 배럴 파일을 피하고 개별 API를 직접 임포트해야 합니다. 더 자세한 내용은 [#8237 이슈](https://github.com/vitejs/vite/issues/8237)를 참고해 주세요.

## 자주 사용되는 파일 워밍업 {#warm-up-frequently-used-files}

Vite 개발 서버는 브라우저에서 요청한 파일만 변환하기 때문에, 빠르게 시작할 수 있고 사용하고자 하는 파일에만 변환을 적용할 수 있습니다. 또한 특정 파일이 곧 요청될 것으로 예상되면 미리 변환할 수도 있습니다. 그러나 일부 파일이 다른 파일보다 변환하는 데 더 오래 걸릴 경우 요청 워터폴이 발생할 수 있습니다. 예를 들어 다음과 같습니다:

아래는 왼쪽 파일이 오른쪽 파일을 임포트하는 모듈 그래프입니다:

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

파일의 임포트 관계는 변환된 후에만 알 수 있습니다. 따라서 만약 `BigComponent.vue` 파일 변환에 시간이 걸린다면, `big-utils.js`는 그만큼 기다릴 수밖에 없고, 이후의 파일들도 마찬가지입니다. 이러한 내부적인 워터폴은 곧 요청될 것으로 예상되는 파일을 미리 변환하는 것만으로는 막기 어렵습니다.

이를 위해 Vite는 [`server.warmup`](/config/server-options.md#server-warmup) 옵션을 통해 `big-utils.js`와 같이 자주 사용되는 파일을 워밍업할 수 있도록 제공하고 있습니다. 이렇게 하면 `big-utils.js`는 요청 즉시 제공할 수 있도록 준비되고 캐시됩니다.

`DEBUG="vite:transform" vite`를 실행해 나오는 로그를 통해 자주 사용되는 파일을 찾을 수도 있습니다:

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

참고로 Vite 개발 서버를 시작할 때 과부하가 걸리지 않도록 자주 사용되는 파일만 워밍업해야 합니다. 자세한 내용은 [`server.warmup`](/config/server-options.md#server-warmup) 옵션을 확인해 주세요.

[`--open` 또는 `server.open`](/config/server-options.html#server-open)을 사용하면 Vite가 앱의 진입점이나 제공된 URL을 자동으로 워밍업하기 때문에 성능을 향상시킬 수 있습니다.

## 작업량을 줄이거나 네이티브 툴링 사용하기 {#use-lesser-or-native-tooling}

코드베이스가 커져도 Vite를 빠르게 유지하는 방법은 소스 파일(JS/TS/CSS)의 작업량을 줄이는 것입니다.

이에 대한 예시는 다음과 같습니다:

- 가능하다면 Sass/Less/Stylus 대신 CSS를 사용하세요. 중첩된 스타일은 PostCSS에서 처리할 수 있습니다.
- SVG를 UI 프레임워크 컴포넌트(React, Vue 등)로 변환하지 마세요. 대신 문자열이나 URL로 임포트하세요.
- `@vitejs/plugin-react`를 사용하는 경우, 빌드 중 변환을 수행하지 않기 위해 Babel 옵션을 구성하지 마세요. 이 경우 esbuild만 사용됩니다.

네이티브 툴링을 사용하는 예시:

네이티브 툴링을 사용하면 설치 시 크기가 커지는 경우가 많으므로 새로운 Vite 프로젝트를 시작할 때는 기본적으로 사용되지 않습니다. 그러나 대규모 애플리케이션의 경우에는 그 비용을 감당할 가치가 있을 수 있습니다.

- 실험적으로 도입된 [LightningCSS](https://github.com/vitejs/vite/discussions/13835)를 사용해 보세요.
- `@vitejs/plugin-react` 대신 [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc)를 사용하세요.