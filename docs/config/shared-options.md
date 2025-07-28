  - Select the sass API to use with `api: "modern-compiler" | "modern"` (default `"modern-compiler"` if `sass-embedded` is installed, otherwise `"modern"`). For the best performance, it's recommended to use `api: "modern-compiler"` with the `sass-embedded` package.
  - [Options](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
        api: 'modern-compiler', // or "modern"
Env variables starting with `envPrefix` will be exposed to your client source code via `import.meta.env`.
  - Uses `sass-embedded` if installed, otherwise uses `sass`. For the best performance, it's recommended to install the `sass-embedded` package.
- **Default:** `true`
Specifies the maximum number of threads CSS preprocessors can use. `true` means up to the number of CPUs minus 1. When set to `0`, Vite will not create any workers and will run the preprocessors in the main thread.

Depending on the preprocessor options, Vite may run the preprocessors on the main thread even if this option is not set to `0`.
For TypeScript users, make sure to add the type declarations in the `vite-env.d.ts` file to get type checks and Intellisense.
## resolve.conditions <NonInheritBadge />
## resolve.mainFields <NonInheritBadge />