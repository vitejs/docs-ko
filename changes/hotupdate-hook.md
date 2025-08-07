# HMR `hotUpdate` 플러그인 훅 {#hmr-hotupdate-plugin-hook}

::: tip 피드백
[환경 API 피드백 논의](https://github.com/vitejs/vite/discussions/16358)에서 피드백을 남겨주세요.
:::

[환경 API](/guide/api-environment.md)를 인식하고 `create`와 `delete` 이벤트를 추가로 처리할 수 있도록, `handleHotUpdate` 플러그인 훅을 [`hotUpdate` 훅](/guide/api-environment#the-hotupdate-hook)으로 대체할 예정입니다.

영향을 받는 범위: `Vite 플러그인 개발자`

::: warning 지원 중단
`hotUpdate` was first introduced in `v6.0`. The deprecation of `handleHotUpdate` is planned for a future major. We don't recommend moving away from `handleHotUpdate` yet. If you want to experiment and give us feedback, you can use the `future.removePluginHookHandleHotUpdate` to `"warn"` in your vite config.
:::

## 배경 {#motivation}

The [`handleHotUpdate` hook](/guide/api-plugin.md#handlehotupdate) allows to perform custom HMR update handling. A list of modules to be updated is passed in the `HmrContext`.

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