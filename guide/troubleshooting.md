# 트러블슈팅 {#troubleshooting}

자세한 내용은 [Rollup의 문제 해결 가이드](https://rollupjs.org/troubleshooting/)를 참조하시기를 바랍니다.

이 글이 제안하는 해결책이 잘 동작하지 않는다면 [GitHub Discussions](https://github.com/vitejs/vite/discussions)이나 [Vite Land Discord](https://chat.vitejs.dev)의 `#help` 채널에 질문을 게시해 보세요.

## CJS {#cjs}

### Vite CJS Node API 사용 중단 {#vite-cjs-node-api-deprecated}

Node API를 이용한 CJS 빌드는 더 이상 지원되지 않으며 Vite 6에서 제거될 예정입니다. 자세한 내용은 [GitHub discussion](https://github.com/vitejs/vite/discussions/13928)을 참조하세요. 파일 또는 프레임워크를 업데이트하여 ESM 빌드를 가져오도록 해야 합니다.

표준 Vite 프로젝트에서 다음을 확인해 주세요:

1. `vite.config.js` 파일에서 ESM 문법을 사용하고 있습니다.
2. 가장 가까운 `package.json` 파일에 `"type": "module"`이 있거나 `.mjs` 확장자(예: `vite.config.mjs`)를 사용하고 있습니다.

다른 프로젝트의 경우, 몇 가지 일반적인 접근 방식이 있습니다:

- **ESM을 기본값으로 설정하고, 필요한 경우 CJS를 사용:** 프로젝트 `package.json`에 `"type": "module"`을 추가하세요. 이후 모든 `*.js` 파일은 ESM으로 해석되며 ESM 문법을 사용해야 합니다. 다만 확장자가 `.cjs`인 파일은 CJS로 해석됩니다.
- **CJS를 기본값으로 유지하고, 필요한 경우 ESM을 사용:** 프로젝트 `package.json`에 `"type": "module"`이 없다면, 모든 `*.js` 파일은 CJS로 해석됩니다. 다만 확장자가 `.mjs`인 파일은 ESM으로 해석됩니다.
- **Vite를 동적으로 임포트:** CJS를 계속 사용해야 하는 경우, `import('vite')`를 사용하여 Vite를 동적으로 임포트할 수 있습니다. 이를 위해 코드가 `async` 컨텍스트에서 작성되어야 하지만, Vite의 API가 대부분 비동기적이기 때문에 일반적으로 문제가 되지 않습니다.

경고가 어디에서 발생하는지 모르겠다면, `VITE_CJS_TRACE=true` 플래그를 사용하여 스택 트레이스를 로그로 남길 수 있습니다:

```bash
VITE_CJS_TRACE=true vite dev
```

임시로 경고를 무시하려면 `VITE_CJS_IGNORE_WARNING=true` 플래그를 사용하여 스크립트를 실행하면 됩니다:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

참고로 postcss 설정 파일은 아직 ESM + TypeScript(`.mts` 또는 `"type": "module"` 에서의 `.ts`)를 지원하지 않습니다. 만약 확장자가 `.ts`인 postcss 설정 파일이 존재하고 package.json에 `"type": "module"`로 지정한 경우, postcss 설정 파일의 확장자를 `.cts`로 변경해주세요.

## CLI {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'` {#error-cannot-find-module-c-foo-bar-baz-vite-bin-vite-js}

프로젝트 폴더의 경로에 `&` 가 포함되어있을 가능성이 있습니다. 이는 Windows의 `npm`에서 동작시키지 않습니다([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

다음 중 하나를 수행해야 합니다:

- 다른 패키지 매니저로 교체하세요 (e.g. `pnpm`, `yarn`)
- 프로젝트의 경로에서 `&` 을 제거하세요

## 설정 {#config}

### 이 패키지는 ESM만 지원합니다 {#this-package-is-esm-only}

ESM만 지원하는 패키지를 `require`로 불러올 때 다음과 같은 에러가 발생합니다.

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> "foo" resolved to an ESM file. ESM file cannot be loaded by `require`.

ESM 파일은 [`require`](<https://nodejs.org/docs/latest-v18.x/api/esm.html#require:~:text=Using%20require%20to%20load%20an%20ES%20module%20is%20not%20supported%20because%20ES%20modules%20have%20asynchronous%20execution.%20Instead%2C%20use%20import()%20to%20load%20an%20ES%20module%20from%20a%20CommonJS%20module.>)로 불러올 수 없습니다.

다음과 같이 설정을 ESM으로 변환하는 것을 권장합니다:

- 가장 가까운 `package.json`에 `"type": "module"`을 추가합니다.
- `vite.config.js`/`vite.config.ts`를 `vite.config.mjs`/`vite.config.mts`로 이름을 변경합니다.

## 개발 서버 {#dev-server}

### 요청이 영원히 중단됨 {#requests-are-stalled-forever}

Linux를 사용하는 경우  file descriptor 및 inotify 제한으로 인해 문제가 발생할 수 있습니다. Vite는 대부분의 파일을 번들로 제공하지 않기 때문에 브라우저는 한도를 초과하여 많은 file descriptor가 필요한 많은 파일을 요청할 수 있습니다.

이 문제를 해결하기 위해서:

- `ulimit`로 file descriptor 제한 늘리기

  ```shell
  # Check current limit
  $ ulimit -Sn
  # Change limit (temporary)
  $ ulimit -Sn 10000 # You might need to change the hard limit too
  # Restart your browser
  ```

- `sysctl`로 inotify 관련 제한 늘리기.

  ```shell
  # Check current limits
  $ sysctl fs.inotify
  # Change limits (temporary)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

위의 단계가 작동하지 않으면 `DefaultLimitNOFILE=65536`을 주석 처리되지 않도록 하여 다음 파일에 추가하세요:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Ubuntu Linux의 경우 systemd 구성 파일을 업데이트하는 대신 `/etc/security/limits.conf` 파일에 `* - nofile 65536` 줄을 추가해야 할 수 있습니다.

이 설정은 유지되지만, **다시 시작해야 합니다**.

### 네트워크 요청 로딩 중지 {#network-requests-stop-loading}

자체 서명된 SSL 인증서를 사용하는 경우 Chrome은 모든 캐싱 지시문을 무시하고 콘텐츠를 다시 로드합니다. Vite는 이러한 캐싱 지시문에 의존합니다.

문제를 해결하려면 신뢰할 수 있는 SSL 인증서를 사용하십시오.

참조: [Cache problems](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS {#macos}

이 명령으로 CLI를 통해 신뢰할 수 있는 인증서를 설치할 수 있습니다:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

또는 인증서를 키체인 액세스 앱으로 가져오고 인증서에 대한 신뢰도를 "항상 신뢰"로 변경하세요.

### 431 Request Header Fields Too Large {#_431-request-header-fields-too-large}

서버/WebSocket 서버가 큰 HTTP 헤더를 수신하면 요청이 삭제되고 다음 경고가 표시됩니다.

> Server responded with status code 431. See https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

이는 Node.js가 [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) 완화를 위해 요청 헤더 크기를 제한하기 때문입니다..

이를 방지하려면 요청 헤더 크기를 줄이세요. 예를 들어 길이가 긴 쿠키를 삭제합니다. 또는 최대 헤더 크기를 변경하기 위해서 [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize)를 사용할 수 있습니다.

## HMR {#hmr}

### Vite가 파일 변경을 감지했지만 HMR이 작동하지 않음 {#vite-detects-a-file-change-but-the-hmr-is-not-working}

대소문자가 다른 파일을 가져왔을지도 모릅니다. 예를 들어 `src/foo.js`가 존재하고 `src/bar.js`에는 다음이 포함됩니다:

```js
import './Foo.js' // './foo.js' 이어야 합니다.
```

관련 이슈: [#964](https://github.com/vitejs/vite/issues/964)

### Vite가 파일 변경을 감지하지 못함 {#vite-does-not-detect-a-file-change}

WSL2로 Vite를 실행하는 경우 일부 조건에서는 파일 변경 사항을 볼 수 없습니다. [`server.watch` option](/config/server-options.md#server-watch)를 참고하세요.

### HMR 대신 전체 리 로드가 발생됨 {#a-full-reload-happens-instead-of-hmr}

Vite 또는 플러그인에서 HMR을 처리하지 않으면, 전체 리 로드를 통해 상태를 갱신합니다.

HMR이 처리되지만 순환 참조 내부에 있는 경우에도 실행 순서를 복구하기 위해 전체 리로드가 발생합니다. 이를 해결하려면 순환 참조 관계를 끊는 방법밖에는 없습니다. 파일 변경으로 인해 순환 참조 관계가 발생하면 `vite --debug hmr`을 실행하여 경로에 대한 로그를 확인할 수 있습니다.

## 빌드 {#build}

### CORS 오류로 인해 빌드된 파일이 작동하지 않음 {#built-file-does-not-work-because-of-cors-error}

HTML 파일 출력이 `file` 프로토콜로 열린 경우 다음 오류와 함께 스크립트가 실행되지 않습니다.

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

이러한 상황이 나타나는 이유에 대한 자세한 정보는 [Reason: CORS request not HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp)을 참조하세요.

`http` 프로토콜로 파일에 액세스해야 합니다. 이를 달성하는 가장 쉬운 방법은 `npx vite preview`를 실행하는 것입니다.

## 디펜던시 최적화 {#optimized-dependencies}

### 링크된 로컬 패키지의 경우 사전 번들링 된 디펜던시가 갱신되지 않음 {#outdated-pre-bundled-deps-when-linking-to-a-local-package}

최적화된 디펜던시를 무효화하는 데 사용되는 해시 키는 패키지 락 내용, 디펜던시에 적용된 패치, 그리고 노드 모듈 번들링에 영향을 미치는 Vite 설정 파일의 옵션에 따라 달라집니다. 이는 Vite가 [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)와 같은 기능을 사용하여 디펜던시를 덮어쓸 때 디펜던시를 다시 번들링하고 다음 서버 시작 시에 감지할 수 있다는 것을 의미합니다. 다만 Vite는 [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link)와 같은 기능을 사용할 때는 디펜던시를 무효화하지 않습니다. 따라서 디펜던시를 링크하거나 링크 해제하는 경우 `vite --force`를 사용하여 다음 서버 시작 시에 강제로 다시 최적화해야 합니다. 우리는 대신 모든 패키지 매니저에서 지원하는 오버라이드 기능을 사용하는 것을 권장합니다([pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) 및 [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)를 참고하세요).

## 성능 병목현상 {#performance-bottlenecks}

성능 병목현상으로 인해 앱의 로드 시간이 저하되는 경우, Vite 개발 서버 또는 프로덕션 빌드 시 Node.js 내장 인스펙터를 사용하여 CPU 프로파일링이 가능합니다:

::: code-group

```bash [개발 서버]
vite --profile --open
```

```bash [빌드]
vite build --profile
```

:::

::: tip Vite 개발 서버에서의 사용법
브라우저에서 앱을 열고 로드가 완료될 때까지 기다린 후 터미널로 돌아가 `p` 키를 누르세요(Node.js 인스펙터를 중지합니다). 이후 `q` 키를 눌러 개발 서버를 중지하세요.
:::

Node.js 인스펙터가 루트 폴더에 `vite-profile-0.cpuprofile`을 생성합니다. https://www.speedscope.app/ 에서 `BROWSE` 버튼을 눌러 CPU 프로파일을 업로드하고 결과를 확인하세요.

[vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)를 설치하여 Vite 플러그인의 중간 상태를 점검하고 병목현상을 일으키는 플러그인 또는 미들웨어를 식별할 수 있습니다. 개발 및 프로덕션 빌드 둘 다 사용 가능합니다. 자세한 내용은 readme 파일을 확인하세요.

## 그 외 {#others}

### 브라우저 호환성을 위해 외부화된 모듈 {#module-externalized-for-browser-compatibility}

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

이러한 코드들이 의존성 모듈 내부에서 사용된다면, 문제를 해결하기 위해[`patch-package`](https://github.com/ds300/patch-package) (또는 [`yarn patch`](https://yarnpkg.com/cli/patch) 또는 [`pnpm patch`](https://pnpm.io/cli/patch))를 사용할 수 있습니다.

### 브라우저 확장 프로그램 {#browser-extensions}

광고 차단기와 같은 일부 브라우저 확장 프로그램은 Vite 클라이언트가 Vite 개발 서버에 요청을 보내는 것을 방지할 수 있습니다. 이 경우 화면이 흰색으로 표시되고 오류가 표시되지 않을 수 있습니다. 이러한 문제가 발생하는 경우 확장 프로그램을 비활성화해 보세요.

### Windows의 드라이브 간 링크 {#cross-drive-links-on-windows}

Windows에서 프로젝트에 드라이브 간 링크가 있는 경우 Vite가 작동하지 않을 수 있습니다.

드라이브 간 링크의 예시는 다음과 같습니다:

- `subst` 명령으로 폴더에 연결된 가상 드라이브
- `mklink` 명령으로 다른 드라이브에 대한 소프트 링크(Junction)/심볼릭 링크 (예: Yarn 글로벌 캐시)

관련 이슈: [#10802](https://github.com/vitejs/vite/issues/10802)