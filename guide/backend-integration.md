# 백엔드 프레임워크와 함께 사용하기

기존 백엔드(예 : Rails, Laravel)를 사용하여 HTML을 제공하지만 에셋에 Vite를 사용하기를 원한다면 [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends)에 나열된 기존의 통합을 확인하십시오.

또는 다음 단계에 따라 수동으로 구성할 수 있습니다.

1. Vite config 파일에서 항목을 구성하고 빌드 매니페스트를 활성화합니다.

   ```js
   // vite.config.js
   export default {
     build: {
       // outDir에서 manifest.json을 생성합니다.
       manifest: true,
       rollupOptions: {
         // 기본 .html 항목을 덮어씁니다.
         input: '/path/to/main.js'
       }
     }
   }
   ```

   또한 그것들이 자동으로 주입되지 않으므로 항목에 [dynamic import polyfill](/config/#build-polyfilldynamicimport)을 추가해야 합니다.

   ```js
   // 앱 항목의 시작 영역에 추가합니다.
   import 'vite/dynamic-import-polyfill'
   ```

2. 개발을 위해 서버의 HTML 템플릿에 다음을 삽입합니다(`http://localhost:3000`을 Vite가 실행중인 로컬 URL로 대체).

   ```html
   <!-- 개발하는 경우 -->
   <script type="module" src="http://localhost:3000/@vite/client"></script>
   <script type="module" src="http://localhost:3000/main.js"></script>
   ```

   또한 서버가 Vite 작업 디렉토리에서 정적 에셋을 제공하도록 구성되어 있는지 확인하십시오. 그렇지 않으면 이미지와 같은 에셋이 제대로 로드되지 않습니다.

   React를 `@vitejs/plugin-react-refresh`와 함께 사용하는 경우 플러그인이 사용자가 제공하는 HTML을 수정할 수 없기 때문에 위 스크립트 이전에 이것을 추가해야 합니다.

   ```html
   <script type="module">
     import RefreshRuntime from "http://localhost:3000/@react-refresh"
     RefreshRuntime.injectIntoGlobalHook(window) 
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. 운영하는 경우 : `vite build`를 실행한 후에 `manifest.json`파일은 다른 에셋 파일과 함께 생성됩니다. 매니페스트 파일 예시는 다음과 같습니다.

   ```json
   {
     "main.js": {
       "file": "assets/main.4889e940.js",
       "src": "main.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js"
     }
   }
   ```

   - 매니페스트는 `Record<name, chunk>` 구조를 가집니다.
   - 항목 또는 동적 항목 청크의 키는 프로젝트 루트의 상대 src 경로입니다.
   - 항목이 아닌 청크의 경우 키는 `_`가 접두사로 붙은 파일명이 기본 이름이 됩니다.
   - 청크에는 정적 및 동적 불러오기(둘 다 매니페스트의 해당 청크에 매핑되는 키)에 대한 정보와 해당 css 및 에셋 파일(있는 경우)이 포함됩니다.

   해시 된 파일 이름으로 링크를 렌더링하거나 지시문을 미리 로드하기 위해 이 파일을 사용할 수 있습니다(참고 : 여기에 있는 구문은 설명하기 위한 용도이며 서버 템플릿 언어로 대체합니다).

   ```html
   <!-- 운영하는 경우 -->
   <link rel="stylesheet" href="/assets/{{ manifest['main.js'].css }}" />
   <script type="module" src="/assets/{{ manifest['main.js'].file }}"></script>
   ```
   
