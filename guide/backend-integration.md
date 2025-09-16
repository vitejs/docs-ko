# 백엔드 프레임워크와 함께 사용하기 {#backend-integration}

:::tip 참고
기존의 백엔드(Rails, Laravel 등)를 사용해 HTML을 제공하기를 원하지만, 에셋은 Vite를 이용하고자 한다면, [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends)의 방법을 확인해 보세요.

만약 이를 직접 구성하고자 한다면, 아래의 가이드를 따라 진행할 수 있습니다.
:::

1. Vite 설정 파일에서, 진입점을 설정하고 매니페스트를 활성화합니다:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   export default defineConfig({
     server: {
       cors: {
         // 브라우저를 통해 접근하고자 하는 출처
         origin: 'http://my-backend.example.com',
       },
     },
     build: {
       // outDir 위치에 .vite/manifest.json 파일을 생성
       manifest: true,
       rollupOptions: {
         // 기본 .html 진입점을 변경
         input: '/path/to/main.js'
       }
     }
   })
   ```

   만약 [module preload polyfill](/config/build-options.md#build-polyfillmodulepreload)을 비활성화하지 않았다면, 진입점에 폴리필을 가져와야 합니다.

   ```js
   // 앱 진입점에 추가
   import 'vite/modulepreload-polyfill'
   ```

2. 개발 단계에서는 서버의 HTML 템플릿에 다음을 추가합니다(`http://localhost:5173`을 Vite가 실행 중인 로컬 URL로 대체):

   ```html
   <!-- 개발 시 -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   이후 Vite의 에셋에 접근할 수 있도록 아래 두 가지 옵션 중 하나를 적용해 주세요:
   - 백엔드 서버가 Vite 서버에 대한 에셋 요청을 프록시 하도록 설정
   - 에셋의 URL이 상대 경로 대신 백엔드 서버 URL을 사용해 가져와질 수 있도록 [`server.origin`](/config/server-options.md#server-origin) 옵션값을 설정

   위 옵션은 이미지와 같은 에셋이 정상적으로 로드되기 위해 필요합니다.

   만약 React를 `@vitejs/plugin-react`와 함께 사용한다면, 플러그인이 HTML을 수정할 수 없기 때문에, 위의 스크립트 이전에 다음을 추가해야 합니다(`http://localhost:5173`을 Vite가 실행 중인 로컬 URL로 대체):

   ```html
   <script type="module">
     import RefreshRuntime from "http://localhost:5173/@react-refresh"
     RefreshRuntime.injectIntoGlobalHook(window) 
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. For production, after running `vite build`, a `.vite/manifest.json` file will be generated alongside other asset files. An example manifest file looks like this:

   ```json [.vite/manifest.json]
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "logo.svg": {
       "file": "assets/logo-BuPIv-2h.svg",
       "src": "logo.svg"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   매니페스트는 `Record<name, chunk>` 구조를 가지며, 각 청크는 `ManifestChunk` 인터페이스를 따릅니다:

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

   매니페스트의 각 항목은 다음 중 하나를 나타냅니다:
   - **진입 청크**: [`build.rollupOptions.input`](https://rollupjs.org/configuration-options/#input)에 지정된 파일에서 생성됩니다. 이러한 청크는 `isEntry: true`를 가지며, 키는 프로젝트 루트 기준 상대적인 src 경로입니다.
   - **동적 진입 청크**: 동적 가져오기에서 생성됩니다. 이러한 청크는 `isDynamicEntry: true`를 가지며, 키는 프로젝트 루트 기준 상대적인 src 경로입니다.
   - **비진입(Non-entry) 청크**: 생성된 파일 이름에 `_` 접두사를 붙여 키로 사용합니다.
   - **에셋 청크**: 이미지나 폰트와 같은 에셋에서 생성됩니다. 키는 프로젝트 루트 기준 상대적인 src 경로입니다.
   - **CSS 파일**: [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit)이 `false`인 경우, `style.css` 키로 단일 CSS 파일이 생성됩니다. `build.cssCodeSplit`이 `false`가 아닌 경우, 키는 JS 청크와 유사하게 생성됩니다(즉, 진입 청크는 `_` 접두사가 없고 비진입 청크는 `_` 접두사가 있음).

   청크는 정적 및 동적 가져오기에 대한 정보(둘 다 매니페스트의 해당 청크에 매핑되는 키)와 해당 CSS 및 에셋 파일(있는 경우)을 포함합니다.

4. 해시된 파일 이름으로 링크를 렌더링하거나 지시문을 미리 로드하기 위해 이 파일을 사용할 수 있습니다.

   아래는 올바른 링크를 렌더링하는 HTML 템플릿 예시입니다.
   여기서 사용된 구문은 설명을 위한 것이므로, 실제 사용 시에는 서버 템플릿 언어로 대체해 주세요.
   `importedChunks` 함수 역시 예시를 위한 것이며, Vite에서 제공하지 않습니다.

   ```html
   <!-- 프로덕션 (아래 `for ... of` 는 구문입니다 - 옮긴이) -->

   <!-- for cssFile of manifest[name].css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- for chunk of importedChunks(manifest, name) -->
   <!-- for cssFile of chunk.css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- for chunk of importedChunks(manifest, name) -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

   구체적으로, HTML을 생성하는 백엔드는 매니페스트 파일과 진입점이 주어졌을 때
   다음 순서를 따라야 합니다. 최적 성능을 위해 이 순서를 따르는 것을 권장합니다:
   1. 진입점 청크의 `css` 목록(있는 경우)에 있는 각 파일에 대한 `<link rel="stylesheet">` 태그
   2. 진입점의 `imports` 목록에 있는 모든 청크를 재귀적으로 따라가며, 
      가져온 각 청크의 `css` 목록(있는 경우)의 각 CSS 파일에 대한 `<link rel="stylesheet">` 태그를 포함
   3. 진입점 청크의 `file` 키에 대한 태그. JavaScript의 경우 `<script type="module">`, CSS의 경우 `<link rel="stylesheet">`가 될 수 있습니다.
   4. 선택적으로, 진입점 청크에서 시작해 imports를 재귀적으로 따라가며 가져온
      각 JavaScript 청크 파일에 대한 `<link rel="modulepreload">` 태그를 포함

   위 예시 매니페스트를 예로 들자면, 진입점 `views/foo.js`에 대해 다음 태그가 포함되어야 합니다.

   ```html
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/foo-BRBmoGS9.js"></script>
   <!-- 선택 사항 -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   진입점 `views/foo.js`에 대해서는 아래 코드가 포함되어야 합니다.

   ```html
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
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
           continue
         }
         seen.add(file)

         chunks.push(...getImportedChunks(importee))
         chunks.push(importee)
       }

       return chunks
     }

     return getImportedChunks(manifest[name])
   }
   ```

   :::