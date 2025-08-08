# HMR `hotUpdate` 플러그인 훅 {#hmr-hotupdate-plugin-hook}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

[환경 API](/guide/api-environment.md)를 인식하고 `create`와 `delete` 이벤트를 추가로 처리할 수 있도록, `handleHotUpdate` 플러그인 훅을 [`hotUpdate` 훅](/guide/api-environment#the-hotupdate-hook)으로 대체할 예정입니다.

영향을 받는 범위: `Vite 플러그인 개발자`

::: warning 지원 중단
`hotUpdate`는 `v6.0`에서 처음 도입되었습니다. `handleHotUpdate`의 지원 중단은 향후 메이저 버전에서 계획되어 있기에, 아직은 `handleHotUpdate`에서 벗어나는 것을 권장하지 않습니다. 실험해보고 피드백을 주고 싶다면, Vite 설정에서 `future.removePluginHookHandleHotUpdate`를 `"warn"`으로 설정할 수 있습니다.
:::

## 배경 {#motivation}

[`handleHotUpdate` 훅](/guide/api-plugin.md#handlehotupdate)은 커스텀 HMR 업데이트 처리를 수행할 수 있게 해줍니다. 업데이트될 모듈 목록이 `HmrContext`로 전달됩니다.

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

그러나 이 훅은 모든 환경에서 한 번 호출되며, 전달된 모듈은 클라이언트와 SSR 환경에 대한 정보가 혼합되어 있습니다. 이제 프레임워크가 커스텀 환경으로 이동했기에, 각 환경에 대해 호출되는 새로운 훅이 필요해졌습니다.

새로운 `hotUpdate` 훅은 `handleHotUpdate`와 동일한 방식으로 작동하지만 각 환경에 대해 호출되며 새로운 `HotUpdateOptions` 인스턴스를 전달받습니다:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

이제 다른 플러그인 훅과 마찬가지로 `this.environment`를 통해 개발 환경에 접근할 수 있게 되었으며, `modules` 목록 역시 현재 환경에 대한 모듈 노드만을 포함합니다. 이를 통해 각 환경에 대한 업데이트는 서로 다른 전략을 취할 수 있습니다.

또한 이 훅은 `'update'`뿐만 아니라 추가적인 감시 이벤트에 대해서도 호출됩니다. `type`을 사용해 이들을 구분할 수 있습니다.

## 마이그레이션 가이드 {#migration-guide}

영향을 받는 모듈 목록을 필터링하고 좁혀서 HMR이 더 정확하게 동작하도록 합니다.

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// 다음과 같이 마이그레이션:

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

빈 배열을 반환해 전체 리로드를 수행:

```js
handleHotUpdate({ server, modules, timestamp }) {
  // 수동으로 모듈 무효화
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// 다음과 같이 마이그레이션:

hotUpdate({ modules, timestamp }) {
  // 수동으로 모듈 무효화
  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

빈 배열을 반환하고 클라이언트에 커스텀 이벤트를 전송해 완전히 커스텀한 HMR 처리를 수행:

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// 다음과 같이 마이그레이션:

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```