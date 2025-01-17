# ModuleRunner API를 사용하는 SSR {#ssr-using-modulerunner-api}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

`server.ssrLoadModule`이 [ModuleRunner](/guide/api-environment#modulerunner)를 통한 임포트로 대체되었습니다.

영향을 받는 범위: `Vite 플러그인 개발자`

::: warning 지원 중단
`ModuleRunner`는 `v6.0`에서 처음 도입되었습니다. 향후 메이저 버전에서 `server.ssrLoadModule`이 지원 중단될 예정입니다. 이 변경 사항에 영향을 받는 코드를 미리 확인하고자 한다면, Vite 설정에서 `future.removeSsrLoadModule`을 `"warn"`으로 설정하세요.
:::

## 배경 {#motivation}

`server.ssrLoadModule(url)`은 `ssr` 환경에서만 모듈을 임포트할 수 있었고, Vite 개발 서버와 동일한 프로세스에서만 모듈을 실행할 수 있었습니다. 커스텀 환경을 가진 앱의 경우, 각 환경은 별도의 스레드나 프로세스에서 실행될 수 있는 `ModuleRunner`와 연결됩니다. 이러한 환경에서는 `moduleRunner.import(url)`를 통해 모듈을 임포트할 수 있습니다.

## 마이그레이션 가이드 {#migration-guide}

[프레임워크를 위한 환경 API 가이드](../guide/api-environment-frameworks.md)를 참고하세요.