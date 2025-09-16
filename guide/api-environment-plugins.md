# 플러그인을 위한 환경 API {#environment-api-for-plugins}

:::info 릴리즈 후보
환경 API는 현재 릴리즈 후보 단계에 있습니다. 생태계가 실험하고 이를 기반으로 구축할 수 있도록 주요 릴리즈 간 API의 안정성을 유지할 계획입니다. 다만 [일부 특정 API](/changes/#considering)는 여전히 실험적인 기능으로 간주됩니다.

다운스트림 프로젝트들이 새로운 기능을 실험하고 검증할 시간을 가진 후, 향후 메이저 릴리즈에서 (잠재적인 주요 변경 사항과 함께) 이러한 새로운 API를 안정화할 계획입니다.

리소스:

- [피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 새로운 API에 대한 피드백을 모으고 있습니다.
- [환경 API PR](https://github.com/vitejs/vite/pull/16471)에서 새로운 API를 구현하고 검토했습니다.

여러분의 피드백을 공유해주세요.
:::

## 훅에서 현재 환경에 접근하기 {#accessing-the-current-environment-in-hooks}

Vite 6 이전에는 두 가지 환경(`client`와 `ssr`)만 있었기에, Vite API에서 현재 환경을 식별하기 위해서는 `ssr` 불리언 값이면 충분했습니다. 플러그인 훅은 마지막 옵션 매개변수로 `ssr` 불리언 값을 받았고, 여러 API에서도 모듈을 올바른 환경과 연결하기 위해 마지막 매개변수로 `ssr` 값을 옵션으로 받았습니다(예: `server.moduleGraph.getModuleByUrl(url, { ssr })`).

이제 환경을 구성할 수 있게 되면서, 플러그인 내에서 환경 옵션과 인스턴스에 접근하는 방법이 통일되었습니다. 플러그인 훅에서는 `this.environment`로 환경에 접근할 수 있으며, `ssr` 불리언 값을 받던 API는 환경에 맞게 적절히 범위가 지정됩니다(예: `environment.moduleGraph.getModuleByUrl(url)`).

Vite 서버는 모든 환경이 공유하는 하나의 플러그인 파이프라인을 가지고 있습니다. 하지만 모듈을 처리할 때는 항상 특정 환경에 속하게 되며, 플러그인은 이 환경에 대한 정보를 `environment` 인스턴스를 통해 접근할 수 있습니다.

그리고 플러그인은 `environment` 인스턴스를 사용해 환경에 대한 설정(`environment.config`로 접근)에 따라 모듈 처리 방식을 변경할 수 있습니다.

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

## 훅을 사용해 새로운 환경 등록하기 {#registering-new-environments-using-hooks}

Plugins can add new environments in the `config` hook. For example, [RSC support](/plugins/#vitejs-plugin-rsc) uses an additional environment to have a separate module graph with the `react-server` condition:

```ts
  config(config: UserConfig) {
    return {
      environments: {
        rsc: {
          resolve: {
            conditions: ['react-server', ...defaultServerConditions],
          },
        },
      },
    }
  }
```

빈 객체만으로도 환경을 등록할 수 있으며, 최상위 환경 설정에서 기본값을 가져옵니다(상속).

## 훅을 사용해 환경 구성하기 {#configuring-environment-using-hooks}

`config` 훅이 실행되는 동안에는 전체 환경 목록을 알 수 없으며, 환경은 최상위 환경 설정에서 가져와지는 기본값이나 `config.environments` 값을 통해 직접적으로 영향을 받을 수 있습니다.
플러그인은 `config` 훅으로 기본값을 설정할 수 있습니다. 또는, 이를 위한 `configEnvironment` 훅을 사용할 수도 있습니다. 이 훅은 각 환경에 대해, 기본값이 적용된 초기 설정과 함께 호출됩니다.

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    // add "workerd" condition to the rsc environment
    if (name === 'rsc') {
      return {
        resolve: {
          conditions: ['workerd'],
        },
      }
    }
  }
```

## `hotUpdate` 훅 {#the-hotupdate-hook}

- **타입:** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **Kind:** `async`, `sequential`
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
    return []
  }
  ```

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
  }
  ```

## 플러그인에서의 환경별 상태 관리 {#per-environment-state-in-plugins}

동일한 플러그인 인스턴스가 여러 환경에서 사용되기 때문에, 플러그인 상태는 `this.environment`를 키로 사용해야 합니다. 이는 생태계에서 이미 클라이언트와 SSR 모듈 상태가 섞이지 않도록 `ssr` 불리언 값을 키로 사용해 모듈 상태를 유지하는 패턴과 동일합니다. `Map<Environment, State>`를 사용하여 각 환경의 상태를 별도로 유지할 수 있습니다. 하위 호환성을 위해 `perEnvironmentStartEndDuringDev: true` 플래그 없이는 `buildStart`와 `buildEnd`가 클라이언트 환경에서만 호출됩니다.

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

## 환경별 플러그인 {#per-environment-plugins}

플러그인은 `applyToEnvironment` 함수로 적용할 환경을 정의할 수 있습니다.

```js
const UnoCssPlugin = () => {
  // 공유 전역 상태
  return {
    buildStart() {
      // this.environment를 이용해
      // WeakMap<Environment,Data>로 환경별 상태 초기화
    },
    configureServer() {
      // 전역 훅은 평소처럼 사용
    },
    applyToEnvironment(environment) {
      // 플러그인이 해당 환경에서 활성화되어야 한다면 true를 반환하거나,
      // 대체할 새로운 플러그인을 반환합니다.
      // 이 훅을 사용하지 않는다면 플러그인은 모든 환경에서 활성화됩니다
    },
    resolveId(id, importer) {
      // 플러그인이 적용되는 환경에서만 호출
    },
  }
}
```

만약 플러그인이 환경을 인식하지 못하고 현재 환경에 대해 키가 지정되지 않은 상태를 가지는 경우(플러그인 상태가 환경별로 구분되지 않고 모든 환경이 같은 상태를 공유하는 경우 - 옮긴이), `applyToEnvironment` 훅을 사용하면 쉽게 환경별로 만들 수 있습니다.

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    {
      name: 'per-environment-plugin',
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
  ],
})
```

`applyToEnvironment` 훅은 설정 시점에 호출되며, 현재는 생태계의 프로젝트들이 플러그인을 수정하기 때문에 `configResolved` 이후에 호출됩니다. 환경 플러그인 해석은 향후 `configResolved` 이전으로 이동될 수 있습니다.

## 빌드 훅에서의 환경 {#environment-in-build-hooks}

개발 단계에서와 마찬가지로, 빌드 시에도 플러그인 훅은 `ssr` 불리언 값 대신 환경 인스턴스를 전달받습니다.
이는 `renderChunk`, `generateBundle` 등 빌드 전용 훅에서도 동일합니다.

## 빌드 단계 공유 플러그인 {#shared-plugins-during-build}

Vite 6 이전에는 플러그인 파이프라인이 개발과 빌드 단계에서 서로 다르게 동작했습니다:

- **개발 단계:** 플러그인이 모든 환경에서 공유됨
- **빌드 단계:** 각 환경마다 플러그인이 격리됨(클라이언트를 위한 `vite build` 명령 후, SSR을 위한 `vite build --ssr` 명령을 실행하기에, 별도 프로세스에서 빌드가 수행되어 플러그인도 환경별로 격리)

따라서 프레임워크는 `client` 빌드와 `ssr` 빌드 간 정보를 공유하기 위해 매니페스트 파일을 파일 시스템에 작성해 공유해야 했습니다. Vite 6에서는 모든 환경에 대한 빌드를 단일 프로세스에서 수행하므로, 플러그인 파이프라인과 환경 간 통신 시 개발 단계에서와 같이 메모리를 이용할 수 있게 되었습니다.

향후 메이저 릴리즈에서는 완전한 일치(Alignment)를 달성할 수 있을 것입니다:

- **개발과 빌드 모두:** 플러그인이 공유되며, [환경별 필터링 됨](#per-environment-plugins)

또한 빌드 시에도 모든 환경이 단일 `ResolvedConfig` 인스턴스를 공유하기에, 개발 단계에서처럼 `WeakMap<ResolvedConfig, CachedData>`로 전체 앱 빌드 프로세스 수준에서 캐싱이 가능해집니다.

다만 Vite 6에서는 하위 호환성을 유지하기 위해 일부 설정이 필요합니다. 생태계 내 플러그인들이 현재 `environment.config.build` 대신 `config.build`를 사용해 설정에 접근하고 있으며, 이 때 기본적으로 환경별 새로운 `ResolvedConfig`가 생성됩니다. 플러그인 파이프라인이 환경 간 공유되도록 하기 위해, `builder.sharedConfigBuild`를 `true`로 설정할 수 있습니다.

참고로 이 옵션은 처음에는 일부 프로젝트에서만 동작할 것이기에, 플러그인 개발자는 플러그인 단위로 `sharedDuringBuild` 플래그를 `true`로 설정해 이를 환경 간 공유되도록 할 수 있습니다. 이를 통해 일반 플러그인에 대해서도 상태를 쉽게 공유할 수 있습니다:

```js
function myPlugin() {
  // 개발 및 빌드 단계에서 모든 환경 간 상태 공유
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // 모든 환경에서 단일 인스턴스 사용
    sharedDuringBuild: true,
  }
}
```