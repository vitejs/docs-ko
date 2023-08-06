# 디펜던시 최적화 옵션 {#dep-optimization-options}

- **관련 항목:** [사전 번들링된 디펜던시](/guide/dep-pre-bundling)

## optimizeDeps.entries {#optimizedeps-entries}

- **타입:** `string | string[]`

기본적으로 Vite는 모든 `.html` 파일을 크롤링해 사전 번들링이 필요한 디펜던시를 탐지합니다(`node_modules`, `build.outDir`, `__tests__` 및 `coverage` 디렉터리는 무시). 만약 `build.rollupOptions.input`이 지정된 경우 Vite가 대신 해당 진입점을 탐색합니다.

둘 다 필요에 맞지 않는다면 이 옵션을 사용해 진입점을 지정할 수도 있습니다. 이 값은 [fast-glob 패턴](https://github.com/mrmlnc/fast-glob#basic-syntax) 또는 Vite 프로젝트 루트를 기준으로 상대 경로 패턴의 배열 값이 될 수 있습니다. 참고로 이렇게 값을 지정하게 되면 기존의 진입점 추론 방식을 덮어쓰게 됩니다. `optimizeDeps.entries`가 명시적으로 정의된 경우에는 기본적으로 `node_modules` 및 `build.outDir` 폴더만 무시됩니다. 다른 폴더를 추가로 무시하고자 하는 경우에는 진입점 리스트 요소에 `!` 로 시작하는 무시 패턴을 사용할 수 있습니다.

## optimizeDeps.exclude {#optimizedeps-exclude}

- **타입:** `string[]`

사전 번들링에서 제외할 디펜던시 목록입니다.

:::warning CommonJS
CommonJS 디펜던시는 최적화에서 제외돼서는 안 됩니다. ESM 디펜던시가 최적화에서 제외되었지만 이와 중첩된(Nested) CommonJS 디펜던시가 있는 경우, CommonJS 디펜던시를 `optimizeDeps.include`에 추가해줘야 합니다:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## optimizeDeps.include {#optimizedeps-include}

- **타입:** `string[]`

기본적으로 `node_modules` 내부에 없는 연결된 패키지들은 미리 번들로 제공되지 않습니다. 이 옵션을 사용하여 연결된 패키지를 미리 번들로 묶을 수 있습니다.

많은 수의 라이브러리를 디렉터리 깊은 곳에서까지 가져와야 하는 경우, 끝에 Glob 패턴을 지정해 모든 라이브러리를 한 번에 사전 번들로 묶을 수 있습니다. 이렇게 하면 유사한 라이브러리를 가져올 때마다 반복적으로 사전 번들링을 수행하는 것을 피할 수 있습니다. 예를 들어 다음과 같이 사용할 수 있습니다:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions {#optimizedeps-esbuildoptions}

- **타입:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

디펜던시 스캐닝 및 최적화 중 Esbuild에 전달할 옵션입니다.

특정 옵션은 Vite의 디펜던시 최적화와 호환되지 않기에 생략되었습니다.

- `external`은 생략됩니다. 이 대신 Vite의 `optimizeDeps.exclude` 옵션을 사용합니다.
- `plugins`는 Vite의 디펜던시 플러그인과 병합됩니다.

## optimizeDeps.force {#optimizedeps-force}

- **타입:** `boolean`

`true`로 설정하면 최적화되어 캐시된 디펜던시들을 무시하고, 디펜던시 사전 번들링을 강제로 실행합니다.

## optimizeDeps.disabled {#optimizedeps-disabled}

- **실험적 기능:** [이 곳에 피드백을 남겨주세요](https://github.com/vitejs/vite/discussions/13839)
- **타입:** `boolean | 'build' | 'dev'`
- **기본값:** `'build'`

디펜던시 최적화를 비활성화합니다. `true`로 설정하면 빌드 및 개발 모드에서 최적화가 비활성화됩니다. `'build'` 또는 `'dev'`를 전달하여 빌드 또는 개발 중에만 비활성화할 수도 있습니다. 디펜던시 최적화는 기본적으로 개발 모드에서만 활성화됩니다.

:::warning
빌드 모드에서 디펜던시 최적화는 **실험적**입니다. 활성화하면 개발 모드와 프로덕션 모드 사이의 가장 중요한 차이점 중 하나가 사라지게 됩니다. 이 경우 esbuild가 CJS 전용 디펜던시를 ESM으로 변환하기 때문에 [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs)가 더 이상 필요하지 않습니다.

만약 빌드 시에도 이 전략을 사용하고 싶다면 `optimizeDeps.disabled: false`로 설정해주세요. `@rollup/plugin-commonjs`는 `build.commonjsOptions: { include: [] }`를 전달함으로써 제거할 수 있습니다.
:::

## optimizeDeps.needsInterop {#optimizedeps-needsinterop}

- **실험적 기능**
- **타입:** `string[]`

명시된 디펜던시를 가져올 때 ESM 상호 운용을 강제합니다. Vite는 디펜던시가 상호 운용 필요한지를 정확하게 감지할 수 있기 때문에 이 옵션은 일반적으로 필요하지 않습니다. 그러나 디펜던시들의 다양한 조합에 따라 이들 중 일부는 사전 번들링이 다르게 적용될 수 있습니다. 이 패키지들을 `needsInterop`에 추가하면 전체 페이지에 대한 리로드를 피하고 콜드 스타트를 가속할 수 있습니다. 만약 사용하는 디펜던시가 이 상황에 해당한다면, 설정 파일에 이 패키지 이름을 추가하라는 경고가 표시됩니다.