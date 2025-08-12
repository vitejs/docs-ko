# 빌드 중 공유되는 플러그인 {#shared-plugins-during-build}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

See [Shared plugins during build](/guide/api-environment-plugins.md#shared-plugins-during-build).

영향을 받는 범위: `Vite 플러그인 개발자`

::: warning 기본값 변경
`builder.sharedConfigBuild`는 `v6.0`에서 처음 도입되었습니다. 플러그인이 공유 설정에서 어떻게 동작하는지 확인하려면 이 값을 `true`로 설정해 주세요. 플러그인 생태계가 준비된다면 향후 메이저 버전에서 기본값을 변경하는 것에 대한 피드백을 받을 예정입니다.
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