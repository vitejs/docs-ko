# 훅에서 `this.environment` 사용하기 {#this-environment-in-hooks}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

Vite 6 이전에는 `client`와 `ssr` 두 가지 환경만 사용할 수 있었습니다. 플러그인 개발자는 `options.ssr` 인자를 통해 모듈을 처리할 때 `resolveId`, `load`, `transform` 플러그인 훅에서 이 두 환경을 구분했습니다. Vite 6에서는 Vite 애플리케이션이 필요한만큼 환경을 정의할 수 있게 되었습니다. 따라서 플러그인 컨텍스트에 `this.environment`를 도입해, 훅에서 현재 모듈의 환경과 상호작용 할 수 있도록 했습니다.

Affected scope: `Vite Plugin Authors`

::: warning 지원 중단
`this.environment` was introduced in `v6.0`. The deprecation of `options.ssr` is planned for a future major. At that point we'll start recommending migrating your plugins to use the new API. To identify your usage, set `future.removePluginHookSsrArgument` to `"warn"` in your vite config.
:::

## 배경 {#motivation}

`this.environment`는 플러그인 훅 구현 시 현재 환경 이름을 알 수 있게 할 뿐만 아니라, 환경 설정 옵션, 모듈 그래프 정보, 변환 파이프라인(`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`)에도 접근할 수 있게 해줍니다. 컨텍스트에서 환경 인스턴스를 사용할 수 있게 함으로써, 플러그인 개발자가 전체 개발 서버에 대한 의존성을 피할 수 있게 됩니다(일반적으로 `configureServer` 훅을 통해 시작 시 캐시됨).

## 마이그레이션 가이드 {#migration-guide}

For the existing plugin to do a quick migration, replace the `options.ssr` argument with `this.environment.config.consumer === 'server'` in the `resolveId`, `load` and `transform` hooks:

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]

      if (isSSR) {
        // SSR 관련 로직
      } else {
        // 클라이언트 관련 로직
      }
    },
  }
}
```

For a more robust long term implementation, the plugin hook should handle for [multiple environments](/guide/api-environment-plugins.html#accessing-the-current-environment-in-hooks) using fine-grained environment options instead of relying on the environment name.