This test aims to check for a particular type of circular dependency that causes tricky deadlocks, **deadlocks with forked imports stack**

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
  "don't warn when inlineDynamicImports is set to true",

[빌드 중 공유되는 플러그인](/guide/api-environment-plugins.md#shared-plugins-during-build)을 참고하세요.

Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
`ModuleRunner` was first introduced in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
Affected scope: `Vite Plugin Authors`
The Vite version ranges that are supported by the Vite team are automatically determined by:

개발 환경과 빌드 플러그인 파이프라인을 일치시키고자 합니다.

## 마이그레이션 가이드 {#migration-guide}

환경 간 플러그인을 공유하려면, 플러그인의 상태가 현재 환경에 따라 구분되어야 합니다. 먼저 아래는 이를 구분하지 않고 모든 환경에 대해 변환된 모듈 수를 카운트하는 플러그인입니다.

```js
function CountTransformedModulesPlugin() {
The changes below have been done or reverted. They are no longer relevant in the current major version.
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
Even if `[X]` is imported by `[B]`, `[B]` is not in `[X]`'s stack because it's imported by `[H]` in first place then it's stack is only composed by `[H]`. `[H]` **forks** the imports **stack** and this makes it hard to be found.
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
    // "verbatimModuleSyntax": true from tsconfig.json should not be read
```

List of fields in `package.json` to try when resolving a package's entry point. Note this takes lower precedence than conditional exports resolved from the `exports` field: if an entry point is successfully resolved from `exports`, the main field will be ignored. This setting only affects non-externalized dependencies.

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
    desc: 'Passionate about tooling around TypeScript and React.',
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
test("don't add extension to directory name (./dir-with-ext.js/index.js)", async () => {
    desc: 'weeb/JavaScript lover.',
test("Resolve doesn't interrupt page request with trailing query and .css", async () => {
  "Resolve doesn't interrupt page request that clashes with local project package.json",
      describe("doesn't reload if files not in the entrypoint importers chain is changed", async () => {
  // To help visualize how each parameter works, imagine this import graph: