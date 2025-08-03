# 플러그인을 위한 환경 API {#environment-api-for-plugins}

:::info Release Candidate
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
- [`this.environment` in Hooks](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` Plugin Hook](/changes/hotupdate-hook)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.




Vite 6 formalizes the concept of Environments. Until Vite 5, there were two implicit Environments (`client`, and optionally `ssr`). The new Environment API allows users and framework authors to create as many environments as needed to map the way their apps work in production. This new capability required a big internal refactoring, but a lot of effort has been placed on backward compatibility. The initial goal of Vite 6 is to move the ecosystem to the new major as smoothly as possible, delaying the adoption of the APIs until enough users have migrated and frameworks and plugin authors have validated the new design.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
이제 환경을 구성할 수 있게 되면서, 플러그인 내에서 환경 옵션과 인스턴스에 접근하는 방법이 통일되었습니다. 플러그인 훅에서는 `this.environment`로 환경에 접근할 수 있으며, `ssr` 불리언 값을 받던 API는 환경에 맞게 적절히 범위가 지정됩니다(예: `environment.moduleGraph.getModuleByUrl(url)`).


## 훅을 사용해 새로운 환경 등록하기 {#registering-new-environments-using-hooks}

플러그인은 `config` 훅에서 새로운 환경을 구성할 수 있습니다(예: [RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)를 위한 별도의 모듈 그래프 구성하기):

```ts
  config(config: UserConfig) {
    config.environments.rsc ??= {}
  }
```

빈 객체만으로도 환경을 등록할 수 있으며, 최상위 환경 설정에서 기본값을 가져옵니다(상속).

## 훅을 사용해 환경 구성하기 {#configuring-environment-using-hooks}

`config` 훅이 실행되는 동안에는 전체 환경 목록을 알 수 없으며, 환경은 최상위 환경 설정에서 가져와지는 기본값이나 `config.environments` 값을 통해 직접적으로 영향을 받을 수 있습니다.
플러그인은 `config` 훅으로 기본값을 설정할 수 있습니다. 또는, 이를 위한 `configEnvironment` 훅을 사용할 수도 있습니다. 이 훅은 각 환경에 대해, 기본값이 적용된 초기 설정과 함께 호출됩니다.

  configEnvironment(name: string, options: EnvironmentOptions) {
    if (name === 'rsc') {
      options.resolve.conditions = // ...
```

## `hotUpdate` 훅 {#the-hotupdate-hook}

- **타입:** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **참고:** [HMR API](./api-hmr)

`hotUpdate` 훅을 사용하면 플러그인이 특정 환경에 대해 HMR 업데이트 처리를 커스텀할 수 있습니다. 파일이 변경되면 `server.environments`의 순서에 따라 각 환경에 대해 순차적으로 HMR 알고리즘이 실행되므로, `hotUpdate` 훅은 여러 번 호출됩니다. 훅은 다음과 같은 시그니처를 가진 컨텍스트 객체를 받습니다:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

- `this.environment`는 현재 파일 업데이트가 처리되는 모듈 실행 환경입니다.

- `modules`는 해당 환경에서 변경된 파일의 영향을 받는 모듈 배열입니다. 하나의 파일이 여러 모듈에 매핑될 수 있기 때문에(예: Vue SFC) 배열로 제공됩니다.

- `read`는 파일 내용을 반환하는 비동기 읽기 함수입니다. 일부 시스템에서는 에디터가 파일 업데이트를 완료하기 전 파일 변경 콜백이 실행될 수 있습니다. 이 때 `fs.readFile`을 직접 호출하면 빈 내용이 반환될 수 있습니다. `read` 함수는 이를 정규화하고, 올바른 동작을 하도록 만듭니다.

훅은 다음과 같은 동작을 선택할 수 있습니다:

- 영향받는 모듈 목록을 필터링하고 범위를 좁혀 HMR을 더 정확하게 만듭니다.

- 빈 배열을 반환하고 전체 새로고침을 수행합니다:

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

    // 수동으로 모듈 무효화
    const invalidatedModules = new Set()
    for (const mod of modules) {
      this.environment.moduleGraph.invalidateModule(
        mod,
        invalidatedModules,
        timestamp,
        true
      )
    }
    this.environment.hot.send({ type: 'full-reload' })

- 빈 배열을 반환하고 클라이언트에 커스텀 이벤트를 보내 완전한 커스텀 HMR 처리를 수행합니다:

  ```js
  hotUpdate() {
    if (this.environment.name !== 'client')
      return

    this.environment.hot.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  클라이언트 코드는 [HMR API](./api-hmr)를 사용해 해당 핸들러를 등록해야 합니다(동일한 플러그인의 `transform` 훅에서 주입할 수 있음):

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // 커스텀 업데이트 수행
    })
The current Vite server API is not yet deprecated and is backward compatible with Vite 5.
  }
  ```

## 환경별 플러그인 {#per-environment-plugins}

플러그인은 `applyToEnvironment` 함수로 적용할 환경을 정의할 수 있습니다.

  return {
    buildStart() {
      // this.environment를 이용해
      // WeakMap<Environment,Data>로 환경별 상태 초기화
    },
    },
## Per-environment State in Plugins

Given that the same plugin instance is used for different environments, the plugin state needs to be keyed with `this.environment`. This is the same pattern the ecosystem has already been using to keep state about modules using the `ssr` boolean as key to avoid mixing client and ssr modules state. A `Map<Environment, State>` can be used to keep the state for each environment separately. Note that for backward compatibility, `buildStart` and `buildEnd` are only called for the client environment without the `perEnvironmentStartEndDuringDev: true` flag.
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

    applyToEnvironment(environment) {
      // 플러그인이 해당 환경에서 활성화되어야 한다면 true를 반환하거나,
      // 대체할 새로운 플러그인을 반환합니다.
      // 이 훅을 사용하지 않는다면 플러그인은 모든 환경에서 활성화됩니다
    },
    resolveId(id, importer) {
      // 플러그인이 적용되는 환경에서만 호출
    },
```

만약 플러그인이 환경을 인식하지 못하고 현재 환경에 대해 키가 지정되지 않은 상태를 가지는 경우(플러그인 상태가 환경별로 구분되지 않고 모든 환경이 같은 상태를 공유하는 경우 - 옮긴이), `applyToEnvironment` 훅을 사용하면 쉽게 환경별로 만들 수 있습니다.
```js
import { nonShareablePlugin } from 'non-shareable-plugin'
      applyToEnvironment(environment) {
        return nonShareablePlugin({ outputName: environment.name }) // 각 환경마다 독립된 플러그인 인스턴스를 생성 - 옮긴이
      },
    },
  ],
})
```

Vite는 다른 훅이 필요하지 않은 경우를 위해 `perEnvironmentPlugin` 헬퍼도 제공합니다:

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    perEnvironmentPlugin('per-environment-plugin', (environment) =>
      nonShareablePlugin({ outputName: environment.name }),
    ),
})
```

## 빌드 훅에서의 환경 {#environment-in-build-hooks}

개발 단계에서와 마찬가지로, 빌드 시에도 플러그인 훅은 `ssr` 불리언 값 대신 환경 인스턴스를 전달받습니다.
이는 `renderChunk`, `generateBundle` 등 빌드 전용 훅에서도 동일합니다.

## 빌드 단계 공유 플러그인 {#shared-plugins-during-build}

Vite 6 이전에는 플러그인 파이프라인이 개발과 빌드 단계에서 서로 다르게 동작했습니다:

- **개발 단계:** 플러그인이 모든 환경에서 공유됨
- **빌드 단계:** 각 환경마다 플러그인이 격리됨(클라이언트를 위한 `vite build` 명령 후, SSR을 위한 `vite build --ssr` 명령을 실행하기에, 별도 프로세스에서 빌드가 수행되어 플러그인도 환경별로 격리)

따라서 프레임워크는 `client` 빌드와 `ssr` 빌드 간 정보를 공유하기 위해 매니페스트 파일을 파일 시스템에 작성해 공유해야 했습니다. Vite 6에서는 모든 환경에 대한 빌드를 단일 프로세스에서 수행하므로, 플러그인 파이프라인과 환경 간 통신 시 개발 단계에서와 같이 메모리를 이용할 수 있게 되었습니다.
The `applyToEnvironment` hook is called at config time, currently after `configResolved` due to projects in the ecosystem modifying the plugins in it. Environment plugins resolution may be moved before `configResolved` in the future.



- **개발과 빌드 모두:** 플러그인이 공유되며, [환경별 필터링 됨](#per-environment-plugins)

또한 빌드 시에도 모든 환경이 단일 `ResolvedConfig` 인스턴스를 공유하기에, 개발 단계에서처럼 `WeakMap<ResolvedConfig, CachedData>`로 전체 앱 빌드 프로세스 수준에서 캐싱이 가능해집니다.

다만 Vite 6에서는 하위 호환성을 유지하기 위해 일부 설정이 필요합니다. 생태계 내 플러그인들이 현재 `environment.config.build` 대신 `config.build`를 사용해 설정에 접근하고 있으며, 이 때 기본적으로 환경별 새로운 `ResolvedConfig`가 생성됩니다. 플러그인 파이프라인이 환경 간 공유되도록 하기 위해, `builder.sharedConfigBuild`를 `true`로 설정할 수 있습니다.

참고로 이 옵션은 처음에는 일부 프로젝트에서만 동작할 것이기에, 플러그인 개발자는 플러그인 단위로 `sharedDuringBuild` 플래그를 `true`로 설정해 이를 환경 간 공유되도록 할 수 있습니다. 이를 통해 일반 플러그인에 대해서도 상태를 쉽게 공유할 수 있습니다:

```js
function myPlugin() {
  // 개발 및 빌드 단계에서 모든 환경 간 상태 공유
  const sharedState = ...
In a future major, we could have complete alignment:
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // 모든 환경에서 단일 인스턴스 사용
    sharedDuringBuild: true,
  }
}
```
    // run configResolved hooks
    await Promise.all(
      createPluginHookUtils(workerResolved.plugins)

    // Resolve environment plugins after configResolved because there are
    // downstream projects modifying the plugins in it. This may change
    // once the ecosystem is ready.
  // Resolve environment plugins after configResolved because there are
  // downstream projects modifying the plugins in it. This may change
  // once the ecosystem is ready.
  for (const name of Object.keys(resolved.environments)) {
    resolved.environments[name].plugins = await resolveEnvironmentPlugins(
      new PartialEnvironment(name, resolved),
    )
  }
