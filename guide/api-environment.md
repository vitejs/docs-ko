# 환경 API {#environment-api}

:::info 릴리즈 후보
환경 API는 현재 릴리즈 후보 단계에 있습니다. 생태계가 실험하고 이를 기반으로 구축할 수 있도록 주요 릴리즈 간 API의 안정성을 유지할 계획입니다. 다만 [일부 특정 API](/changes/#considering)는 여전히 실험적인 기능으로 간주됩니다.

다운스트림 프로젝트들이 새로운 기능을 실험하고 검증할 시간을 가진 후, 향후 메이저 릴리즈에서 (잠재적인 주요 변경 사항과 함께) 이러한 새로운 API를 안정화할 계획입니다.

리소스:

- [피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 새로운 API에 대한 피드백을 모으고 있습니다.
- [환경 API PR](https://github.com/vitejs/vite/pull/16471)에서 새로운 API를 구현하고 검토했습니다.

여러분의 피드백을 공유해주세요.
:::

## 환경 공식화 {#formalizing-environments}

Vite 6는 환경이라는 개념을 공식화합니다. Vite 5까지는 두 가지 암시적 환경(`client`와, 선택적으로 존재하는 `ssr`)만 존재했습니다. 새로운 환경 API를 이용하면, 프로덕션 동작 방식에 맞춰 사용자와 프레임워크 개발자가 필요한 만큼 환경을 생성할 수 있습니다. 이 새로운 기능은 내부 리팩토링을 꽤 요구했지만, 우리는 하위 호환성 유지에 많은 노력을 기울였습니다. Vite 6의 초기 목표는 생태계를 새로운 메이저 버전으로 최대한 원활하게 이전할 수 있도록 돕고, 충분한 사용자가 마이그레이션하고 프레임워크와 플러그인 개발자가 새로운 디자인을 검증할 때까지, 이 API 채택을 지연하는 데 있습니다.

## 빌드와 개발 간 격차 해소 {#closing-the-gap-between-build-and-dev}

간단한 SPA/MPA에서는 환경 관련 새로운 API가 설정에 나타나지 않습니다. 내부적으로 Vite는 옵션을 `client` 환경에 적용하지만, 설정 시 이 개념을 알 필요는 없습니다. Vite 5에서 적용했던 설정과 동작이 여기서도 원활하게 작동합니다.

일반적인 서버 사이드 렌더링(SSR) 앱에서는 두 가지 환경이 있습니다:

- `client`: 브라우저에서 앱을 실행
- `ssr`: 브라우저로 보내기 전 페이지를 렌더링하는 Node.js(또는 다른 서버 런타임)에서 앱을 실행

개발 시 Vite는 서버 코드를 Vite 개발 서버와 동일한 Node.js 프로세스에서 실행해 프로덕션 환경과 유사한 환경을 제공합니다. 하지만 서버는 [Cloudflare의 workerd](https://github.com/cloudflare/workerd)처럼 다른 제약 조건을 가진 JS 런타임에서도 실행될 수 있습니다. 또한 최신 앱은 브라우저, Node.js 서버, 엣지 서버 등 두 개 이상 환경에서 실행될 수도 있습니다. Vite 5는 이러한 환경을 제대로 구성할 수 없었습니다.

Vite 6는 빌드 및 개발 단계에서 모든 환경에 맞춰 앱을 구성할 수 있습니다. 개발 단계에서, 하나의 Vite 개발 서버를 통해 여러 다른 환경에서 동시에 코드를 실행할 수 있습니다. 물론 앱 소스 코드는 여전히 Vite 개발 서버가 변환합니다. 공유된 HTTP 서버, 미들웨어, 확인된 설정, 플러그인 파이프라인 위에서 Vite 개발 서버는 이제 독립적인 개발 환경을 가질 수 있습니다. 각각은 프로덕션 환경과 최대한 가깝게 구성되며, 코드 실행을 위한 개발 런타임에 연결됩니다(workerd의 경우, 서버 코드는 로컬에서 miniflare로 실행 가능). 클라이언트에서는 브라우저가 코드를 임포트하고 실행합니다. 다른 환경에서는 모듈을 사용하는 측에서 변환된 코드를 가져와 실행합니다.

![Vite 환경](../images/vite-environments.svg)

## 환경 설정 {#environments-configuration}

SPA/MPA에 대한 설정은 Vite 5와 유사합니다. 내부적으로 이러한 옵션은 `client` 환경 구성에 사용됩니다.

```js
export default defineConfig({
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
})
```

이는 중요한 부분인데, Vite를 사용하기 쉽게 유지할 수 있고, 필요할 때까지 새로운 개념을 노출하지 않기 때문입니다.

앱이 여러 환경으로 구성된 경우, `environments` 설정으로 명시적인 구성이 가능합니다.

```js
export default {
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
  environments: {
    server: {},
    edge: {
      resolve: {
        noExternal: true,
      },
    },
  },
}
```

명시적으로 문서화되지 않은 경우, 환경은 구성된 최상위 설정 옵션을 상속합니다(예: 새로운 `server`와 `edge` 환경은 `build.sourcemap: false` 옵션을 상속). `optimizeDeps`와 같은 소수의 최상위 옵션은 서버 환경에 기본값으로 적용할 때 잘 작동하지 않기 때문에 `client` 환경에만 적용됩니다. 이러한 옵션들은 [레퍼런스](/config/)에서 <NonInheritBadge /> 배지를 가지고 있습니다. `client` 환경 역시 `environments.client`로 명시적인 구성이 가능하지만, 새로운 환경 추가 시 클라이언트 설정이 변경되지 않도록 최상위 옵션 사용을 권장합니다.

`EnvironmentOptions` 인터페이스는 모든 환경별 옵션을 나타냅니다. `resolve`처럼 `build`와 `dev` 모두에 적용되는 환경 옵션이 있고, `DevEnvironmentOptions`와 `BuildEnvironmentOptions`처럼 개발 및 빌드별 옵션(`dev.warmup` 또는 `build.outDir`같은)이 있습니다. `optimizeDeps`같은 일부 옵션은 개발 시에만 적용되지만, 하위 호환성을 위해 `dev` 대신 최상위 레벨에 위치합니다.

```ts
interface EnvironmentOptions {
  define?: Record<string, any>
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: 'client' | 'server'
  dev: DevOptions
  build: BuildOptions
}
```

`EnvironmentOptions` 인터페이스를 확장한 `UserConfig` 인터페이스는, `environments` 옵션을 통해 클라이언트 외 다른 환경에 대한 기본값을 구성할 수 있게 합니다. 개발 중에는 `client`와 `ssr` 서버 환경이 항상 존재하며, 이를 통해 `server.ssrLoadModule(url)`과 `server.moduleGraph`에 대한 하위 호환성을 유지할 수 있습니다. 빌드 중에는 `client` 환경이 항상 존재하며, `ssr` 환경은 명시적으로 구성한 경우에만 존재합니다(`environments.ssr` 또는 하위 호환성용 `build.ssr`이 사용됩니다). SSR 환경에 대한 이름은 `ssr` 외 `server` 등으로도 지정이 가능합니다.

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // 다른 옵션들
}
```

참고로 환경 API 안정화 이후에는 `ssr` 최상위 프로퍼티가 더 이상 사용되지 않을 예정입니다. 이 옵션은 `environments`와 동일한 역할을 하지만, 기본 `ssr` 환경에만 적용되며 작은 옵션만 구성할 수 있습니다.

## 커스텀 환경 인스턴스 {#custom-environment-instances}

런타임 제공자가 자신의 런타임에 맞게 환경을 구성할 수 있도록 저수준 설정 API를 제공합니다. 이렇게 구성한 환경은 개발 중 프로덕션과 더 유사한 런타임에서 모듈을 실행하기 위해 다른 프로세스나 스레드를 생성할 수도 있습니다.

```js
import { customEnvironment } from 'vite-environment-provider'

export default {
  build: {
    outDir: '/dist/client',
  },
  environments: {
    ssr: customEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

## 하위 호환성 {#backward-compatibility}

현재 Vite 서버 API는 아직 폐기되지 않았으며, Vite 5와 하위 호환을 유지하고 있습니다.

`server.moduleGraph`는 클라이언트와 ssr 모듈 그래프를 통합해서 보여줍니다. 즉, 모든 메서드는 두 환경에 대한 모듈 정보를 포함하는, 하위 호환되는 모듈 노드를 반환합니다. `handleHotUpdate`에 전달되는 모듈 노드도 동일한 방식을 사용합니다.

다만 아직 환경 API 전환을 권장하지는 않습니다. 상당수 사용자가 Vite 6를 채택해 플러그인이 두 가지 버전을 유지할 필요가 없을 때 전환하는 편이 좋습니다. 주요 변경 사항 섹션에서 향후 더 이상 사용되지 않을 기능과 마이그레이션 가이드를 확인하세요:

- [훅에서의 `this.environment`](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 플러그인 훅](/changes/hotupdate-hook)
- [Move to Per-environment APIs](/changes/per-environment-apis)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared Plugins During Build](/changes/shared-plugins-during-build)

## 대상 사용자 {#target-users}

여기서는 최종 사용자를 위한 환경 관련 기본 개념을 설명합니다.

플러그인 개발자는 현재 환경에 대한 설정과 상호 작용할 수 있는 더 일관된 API를 사용할 수 있습니다. Vite 위에서 구축한다면, [플러그인을 위한 환경 API](./api-environment-plugins.md)에서 여러 커스텀 환경을 지원하는 확장된 플러그인 API에 대한 가이드를 확인할 수 있습니다.

프레임워크는 다양한 수준에서 환경을 구성해야 할 수 있습니다. 프레임워크 개발자라면, [프레임워크를 위한 환경 API](./api-environment-frameworks)에서 환경 API의 프로그래밍적 측면을 알아보세요.

런타임을 제공한다면, [런타임을 위한 환경 API](./api-environment-runtimes.md)에서 프레임워크와 사용자가 사용할 수 있는 커스텀 환경 제공 방법을 설명합니다.