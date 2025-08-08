# 환경별 API로 마이그레이션 {#move-to-per-environment-apis}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

모듈 그래프 및 모듈 변환과 관련된 여러 `ViteDevServer` API가 `DevEnvironment` 인스턴스로 이동되었습니다.

영향을 받는 범위: `Vite 플러그인 개발자`

::: warning 지원 중단
`Environment` 인스턴스는 `v6.0`에서 처음 도입되었습니다. `server.moduleGraph` 및 현재 환경에 있는 다른 메서드들에 대한 지원 중단은 향후 메이저 버전에서 계획되어 있습니다. 따라서 아직은 서버 메서드에서 벗어나는 것을 권장하지 않습니다. 사용 현황을 확인하려면 Vite 설정에서 다음과 같이 설정하세요.

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerReloadModule: 'warn',
  removeServerPluginContainer: 'warn',
  removeServerHot: 'warn',
  removeServerTransformRequest: 'warn',
  removeServerWarmupRequest: 'warn',
}
```

:::

## 배경 {#motivation}

Vite v5 이전에는 하나의 Vite 개발 서버가 항상 두 개의 환경(`client`와 `ssr`)을 갖고 있었습니다. `server.moduleGraph`는 이 두 환경에 대한 모듈이 혼합되어 있었습니다. 노드들은 `clientImportedModules`와 `ssrImportedModules` 목록을 통해 연결되어 있었으며(각각에 대해 하나의 `importers` 목록이 유지됨), 변환된 모듈은 `id`와 `ssr` 불리언 값으로 표현되었습니다. 그리고 이 불리언 값은 `server.moduleGraph.getModuleByUrl(url, ssr)`과 `server.transformRequest(url, { ssr })`와 같은 API에 전달되어야 했습니다.

Vite v6에서는 임의의 수의 커스텀 환경(`client`, `ssr`, `edge` 등)을 생성할 수 있습니다. 따라서 단일 `ssr` 불리언 값으로는 더 이상 충분하지 않습니다. `server.transformRequest(url, { environment })`와 같은 형태로 API를 변경하는 대신, 이러한 메서드들을 환경 인스턴스로 이동하여 Vite 개발 서버 없이도 호출할 수 있도록 했습니다.

## 마이그레이션 가이드 {#migration-guide}

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.reloadModule(module)` -> `environment.reloadModule(module)`
- `server.pluginContainer` -> `environment.pluginContainer`
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
- `server.hot` -> `server.client.environment.hot`