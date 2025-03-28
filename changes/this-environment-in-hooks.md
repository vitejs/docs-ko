# 훅에서 `this.environment` 사용하기 {#this-environment-in-hooks}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

Vite 6 이전에는 `client`와 `ssr` 두 가지 환경만 사용할 수 있었습니다. 플러그인 개발자는 `options.ssr` 인자를 통해 모듈을 처리할 때 `resolveId`, `load`, `transform` 플러그인 훅에서 이 두 환경을 구분했습니다. Vite 6에서는 Vite 애플리케이션이 필요한만큼 환경을 정의할 수 있게 되었습니다. 따라서 플러그인 컨텍스트에 `this.environment`를 도입해, 훅에서 현재 모듈의 환경과 상호작용 할 수 있도록 했습니다.

영향을 받는 범위: `Vite 플러그인 개발자`

::: warning 지원 중단
`this.environment`는 `v6.0`에서 도입되었습니다. `v7.0`에서 `options.ssr` 지원이 중단될 예정입니다. 그 시점에 새로운 API를 사용하도록 플러그인 마이그레이션을 권장하고자 합니다. 이 변경 사항에 영향을 받는 코드를 미리 확인하고자 한다면, Vite 설정에서 `future.removePluginHookSsrArgument`를 `"warn"`으로 설정하세요.
:::

## 배경 {#motivation}

`this.environment`는 플러그인 훅 구현 시 현재 환경 이름을 알 수 있게 할 뿐만 아니라, 환경 설정 옵션, 모듈 그래프 정보, 변환 파이프라인(`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`)에도 접근할 수 있게 해줍니다. 컨텍스트에서 환경 인스턴스를 사용할 수 있게 함으로써, 플러그인 개발자가 전체 개발 서버에 대한 의존성을 피할 수 있게 됩니다(일반적으로 `configureServer` 훅을 통해 시작 시 캐시됨).

## 마이그레이션 가이드 {#migration-guide}

기존 플러그인을 빠르게 마이그레이션하려면 `resolveId`, `load`, `transform` 훅에서 `options.ssr` 인자를 `this.environment.name !== 'client'`로 대체하세요:

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.name !== 'client' // [!code ++]

      if (isSSR) {
        // SSR 관련 로직
      } else {
        // 클라이언트 관련 로직
      }
    },
  }
}
```

더 견고하고 장기적인 구현을 위해서는, 환경 이름에 의존하는 대신 [여러 환경](/guide/api-environment.html#accessing-the-current-environment-in-hooks)을 위한 세분화된 환경 옵션을 사용해 플러그인 훅을 처리해야 합니다.