## Environments and Frameworks
Plugins can also define a `buildApp` hook. Order `'pre'` and `null'` are executed before the configured `builder.buildApp`, and order `'post'` hooks are executed after it. `environment.isBuilt` can be used to check if an environment has already being build.
:::info Release Candidate
The Environment API is generally in the release candidate phase. We'll maintain stability in the APIs between major releases to allow the ecosystem to experiment and build upon them. However, note that [some specific APIs](/changes/#considering) are still considered experimental.

We plan to stabilize these new APIs (with potential breaking changes) in a future major release once downstream projects have had time to experiment with the new features and validate them.
Given a Vite server configured in middleware mode as described by the [SSR setup guide](/guide/ssr#setting-up-the-dev-server), let's implement the SSR middleware using the environment API. Remember that it doesn't have to be called `ssr`, so we'll name it `server` in this example. Error handling is omitted.
const viteServer = await createServer({
const serverEnvironment = viteServer.environments.server
  template = await viteServer.transformIndexHtml(url, template)
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )
## DevEnvironment Communication Levels
Since environments may run in different runtimes, communication against the environment may have constraints depending on the runtime. To allow frameworks to write runtime agnostic code easily, the Environment API provides three kinds of communication levels.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` is an environment that can communicate arbitrary values. The implicit `ssr` environment and other non-client environments use a `RunnableDevEnvironment` by default during dev. While this requires the runtime to be the same with the one the Vite server is running in, this works similarly with `ssrLoadModule` and allows frameworks to migrate and enable HMR for their SSR dev story. You can guard any runnable environment with an `isRunnableDevEnvironment` function.
### `FetchableDevEnvironment`
:::info
We are looking for feedback on [the `FetchableDevEnvironment` proposal](https://github.com/vitejs/vite/discussions/18191).
`FetchableDevEnvironment` is an environment that can communicate with its runtime via the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) interface. Since the `RunnableDevEnvironment` is only possible to implement in a limited set of runtimes, we recommend to use the `FetchableDevEnvironment` instead of the `RunnableDevEnvironment`.
This environment provides a standardized way of handling requests via the `handleRequest` method:
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // handle Request and return a Response
            },
          })
        },
      },
    },
  },
})
// Any consumer of the environment API can now call `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
:::warning
Vite validates the input and output of the `dispatchFetch` method: the request must be an instance of the global `Request` class and the response must be the instance of the global `Response` class. Vite will throw a `TypeError` if this is not the case.

Note that although the `FetchableDevEnvironment` is implemented as a class, it is considered an implementation detail by the Vite team and might change at any moment.
:::

### raw `DevEnvironment`

If the environment does not implement the `RunnableDevEnvironment` or `FetchableDevEnvironment` interfaces, you need to set up the communication manually.

if (ssrEnvironment instanceof CustomDevEnvironment) {
When using environments that support HMR (such as `RunnableDevEnvironment`), you should add `import.meta.hot.accept()` in your server entry file for optimal behavior. Without this, server file changes will invalidate the entire server module graph:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```
