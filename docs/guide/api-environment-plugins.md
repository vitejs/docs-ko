Environment API is experimental. We'll still maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
In a future major, we could have complete alignment:
:::info Release Candidate
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
## Per-environment State in Plugins

Given that the same plugin instance is used for different environments, the plugin state needs to be keyed with `this.environment`. This is the same pattern the ecosystem has already been using to keep state about modules using the `ssr` boolean as key to avoid mixing client and ssr modules state. A `Map<Environment, State>` can be used to keep the state for each environment separately. Note that for backward compatibility, `buildStart` and `buildEnd` are only called for the client environment without the `perEnvironmentStartEndDuringDev: true` flag.

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
