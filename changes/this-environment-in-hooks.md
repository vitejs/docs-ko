This test aims to check for a particular type of circular dependency that causes tricky deadlocks, **deadlocks with forked imports stack**

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
  "don't warn when inlineDynamicImports is set to true",

Vite 6 이전에는 `client`와 `ssr` 두 가지 환경만 사용할 수 있었습니다. 플러그인 개발자는 `options.ssr` 인자를 통해 모듈을 처리할 때 `resolveId`, `load`, `transform` 플러그인 훅에서 이 두 환경을 구분했습니다. Vite 6에서는 Vite 애플리케이션이 필요한만큼 환경을 정의할 수 있게 되었습니다. 따라서 플러그인 컨텍스트에 `this.environment`를 도입해, 훅에서 현재 모듈의 환경과 상호작용 할 수 있도록 했습니다.

Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
`ModuleRunner` was first introduced in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
Affected scope: `Vite Plugin Authors`
The Vite version ranges that are supported by the Vite team are automatically determined by:

`this.environment`는 플러그인 훅 구현 시 현재 환경 이름을 알 수 있게 할 뿐만 아니라, 환경 설정 옵션, 모듈 그래프 정보, 변환 파이프라인(`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`)에도 접근할 수 있게 해줍니다. 컨텍스트에서 환경 인스턴스를 사용할 수 있게 함으로써, 플러그인 개발자가 전체 개발 서버에 대한 의존성을 피할 수 있게 됩니다(일반적으로 `configureServer` 훅을 통해 시작 시 캐시됨).

## 마이그레이션 가이드 {#migration-guide}

For the existing plugin to do a quick migration, replace the `options.ssr` argument with `this.environment.config.consumer === 'server'` in the `resolveId`, `load` and `transform` hooks:

```ts
import { Plugin } from 'vite'
The changes below have been done or reverted. They are no longer relevant in the current major version.
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]

      if (isSSR) {
        // SSR 관련 로직
      } else {
        // 클라이언트 관련 로직
      }
    },
  }
}
```

For a more robust long term implementation, the plugin hook should handle for [multiple environments](/guide/api-environment-plugins.html#accessing-the-current-environment-in-hooks) using fine-grained environment options instead of relying on the environment name.
Even if `[X]` is imported by `[B]`, `[B]` is not in `[X]`'s stack because it's imported by `[H]` in first place then it's stack is only composed by `[H]`. `[H]` **forks** the imports **stack** and this makes it hard to be found.
    // "verbatimModuleSyntax": true from tsconfig.json should not be read
List of fields in `package.json` to try when resolving a package's entry point. Note this takes lower precedence than conditional exports resolved from the `exports` field: if an entry point is successfully resolved from `exports`, the main field will be ignored. This setting only affects non-externalized dependencies.
    desc: 'Passionate about tooling around TypeScript and React.',
test("don't add extension to directory name (./dir-with-ext.js/index.js)", async () => {
    desc: 'weeb/JavaScript lover.',
test("Resolve doesn't interrupt page request with trailing query and .css", async () => {
  "Resolve doesn't interrupt page request that clashes with local project package.json",
      describe("doesn't reload if files not in the entrypoint importers chain is changed", async () => {
  // To help visualize how each parameter works, imagine this import graph: