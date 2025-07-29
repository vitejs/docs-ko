# 빌드 중 공유되는 플러그인 {#shared-plugins-during-build}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

[빌드 중 공유되는 플러그인](/guide/api-environment-plugins.md#shared-plugins-during-build)을 참고하세요.

Affected scope: `Vite Plugin Authors`

::: warning 기본값 변경
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
:::

## 배경 {#motivation}

개발 환경과 빌드 플러그인 파이프라인을 일치시키고자 합니다.

## 마이그레이션 가이드 {#migration-guide}

환경 간 플러그인을 공유하려면, 플러그인의 상태가 현재 환경에 따라 구분되어야 합니다. 먼저 아래는 이를 구분하지 않고 모든 환경에 대해 변환된 모듈 수를 카운트하는 플러그인입니다.

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

환경별 변환된 모듈 수를 카운트하려면 map 객체를 사용해야 합니다:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

이를 단순화하기 위해, Vite는 `perEnvironmentState` 헬퍼를 제공합니다:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```