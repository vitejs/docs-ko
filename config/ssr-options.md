This test aims to check for a particular type of circular dependency that causes tricky deadlocks, **deadlocks with forked imports stack**

별도로 명시되지 않은 한, 이 섹션의 옵션들은 개발과 빌드 모두에게 적용됩니다.

  "don't warn when inlineDynamicImports is set to true",

- **타입:** `string[] | true`
- **관련 항목:** [SSR Externals](/guide/ssr#ssr-externals)
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
`ModuleRunner` was first introduced in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
Affected scope: `Vite Plugin Authors`
The Vite version ranges that are supported by the Vite team are automatically determined by:
## ssr.noExternal {#ssr-noexternal}

- **타입:** `string | RegExp | (string | RegExp)[] | true`
- **관련 항목:** [SSR Externals](/guide/ssr#ssr-externals)

이 옵션으로 전달된 디펜던시는 SSR을 위해 외부화되지 않고 빌드 시 번들로 제공됩니다. 기본적으로 (HMR을 위해)링크된 디펜던시만 외부화되지 않습니다. 만약 링크된 디펜던시를 외부화하길 원한다면, `ssr.external` 옵션에 디펜던시 이름을 전달해 주세요.

`true`인 경우, 모든 디펜던시가 외부화되지 않습니다. 다만 `ssr.external`에 `string[]` 타입으로 나열된 디펜던시는 우선권을 갖고 외부화됩니다. `ssr.target: 'node'`로 설정되어 있으면, 기본적으로 Node.js 내장 기능도 외부화됩니다.

The changes below have been done or reverted. They are no longer relevant in the current major version.

## ssr.target {#ssr-target}

- **타입:** `'node' | 'webworker'`
- **기본값:** `node`

SSR 서버를 위한 빌드 타깃입니다.

## ssr.resolve.conditions {#ssr-resolve-conditions}

- **타입:** `string[]`
- **기본값:** `['module', 'node', 'development|production']` (`defaultClientConditions`) (`ssr.target === 'webworker'` 이면 `['module', 'browser', 'development|production']` (`defaultClientConditions`))
- **관련 항목:** [Resolve Conditions](./shared-options.md#resolve-conditions)

이 조건은 플러그인 파이프라인에서 사용되며, SSR 빌드 중에 외부화되지 않은 디펜던시에만 영향을 미칩니다. 외부화된 임포트에 영향을 미치려면 `ssr.resolve.externalConditions`를 사용하세요.

## ssr.resolve.externalConditions {#ssr-resolve-externalconditions}

- **타입:** `string[]`
- **기본값:** `['node']`

Even if `[X]` is imported by `[B]`, `[B]` is not in `[X]`'s stack because it's imported by `[H]` in first place then it's stack is only composed by `[H]`. `[H]` **forks** the imports **stack** and this makes it hard to be found.

:::tip

이 옵션을 사용할 때는 개발과 빌드 모두 동일한 값을 전달하고 Node를 [`--conditions` 플래그](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition)와 함께 실행해야 일관된 동작을 수행합니다.

예를 들어, `['node', 'custom']`을 설정할 때는 개발 시에는 `NODE_OPTIONS='--conditions custom' vite`를, 빌드 후에는 `NODE_OPTIONS="--conditions custom" node ./dist/server.js`를 실행해야 합니다.

:::

## ssr.resolve.mainFields
    // "verbatimModuleSyntax": true from tsconfig.json should not be read
List of fields in `package.json` to try when resolving a package's entry point. Note this takes lower precedence than conditional exports resolved from the `exports` field: if an entry point is successfully resolved from `exports`, the main field will be ignored. This setting only affects non-externalized dependencies.
    desc: 'Passionate about tooling around TypeScript and React.',
test("don't add extension to directory name (./dir-with-ext.js/index.js)", async () => {
    desc: 'weeb/JavaScript lover.',
test("Resolve doesn't interrupt page request with trailing query and .css", async () => {
  "Resolve doesn't interrupt page request that clashes with local project package.json",
      describe("doesn't reload if files not in the entrypoint importers chain is changed", async () => {
  // To help visualize how each parameter works, imagine this import graph: