This test aims to check for a particular type of circular dependency that causes tricky deadlocks, **deadlocks with forked imports stack**
# Move to Per-environment APIs
::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
  "don't warn when inlineDynamicImports is set to true",

모듈 그래프 및 모듈 변환과 관련된 여러 `ViteDevServer` API가 `DevEnvironment` 인스턴스로 이동되었습니다.

Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
  removeServerReloadModule: 'changes/per-environment-apis',
  removeServerPluginContainer: 'changes/per-environment-apis',
Affected scope: `Vite Plugin Authors`
`ModuleRunner` was first introduced in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
  removeServerWarmupRequest: 'changes/per-environment-apis',
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
  removeServerReloadModule: 'warn',
  server.environments.ssr.pluginContainer.buildStart({})
  removeServerPluginContainer: 'warn',
  removeServerHot: 'warn',
Affected scope: `Vite Plugin Authors`
- [Move to Per-environment APIs](/changes/per-environment-apis)
  server.environments.ssr.pluginContainer.buildStart({})
  removeServerWarmupRequest: 'warn',
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)

Vite v6에서는 임의의 수의 커스텀 환경(`client`, `ssr`, `edge` 등)을 생성할 수 있습니다. 따라서 단일 `ssr` 불리언 값으로는 더 이상 충분하지 않습니다. `server.transformRequest(url, { environment })`와 같은 형태로 API를 변경하는 대신, 이러한 메서드들을 환경 인스턴스로 이동하여 Vite 개발 서버 없이도 호출할 수 있도록 했습니다.
  removeServerReloadModule:
    'The `server.reloadModule` is replaced with `environment.reloadModule`.',
The changes below have been done or reverted. They are no longer relevant in the current major version.
## 마이그레이션 가이드 {#migration-guide}
  removeServerPluginContainer:
    'The `server.pluginContainer` is replaced with `this.environment.pluginContainer`.',
  removeServerWarmupRequest:
    'The `server.warmupRequest` is replaced with `this.environment.warmupRequest`.',
- `server.reloadModule(module)` -> `environment.reloadModule(module)`

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.pluginContainer` -> `environment.pluginContainer`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.hot` -> `server.client.environment.hot`
## Plugins Config
- [Move to Per-environment APIs](/changes/per-environment-apis)
              text: 'Move to Per-environment APIs',
              text: 'SSR Using ModuleRunner API',
              text: 'Shared Plugins During Build',
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
  removeServerWarmupRequest?: 'warn'
      warnFutureDeprecation(config, 'removeServerTransformRequest')
      warnFutureDeprecation(config, 'removeServerWarmupRequest')
    removeServerWarmupRequest: undefined,
  server.environments.ssr.pluginContainer.buildStart({})
  server.environments.ssr.pluginContainer.buildStart({})
      const result =
        await server!.environments.client.pluginContainer.transform(
          code,
          mod.id!,
        )
      await server?.environments.client.pluginContainer.transform(code, mod.id!)
  removeServerPluginContainer?: 'warn'
  let pluginContainer = createPluginContainer(environments)
    get pluginContainer() {
      warnFutureDeprecation(config, 'removeServerPluginContainer')
      return pluginContainer
    },
    set pluginContainer(p) {
      pluginContainer = p
    },
  let hot = ws
    get hot() {
      warnFutureDeprecation(config, 'removeServerHot')
      return hot
    },
    set hot(h) {
      hot = h
    },
  removeServerReloadModule?: 'warn'
      warnFutureDeprecation(config, 'removeServerReloadModule')