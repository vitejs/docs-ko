# HMR API {#hmr-api}

:::tip 참고
해당 문서는 클라이언트 쪽 HMR API입니다. HMR 변경을 제어하는 플러그인은 [다음](./api-plugin#handlehotupdate)을 참고해 주세요.

HMR API 설정은 기본적으로 프레임워크나 Vite 지원 도구 원작자를 위해 만들어졌습니다. 최종 사용자에게 있어서는 HMR은 특정 프레임워크 스타터 템플릿에 이미 처리되어 있습니다. 
:::

Vite는 HMR API 설정을 `import.meta.hot` 객체를 통해 노출합니다:

```ts
interface ImportMeta {
  readonly hot?: ViteHotContext
}

type ModuleNamespace = Record<string, any> & {
  [Symbol.toStringTag]: 'Module'
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  decline(): void
  invalidate(message?: string): void

  // `InferCustomEventPayload`는 내장된(Built-in) Vite 이벤트에 대한 타입을 제공합니다
  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void
  ): void
  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void
}
```

## 필수적인 Conditional Guard {#required-conditional-guard}

첫 번째로, 프로덕션에서 트리 셰이킹 하기 위해 HMR API를 사용하기 앞서 conditional block을 해놓는 것이 좋습니다:

```js
if (import.meta.hot) {
  // HMR code
}
```

## `hot.accept(cb)` {#hot-accept-cb}

스스로 수용하는 모듈을 위해 변경된 모듈을 인자로 받는 콜백과 함께 `import.meta.hot.accpet`를 사용하세요:

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // SyntaxError 발생 시 newModule은 undefined 값을 갖습니다.
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

Hot updates를 "수용한" 모듈은 **HMR 범위**로 간주됩니다.

Vite은 처음에 불러온 모듈을 교환하지 않습니다: 만약에 HMR 범위의 모듈이 디펜던시로부터 imports를 다시 exports 한다면, 해당 re-exports를 업데이트할 책임이 있습니다 (그리고 그러한 exports는 `let`을 사용하였을 것입니다). 게다가 경계 모듈에서 체인 위에 있는 importers에게는 변화가 되었다고 알리지 않습니다.

Vite의 간소화된 HMR 기능은 프록시 모듈을 생산하는 것과 같은 비용이 큰일을 하지 않고서 대부분의 개발 환경에서 충분합니다.

## `hot.accept(deps, cb)` {#hot-accept-deps-cb}

모듈은 스스로 리로딩을 하지 않고 직접적인 의존성으로 변경을 수용할 수 있습니다:

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // 콜백으로 변경된 './foo.js' 모듈을 받을 수 있습니다.
    newFoo?.foo()
  })

  // 또한 dep 모듈들을 어레이로 받을 수 있습니다.
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // 콜백은 업데이트된 모듈의 배열을 전달받습니다. 이 때 모듈은 null 값을 가질 수 없
      // 업데이트가 성공적이지 않다면 (예를 들어, 문법 에러), 배열은 비어있습니다.
    }
  )
}
```

## `hot.dispose(cb)` {#hot-dispose-cb}

스스로 수용하는 모듈 혹은 다른 것에 의해 수용될 모듈은 변경된 복사본으로 인한 지속적인 사이드 이펙트를 정리하기 위해 `hot.dispose`를 사용할 수 있습니다:

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // side effect를 처리함
  })
}
```

## `hot.prune(cb)` {#hot-prune-cb}

모듈이 페이지에서 더 이상 import되지 않을 때 호출되는 콜백을 등록합니다. 이는 스타일 삽입과 같은 사이드 이펙트를 정리하는데 사용될 수 있습니다. Vite는 `.css` import에 대해서 이미 이를 사용하고 있습니다.

```js
if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // 사이드 이펙트를 정리
  })
}
```

## `hot.data` {#hot-data}

`import.meta.hot.data` 객체는 같이 변경된 각기 다른 모듈들의 인스턴스들에서 지속됩니다. 해당 객체는 전 버전의 모듈 정보를 다음 버전의 모듈에게 전달할 수 있습니다.

## `hot.decline()` {#hot-decline}

`import.meta.hot.decline()`은 해당 모듈이 hot-업데이트가 불가능함을 가리키고 만약 이 모듈이 변경이 되어야 한다면 브라우저 전체 리로드가 실행이 되어야 함을 알려줍니다. 

## `hot.invalidate(message?: string)` {#hot-invalidate-message-string}

A self-accepting module may realize during runtime that it can't handle a HMR update, and so the update needs to be forcefully propagated to importers. By calling `import.meta.hot.invalidate()`, the HMR server will invalidate the importers of the caller, as if the caller wasn't self-accepting. This will log a message both in the browser console and in the terminal. You can pass a message to give some context on why the invalidation happened.

Note that you should always call `import.meta.hot.accept` even if you plan to call `invalidate` immediately afterwards, or else the HMR client won't listen for future changes to the self-accepting module. To communicate your intent clearly, we recommend calling `invalidate` within the `accept` callback like so:

```js
import.meta.hot.accept(module => {
  // You may use the new module instance to decide whether to invalidate.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)` {#hot-on-event-cb}

HMR 이벤트에 대한 핸들러를 정의합니다.

다음 HMR 이벤트들은 Vite에서 자동적으로 호출됩니다:

- `'vite:beforeUpdate'`은 변경이 적용되기 전에 호출됩니다. (e.g. 모듈이 변경될 예정일 때)
- `'vite:afterUpdate'`는 변경이 적용된 후에 호출됩니다. (e.g. 모듈이 변경된 후)
- `'vite:beforeFullReload'`은 전체 리로드가 일어나기 전에 호출됩니다.
- `'vite:beforePrune'`은 모듈들이 필요가 없어져서 제거될 때 호출됩니다.
- `'vite:invalidate'` when a module is invalidated with `import.meta.hot.invalidate()`
- `'vite:error'`은 에러가 일어났을 때 호출됩니다. (e.g. syntax error)

플러그인들로부터 새로운 HMR 이벤트들을 보낼 수 있습니다. 더 많은 정보는 [handleHotUpdate](./api-plugin#handlehotupdate)를 참고해 주세요.

## `hot.send(event, data)` {#hot-send-event-data}

커스텀 이벤트를 Vite의 개발 서버로 되돌려 보냅니다.

만약 연결되기 전에 호출된다면 데이터는 버퍼에서 잠시 대기하고 이후 연결이 설정되었을 때 전송하게 됩니다.

좀 더 자세한 내용은 [클라이언트-서버 커뮤니케이션](/guide/api-plugin.html#client-server-communication)을 참고해주세요.
