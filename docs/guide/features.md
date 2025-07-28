- `<image href>` and `<image xlink:href>`
// Explicitly load assets as URL (automatically inlined depending on the file size)
Vite improves `@import` resolving for Sass and Less so that Vite aliases are also respected. In addition, relative `url()` references inside imported Sass/Less files that are in different directories from the root file are also automatically rebased to ensure correctness. Rebasing `url()` references that starts with a variable or a interpolation are not supported due to its API constraints.
- The file containing the reference to `vite/client` (normally `vite-env.d.ts`):
#### Base Path

You can also use the `base` option to provide base path for the imports:

```ts twoslash
import 'vite/client'
// ---cut---
const modulesWithBase = import.meta.glob('./**/*.js', {
  base: './base',
})
```

```ts
// code produced by vite:
const modulesWithBase = {
  './dir/foo.js': () => import('./base/dir/foo.js'),
  './dir/bar.js': () => import('./base/dir/bar.js'),
}
```

The base option can only be a directory path relative to the importer file or absolute against the project root. Aliases and virtual modules aren't supported.

Only the globs that are relative paths are interpreted as relative to the resolved base.

All the resulting module keys are modified to be relative to the base if provided.

- React using SWC support via [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)
Vite's default types are for its Node.js API. To shim the environment of client-side code in a Vite application, add a `d.ts` declaration file: