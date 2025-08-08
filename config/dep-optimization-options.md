# 디펜던시 최적화 옵션 {#dep-optimization-options}

- **관련 항목:** [사전 번들링된 디펜던시](/guide/dep-pre-bundling)

별도로 명시되지 않은 한, 이 섹션의 옵션들은 개발 환경에서만 사용되는 디펜던시 최적화 도구에만 적용됩니다.

## optimizeDeps.entries <NonInheritBadge />

- **타입:** `string | string[]`

기본적으로 Vite는 모든 `.html` 파일을 크롤링해 사전 번들링이 필요한 디펜던시를 탐지합니다(`node_modules`, `build.outDir`, `__tests__` 및 `coverage` 디렉터리는 무시). 만약 `build.rollupOptions.input`이 지정된 경우 Vite가 대신 해당 진입점을 탐색합니다.

이 방식들이 맞지 않는다면 이 옵션을 사용해 커스텀 진입점을 지정할 수 있습니다. 값은 [`tinyglobby` 패턴](https://github.com/SuperchupuDev/tinyglobby) 또는 패턴 배열이어야 하며, 이는 Vite 프로젝트 루트를 기준으로 합니다. 이는 기본 진입점 추론 방식을 덮어쓰게 됩니다. `optimizeDeps.entries`가 명시적으로 정의된 경우 기본적으로 `node_modules`와 `build.outDir` 폴더만 무시됩니다. 다른 폴더들을 무시해야 하는 경우에는 진입점 목록의 일부로 `!`로 시작하는 무시 패턴을 사용할 수 있습니다. `node_modules` 문자열을 명시적으로 포함하는 패턴의 경우 `node_modules`는 무시되지 않습니다.

## optimizeDeps.exclude <NonInheritBadge />

- **타입:** `string[]`

사전 번들링에서 제외할 디펜던시 목록입니다.

:::warning CommonJS
CommonJS 디펜던시는 최적화에서 제외돼서는 안 됩니다. ESM 디펜던시가 최적화에서 제외되었지만 이와 중첩된(Nested) CommonJS 디펜던시가 있는 경우, CommonJS 디펜던시를 `optimizeDeps.include`에 추가해줘야 합니다:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## optimizeDeps.include <NonInheritBadge />

- **타입:** `string[]`

기본적으로 `node_modules` 내부에 없는 연결된 패키지들은 미리 번들로 제공되지 않습니다. 이 옵션을 사용하여 연결된 패키지를 미리 번들로 묶을 수 있습니다.

많은 수의 라이브러리를 디렉터리 깊은 곳에서까지 가져와야 하는 경우, 끝에 Glob 패턴을 지정해 모든 라이브러리를 한 번에 사전 번들로 묶을 수 있습니다. 이렇게 하면 유사한 라이브러리를 가져올 때마다 반복적으로 사전 번들링을 수행하는 것을 피할 수 있습니다. [이에 대한 피드백은 여기에 남겨주세요](https://github.com/vitejs/vite/discussions/15833). 예를 들어 다음과 같이 사용할 수 있습니다:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions <NonInheritBadge />

- **타입:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#general-options)`,
| 'bundle'
| 'entryPoints'
| 'external'
| 'write'
| 'watch'
| 'outdir'
| 'outfile'
| 'outbase'
| 'outExtension'
| 'metafile'>`

디펜던시 스캐닝 및 최적화 중 Esbuild에 전달할 옵션입니다.

특정 옵션은 Vite의 디펜던시 최적화와 호환되지 않기에 생략되었습니다.

- `external`은 생략됩니다. 이 대신 Vite의 `optimizeDeps.exclude` 옵션을 사용합니다.
- `plugins`는 Vite의 디펜던시 플러그인과 병합됩니다.

## optimizeDeps.force <NonInheritBadge />

- **타입:** `boolean`

`true`로 설정하면 최적화되어 캐시된 디펜던시들을 무시하고, 디펜던시 사전 번들링을 강제로 실행합니다.

## optimizeDeps.noDiscovery <NonInheritBadge />

- **타입:** `boolean`
- **기본값:** `false`

`true`로 설정하면 자동 디펜던시 탐색이 비활성화되고 `optimizeDeps.include`에 나열된 디펜던시만 최적화됩니다. CJS 전용 디펜던시는 개발 중에 반드시 `optimizeDeps.include`에 포함되어야 합니다.

## optimizeDeps.holdUntilCrawlEnd <NonInheritBadge />

- **실험적 기능**: [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/15834)
- **타입:** `boolean`
- **기본값:** `true`

이 옵션이 활성화되어 있으면 콜드 스타트 시 모든 정적 에셋이 크롤링될 때까지 디펜던시 최적화가 완료되지 않습니다. 이는 크롤링 도중 새로운 디펜던시가 발견되어 공통 청크를 다시 만들어야 하는 경우 전체 페이지를 다시 로드해야 하는 상황을 피할 수 있습니다(자세한 설명은 [이 코멘트](https://github.com/vitejs/vite/pull/8869#issuecomment-1172902125)를 참고해 주세요. - 옮긴이). 만약 디펜던시 스캐너로 `include`에 정의된 목록을 포함해 모든 디펜던시를 찾을 수 있다면, 브라우저가 병렬로 더 많은 요청을 처리할 수 있도록 이 옵션을 비활성화하는 것이 좋습니다.

## optimizeDeps.disabled <NonInheritBadge />

- **지원 중단 예정**
- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13839)
- **타입:** `boolean | 'build' | 'dev'`
- **기본값:** `'build'`

이 옵션은 더 이상 사용되지 않습니다. Vite 5.1부터 빌드 중 수행되는 디펜던시 사전 번들링이 제거되었습니다. `optimizeDeps.disabled`를 `true` 또는 `'dev'`로 설정하면 최적화가 비활성화되고, `false` 또는 `'build'`로 설정하면 개발 모드에서 최적화가 활성화됩니다.

최적화를 완전히 비활성화하려면, `optimizeDeps.noDiscovery: true`를 사용해 디펜던시 자동 탐색을 허용하지 않고, `optimizeDeps.include`를 정의하지 않거나 비워두세요.

:::warning
빌드 중 디펜던시를 최적화하는 것은 **실험적** 기능이었습니다. 이 전략을 시도하는 프로젝트는 `build.commonjsOptions: { include: [] }`를 사용해 `@rollup/plugin-commonjs`를 제거해야 합니다. 이렇게 했다면 번들링 중 CJS 패키지를 지원하기 위해 다시 활성화하도록 안내하는 경고가 표시됩니다.
:::

## optimizeDeps.needsInterop <NonInheritBadge />

- **실험적 기능**
- **타입:** `string[]`

명시된 디펜던시를 가져올 때 ESM 상호 운용을 강제합니다. Vite는 디펜던시가 상호 운용 필요한지를 정확하게 감지할 수 있기 때문에 이 옵션은 일반적으로 필요하지 않습니다. 그러나 디펜던시들의 다양한 조합에 따라 이들 중 일부는 사전 번들링이 다르게 적용될 수 있습니다. 이 패키지들을 `needsInterop`에 추가하면 전체 페이지에 대한 리로드를 피하고 콜드 스타트를 가속할 수 있습니다. 만약 사용하는 디펜던시가 이 상황에 해당한다면, 설정 파일에 이 패키지 이름을 추가하라는 경고가 표시됩니다.