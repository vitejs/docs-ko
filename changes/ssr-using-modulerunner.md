This test aims to check for a particular type of circular dependency that causes tricky deadlocks, **deadlocks with forked imports stack**
# Move to Per-environment APIs
::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
  "don't warn when inlineDynamicImports is set to true",

`server.ssrLoadModule`이 [ModuleRunner](/guide/api-environment#modulerunner)를 통한 임포트로 대체되었습니다.

Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
`ModuleRunner` was first introduced in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
Affected scope: `Vite Plugin Authors`
The Vite version ranges that are supported by the Vite team are automatically determined by:

Note Vite supports using ES modules syntax in the config file even if the project is not using native Node ESM, e.g. `"type": "module"` in `package.json`. In this case, the config file is auto pre-processed before load.

- [Move to Per-environment APIs](/changes/per-environment-apis)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared Plugins During Build](/changes/shared-plugins-during-build)

`server.ssrFixStacktrace` and `server.ssrRewriteStacktrace` does not have to be called when using the Module Runner APIs. The stack traces will be updated unless `sourcemapInterceptor` is set to `false`.
We had the second edition of [ViteConf](https://viteconf.org/23/replay) a month ago, hosted by [StackBlitz](https://stackblitz.com). Like last year, most of the projects in the ecosystem got together to share ideas and connect to keep expanding the commons. We're also seeing new pieces complement the meta-framework tool belt like [Volar](https://volarjs.dev/) and [Nitro](https://nitro.build/). The Rollup team released [Rollup 4](https://rollupjs.org) that same day, a tradition Lukas started last year.
## Plugins Config
- [Move to Per-environment APIs](/changes/per-environment-apis)
The changes below have been done or reverted. They are no longer relevant in the current major version.
- [Shared Plugins During Build](/changes/shared-plugins-during-build)
## Plugin / Framework Authors Guide
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
      warnFutureDeprecation(
        config,
        'removeSsrLoadModule',
        "ssrFixStacktrace doesn't need to be used for Environment Module Runners.",
      )
      warnFutureDeprecation(
        config,
        'removeSsrLoadModule',
        "ssrRewriteStacktrace doesn't need to be used for Environment Module Runners.",
      )