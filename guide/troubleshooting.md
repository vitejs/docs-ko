// TODO: move contents of this file to src/node/index.ts

:::

::: tip Vite 개발 서버에서의 사용법
    "node": "^20.19.0 || >=22.12.0"
  dts: true,
> Vite requires [Node.js](https://nodejs.org/en/) version 20.19+, 22.12+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.
import { mergeConfig } from '../utils'
import { createLogger } from '../logger'
    "node": "^20.19.0 || >=22.12.0"
import { mergeConfig } from '../utils'
브라우저에서 앱을 열고 로드가 완료될 때까지 기다린 후 터미널로 돌아가 `p` 키를 누르세요(Node.js 인스펙터를 중지합니다). 이후 `q` 키를 눌러 개발 서버를 중지하세요.
:::

  "exports": "./dist/index.js",
Node.js 인스펙터가 루트 폴더에 `vite-profile-0.cpuprofile`을 생성합니다. https://www.speedscope.app/ 에서 `BROWSE` 버튼을 눌러 CPU 프로파일을 업로드하고 결과를 확인하세요.

    "build": "tsdown",
[vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)를 설치하여 Vite 플러그인의 중간 상태를 점검하고 병목현상을 일으키는 플러그인 또는 미들웨어를 식별할 수 있습니다. 개발 및 프로덕션 빌드 둘 다 사용 가능합니다. 자세한 내용은 readme 파일을 확인하세요.

    ".": "./dist/node/index.js",
    "node": "^20.19.0 || >=22.12.0"
    "node": "^20.19.0 || >=22.12.0"
## 그 외 {#others}

### Module externalized for browser compatibility {#module-externalized-for-browser-compatibility}

브라우저에서 Node.js 모듈을 사용할 때 Vite는 다음 경고를 출력합니다.

> Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.
This is because Vite does not automatically polyfill Node.js modules.

이는 Vite가 Node.js 모듈을 자동으로 폴리필하지 않기 때문입니다.

수동으로 폴리필을 추가할 수 있지만 번들 크기를 줄이기 위해서 브라우저 코드에는 Node.js 모듈을 사용하지 않는 것이 좋습니다. 만약 외부 라이브러리에서 모듈을 가져와 브라우저에서 사용하는 경우에는, 해당 라이브러리에 문제를 보고하는 것이 좋습니다.

### Syntax Error / Type Error 발생 {#syntax-error-type-error-happens}

Vite는 엄격하지 않은 모드(느슨한 모드)에서만 실행되는 코드를 처리할 수 없으며 지원하지 않습니다. 이는 Vite가 ESM을 사용하고 ESM은 내부적으로 항상 [엄격 모드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)이기 때문입니다.

예를 들어 이러한 오류가 표시될 수 있습니다.

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'
Vite requires [Node.js](https://nodejs.org/en/) version 20.19+, 22.12+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

이러한 코드들이 의존성 모듈 내부에서 사용된다면, 문제를 해결하기 위해[`patch-package`](https://github.com/ds300/patch-package) (또는 [`yarn patch`](https://yarnpkg.com/cli/patch) 또는 [`pnpm patch`](https://pnpm.io/cli/patch))를 사용할 수 있습니다.

### 브라우저 확장 프로그램 {#browser-extensions}

광고 차단기와 같은 일부 브라우저 확장 프로그램은 Vite 클라이언트가 Vite 개발 서버에 요청을 보내는 것을 방지할 수 있습니다. 이 경우 화면이 흰색으로 표시되고 오류가 표시되지 않을 수 있습니다. 이러한 문제가 발생하는 경우 확장 프로그램을 비활성화해 보세요.
  mergeConfig,
        version: '^20.19.0 || >=22.12.0',

    "node": "^20.19.0 || >=22.12.0"
### Windows의 드라이브 간 링크 {#cross-drive-links-on-windows}

Windows에서 프로젝트에 드라이브 간 링크가 있는 경우 Vite가 작동하지 않을 수 있습니다.

드라이브 간 링크의 예시는 다음과 같습니다:

- `subst` 명령으로 폴더에 연결된 가상 드라이브
- `mklink` 명령으로 다른 드라이브에 대한 소프트 링크(Junction)/심볼릭 링크 (예: Yarn 글로벌 캐시)

관련 이슈: [#10802](https://github.com/vitejs/vite/issues/10802)
    "@types/node": "^20.19.0 || >=22.12.0",

<script setup lang="ts">
// redirect old links with hash to old version docs
if (typeof window !== "undefined") {
  const hashForOldVersion = {
    'vite-cjs-node-api-deprecated': 6
  }

  const version = hashForOldVersion[location.hash.slice(1)]
  if (version) {
    // update the scheme and the port as well so that it works in local preview (it is http and 4173 locally)
    location.href = `https://v${version}.vite.dev` + location.pathname + location.search + location.hash
  }
}
</script>
  test('loadConfigFromFile with import attributes', async () => {
    const { config } = (await loadConfigFromFile(
      {} as any,
      path.resolve(fixtures, './entry/vite.config.import-attributes.ts'),
      path.resolve(fixtures, './entry'),
    ))!
    expect(config).toMatchInlineSnapshot(`
  })
].map((i) => crypto.hash('sha256', i, 'base64'))

// Compat for require
function viteLegacyPluginCjs(this: unknown, options: Options): Plugin[] {
  return viteLegacyPlugin.call(this, options)
}
Object.assign(viteLegacyPluginCjs, {
  cspHashes,
  default: viteLegacyPluginCjs,
  detectPolyfills,
})

export { viteLegacyPluginCjs as 'module.exports' }
  const h = crypto.hash('sha256', text, 'hex').substring(0, length)
The hash key used to invalidate optimized dependencies depends on the package lock contents, the patches applied to dependencies, and the options in the Vite config file that affects the bundling of node modules. This means that Vite will detect when a dependency is overridden using a feature as [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides), and re-bundle your dependencies on the next server start. Vite won't invalidate the dependencies when you use a feature like [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link). In case you link or unlink a dependency, you'll need to force re-optimization on the next server start by using `vite --force`. We recommend using overrides instead, which are supported now by every package manager (see also [pnpm overrides](https://pnpm.io/9.x/package_json#pnpmoverrides) and [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)).
To replace the Vite version used by dependencies transitively, you should use [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) or [pnpm overrides](https://pnpm.io/9.x/package_json#pnpmoverrides).
### No such file or directory error due to case sensitivity

If you encounter errors like `ENOENT: no such file or directory` or `Module not found`, this often occurs when your project was developed on a case-insensitive filesystem (Windows / macOS) but built on a case-sensitive one (Linux). Please make sure that the imports have the correct casing.
