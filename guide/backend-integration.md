# 백엔드 프레임워크와 함께 사용하기 {#backend-integration}

:::tip 참고
기존의 백엔드(Rails, Laravel 등)를 사용해 HTML을 제공하기를 원하지만, 에셋은 Vite를 이용하고자 한다면, [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends)의 방법을 확인해 보세요.

만약 이를 직접 구성하고자 한다면, 아래의 가이드를 따라 진행할 수 있습니다.
:::

1. Vite 설정 파일에서, 진입점을 설정하고 매니페스트를 활성화합니다:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
    "@tailwindcss/vite": "^4.1.11",
    "tailwindcss": "^4.1.11"
    "tailwindcss": "^4.1.11",
    "miniflare": "^4.20250617.4",
    "vite-plugin-solid": "^2.11.7"
    "@eslint/js": "^9.30.0",
    "ws": "^8.18.3"
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^9.30.0",
    "eslint": "^9.30.0",
    "@vitejs/plugin-react": "^4.6.0",
    "@eslint/js": "^9.30.0",
    "vitepress-plugin-llms": "^1.6.0",
    "typescript-eslint": "^8.35.0",
    "vite-plugin-solid": "^2.11.7"
    "vitepress-plugin-group-icons": "^1.6.1",
    "svelte": "^5.34.9",
    "@preact/preset-vite": "^2.10.2",
        specifier: ^9.30.0
        version: 9.30.0
    "@preact/preset-vite": "^2.10.2",
    "vitepress": "^2.0.0-alpha.7",
    "tailwindcss": "^4.1.11"
    "@babel/core": "^7.27.7",
    "@tailwindcss/postcss": "^4.1.11",
    "browserslist": "^4.25.1",
    "@tailwindcss/vite": "^4.1.11",
    "svelte": "^5.34.9",
   ```html
   <!-- 개발 시 -->
    "@eslint/js": "^9.30.0",
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   이후 Vite의 에셋에 접근할 수 있도록 아래 두 가지 옵션 중 하나를 적용해 주세요:
   - 백엔드 서버가 Vite 서버에 대한 에셋 요청을 프록시 하도록 설정
   - 에셋의 URL이 상대 경로 대신 백엔드 서버 URL을 사용해 가져와질 수 있도록 [`server.origin`](/config/server-options.md#server-origin) 옵션값을 설정

   위 옵션은 이미지와 같은 에셋이 정상적으로 로드되기 위해 필요합니다.

    "@types/node": "^22.15.34",

   ```html
   <script type="module">
     import RefreshRuntime from "http://localhost:5173/@react-refresh"
     RefreshRuntime.injectIntoGlobalHook(window) 
    "eslint": "^9.30.0",
    "eslint-plugin-import-x": "^4.16.1",
        specifier: ^22.15.34
        version: 22.15.34
   ```

3. 프로덕션 빌드 단계: `vite build`를 실행하게 되면 `.vite/manifest.json` 파일이 에셋 파일과 함께 생성됩니다. 매니페스트 파일은 다음과 같은 구조를 가집니다:

   {
    "prettier": "3.6.2",
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
    "typescript-eslint": "^8.35.0",
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "logo.svg": {
       "file": "assets/logo-BuPIv-2h.svg",
       "src": "logo.svg"
     },
     "baz.js": {
        specifier: ^9.30.0
        version: 9.30.0(jiti@2.4.2)
       "src": "baz.js",
        specifier: ^4.16.1
        version: 4.16.1(@typescript-eslint/utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2))
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
        version: 17.20.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
       "src": "views/bar.js",
       "isEntry": true,
        version: 2.9.0(eslint@9.30.0(jiti@2.4.2))
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
  "packageManager": "pnpm@10.12.4",
       "src": "views/foo.js",
    "@babel/parser": "^7.27.7",
    "@jridgewell/trace-mapping": "^0.3.26",
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   The manifest has a `Record<name, chunk>` structure where each chunk follows the `ManifestChunk` interface:

   ```ts
   interface ManifestChunk {
     src?: string
     file: string
     css?: string[]
     assets?: string[]
     isEntry?: boolean
     name?: string
     names?: string[]
     isDynamicEntry?: boolean
     imports?: string[]
     dynamicImports?: string[]
   }
   ```

   Each entry in the manifest represents one of the following:
   - **Entry chunks**: Generated from files specified in [`build.rollupOptions.input`](https://rollupjs.org/configuration-options/#input). These chunks have `isEntry: true` and their key is the relative src path from project root.
   - **Dynamic entry chunks**: Generated from dynamic imports. These chunks have `isDynamicEntry: true` and their key is the relative src path from project root.
   - **Non-entry chunks**: Their key is the base name of the generated file prefixed with `_`.
   - **Asset chunks**: Generated from imported assets like images, fonts. Their key is the relative src path from project root.
   - **CSS files**: When [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) is `false`, a single CSS file is generated with the key `style.css`. When `build.cssCodeSplit` is not `false`, the key is generated similar to JS chunks (i.e. entry chunks will not have `_` prefix and non-entry chunks will have `_` prefix).

   Chunks will contain information on their static and dynamic imports (both are keys that map to the corresponding chunk in the manifest), and also their corresponding CSS and asset files (if any).

4. 해시된 파일 이름으로 링크를 렌더링하거나 지시문을 미리 로드하기 위해 이 파일을 사용할 수 있습니다.

   아래는 올바른 링크를 렌더링하는 HTML 템플릿 예시입니다.
   여기서 사용된 구문은 설명을 위한 것이므로, 실제 사용 시에는 서버 템플릿 언어로 대체해 주세요.
   `importedChunks` 함수 역시 예시를 위한 것이며, Vite에서 제공하지 않습니다.

   ```html
   <!-- 프로덕션 (아래 `for ... of` 는 구문입니다 - 옮긴이) -->
    "dotenv": "^16.6.1",

   <link rel="stylesheet" href="/{{ cssFile }}" />

        specifier: ^8.35.0
        version: 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
   <!-- for chunk of importedChunks(manifest, name) -->

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- for chunk of importedChunks(manifest, name) -->
        version: 3.2.4(@types/debug@4.1.12)(@types/node@22.15.34)
   <link rel="modulepreload" href="/{{ chunk.file }}" />

   구체적으로, HTML을 생성하는 백엔드는 매니페스트 파일과 진입점이 주어졌을 때
   file and an entry point. Note that following this order is recommended for optimal performance:
   1. A `<link rel="stylesheet">` tag for each file in the entry point chunk's `css` list (if it exists)
   2. Recursively follow all chunks in the entry point's `imports` list and include a
      `<link rel="stylesheet">` tag for each CSS file of each imported chunk's `css` list (if it exists).
   3. A tag for the `file` key of the entry point chunk. This can be `<script type="module">` for JavaScript, `<link rel="stylesheet">` for CSS.
   4. Optionally, `<link rel="modulepreload">` tag for the `file` of each imported JavaScript
      chunk, again recursively following the imports starting from the entry point chunk.

   위 예시 매니페스트를 예로 들자면, 진입점 `views/foo.js`에 대해 다음 태그가 포함되어야 합니다.

   ```html
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
        specifier: ^2.0.0-alpha.7
        version: 2.0.0-alpha.7(@algolia/client-search@5.20.3)(@types/react@19.1.8)(axios@1.10.0)(postcss@8.5.6)(react-dom@19.1.0(react@19.1.0))(react@19.1.0)(typescript@5.7.3)
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
        specifier: ^1.6.1
        version: 1.6.1(markdown-it@14.1.0)(vite@packages+vite)
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
        specifier: ^1.6.0
        version: 1.6.0
    "ws": "^8.18.3"
   진입점 `views/foo.js`에 대해서는 아래 코드가 포함되어야 합니다.
   <script type="module" src="assets/bar-gkvgaI9m.js"></script>
   <!-- 선택 사항 -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   ::: details `importedChunks` 의사 구현체
   아래 예시 코드는 `importedChunks` 의사 구현체입니다. TypeScript로 작성되어 있으며,
   실제 적용 시에는 사용하는 프로그래밍 언어와 템플릿 언어에 맞게 수정이 필요합니다:

   ```ts
   import type { Manifest, ManifestChunk } from 'vite'

   export default function importedChunks(
     manifest: Manifest,
     name: string,
   ): ManifestChunk[] {
     const seen = new Set<string>()

     function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
       const chunks: ManifestChunk[] = []
       for (const file of chunk.imports ?? []) {
         const importee = manifest[file]
         if (seen.has(file)) {
        specifier: ^7.27.7
        version: 7.27.7
           continue

        version: 7.27.2(@babel/core@7.27.7)
         chunks.push(...getImportedChunks(importee))
        specifier: ^4.25.1
        version: 4.25.1
       }
     }
        version: 2.1.1(browserslist@4.25.1)

   }
   ```

   :::
  prettier@3.6.0:
    resolution: {integrity: sha512-ujSB9uXHJKzM/2GBuE0hBOUgC77CN3Bnpqa+g80bkv3T3A93wL/xlzDATHhnhkzifz/UE2SNOvmbTz5hSkDlHw==}
  prettier@3.6.0: {}
        specifier: ^7.27.7
        version: 7.27.7
        specifier: ^0.3.26
        version: 0.3.26
        specifier: ^16.6.1
        version: 16.6.1
Repository: git+https://github.com/jridgewell/sourcemaps.git
> Copyright 2024 Justin Ridgewell <justin@ridgewell.name>
        specifier: ^8.18.3
        version: 8.18.3

        specifier: ^4.1.11
        version: 4.1.11(vite@packages+vite)
        specifier: ^4.1.11
        version: 4.1.11
        specifier: ^8.18.3
        version: 8.18.3
        specifier: ^4.20250617.4
        version: 4.20250617.4
        specifier: ^4.1.11
        version: 4.1.11(vite@packages+vite)
        specifier: ^4.1.11
        version: 4.1.11
        specifier: ^4.1.11
        version: 4.1.11
        specifier: ^4.1.11
        version: 4.1.11
  '@babel/core@7.27.7':
    resolution: {integrity: sha512-BU2f9tlKQ5CAthiMIgpzAh4eDTLWo1mqi9jqE2OxMG0E/OM199VJt2q8BztTxpnSW0i1ymdwLXRJnYzvDM5r2w==}
  '@babel/traverse@7.27.7':
    resolution: {integrity: sha512-X6ZlfR/O/s5EQ/SnUSLzr+6kGnkg8HXGMzpgsMsrJVcfDtH1vIp6ctCN4eZ1LS5c0+te5Cb6Y514fASjMRJ1nw==}
    engines: {node: '>=6.9.0'}

  '@eslint/config-array@0.21.0':
    resolution: {integrity: sha512-ENIdc4iLu0d93HeYirvKmrzshzofPw6VkZRKQGe9Nv46ZnWUzcF1xV01dcvEg/1wXUR61OmmlSfyeyO7EvjLxQ==}
  '@eslint/config-helpers@0.3.0':
    resolution: {integrity: sha512-ViuymvFmcJi04qdZeDc2whTHryouGcDlaxPqarTD0ZE10ISpxGUVZGZDx4w01upyIynL3iu6IXH2bS1NhclQMw==}
  '@eslint/js@9.30.0':
    resolution: {integrity: sha512-Wzw3wQwPvc9sHM+NjakWTcPx11mbZyiYHuwWa/QfZ7cIRX7WK54PSk7bdyXDaoaopUcMatv1zaQvOAAO8hCdww==}
  '@iconify-json/simple-icons@1.2.40':
    resolution: {integrity: sha512-sr2fbrS8rRhJNap41ucTStctxTcWQ3lcsHkY3loc4Yt1KNOne6D+l1JTOQCDj9f/VrUktVIEdaRQoYTvqfuSSw==}
  '@iconify-json/vscode-icons@1.2.23':
    resolution: {integrity: sha512-gFTcKecKra2/b5SbGDgHGI/l8CuikHyBPmqGlK+YCmS8AK72dtDQbUekdoACsju/3TYS37QvdPoOQwnyx2LdYg==}
  '@isaacs/balanced-match@4.0.1':
    resolution: {integrity: sha512-yzMTt9lEb8Gv7zRioUilSglI0c0smZ9k5D65677DLWLtWJaXIS3CqcGyUFByYKlnUj6TkjLVs54fBl6+TiGQDQ==}
    engines: {node: 20 || >=22}

  '@isaacs/brace-expansion@5.0.0':
    resolution: {integrity: sha512-ZT55BDLV0yv0RBm2czMiZ+SqCGO7AvmOM3G/w2xhVPH+te0aKgFjmBvGlL1dH+ql2tgGO3MVrbb3jCKyvpgnxA==}
    engines: {node: 20 || >=22}

  '@jridgewell/trace-mapping@0.3.26':
    resolution: {integrity: sha512-Z9rjt4BUVEbLFpw0qjCklVxxf421wrmcbP4w+LmBUxYCyJTYYSclgJD0YsCgGqQCtCIPiz7kjbYYJiAKhjJ3kA==}
  '@rolldown/pluginutils@1.0.0-beta.19':
    resolution: {integrity: sha512-3FL3mnMbPu0muGOCaKAhhFEYmqv9eTfPSJRJmANrCwtgK8VuxpsZDGK+m0LYAGoyO8+0j5uRe4PeyPDK1yA/hA==}

  '@tailwindcss/node@4.1.11':
    resolution: {integrity: sha512-yzhzuGRmv5QyU9qLNg4GTlYI6STedBWRE7NjxP45CsFYYq9taI0zJXZBMqIC/c8fViNLhmrbpSFS57EoxUmD6Q==}
  '@tailwindcss/oxide-android-arm64@4.1.11':
    resolution: {integrity: sha512-3IfFuATVRUMZZprEIx9OGDjG3Ou3jG4xQzNTvjDoKmU9JdmoCohQJ83MYd0GPnQIu89YoJqvMM0G3uqLRFtetg==}
  '@tailwindcss/oxide-darwin-arm64@4.1.11':
    resolution: {integrity: sha512-ESgStEOEsyg8J5YcMb1xl8WFOXfeBmrhAwGsFxxB2CxY9evy63+AtpbDLAyRkJnxLy2WsD1qF13E97uQyP1lfQ==}
  '@tailwindcss/oxide-darwin-x64@4.1.11':
    resolution: {integrity: sha512-EgnK8kRchgmgzG6jE10UQNaH9Mwi2n+yw1jWmof9Vyg2lpKNX2ioe7CJdf9M5f8V9uaQxInenZkOxnTVL3fhAw==}
  '@tailwindcss/oxide-freebsd-x64@4.1.11':
    resolution: {integrity: sha512-xdqKtbpHs7pQhIKmqVpxStnY1skuNh4CtbcyOHeX1YBE0hArj2romsFGb6yUmzkq/6M24nkxDqU8GYrKrz+UcA==}
  '@tailwindcss/oxide-linux-arm-gnueabihf@4.1.11':
    resolution: {integrity: sha512-ryHQK2eyDYYMwB5wZL46uoxz2zzDZsFBwfjssgB7pzytAeCCa6glsiJGjhTEddq/4OsIjsLNMAiMlHNYnkEEeg==}
  '@tailwindcss/oxide-linux-arm64-gnu@4.1.11':
    resolution: {integrity: sha512-mYwqheq4BXF83j/w75ewkPJmPZIqqP1nhoghS9D57CLjsh3Nfq0m4ftTotRYtGnZd3eCztgbSPJ9QhfC91gDZQ==}
  '@tailwindcss/oxide-linux-arm64-musl@4.1.11':
    resolution: {integrity: sha512-m/NVRFNGlEHJrNVk3O6I9ggVuNjXHIPoD6bqay/pubtYC9QIdAMpS+cswZQPBLvVvEF6GtSNONbDkZrjWZXYNQ==}
  '@tailwindcss/oxide-linux-x64-gnu@4.1.11':
    resolution: {integrity: sha512-YW6sblI7xukSD2TdbbaeQVDysIm/UPJtObHJHKxDEcW2exAtY47j52f8jZXkqE1krdnkhCMGqP3dbniu1Te2Fg==}
  '@tailwindcss/oxide-linux-x64-musl@4.1.11':
    resolution: {integrity: sha512-e3C/RRhGunWYNC3aSF7exsQkdXzQ/M+aYuZHKnw4U7KQwTJotnWsGOIVih0s2qQzmEzOFIJ3+xt7iq67K/p56Q==}
  '@tailwindcss/oxide-wasm32-wasi@4.1.11':
    resolution: {integrity: sha512-Xo1+/GU0JEN/C/dvcammKHzeM6NqKovG+6921MR6oadee5XPBaKOumrJCXvopJ/Qb5TH7LX/UAywbqrP4lax0g==}
  '@tailwindcss/oxide-win32-arm64-msvc@4.1.11':
    resolution: {integrity: sha512-UgKYx5PwEKrac3GPNPf6HVMNhUIGuUh4wlDFR2jYYdkX6pL/rn73zTq/4pzUm8fOjAn5L8zDeHp9iXmUGOXZ+w==}
  '@tailwindcss/oxide-win32-x64-msvc@4.1.11':
    resolution: {integrity: sha512-YfHoggn1j0LK7wR82TOucWc5LDCguHnoS879idHekmmiR7g9HUtMw9MI0NHatS28u/Xlkfi9w5RJWgz2Dl+5Qg==}
  '@tailwindcss/oxide@4.1.11':
    resolution: {integrity: sha512-Q69XzrtAhuyfHo+5/HMgr1lAiPP/G40OMFAnws7xcFEYqcypZmdW8eGXaOUIeOl1dzPJBPENXgbjsOyhg2nkrg==}
  '@tailwindcss/postcss@4.1.11':
    resolution: {integrity: sha512-q/EAIIpF6WpLhKEuQSEVMZNMIY8KhWoAemZ9eylNAih9jxMGAYPPWBn3I9QL/2jZ+e7OEz/tZkX5HwbBR4HohA==}
  '@tailwindcss/vite@4.1.11':
    resolution: {integrity: sha512-RHYhrR3hku0MJFRV+fN2gNbDNEh3dwKvY8XJvTxCSXeMOsCRSr+uKvDWQcbizrHgjML6ZmTE5OwMrl5wKcujCw==}
  '@types/node@22.15.34':
    resolution: {integrity: sha512-8Y6E5WUupYy1Dd0II32BsWAx5MWdcnRd8L84Oys3veg1YrYtNtzgO4CFhiBg6MDSjk7Ay36HYOnU7/tuOzIzcw==}
  '@typescript-eslint/eslint-plugin@8.35.0':
    resolution: {integrity: sha512-ijItUYaiWuce0N1SoSMrEd0b6b6lYkYt99pqCPfybd+HKVXtEvYhICfLdwp42MhiI5mp0oq7PKEL+g1cNiz/Eg==}
      '@typescript-eslint/parser': ^8.35.0
  '@typescript-eslint/parser@8.35.0':
    resolution: {integrity: sha512-6sMvZePQrnZH2/cJkwRpkT7DxoAWh+g6+GFRK6bV3YQo7ogi3SX5rgF6099r5Q53Ma5qeT7LGmOmuIutF4t3lA==}
  '@typescript-eslint/project-service@8.35.0':
    resolution: {integrity: sha512-41xatqRwWZuhUMF/aZm2fcUsOFKNcG28xqRSS6ZVr9BVJtGExosLAm5A1OxTjRMagx8nJqva+P5zNIGt8RIgbQ==}
  '@typescript-eslint/scope-manager@8.35.0':
    resolution: {integrity: sha512-+AgL5+mcoLxl1vGjwNfiWq5fLDZM1TmTPYs2UkyHfFhgERxBbqHlNjRzhThJqz+ktBqTChRYY6zwbMwy0591AA==}
  '@typescript-eslint/tsconfig-utils@8.35.0':
    resolution: {integrity: sha512-04k/7247kZzFraweuEirmvUj+W3bJLI9fX6fbo1Qm2YykuBvEhRTPl8tcxlYO8kZZW+HIXfkZNoasVb8EV4jpA==}
  '@typescript-eslint/type-utils@8.35.0':
    resolution: {integrity: sha512-ceNNttjfmSEoM9PW87bWLDEIaLAyR+E6BoYJQ5PfaDau37UGca9Nyq3lBk8Bw2ad0AKvYabz6wxc7DMTO2jnNA==}
  '@typescript-eslint/types@8.35.0':
    resolution: {integrity: sha512-0mYH3emanku0vHw2aRLNGqe7EXh9WHEhi7kZzscrMDf6IIRUQ5Jk4wp1QrledE/36KtdZrVfKnE32eZCf/vaVQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}

  '@typescript-eslint/typescript-estree@8.35.0':
    resolution: {integrity: sha512-F+BhnaBemgu1Qf8oHrxyw14wq6vbL8xwWKKMwTMwYIRmFFY/1n/9T/jpbobZL8vp7QyEUcC6xGrnAO4ua8Kp7w==}
  '@typescript-eslint/utils@8.35.0':
    resolution: {integrity: sha512-nqoMu7WWM7ki5tPgLVsmPM8CkqtoPUG6xXGeefM5t4x3XumOEKMoUZPdi+7F+/EotukN4R9OWdmDxN80fqoZeg==}
  '@typescript-eslint/visitor-keys@8.35.0':
    resolution: {integrity: sha512-zTh2+1Y8ZpmeQaQVIc/ZZxsx8UzgKJyNg1PTvjzC7WMhPSVS8bfDX34k1SrwOf016qd5RU3az2UxUNue3IfQ5g==}
  '@unrs/resolver-binding-android-arm-eabi@1.9.2':
    resolution: {integrity: sha512-tS+lqTU3N0kkthU+rYp0spAYq15DU8ld9kXkaKg9sbQqJNF+WPMuNHZQGCgdxrUOEO0j22RKMwRVhF1HTl+X8A==}
  '@unrs/resolver-binding-android-arm64@1.9.2':
    resolution: {integrity: sha512-MffGiZULa/KmkNjHeuuflLVqfhqLv1vZLm8lWIyeADvlElJ/GLSOkoUX+5jf4/EGtfwrNFcEaB8BRas03KT0/Q==}
  '@unrs/resolver-binding-darwin-arm64@1.9.2':
    resolution: {integrity: sha512-dzJYK5rohS1sYl1DHdJ3mwfwClJj5BClQnQSyAgEfggbUwA9RlROQSSbKBLqrGfsiC/VyrDPtbO8hh56fnkbsQ==}
  '@unrs/resolver-binding-darwin-x64@1.9.2':
    resolution: {integrity: sha512-gaIMWK+CWtXcg9gUyznkdV54LzQ90S3X3dn8zlh+QR5Xy7Y+Efqw4Rs4im61K1juy4YNb67vmJsCDAGOnIeffQ==}
  '@unrs/resolver-binding-freebsd-x64@1.9.2':
    resolution: {integrity: sha512-S7QpkMbVoVJb0xwHFwujnwCAEDe/596xqY603rpi/ioTn9VDgBHnCCxh+UFrr5yxuMH+dliHfjwCZJXOPJGPnw==}
  '@unrs/resolver-binding-linux-arm-gnueabihf@1.9.2':
    resolution: {integrity: sha512-+XPUMCuCCI80I46nCDFbGum0ZODP5NWGiwS3Pj8fOgsG5/ctz+/zzuBlq/WmGa+EjWZdue6CF0aWWNv84sE1uw==}
  '@unrs/resolver-binding-linux-arm-musleabihf@1.9.2':
    resolution: {integrity: sha512-sqvUyAd1JUpwbz33Ce2tuTLJKM+ucSsYpPGl2vuFwZnEIg0CmdxiZ01MHQ3j6ExuRqEDUCy8yvkDKvjYFPb8Zg==}
  '@unrs/resolver-binding-linux-arm64-gnu@1.9.2':
    resolution: {integrity: sha512-UYA0MA8ajkEDCFRQdng/FVx3F6szBvk3EPnkTTQuuO9lV1kPGuTB+V9TmbDxy5ikaEgyWKxa4CI3ySjklZ9lFA==}
  '@unrs/resolver-binding-linux-arm64-musl@1.9.2':
    resolution: {integrity: sha512-P/CO3ODU9YJIHFqAkHbquKtFst0COxdphc8TKGL5yCX75GOiVpGqd1d15ahpqu8xXVsqP4MGFP2C3LRZnnL5MA==}
  '@unrs/resolver-binding-linux-ppc64-gnu@1.9.2':
    resolution: {integrity: sha512-uKStFlOELBxBum2s1hODPtgJhY4NxYJE9pAeyBgNEzHgTqTiVBPjfTlPFJkfxyTjQEuxZbbJlJnMCrRgD7ubzw==}
  '@unrs/resolver-binding-linux-riscv64-gnu@1.9.2':
    resolution: {integrity: sha512-LkbNnZlhINfY9gK30AHs26IIVEZ9PEl9qOScYdmY2o81imJYI4IMnJiW0vJVtXaDHvBvxeAgEy5CflwJFIl3tQ==}
  '@unrs/resolver-binding-linux-riscv64-musl@1.9.2':
    resolution: {integrity: sha512-vI+e6FzLyZHSLFNomPi+nT+qUWN4YSj8pFtQZSFTtmgFoxqB6NyjxSjAxEC1m93qn6hUXhIsh8WMp+fGgxCoRg==}
  '@unrs/resolver-binding-linux-s390x-gnu@1.9.2':
    resolution: {integrity: sha512-sSO4AlAYhSM2RAzBsRpahcJB1msc6uYLAtP6pesPbZtptF8OU/CbCPhSRW6cnYOGuVmEmWVW5xVboAqCnWTeHQ==}
  '@unrs/resolver-binding-linux-x64-gnu@1.9.2':
    resolution: {integrity: sha512-jkSkwch0uPFva20Mdu8orbQjv2A3G88NExTN2oPTI1AJ+7mZfYW3cDCTyoH6OnctBKbBVeJCEqh0U02lTkqD5w==}
  '@unrs/resolver-binding-linux-x64-musl@1.9.2':
    resolution: {integrity: sha512-Uk64NoiTpQbkpl+bXsbeyOPRpUoMdcUqa+hDC1KhMW7aN1lfW8PBlBH4mJ3n3Y47dYE8qi0XTxy1mBACruYBaw==}
  '@unrs/resolver-binding-wasm32-wasi@1.9.2':
    resolution: {integrity: sha512-EpBGwkcjDicjR/ybC0g8wO5adPNdVuMrNalVgYcWi+gYtC1XYNuxe3rufcO7dA76OHGeVabcO6cSkPJKVcbCXQ==}
  '@unrs/resolver-binding-win32-arm64-msvc@1.9.2':
    resolution: {integrity: sha512-EdFbGn7o1SxGmN6aZw9wAkehZJetFPao0VGZ9OMBwKx6TkvDuj6cNeLimF/Psi6ts9lMOe+Dt6z19fZQ9Ye2fw==}
  '@unrs/resolver-binding-win32-ia32-msvc@1.9.2':
    resolution: {integrity: sha512-JY9hi1p7AG+5c/dMU8o2kWemM8I6VZxfGwn1GCtf3c5i+IKcMo2NQ8OjZ4Z3/itvY/Si3K10jOBQn7qsD/whUA==}
  '@unrs/resolver-binding-win32-x64-msvc@1.9.2':
    resolution: {integrity: sha512-ryoo+EB19lMxAd80ln9BVf8pdOAxLb97amrQ3SFN9OCRn/5M5wvwDgAe4i8ZjhpbiHoDeP8yavcTEnpKBo7lZg==}
  '@vitejs/plugin-vue@6.0.0':
    resolution: {integrity: sha512-iAliE72WsdhjzTOp2DtvKThq1VBC4REhwRcaA+zPAAph6I+OQhUXv+Xu2KS7ElxYtb7Zc/3R30Hwv1DxEo7NXQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
  browserslist@4.25.1:
    resolution: {integrity: sha512-KGj0KoOMXLpSNkkEI6Z6mShmQy0bc1I+T7K9N81k4WWMrfz+6fQ6es80B/YLAeRoKvjYE1YSHHOW1qe9xIVzHw==}
  caniuse-lite@1.0.30001726:
    resolution: {integrity: sha512-VQAUIUzBiZ/UnlM28fSp2CRF3ivUn1BWEvxMcVTNwpw91Py1pGbPIyIKtd+tzct9C3ouceCVdGAXxZOpZAsgdw==}
  dotenv@16.6.1:
    resolution: {integrity: sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==}
  electron-to-chromium@1.5.177:
    resolution: {integrity: sha512-7EH2G59nLsEMj97fpDuvVcYi6lwTcM1xuWw3PssD8xzboAW7zj7iB3COEEEATUfjLHrs5uKBLQT03V/8URx06g==}
  eslint-import-context@0.1.9:
    resolution: {integrity: sha512-K9Hb+yRaGAGUbwjhFNHvSmmkZs9+zbuoe3kFQ4V1wYjrepUFYM2dZAfNtjbbj3qsPfUfsA68Bx/ICWQMi+C8Eg==}
  eslint-plugin-import-x@4.16.1:
    resolution: {integrity: sha512-vPZZsiOKaBAIATpFE2uMI4w5IRwdv/FpQ+qZZMR4E+PeOcM4OeoEbqxRMnywdxP19TyB/3h6QBB0EWon7letSQ==}
  eslint@9.30.0:
    resolution: {integrity: sha512-iN/SiPxmQu6EVkf+m1qpBxzUhE12YqFLOSySuOyVLJLEF9nzTf+h/1AJYc1JWzCnktggeNrjvQGLngDzXirU6g==}
  linkify-it@5.0.0:
    resolution: {integrity: sha512-5aHCbzQRADcdP+ATqnDuhhJ/MRIqDkZX5pyjFHRRysS8vZ5AbqGEoFIb6pYHPZ+L/OC2Lc+xT8uHVVR5CAK/wQ==}

  markdown-it@14.1.0:
    resolution: {integrity: sha512-a54IwgWPaeBCAAsv13YgmALOF1elABB08FxO9i+r4VFk5Vl4pKokRPeX8u5TCgSsPi6ec1otfLjdOpVcgbpshg==}
    hasBin: true

  mdurl@2.0.0:
    resolution: {integrity: sha512-Lf+9+2r+Tdp5wXDXC4PcIBjTDtq4UKjCPMQhKIuzpJNW0b96kVqSwW0bT7FhRSfmAiFYgP+SCRvdrDozfh0U5w==}

  miniflare@4.20250617.4:
    resolution: {integrity: sha512-IAoApFKxOJlaaFkym5ETstVX3qWzVt3xyqCDj6vSSTgEH3zxZJ5417jZGg8iQfMHosKCcQH1doPPqqnOZm/yrw==}
  minimatch@10.0.3:
    resolution: {integrity: sha512-IPZ167aShDZZUMdRk66cyQAW3qr0WzbHkPdMYa8bzZhlHhO3jALbKdxcaak7W9FfT2rZNpQuUu4Od7ILEpXSaw==}
    engines: {node: 20 || >=22}

  napi-postinstall@0.2.5:
    resolution: {integrity: sha512-kmsgUvCRIJohHjbZ3V8avP0I1Pekw329MVAMDzVxsrkjgdnqiwvMX5XwR+hWV66vsAtZ+iM+fVnq8RTQawUmCQ==}
  prettier@3.6.2:
    resolution: {integrity: sha512-I7AIg5boAr5R0FFtJ6rCfD+LFsWHp81dolrFD8S79U9tb8Az2nGrJncnMSnys+bpQJfRUzqs9hnA81OAA3hCuQ==}
  punycode.js@2.3.1:
    resolution: {integrity: sha512-uxFIHU0YlHYhDQtV4R9J6a52SLx28BCjT+4ieh7IGbgwVJWO+km431c4yRlREUAsAmt/uMjQUyQHNEPf0M39CA==}
    engines: {node: '>=6'}

  stable-hash-x@0.2.0:
    resolution: {integrity: sha512-o3yWv49B/o4QZk5ZcsALc6t0+eCelPc44zZsLtCQnZPDwFpDYSWcDnrv2TtMmMbQ7uKo3J0HTURCqckw23czNQ==}
  tailwindcss@4.1.11:
    resolution: {integrity: sha512-2E9TBm6MDD/xKYe+dvJZAmg3yxIEDNRc0jwlNyDg/4Fil2QcSLjFKGVff0lAf1jjeaArlG/M75Ey/EYr/OJtBA==}
  tokenx@1.1.0:
    resolution: {integrity: sha512-KCjtiC2niPwTSuz4ktM82Ki5bjqBwYpssiHDsGr5BpejN/B3ksacRvrsdoxljdMIh2nCX78alnDkeemBmYUmTA==}
  typescript-eslint@8.35.0:
    resolution: {integrity: sha512-uEnz70b7kBz6eg/j0Czy6K5NivaYopgxRjsnAJ2Fx5oTLo3wefTHIbL7AkQr1+7tJCRVpTs/wiM8JR/11Loq9A==}
  uc.micro@2.1.0:
    resolution: {integrity: sha512-ARDJmphmdvUk6Glw7y9DQ2bFkKBHwQHLi2lsaH6PPmz/Ka9sFOBsBluozhDltWmnv9u/cF6Rt87znRTPV+yp/A==}

  unrs-resolver@1.9.2:
    resolution: {integrity: sha512-VUyWiTNQD7itdiMuJy+EuLEErLj3uwX/EpHQF8EOf33Dq3Ju6VW1GXm+swk6+1h7a49uv9fKZ+dft9jU7esdLA==}
  vitepress-plugin-group-icons@1.6.1:
    resolution: {integrity: sha512-eoFlFAhAy/yTZDbaIgA/nMbjVYXkf8pz8rr75MN2VCw7yH60I3cw6bW5EuwddAeafZtBqbo8OsEGU7TIWFiAjg==}
  vitepress-plugin-llms@1.6.0:
    resolution: {integrity: sha512-5EjrMvtggY61fAnhC+rldzw1UqPxwdbtsh/w15Z/Gy7u/SOsPQgSdDzoQm1iFet6ofAzUB2TXA8wj5KZX9TKSA==}
  vitepress@2.0.0-alpha.7:
    resolution: {integrity: sha512-75xXvCWymnSgA7BFt1BmiXnusl4aeV4sM6DpIo9sf2OvkNER3cMLWN6xqZrLGu3SNaQccfS5u3ikCqAnA4p70w==}
      oxc-minify: ^0.74.0
  ws@8.18.3:
    resolution: {integrity: sha512-PEIGCY5tSlUt50cqyMXfCzX+oOPqN0vuGqWzbcJ2xvnkzkq46oOpz7dQaTDBdfICb4N14+GARUDw2XV2N4tvzg==}
      '@jridgewell/trace-mapping': 0.3.26
  '@babel/core@7.27.7':
      '@babel/generator': 7.27.5
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
      '@babel/parser': 7.27.7
      '@babel/traverse': 7.27.7
      '@babel/types': 7.27.7
      '@jridgewell/trace-mapping': 0.3.26
      '@babel/types': 7.27.7
      '@babel/types': 7.27.7
      browserslist: 4.25.1
  '@babel/helper-create-class-features-plugin@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-replace-supers': 7.27.1(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/helper-create-regexp-features-plugin@7.26.3(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/helper-create-regexp-features-plugin@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/helper-define-polyfill-provider@0.6.3(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/types': 7.27.7
  '@babel/helper-module-imports@7.27.1':
      '@babel/traverse': 7.27.7
      '@babel/types': 7.27.7
  '@babel/helper-module-transforms@7.27.3(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.7
      '@babel/types': 7.27.7
  '@babel/helper-remap-async-to-generator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/helper-replace-supers@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
      '@babel/traverse': 7.27.4
      '@babel/types': 7.27.7
      '@babel/traverse': 7.27.4
      '@babel/types': 7.27.7
      '@babel/types': 7.27.7
  '@babel/plugin-bugfix-firefox-class-in-computed-class-key@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/plugin-bugfix-safari-class-field-initializer-scope@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/plugin-transform-optional-chaining': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/plugin-proposal-private-property-in-object@7.21.0-placeholder-for-preset-env.2(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-syntax-import-assertions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-syntax-import-attributes@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-syntax-unicode-sets-regex@7.18.6(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.26.3(@babel/core@7.27.7)
  '@babel/plugin-transform-arrow-functions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-async-generator-functions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-remap-async-to-generator': 7.27.1(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-async-to-generator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-remap-async-to-generator': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-block-scoped-functions@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-block-scoping@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-class-properties@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-class-static-block@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-classes@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-replace-supers': 7.27.1(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-computed-properties@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-destructuring@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-dotall-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-duplicate-keys@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-duplicate-named-capturing-groups-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-dynamic-import@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-exponentiation-operator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-export-namespace-from@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-for-of@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-function-name@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-json-strings@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-logical-assignment-operators@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-member-expression-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-modules-amd@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
  '@babel/plugin-transform-modules-commonjs@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
  '@babel/plugin-transform-modules-systemjs@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
      '@babel/traverse': 7.27.4
  '@babel/plugin-transform-modules-umd@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-module-transforms': 7.27.3(@babel/core@7.27.7)
  '@babel/plugin-transform-named-capturing-groups-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-new-target@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-nullish-coalescing-operator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-numeric-separator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-object-rest-spread@7.27.2(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/plugin-transform-destructuring': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-parameters': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-object-super@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-replace-supers': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-optional-catch-binding@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-optional-chaining@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-parameters@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-private-methods@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-private-property-in-object@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-class-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-property-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-regenerator@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-regexp-modifiers@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-reserved-words@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-shorthand-properties@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-spread@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-sticky-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-template-literals@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-typeof-symbol@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-unicode-escapes@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
  '@babel/plugin-transform-unicode-property-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-unicode-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/plugin-transform-unicode-sets-regex@7.27.1(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/helper-create-regexp-features-plugin': 7.27.1(@babel/core@7.27.7)
  '@babel/preset-env@7.27.2(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/plugin-bugfix-firefox-class-in-computed-class-key': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-safari-class-field-initializer-scope': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-proposal-private-property-in-object': 7.21.0-placeholder-for-preset-env.2(@babel/core@7.27.7)
      '@babel/plugin-syntax-import-assertions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-syntax-import-attributes': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-syntax-unicode-sets-regex': 7.18.6(@babel/core@7.27.7)
      '@babel/plugin-transform-arrow-functions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-async-generator-functions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-async-to-generator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-block-scoped-functions': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-block-scoping': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-class-properties': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-class-static-block': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-classes': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-computed-properties': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-destructuring': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-dotall-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-duplicate-keys': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-duplicate-named-capturing-groups-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-dynamic-import': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-exponentiation-operator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-export-namespace-from': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-for-of': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-function-name': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-json-strings': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-logical-assignment-operators': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-member-expression-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-amd': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-commonjs': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-systemjs': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-modules-umd': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-named-capturing-groups-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-new-target': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-nullish-coalescing-operator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-numeric-separator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-object-rest-spread': 7.27.2(@babel/core@7.27.7)
      '@babel/plugin-transform-object-super': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-optional-catch-binding': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-optional-chaining': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-parameters': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-private-methods': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-private-property-in-object': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-property-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-regenerator': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-regexp-modifiers': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-reserved-words': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-shorthand-properties': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-spread': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-sticky-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-template-literals': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-typeof-symbol': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-escapes': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-property-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/plugin-transform-unicode-sets-regex': 7.27.1(@babel/core@7.27.7)
      '@babel/preset-modules': 0.1.6-no-external-plugins(@babel/core@7.27.7)
      babel-plugin-polyfill-corejs2: 0.4.12(@babel/core@7.27.7)
      babel-plugin-polyfill-corejs3: 0.11.1(@babel/core@7.27.7)
      babel-plugin-polyfill-regenerator: 0.6.3(@babel/core@7.27.7)
  '@babel/preset-modules@0.1.6-no-external-plugins(@babel/core@7.27.7)':
      '@babel/core': 7.27.7
      '@babel/types': 7.27.7
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  '@babel/traverse@7.27.4':
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  '@babel/traverse@7.27.7':
      '@babel/generator': 7.27.5
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  '@eslint-community/eslint-utils@4.7.0(eslint@9.30.0(jiti@2.4.2))':
      eslint: 9.30.0(jiti@2.4.2)
  '@eslint/config-array@0.21.0':
  '@eslint/config-helpers@0.3.0': {}
  '@eslint/js@9.30.0': {}
  '@iconify-json/simple-icons@1.2.40':
  '@iconify-json/vscode-icons@1.2.23':
  '@isaacs/balanced-match@4.0.1': {}

  '@isaacs/brace-expansion@5.0.0':
    dependencies:
      '@isaacs/balanced-match': 4.0.1

      '@jridgewell/trace-mapping': 0.3.26
      '@jridgewell/trace-mapping': 0.3.26
  '@jridgewell/trace-mapping@0.3.26':
  '@rolldown/pluginutils@1.0.0-beta.19': {}

  '@tailwindcss/node@4.1.11':
      tailwindcss: 4.1.11
  '@tailwindcss/oxide-android-arm64@4.1.11':
  '@tailwindcss/oxide-darwin-arm64@4.1.11':
  '@tailwindcss/oxide-darwin-x64@4.1.11':
  '@tailwindcss/oxide-freebsd-x64@4.1.11':
  '@tailwindcss/oxide-linux-arm-gnueabihf@4.1.11':
  '@tailwindcss/oxide-linux-arm64-gnu@4.1.11':
  '@tailwindcss/oxide-linux-arm64-musl@4.1.11':
  '@tailwindcss/oxide-linux-x64-gnu@4.1.11':
  '@tailwindcss/oxide-linux-x64-musl@4.1.11':
  '@tailwindcss/oxide-wasm32-wasi@4.1.11':
  '@tailwindcss/oxide-win32-arm64-msvc@4.1.11':
  '@tailwindcss/oxide-win32-x64-msvc@4.1.11':
  '@tailwindcss/oxide@4.1.11':
      '@tailwindcss/oxide-android-arm64': 4.1.11
      '@tailwindcss/oxide-darwin-arm64': 4.1.11
      '@tailwindcss/oxide-darwin-x64': 4.1.11
      '@tailwindcss/oxide-freebsd-x64': 4.1.11
      '@tailwindcss/oxide-linux-arm-gnueabihf': 4.1.11
      '@tailwindcss/oxide-linux-arm64-gnu': 4.1.11
      '@tailwindcss/oxide-linux-arm64-musl': 4.1.11
      '@tailwindcss/oxide-linux-x64-gnu': 4.1.11
      '@tailwindcss/oxide-linux-x64-musl': 4.1.11
      '@tailwindcss/oxide-wasm32-wasi': 4.1.11
      '@tailwindcss/oxide-win32-arm64-msvc': 4.1.11
      '@tailwindcss/oxide-win32-x64-msvc': 4.1.11

  '@tailwindcss/postcss@4.1.11':
      '@tailwindcss/node': 4.1.11
      '@tailwindcss/oxide': 4.1.11
      tailwindcss: 4.1.11
  '@tailwindcss/vite@4.1.11(vite@packages+vite)':
      '@tailwindcss/node': 4.1.11
      '@tailwindcss/oxide': 4.1.11
      tailwindcss: 4.1.11
      '@babel/parser': 7.27.7
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
  '@types/node@22.15.34':
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
      '@types/node': 22.15.34
  '@typescript-eslint/eslint-plugin@8.35.0(@typescript-eslint/parser@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@typescript-eslint/parser': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/scope-manager': 8.35.0
      '@typescript-eslint/type-utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/visitor-keys': 8.35.0
      eslint: 9.30.0(jiti@2.4.2)
  '@typescript-eslint/parser@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@typescript-eslint/scope-manager': 8.35.0
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/typescript-estree': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/visitor-keys': 8.35.0
      eslint: 9.30.0(jiti@2.4.2)
      '@typescript-eslint/types': 8.34.1
  '@typescript-eslint/project-service@8.35.0(typescript@5.7.3)':
      '@typescript-eslint/tsconfig-utils': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/types': 8.35.0
  '@typescript-eslint/scope-manager@8.35.0':
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/visitor-keys': 8.35.0
  '@typescript-eslint/tsconfig-utils@8.35.0(typescript@5.7.3)':
  '@typescript-eslint/type-utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@typescript-eslint/typescript-estree': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
  '@typescript-eslint/types@8.35.0': {}

  '@typescript-eslint/typescript-estree@8.35.0(typescript@5.7.3)':
      '@typescript-eslint/project-service': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/tsconfig-utils': 8.35.0(typescript@5.7.3)
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/visitor-keys': 8.35.0
  '@typescript-eslint/utils@8.34.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      eslint: 9.30.0(jiti@2.4.2)
  '@typescript-eslint/utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)':
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      '@typescript-eslint/scope-manager': 8.35.0
      '@typescript-eslint/types': 8.35.0
      '@typescript-eslint/typescript-estree': 8.35.0(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
      eslint-visitor-keys: 4.2.1
  '@typescript-eslint/visitor-keys@8.35.0':
      '@typescript-eslint/types': 8.35.0
  '@unrs/resolver-binding-android-arm-eabi@1.9.2':
  '@unrs/resolver-binding-android-arm64@1.9.2':
  '@unrs/resolver-binding-darwin-arm64@1.9.2':
  '@unrs/resolver-binding-darwin-x64@1.9.2':
  '@unrs/resolver-binding-freebsd-x64@1.9.2':
  '@unrs/resolver-binding-linux-arm-gnueabihf@1.9.2':
  '@unrs/resolver-binding-linux-arm-musleabihf@1.9.2':
  '@unrs/resolver-binding-linux-arm64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-arm64-musl@1.9.2':
  '@unrs/resolver-binding-linux-ppc64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-riscv64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-riscv64-musl@1.9.2':
  '@unrs/resolver-binding-linux-s390x-gnu@1.9.2':
  '@unrs/resolver-binding-linux-x64-gnu@1.9.2':
  '@unrs/resolver-binding-linux-x64-musl@1.9.2':
  '@unrs/resolver-binding-wasm32-wasi@1.9.2':
  '@unrs/resolver-binding-win32-arm64-msvc@1.9.2':
  '@unrs/resolver-binding-win32-ia32-msvc@1.9.2':
  '@unrs/resolver-binding-win32-x64-msvc@1.9.2':
  '@vitejs/plugin-vue@6.0.0(vite@packages+vite)(vue@3.5.17(typescript@5.7.3))':
      '@rolldown/pluginutils': 1.0.0-beta.19
      '@babel/parser': 7.27.7
      '@babel/parser': 7.27.7
      '@babel/parser': 7.27.7
      '@babel/parser': 7.27.7
      browserslist: 4.25.1
  babel-plugin-polyfill-corejs2@0.4.12(@babel/core@7.27.7):
      '@babel/core': 7.27.7
      '@babel/helper-define-polyfill-provider': 0.6.3(@babel/core@7.27.7)
  babel-plugin-polyfill-corejs3@0.11.1(@babel/core@7.27.7):
      '@babel/core': 7.27.7
      '@babel/helper-define-polyfill-provider': 0.6.3(@babel/core@7.27.7)
  babel-plugin-polyfill-regenerator@0.6.3(@babel/core@7.27.7):
      '@babel/core': 7.27.7
      '@babel/helper-define-polyfill-provider': 0.6.3(@babel/core@7.27.7)
      '@babel/types': 7.27.7
  browserslist-to-esbuild@2.1.1(browserslist@4.25.1):
      browserslist: 4.25.1
  browserslist@4.25.1:
      caniuse-lite: 1.0.30001726
      electron-to-chromium: 1.5.177
      update-browserslist-db: 1.1.3(browserslist@4.25.1)
  caniuse-lite@1.0.30001726: {}
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
      browserslist: 4.25.1
      dotenv: 16.6.1
  dotenv@16.6.1: {}
  electron-to-chromium@1.5.177: {}
  eslint-compat-utils@0.5.1(eslint@9.30.0(jiti@2.4.2)):
      eslint: 9.30.0(jiti@2.4.2)
  eslint-import-context@0.1.9(unrs-resolver@1.9.2):
      stable-hash-x: 0.2.0
      unrs-resolver: 1.9.2
  eslint-plugin-es-x@7.8.0(eslint@9.30.0(jiti@2.4.2)):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      eslint: 9.30.0(jiti@2.4.2)
      eslint-compat-utils: 0.5.1(eslint@9.30.0(jiti@2.4.2))
  eslint-plugin-import-x@4.16.1(@typescript-eslint/utils@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2)):
      '@typescript-eslint/types': 8.35.0
      eslint: 9.30.0(jiti@2.4.2)
      eslint-import-context: 0.1.9(unrs-resolver@1.9.2)
      stable-hash-x: 0.2.0
      unrs-resolver: 1.9.2
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
  eslint-plugin-n@17.20.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      '@typescript-eslint/utils': 8.34.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
      eslint-plugin-es-x: 7.8.0(eslint@9.30.0(jiti@2.4.2))
  eslint-plugin-regexp@2.9.0(eslint@9.30.0(jiti@2.4.2)):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      eslint: 9.30.0(jiti@2.4.2)
  eslint@9.30.0(jiti@2.4.2):
      '@eslint-community/eslint-utils': 4.7.0(eslint@9.30.0(jiti@2.4.2))
      '@eslint/config-array': 0.21.0
      '@eslint/config-helpers': 0.3.0
      '@eslint/js': 9.30.0
  linkify-it@5.0.0:
    dependencies:
      uc.micro: 2.1.0

  markdown-it@14.1.0:
    dependencies:
      argparse: 2.0.1
      entities: 4.5.0
      linkify-it: 5.0.0
      mdurl: 2.0.0
      punycode.js: 2.3.1
      uc.micro: 2.1.0

  mdurl@2.0.0: {}

  miniflare@4.20250617.4:
  minimatch@10.0.3:
    dependencies:
      '@isaacs/brace-expansion': 5.0.0

  napi-postinstall@0.2.5: {}
  prettier@3.6.2: {}
  punycode.js@2.3.1: {}

  stable-hash-x@0.2.0: {}
  tailwindcss@4.1.11: {}
  tokenx@1.1.0: {}
  typescript-eslint@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3):
      '@typescript-eslint/eslint-plugin': 8.35.0(@typescript-eslint/parser@8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3))(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/parser': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      '@typescript-eslint/utils': 8.35.0(eslint@9.30.0(jiti@2.4.2))(typescript@5.7.3)
      eslint: 9.30.0(jiti@2.4.2)
  uc.micro@2.1.0: {}

  unrs-resolver@1.9.2:
      napi-postinstall: 0.2.5
      '@unrs/resolver-binding-android-arm-eabi': 1.9.2
      '@unrs/resolver-binding-android-arm64': 1.9.2
      '@unrs/resolver-binding-darwin-arm64': 1.9.2
      '@unrs/resolver-binding-darwin-x64': 1.9.2
      '@unrs/resolver-binding-freebsd-x64': 1.9.2
      '@unrs/resolver-binding-linux-arm-gnueabihf': 1.9.2
      '@unrs/resolver-binding-linux-arm-musleabihf': 1.9.2
      '@unrs/resolver-binding-linux-arm64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-arm64-musl': 1.9.2
      '@unrs/resolver-binding-linux-ppc64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-riscv64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-riscv64-musl': 1.9.2
      '@unrs/resolver-binding-linux-s390x-gnu': 1.9.2
      '@unrs/resolver-binding-linux-x64-gnu': 1.9.2
      '@unrs/resolver-binding-linux-x64-musl': 1.9.2
      '@unrs/resolver-binding-wasm32-wasi': 1.9.2
      '@unrs/resolver-binding-win32-arm64-msvc': 1.9.2
      '@unrs/resolver-binding-win32-ia32-msvc': 1.9.2
      '@unrs/resolver-binding-win32-x64-msvc': 1.9.2

  update-browserslist-db@1.1.3(browserslist@4.25.1):
    dependencies:
      browserslist: 4.25.1
  vitepress-plugin-group-icons@1.6.1(markdown-it@14.1.0)(vite@packages+vite):
      '@iconify-json/vscode-icons': 1.2.23
      markdown-it: 14.1.0
  vitepress-plugin-llms@1.6.0:
      markdown-it: 14.1.0
      minimatch: 10.0.3
      tokenx: 1.1.0
  vitepress@2.0.0-alpha.7(@algolia/client-search@5.20.3)(@types/react@19.1.8)(axios@1.10.0)(postcss@8.5.6)(react-dom@19.1.0(react@19.1.0))(react@19.1.0)(typescript@5.7.3):
      '@iconify-json/simple-icons': 1.2.40
      '@vitejs/plugin-vue': 6.0.0(vite@packages+vite)(vue@3.5.17(typescript@5.7.3))
  vitest@3.2.4(@types/debug@4.1.12)(@types/node@22.15.34):
      '@types/node': 22.15.34
      '@babel/parser': 7.27.7
      '@babel/types': 7.27.7
  ws@8.18.3: {}