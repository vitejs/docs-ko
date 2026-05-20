# 트러블슈팅 {#troubleshooting}

자세한 내용은 [Rollup의 문제 해결 가이드](https://rollupjs.org/troubleshooting/)를 참조하시기를 바랍니다.

이 글이 제안하는 해결책이 잘 동작하지 않는다면 [GitHub Discussions](https://github.com/vitejs/vite/discussions)이나 [Vite Land Discord](https://chat.vite.dev)의 `#help` 채널에 질문을 게시해 보세요.

## CLI {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'` {#error-cannot-find-module-c-foo-bar-baz-vite-bin-vite-js}

프로젝트 폴더의 경로에 `&` 가 포함되어있을 가능성이 있습니다. 이는 Windows의 `npm`에서 동작시키지 않습니다([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

다음 중 하나를 수행해야 합니다:

- 다른 패키지 매니저로 교체하세요 (e.g. `pnpm`, `yarn`)
- 프로젝트의 경로에서 `&` 을 제거하세요

## 설정 {#config}

### 이 패키지는 ESM 전용입니다 {#this-package-is-esm-only}

ESM 전용 패키지를 `require`로 임포트하면 다음 오류가 발생합니다.

> "foo"를 해석하지 못했습니다. 이 패키지는 ESM 전용이지만 `require`로 로드하려고 했습니다.

> Error [ERR_REQUIRE_ESM]: /path/to/vite.config.js에서 ES Module /path/to/dependency.js에 require()를 사용하는 것은 지원되지 않습니다.
> 대신 /path/to/vite.config.js의 index.js require를 모든 CommonJS 모듈에서 사용할 수 있는 동적 import()로 변경하세요.

Node.js <=22 환경에서, ESM 파일은 기본적으로 [`require`](https://nodejs.org/docs/latest-v22.x/api/esm.html#require)를 통해 불러올 수 없습니다.

[`--experimental-require-module`](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require) 옵션이나 Node.js >22 환경, 또는 다른 런타임을 이용할 수도 있겠지만, 다음과 같이 설정을 ESM으로 변환하기를 권장합니다:

- 가장 가까운 `package.json`에 `"type": "module"`을 추가합니다.
- `vite.config.js`/`vite.config.ts`를 `vite.config.mjs`/`vite.config.mts`로 변경합니다.

## 개발 서버 {#dev-server}

### 요청이 영원히 중단됨 {#requests-are-stalled-forever}

Linux를 사용하는 경우, 파일 디스크립터 및 inotify 제한이 문제의 원인일 수 있습니다. Vite는 파일 대부분을 번들링하지 않기 때문에, 브라우저가 많은 파일을 요청하게 되고, 이로 인해 많은 파일 디스크립터가 필요해져 시스템 제한을 초과할 수 있습니다.

이 문제를 해결하기 위해 다음을 수행할 수 있습니다:

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

해결되지 않으면 `DefaultLimitNOFILE=65536`을 주석 처리되지 않도록 하고 다음 파일에 추가하세요:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Ubuntu Linux는 systemd 구성 파일을 업데이트하는 대신 `/etc/security/limits.conf` 파일에 `* - nofile 65536` 줄을 추가해야 할 수 있습니다.

이 설정은 유지되지만, **다시 시작해야 합니다**.

서버가 VS Code devcontainer 내부에서 실행 중이라면 요청이 멈춘 것처럼 보일 수 있습니다. 이 문제에 대해서는
[Dev Containers / VS Code 포트 포워딩](#dev-containers-vs-code-port-forwarding) 섹션을 참고해 주세요.

### Vite가 ENOSPC 오류로 중단됩니다 {#vite-crashes-with-enospc-error}

Linux에서 다음과 같은 오류가 보인다면:

> Error: ENOSPC: 파일 감시자 수에 대한 시스템 제한에 도달했습니다.

프로젝트 디렉터리에 파일이 너무 많아(예: 많은 이미지나 에셋) 시스템의 파일 감시자 제한을 초과하면 발생합니다. Linux의 기본 제한은 대략 8,192-10,000개의 파일 감시자입니다.

이를 해결하려면 다음을 수행할 수 있습니다:

- 시스템 파일 감시자 제한 늘리기:

  ```shell
  # Check current limit
  $ cat /proc/sys/fs/inotify/max_user_watches
  # Increase limit (temporary)
  $ sudo sysctl fs.inotify.max_user_watches=524288
  # Make it permanent - add to /etc/sysctl.conf (or edit if it already exists)
  $ echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
  $ sudo sysctl -p
  ```

- [`server.watch.ignored`](/config/server-options#server-watch)를 사용해 파일이 많은 디렉터리를 파일 감시 대상에서 제외합니다.
- [`server.watch.usePolling`](/config/server-options#server-watch)을 사용해 파일 시스템 이벤트 대신 폴링을 사용합니다. 폴링은 더 많은 CPU 리소스를 사용한다는 점에 유의하세요.

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

### 431 요청 헤더 필드가 너무 큼 {#_431-request-header-fields-too-large}

서버/WebSocket 서버가 큰 HTTP 헤더를 수신하면 요청이 삭제되고 다음 경고가 표시됩니다.

> 서버가 431 상태 코드로 응답했습니다. https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large 를 참고하세요.

이는 Node.js가 [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) 완화를 위해 요청 헤더 크기를 제한하기 때문입니다..

이를 방지하려면 요청 헤더 크기를 줄이세요. 예를 들어 길이가 긴 쿠키를 삭제합니다. 또는 최대 헤더 크기를 변경하기 위해서 [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize)를 사용할 수 있습니다.

### Dev Containers / VS Code 포트 포워딩 {#dev-containers-vs-code-port-forwarding}

Dev Container나 VS Code의 포트 포워딩 기능을 사용하는 경우, 정상적으로 작동하게 하려면 설정에서 [`server.host`](/config/server-options.md#server-host) 옵션을 `127.0.0.1`로 설정해야 할 수 있습니다.

이는 [VS Code 포트 포워딩 기능이 IPv6를 지원하지 않기 때문](https://github.com/microsoft/vscode-remote-release/issues/7029)입니다.

자세한 내용은 [#16522](https://github.com/vitejs/vite/issues/16522)를 참조하세요.

## HMR {#hmr}

### Vite가 파일 변경을 감지했지만 HMR이 작동하지 않음 {#vite-detects-a-file-change-but-the-hmr-is-not-working}

대소문자가 다른 파일을 가져왔을지도 모릅니다. 예를 들어 `src/foo.js`가 존재하고 `src/bar.js`에는 다음이 포함됩니다:

```js
import './Foo.js' // should be './foo.js'
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

> origin 'null'에서 'file:///foo/bar.js' 스크립트에 접근하는 것이 CORS 정책에 의해 차단되었습니다. 교차 출처 요청은 http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted 프로토콜 스킴에서만 지원됩니다.

> 교차 출처 요청이 차단되었습니다. 동일 출처 정책이 file:///foo/bar.js 원격 리소스 읽기를 허용하지 않습니다. (이유: CORS 요청이 http가 아님)

이러한 상황이 나타나는 이유에 대한 자세한 정보는 [Reason: CORS request not HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp)을 참조하세요.

`http` 프로토콜로 파일에 액세스해야 합니다. 이를 달성하는 가장 쉬운 방법은 `npx vite preview`를 실행하는 것입니다.

### 대소문자 구분으로 인한 No such file or directory 오류 {#no-such-file-or-directory-error-due-to-case-sensitivity}

`ENOENT: no such file or directory` 또는 `Module not found`와 같은 오류가 발생하는 경우, 이는 대소문자를 구분하지 않는 파일 시스템(Windows / macOS)에서 개발되었지만 대소문자를 구분하는 시스템(Linux)에서 빌드될 때 자주 발생합니다. import 시 올바른 대소문자를 사용하고 있는지 확인하세요.

### `Failed to fetch dynamically imported module` 오류 {#failed-to-fetch-dynamically-imported-module-error}

> TypeError: 동적으로 임포트한 모듈을 가져오지 못했습니다.

이 오류는 여러 경우에 발생합니다:

- 버전 불일치
- 좋지 않은 네트워크 상태
- 브라우저 확장 프로그램의 요청 차단

#### 버전 불일치 {#version-skew}

애플리케이션의 새 버전을 배포했지만 HTML 파일과 JS 파일이 새 배포에서 삭제된 이전 청크 이름을 계속 참조할 때 발생합니다. 이는 다음 상황에서 발생합니다:

1. 사용자의 브라우저에 앱의 이전 버전이 캐시되어 있습니다.
2. 코드 변경으로 인해 다른 청크 이름을 가진 새 버전을 배포합니다.
3. 캐시된 HTML이 더 이상 존재하지 않는 청크를 로드하려고 합니다.

프레임워크를 사용 중이라면, 이 문제에 대한 내장 해결책이 있을 수 있으므로 먼저 해당 문서를 참고하세요.

이를 해결하려면 다음을 고려할 수 있습니다:

- **이전 청크를 일시적으로 유지하기**: 캐시된 사용자가 부드럽게 전환할 수 있도록 이전 배포의 청크를 일정 기간 유지하는 것을 고려하세요.
- **서비스 워커 사용하기**: 모든 에셋을 미리 가져오고 캐시하는 서비스 워커를 구현하세요.
- **동적 청크 미리 가져오기**: HTML 파일이 `Cache-Control` 헤더 때문에 브라우저에 캐시된 경우에는 도움이 되지 않는다는 점에 유의하세요.
- **우아한 폴백 구현하기**: 청크가 누락되었을 때 페이지를 다시 로드하도록 동적 임포트 오류 처리를 구현하세요. 자세한 내용은 [로드 오류 처리](./build.md#load-error-handling)를 참고하세요.

#### 좋지 않은 네트워크 상태 {#poor-network-conditions}

이 오류는 불안정한 네트워크 환경에서 발생할 수 있습니다. 예를 들어 네트워크 오류나 서버 다운타임으로 요청이 실패하는 경우입니다.

브라우저 제한으로 인해 동적 임포트를 다시 시도할 수 없다는 점에 유의하세요([whatwg/html#6768](https://github.com/whatwg/html/issues/6768)).

#### 브라우저 확장 프로그램의 요청 차단 {#browser-extensions-blocking-requests}

브라우저 확장 프로그램(예: 광고 차단기)이 해당 요청을 차단하는 경우에도 이 오류가 발생할 수 있습니다.

이러한 확장 프로그램은 파일 이름을 기준으로 요청을 차단하는 경우가 많으므로(예: `ad`, `track`이 포함된 이름), [`build.rollupOptions.output.chunkFileNames`](../config/build-options.md#build-rollupoptions)로 다른 청크 이름을 선택해 우회할 수 있을 수도 있습니다.

## 디펜던시 최적화 {#optimized-dependencies}

### 링크된 로컬 패키지의 경우 사전 번들링 된 디펜던시가 갱신되지 않음 {#outdated-pre-bundled-deps-when-linking-to-a-local-package}

최적화된 디펜던시를 무효화하는 데 사용되는 해시 키는 패키지 락 파일 내용, 디펜던시에 적용된 패치, 그리고 node 모듈 번들링에 영향을 미치는 Vite 설정 파일의 옵션에 따라 달라집니다. 즉, Vite는 [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)와 같은 기능을 사용해 디펜던시가 재정의될 때 이를 감지하고, 다음 서버 시작 시 디펜던시를 다시 번들링합니다. 하지만 [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link)와 같은 기능을 사용할 때는 Vite가 디펜던시를 무효화하지 않습니다. 디펜던시를 링크하거나 링크를 해제하는 경우, `vite --force`를 사용해 다음 서버 시작 시 최적화를 강제로 다시 실행해야 합니다. 대신 모든 패키지 매니저에서 지원되는 overrides 기능을 사용하는 것을 권장합니다([pnpm overrides](https://pnpm.io/9.x/package_json#pnpmoverrides) 및 [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions) 참고).

## 성능 병목현상 {#performance-bottlenecks}

성능 병목현상으로 인해 앱의 로드 시간이 저하되는 경우, Vite 개발 서버 또는 프로덕션 빌드 시 Node.js 내장 인스펙터를 사용하여 CPU 프로파일링이 가능합니다:

::: code-group

```bash [dev server]
vite --profile --open
```

```bash [build]
vite build --profile
```

:::

::: tip Vite 개발 서버에서의 사용법
브라우저에서 앱을 열고 로드가 완료될 때까지 기다린 후 터미널로 돌아가 `p` 키를 누르세요(Node.js 인스펙터를 중지합니다). 이후 `q` 키를 눌러 개발 서버를 중지하세요.
:::

Node.js 인스펙터가 루트 폴더에 `vite-profile-0.cpuprofile`을 생성합니다. https://www.speedscope.app/ 에서 `BROWSE` 버튼을 눌러 CPU 프로파일을 업로드하고 결과를 확인하세요.

[vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)를 설치하여 Vite 플러그인의 중간 상태를 점검하고 병목현상을 일으키는 플러그인 또는 미들웨어를 식별할 수 있습니다. 개발 및 프로덕션 빌드 둘 다 사용 가능합니다. 자세한 내용은 readme 파일을 확인하세요.

## 그 외 {#others}

### 브라우저 호환성을 위해 모듈이 외부화됨 {#module-externalized-for-browser-compatibility}

브라우저에서 Node.js 모듈을 사용할 때 Vite는 다음 경고를 출력합니다.

> "fs" 모듈은 브라우저 호환성을 위해 외부화되었습니다. 클라이언트 코드에서 "fs.readFile"에 접근할 수 없습니다.

이는 Vite가 Node.js 모듈을 자동으로 폴리필하지 않기 때문입니다.

수동으로 폴리필을 추가할 수 있지만 번들 크기를 줄이기 위해서 브라우저 코드에는 Node.js 모듈을 사용하지 않는 것이 좋습니다. 만약 외부 라이브러리에서 모듈을 가져와 브라우저에서 사용하는 경우에는, 해당 라이브러리에 문제를 보고하는 것이 좋습니다.

### Syntax Error / Type Error 발생 {#syntax-error-type-error-happens}

Vite는 엄격하지 않은 모드(느슨한 모드)에서만 실행되는 코드를 처리할 수 없으며 지원하지 않습니다. 이는 Vite가 ESM을 사용하고 ESM은 내부적으로 항상 [엄격 모드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)이기 때문입니다.

예를 들어 이러한 오류가 표시될 수 있습니다.

> [ERROR] 엄격 모드 때문에 "with" 문은 "esm" 출력 형식에서 사용할 수 없습니다.

> TypeError: boolean 'false'에 프로퍼티 'foo'를 생성할 수 없습니다.

이러한 코드들이 디펜던시 모듈 내부에서 사용된다면, 문제를 해결하기 위해[`patch-package`](https://github.com/ds300/patch-package) (또는 [`yarn patch`](https://yarnpkg.com/cli/patch) 또는 [`pnpm patch`](https://pnpm.io/cli/patch))를 사용할 수 있습니다.

### 브라우저 확장 프로그램 {#browser-extensions}

일부 브라우저 확장 프로그램(예: 광고 차단기)은 Vite 클라이언트가 Vite 개발 서버에 요청을 보내지 못하게 할 수 있습니다. 이 경우 기록된 오류 없이 흰 화면이 보일 수 있습니다. 다음 오류가 표시될 수도 있습니다:

> TypeError: 동적으로 임포트한 모듈을 가져오지 못했습니다.

이 문제가 있다면 확장 프로그램을 비활성화해 보세요.

### Windows의 드라이브 간 링크 {#cross-drive-links-on-windows}

Windows에서 프로젝트에 드라이브 간 링크가 있는 경우 Vite가 작동하지 않을 수 있습니다.

드라이브 간 링크의 예시는 다음과 같습니다:

- `subst` 명령으로 폴더에 연결된 가상 드라이브
- `mklink` 명령으로 다른 드라이브에 대한 소프트 링크(Junction)/심볼릭 링크 (예: Yarn 글로벌 캐시)

관련 이슈: [#10802](https://github.com/vitejs/vite/issues/10802)

### 기본 import가 예기치 않게 객체를 반환함 {#default-import-unexpectedly-returns-an-object}

CJS 모듈에서 default import는 `module.exports.default` 값이 반환되기를 기대할 수 있지만, 실제로는 `module.exports` 객체를 반환합니다.

이로 인해 다음과 같은 오류가 발생할 수 있습니다:

> Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

> foo is not a function

자세한 내용은 Rolldown 문서의 [Ambiguous `default` import from CJS modules - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules)를 참고하세요.

<script setup lang="ts">
// 해시가 있는 오래된 링크를 이전 버전 문서로 리디렉션
if (typeof window !== "undefined") { // 브라우저 환경 확인
  const hashForOldVersion = { // 이전 버전 해시
    'vite-cjs-node-api-deprecated': 6
  }

  const version = hashForOldVersion[location.hash.slice(1)] // 리디렉션 버전
  if (version) { // 버전이 있으면 이동
    // 로컬 미리보기에서도 동작하도록 스키마 및 포트 업데이트 (로컬에서는 http와 4173)
    location.href = `https://v${version}.vite.dev` + location.pathname + location.search + location.hash // 이전 문서로 이동
  }
}
</script>
