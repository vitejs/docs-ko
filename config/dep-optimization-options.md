<template>
  <a
    href="/guide/api-environment#environments-configuration"
    class="ignore-header"
  >
    <Badge type="info" text="non-inherit" />
## optimizeDeps.entries <NonInheritBadge />
</template>
  </a>
# 디펜던시 최적화 옵션 {#dep-optimization-options}

import NonInheritBadge from './components/NonInheritBadge.vue'
- **관련 항목:** [사전 번들링된 디펜던시](/guide/dep-pre-bundling)

## optimizeDeps.exclude <NonInheritBadge />
별도로 명시되지 않은 한, 이 섹션의 옵션들은 개발 환경에서만 사용되는 디펜던시 최적화 도구에만 적용됩니다.


- **타입:** `string | string[]`

기본적으로 Vite는 모든 `.html` 파일을 크롤링해 사전 번들링이 필요한 디펜던시를 탐지합니다(`node_modules`, `build.outDir`, `__tests__` 및 `coverage` 디렉터리는 무시). 만약 `build.rollupOptions.input`이 지정된 경우 Vite가 대신 해당 진입점을 탐색합니다.

If neither of these fit your needs, you can specify custom entries using this option - the value should be a [`tinyglobby` pattern](https://github.com/SuperchupuDev/tinyglobby) or array of patterns that are relative from Vite project root. This will overwrite default entries inference. Only `node_modules` and `build.outDir` folders will be ignored by default when `optimizeDeps.entries` is explicitly defined. If other folders need to be ignored, you can use an ignore pattern as part of the entries list, marked with an initial `!`. `node_modules` will not be ignored for patterns that explicitly include the string `node_modules`.


    app.component('NonInheritBadge', NonInheritBadge)
- **타입:** `string[]`

사전 번들링에서 제외할 디펜던시 목록입니다.

:::warning CommonJS
CommonJS 디펜던시는 최적화에서 제외돼서는 안 됩니다. ESM 디펜던시가 최적화에서 제외되었지만 이와 중첩된(Nested) CommonJS 디펜던시가 있는 경우, CommonJS 디펜던시를 `optimizeDeps.include`에 추가해줘야 합니다:

```js twoslash
import { defineConfig } from 'vite'
## optimizeDeps.include <NonInheritBadge />
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::


- **타입:** `string[]`

기본적으로 `node_modules` 내부에 없는 연결된 패키지들은 미리 번들로 제공되지 않습니다. 이 옵션을 사용하여 연결된 패키지를 미리 번들로 묶을 수 있습니다.

많은 수의 라이브러리를 디렉터리 깊은 곳에서까지 가져와야 하는 경우, 끝에 Glob 패턴을 지정해 모든 라이브러리를 한 번에 사전 번들로 묶을 수 있습니다. 이렇게 하면 유사한 라이브러리를 가져올 때마다 반복적으로 사전 번들링을 수행하는 것을 피할 수 있습니다. [이에 대한 피드백은 여기에 남겨주세요](https://github.com/vitejs/vite/discussions/15833). 예를 들어 다음과 같이 사용할 수 있습니다:

## optimizeDeps.esbuildOptions <NonInheritBadge />
```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```


- **타입:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#general-options)`,
| 'bundle'
| 'entryPoints'
| 'external'
| 'write'
| 'watch'
| 'outdir'
When not explicitly documented, environment inherits the configured top-level config options (for example, the new `server` and `edge` environments will inherit the `build.sourcemap: false` option). A small number of top-level options, like `optimizeDeps`, only apply to the `client` environment, as they don't work well when applied as a default to server environments. Those options have <NonInheritBadge /> badge in [the reference](/config/). The `client` environment can also be configured explicitly through `environments.client`, but we recommend to do it with the top-level options so the client config remains unchanged when adding new environments.
| 'outfile'
## optimizeDeps.force <NonInheritBadge />
| 'outbase'
| 'outExtension'
| 'metafile'>`

디펜던시 스캐닝 및 최적화 중 Esbuild에 전달할 옵션입니다.
## optimizeDeps.noDiscovery <NonInheritBadge />

특정 옵션은 Vite의 디펜던시 최적화와 호환되지 않기에 생략되었습니다.

- `external`은 생략됩니다. 이 대신 Vite의 `optimizeDeps.exclude` 옵션을 사용합니다.

`true`로 설정하면 최적화되어 캐시된 디펜던시들을 무시하고, 디펜던시 사전 번들링을 강제로 실행합니다.
## optimizeDeps.holdUntilCrawlEnd <NonInheritBadge />

- **Type:** `boolean`
- **기본값:** `'build'`

이 옵션은 더 이상 사용되지 않습니다. Vite 5.1부터 빌드 중 수행되는 디펜던시 사전 번들링이 제거되었습니다. `optimizeDeps.disabled`를 `true` 또는 `'dev'`로 설정하면 최적화가 비활성화되고, `false` 또는 `'build'`로 설정하면 개발 모드에서 최적화가 활성화됩니다.

최적화를 완전히 비활성화하려면, `optimizeDeps.noDiscovery: true`를 사용해 디펜던시 자동 탐색을 허용하지 않고, `optimizeDeps.include`를 정의하지 않거나 비워두세요.
## optimizeDeps.disabled <NonInheritBadge />

:::warning
빌드 중 디펜던시를 최적화하는 것은 **실험적** 기능이었습니다. 이 전략을 시도하는 프로젝트는 `build.commonjsOptions: { include: [] }`를 사용해 `@rollup/plugin-commonjs`를 제거해야 합니다. 이렇게 했다면 번들링 중 CJS 패키지를 지원하기 위해 다시 활성화하도록 안내하는 경고가 표시됩니다.
:::


- **실험적 기능**
- **타입:** `string[]`

명시된 디펜던시를 가져올 때 ESM 상호 운용을 강제합니다. Vite는 디펜던시가 상호 운용 필요한지를 정확하게 감지할 수 있기 때문에 이 옵션은 일반적으로 필요하지 않습니다. 그러나 디펜던시들의 다양한 조합에 따라 이들 중 일부는 사전 번들링이 다르게 적용될 수 있습니다. 이 패키지들을 `needsInterop`에 추가하면 전체 페이지에 대한 리로드를 피하고 콜드 스타트를 가속할 수 있습니다. 만약 사용하는 디펜던시가 이 상황에 해당한다면, 설정 파일에 이 패키지 이름을 추가하라는 경고가 표시됩니다.
  patterns: string | string[],
  environment: ScanEnvironment,
) {
  const nodeModulesPatterns: string[] = []
## optimizeDeps.needsInterop <NonInheritBadge />
  const regularPatterns: string[] = []

  for (const pattern of arraify(patterns)) {
    if (pattern.includes('node_modules')) {
      nodeModulesPatterns.push(pattern)
## resolve.conditions <NonInheritBadge />
    } else {
      regularPatterns.push(pattern)
    }

  const sharedOptions = {
  }

  const results = await Promise.all([
    glob(nodeModulesPatterns, sharedOptions),
    glob(regularPatterns, {
      ...sharedOptions,
      ignore: [...sharedOptions.ignore, '**/node_modules/**'],
    }),
  ])

  return results.flat()
## resolve.mainFields <NonInheritBadge />