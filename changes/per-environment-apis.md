# Move to Per-environment APIs

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

모듈 그래프 및 모듈 변환과 관련된 여러 `ViteDevServer` API가 `DevEnvironment` 인스턴스로 이동되었습니다.

Affected scope: `Vite Plugin Authors`

::: warning 지원 중단
The `Environment` instance was first introduced at `v6.0`. The deprecation of `server.moduleGraph` and other methods that are now in environments is planned for a future major. We don't recommend moving away from server methods yet. To identify your usage, set these in your vite config.

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## 배경 {#motivation}

Vite v5 이전에는 하나의 Vite 개발 서버가 항상 두 개의 환경(`client`와 `ssr`)을 갖고 있었습니다. `server.moduleGraph`는 이 두 환경에 대한 모듈이 혼합되어 있었습니다. 노드들은 `clientImportedModules`와 `ssrImportedModules` 목록을 통해 연결되어 있었으며(각각에 대해 하나의 `importers` 목록이 유지됨), 변환된 모듈은 `id`와 `ssr` 불리언 값으로 표현되었습니다. 그리고 이 불리언 값은 `server.moduleGraph.getModuleByUrl(url, ssr)`과 `server.transformRequest(url, { ssr })`와 같은 API에 전달되어야 했습니다.

Vite v6에서는 임의의 수의 커스텀 환경(`client`, `ssr`, `edge` 등)을 생성할 수 있습니다. 따라서 단일 `ssr` 불리언 값으로는 더 이상 충분하지 않습니다. `server.transformRequest(url, { environment })`와 같은 형태로 API를 변경하는 대신, 이러한 메서드들을 환경 인스턴스로 이동하여 Vite 개발 서버 없이도 호출할 수 있도록 했습니다.

## 마이그레이션 가이드 {#migration-guide}

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`