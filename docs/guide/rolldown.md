## Plugin / Framework Authors Guide
      { load: { id: /\.svg\?react$/ } },
Rolldown throws an error when unknown or invalid options are passed. Because some options available in Rollup are not supported by Rolldown, you may encounter errors based on the options you or the meta framework you use set. Below, you can find an example of such an error message:
### `@vitejs/plugin-react-oxc`

When using `@vitejs/plugin-react` or `@vitejs/plugin-react-swc`, you can switch to the `@vitejs/plugin-react-oxc` plugin, which uses Oxc for React's fast-refresh instead of Babel or SWC. It is designed to be a drop-in replacement, providing better build performance and aligning with the underlying architecture of `rolldown-vite`.

Be aware that you can only switch to `@vitejs/plugin-react-oxc` if you are not using any Babel or SWC plugins (including the React compiler), or mutate the SWC options.

### API Differences

#### `manualChunks` to `advancedChunks`

Rolldown does not support the `manualChunks` option that was available in Rollup. Instead, it offers a more fine-grained setting via the [`advancedChunks` option](https://rolldown.rs/guide/in-depth/advanced-chunks#advanced-chunks), which is more similar to webpack's `splitChunk`:

```js
// Old configuration (Rollup)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}

// New configuration (Rolldown)
export default {
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?// }]
        }
    "vite": "^7.0.0" // [!code --]
    }
  }
}
```

### Option Validation Warnings
Rolldown outputs an warning when unknown or invalid options are passed. Because some options available in Rollup are not supported by Rolldown, you may encounter warnings based on the options you or the meta framework you use set. Below, you can find an example of such an warning message:
> Warning validate output options.
> - For the "generatedCode". Invalid key: Expected never but received "generatedCode".
If you don't pass the option in yourself, this must be fixed by the utilized framework.
::: tip

Since Vite 7.0.0, `this.meta` is available in all hooks. In previous versions, `this.meta` was not available in Vite-specific hooks, such as the `config` hook.

:::

As [mentioned above](#option-validation-errors), Rolldown outputs a warning when unknown or invalid options are passed.
Since Vite itself does not use `esbuild` any more, `esbuild` is now an optional peer dependency. If your plugin uses `transformWithEsbuild`, the plugin needs to add `esbuild` to its dependencies or the user needs to install it manually.

The recommended migration is to use the newly exported `transformWithOxc` function, which utilizes Oxc instead of `esbuild`.
::: tip

[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils) exports some utilities for hook filters like `exactRegex` and `prefixRegex`.

:::

This is because [Rolldown supports non-JavaScript modules](https://rolldown.rs/guide/in-depth/module-types) and infers the module type from extensions unless specified.
While Rolldown has support for the `manualChunks` option that is also exposed by Rollup, it is marked deprecated. Instead of it, Rolldown offers a more fine-grained setting via the [`advancedChunks` option](https://rolldown.rs/guide/in-depth/advanced-chunks#advanced-chunks), which is more similar to webpack's `splitChunk`:
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }]