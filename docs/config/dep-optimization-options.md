## optimizeDeps.noDiscovery

- **Type:** `boolean`
- **Default:** `false`

When set to `true`, automatic dependency discovery will be disabled and only dependencies listed in `optimizeDeps.include` will be optimized. CJS-only dependencies must be present in `optimizeDeps.include` during dev.
## optimizeDeps.entries <NonInheritBadge />
If neither of these fit your needs, you can specify custom entries using this option - the value should be a [`tinyglobby` pattern](https://github.com/SuperchupuDev/tinyglobby) or array of patterns that are relative from Vite project root. This will overwrite default entries inference. Only `node_modules` and `build.outDir` folders will be ignored by default when `optimizeDeps.entries` is explicitly defined. If other folders need to be ignored, you can use an ignore pattern as part of the entries list, marked with an initial `!`. `node_modules` will not be ignored for patterns that explicitly include the string `node_modules`.
## optimizeDeps.exclude <NonInheritBadge />
## optimizeDeps.include <NonInheritBadge />
## optimizeDeps.esbuildOptions <NonInheritBadge />
## optimizeDeps.force <NonInheritBadge />
## optimizeDeps.noDiscovery <NonInheritBadge />
## optimizeDeps.holdUntilCrawlEnd <NonInheritBadge />
## optimizeDeps.disabled <NonInheritBadge />
## optimizeDeps.needsInterop <NonInheritBadge />