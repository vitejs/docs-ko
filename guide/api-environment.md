<template>
  <a
    href="/guide/api-environment#environments-configuration"
    class="ignore-header"
  >
    <Badge type="info" text="non-inherit" />
## optimizeDeps.entries <NonInheritBadge />
</template>
  </a>
# SSR Using `ModuleRunner` API
# Move to Per-environment APIs
import NonInheritBadge from './components/NonInheritBadge.vue'
:::info Release Candidate
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
## optimizeDeps.exclude <NonInheritBadge />

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
- [`this.environment` in Hooks](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` Plugin Hook](/changes/hotupdate-hook)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.


    app.component('NonInheritBadge', NonInheritBadge)

Vite 6 formalizes the concept of Environments. Until Vite 5, there were two implicit Environments (`client`, and optionally `ssr`). The new Environment API allows users and framework authors to create as many environments as needed to map the way their apps work in production. This new capability required a big internal refactoring, but a lot of effort has been placed on backward compatibility. The initial goal of Vite 6 is to move the ecosystem to the new major as smoothly as possible, delaying the adoption of the APIs until enough users have migrated and frameworks and plugin authors have validated the new design.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.
:::info Release Candidate
:::info Release Candidate
:::info Release Candidate
## optimizeDeps.include <NonInheritBadge />
:::info Release Candidate
## 빌드와 개발 간 격차 해소 {#closing-the-gap-between-build-and-dev}
- [Move to Per-environment APIs](/changes/per-environment-apis)
clientEnvironment.transformRequest(url)
- `ssr`: runs the app in node (or other server runtimes) which renders pages before sending them to the browser.

![Vite 환경](../images/vite-environments.svg)

## 환경 설정 {#environments-configuration}

We had the second edition of [ViteConf](https://viteconf.org/23/replay) a month ago, hosted by [StackBlitz](https://stackblitz.com). Like last year, most of the projects in the ecosystem got together to share ideas and connect to keep expanding the commons. We're also seeing new pieces complement the meta-framework tool belt like [Volar](https://volarjs.dev/) and [Nitro](https://nitro.build/). The Rollup team released [Rollup 4](https://rollupjs.org) that same day, a tradition Lukas started last year.
```js
export default defineConfig({
  build: {
    sourcemap: false,
## Plugins Config
  optimizeDeps: {
## optimizeDeps.esbuildOptions <NonInheritBadge />
    include: ['lib'],
  },
})
```

이는 중요한 부분인데, Vite를 사용하기 쉽게 유지할 수 있고, 필요할 때까지 새로운 개념을 노출하지 않기 때문입니다.

앱이 여러 환경으로 구성된 경우, `environments` 설정으로 명시적인 구성이 가능합니다.
  },
  optimizeDeps: {
  },
  environments: {
    server: {},
    edge: {
      resolve: {
        noExternal: true,
      },
    },
When not explicitly documented, environment inherits the configured top-level config options (for example, the new `server` and `edge` environments will inherit the `build.sourcemap: false` option). A small number of top-level options, like `optimizeDeps`, only apply to the `client` environment, as they don't work well when applied as a default to server environments. Those options have <NonInheritBadge /> badge in [the reference](/config/). The `client` environment can also be configured explicitly through `environments.client`, but we recommend to do it with the top-level options so the client config remains unchanged when adding new environments.
  },
## optimizeDeps.force <NonInheritBadge />
`EnvironmentOptions` 인터페이스는 모든 환경별 옵션을 나타냅니다. `resolve`처럼 `build`와 `dev` 모두에 적용되는 환경 옵션이 있고, `DevEnvironmentOptions`와 `BuildEnvironmentOptions`처럼 개발 및 빌드별 옵션(`dev.warmup` 또는 `build.outDir`같은)이 있습니다. `optimizeDeps`같은 일부 옵션은 개발 시에만 적용되지만, 하위 호환성을 위해 `dev` 대신 최상위 레벨에 위치합니다.

```ts
interface EnvironmentOptions {
  define?: Record<string, any>
## optimizeDeps.noDiscovery <NonInheritBadge />
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: 'client' | 'server'
  dev: DevOptions
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
## optimizeDeps.holdUntilCrawlEnd <NonInheritBadge />
}
```

참고로 환경 API 안정화 이후에는 `ssr` 최상위 프로퍼티가 더 이상 사용되지 않을 예정입니다. 이 옵션은 `environments`와 동일한 역할을 하지만, 기본 `ssr` 환경에만 적용되며 작은 옵션만 구성할 수 있습니다.

Given a Vite server configured in middleware mode as described by the [SSR setup guide](/guide/ssr#setting-up-the-dev-server), let's implement the SSR middleware using the environment API. Remember that it doesn't have to be called `ssr`, so we'll name it `server` in this example. Error handling is omitted.
런타임 제공자가 자신의 런타임에 맞게 환경을 구성할 수 있도록 저수준 설정 API를 제공합니다. 이렇게 구성한 환경은 개발 중 프로덕션과 더 유사한 런타임에서 모듈을 실행하기 위해 다른 프로세스나 스레드를 생성할 수도 있습니다.
## optimizeDeps.disabled <NonInheritBadge />

```js
import { customEnvironment } from 'vite-environment-provider'

export default {
  build: {
const viteServer = await createServer({
  },
  environments: {
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
## optimizeDeps.needsInterop <NonInheritBadge />
}
```

## 하위 호환성 {#backward-compatibility}
const serverEnvironment = viteServer.environments.server
## resolve.conditions <NonInheritBadge />

`server.moduleGraph`는 클라이언트와 ssr 모듈 그래프를 통합해서 보여줍니다. 즉, 모든 메서드는 두 환경에 대한 모듈 정보를 포함하는, 하위 호환되는 모듈 노드를 반환합니다. `handleHotUpdate`에 전달되는 모듈 노드도 동일한 방식을 사용합니다.

다만 아직 환경 API 전환을 권장하지는 않습니다. 상당수 사용자가 Vite 6를 채택해 플러그인이 두 가지 버전을 유지할 필요가 없을 때 전환하는 편이 좋습니다. 주요 변경 사항 섹션에서 향후 더 이상 사용되지 않을 기능과 마이그레이션 가이드를 확인하세요:

The current Vite server API is not yet deprecated and is backward compatible with Vite 5.
## 대상 사용자 {#target-users}

여기서는 최종 사용자를 위한 환경 관련 기본 개념을 설명합니다.

  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )
## Plugin / Framework Authors Guide
              text: 'Move to Per-environment APIs',
              text: 'SSR Using ModuleRunner API',
              text: 'Shared Plugins During Build',
In a future major, we could have complete alignment:
## resolve.mainFields <NonInheritBadge />