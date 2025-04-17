# HMR API {#hmr-api}

:::tip 참고
해당 문서는 클라이언트 쪽 HMR API입니다. HMR 변경을 제어하는 플러그인은 [다음](./api-plugin#handlehotupdate)을 참고해 주세요.

HMR API 설정은 기본적으로 프레임워크나 Vite 지원 도구 원작자를 위해 만들어졌습니다. 최종 사용자에게 있어서는 HMR은 특정 프레임워크 스타터 템플릿에 이미 처리되어 있습니다. 
:::

Vite는 HMR API 설정을 `import.meta.hot` 객체를 통해 노출합니다:

```ts twoslash
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type {
  CustomEventName,
  InferCustomEventPayload,
} from 'vite/types/customEvent.d.ts'

// ---cut---
interface ImportMeta {
  readonly hot?: ViteHotContext
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
  invalidate(message?: string): void

  on<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends CustomEventName>(
    event: T,
    data?: InferCustomEventPayload<T>,
  ): void
}
```

## 필수적인 Conditional Guard {#required-conditional-guard}

첫 번째로, 프로덕션에서 트리 셰이킹 하기 위해 HMR API를 사용하기 앞서 conditional block을 해놓는 것이 좋습니다:

```js
if (import.meta.hot) {
  // HMR code
}
```

## IntelliSense for TypeScript {#intellisense-for-typescript}

Vite는 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts)을 통해 `import.meta.hot`에 대한 타입 정의를 제공하고 있습니다. `src` 디렉터리 아래에 `env.d.ts`를 생성해 TypeScript가 타입 정의를 찾을 수 있도록 할 수 있습니다:

```ts
/// <reference types="vite/client" />
```

## `hot.accept(cb)` {#hot-accept-cb}

모듈 자신에 대한 HMR을 확인하기 위해서는 `import.meta.hot.accept`를 사용하고 업데이트된 모듈을 받는 콜백을 전달합니다:

```js twoslash
import 'vite/client'
// ---cut---
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

이렇게 Hot updates를 "허용한" 모듈은 **HMR 범위**로 간주됩니다.

Vite의 HMR은 처음에 불러온 모듈을 교체하지 않습니다: 만약에 HMR 범위의 모듈이 디펜던시로부터 imports를 다시 exports 한다면, 해당 re-exports를 업데이트할 책임이 있습니다 (그리고 그러한 exports는 `let`을 사용했을 것입니다). 또한, 경계 모듈에서 체인 위에 있는 importers에게는 변화가 되었다고 알리지 않습니다. 이렇게 간소화된 HMR 구현은 대부분의 개발 환경에서 충분하며, 프록시 모듈을 생성하는 것과 같이 비용이 큰 작업을 생략할 수 있도록 합니다.

모듈이 업데이트를 수락하고자 한다면, 이 함수에 대한 호출이 소스 코드에서 `import.meta.hot.accept(` (공백 구분)로 나타나야 합니다. 이는 Vite가 HMR 범위를 추적할 수 있도록 합니다.

## `hot.accept(deps, cb)` {#hot-accept-deps-cb}

모듈은 자체적으로 리로딩을 하지 않고 직접적인 의존성으로 변경을 수락할 수 있습니다:

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
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
      // 콜백은 null이 아닌 값을 갖는 업데이트된 모듈에 대한 배열을 전달받습니다.
      // 구문 오류와 같이 만약 업데이트가 성공하지 않았다면
      // 배열은 비어있습니다.
    }
  )
}
```

## `hot.dispose(cb)` {#hot-dispose-cb}

자체적으로 업데이트를 수락하는 모듈 혹은 다른 변경 사항에 의해 수락될 모듈은 변경된 복사본으로 인한 지속적인 사이드 이펙트를 정리하기 위해 `hot.dispose`를 사용할 수 있습니다:

```js twoslash
import 'vite/client'
// ---cut---
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // side effect를 처리함
  })
}
```

## `hot.prune(cb)` {#hot-prune-cb}

모듈이 페이지에서 더 이상 import 되지 않을 때 호출되는 콜백을 등록합니다. `hot.dispose`와 비교했을 때, 소스 코드 업데이트 시 자체적으로 또는 페이지에서 제거될 때 사이드 이펙트를 정리하는 경우 사용할 수 있습니다. Vite는 현재 `.css` import에 대해 이를 사용하고 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // 사이드 이펙트를 정리
  })
}
```

## `hot.data` {#hot-data}

`import.meta.hot.data` 객체는 같이 변경된 각기 다른 모듈들의 인스턴스들에서 지속됩니다. 해당 객체는 전 버전의 모듈 정보를 다음 버전의 모듈에게 전달할 수 있습니다.

`data` 자체에 대한 재할당은 지원되지 않습니다. 이 대신 다른 핸들러에서 추가된 정보가 유지되도록 `data` 객체의 속성을 변경해야 합니다.

```js twoslash
import 'vite/client'
// ---cut---
// ok
import.meta.hot.data.someValue = 'hello'

// 지원되지 않음
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()` {#hot-decline}

이는 현재 무시되고 있으며, 이전 버전과의 호환성을 위해 존재합니다. 만약 새로운 사용법이 생긴다면, 이는 변경될 수 있습니다. 모듈이 Hot 업데이트가 불가능함을 알리기 위해서는 `hot.invalidate()`를 사용하세요.

## `hot.invalidate(message?: string)` {#hot-invalidate-message-string}

실행 중인 자체 수용 모듈(self-accepting module)은 HMR 업데이트를 처리할 수 없음을 인지할 수 있고, 이에 따라 업데이트를 강제로 가져오는(importers) 모듈에 전파되어야 합니다. `import.meta.hot.invalidate()`를 호출함으로써 HMR 서버는 호출자의 가져오기(importers)를 무효화하며, 마치 호출자가 자체 수용 모듈이 아닌 것처럼 처리됩니다. 이 결과, 브라우저 콘솔과 터미널에 메시지가 기록됩니다. 무효화가 발생한 이유에 대한 문맥을 제공하기 위해 메시지를 전달할 수 있습니다.

자체 수용 모듈에 대한 향후 변경 사항을 수신하려면 항상 `import.meta.hot.accept`를 호출해야 하며, 그 직후에 `invalidate`를 호출할 계획이라도 이 작업을 수행해야 합니다. 의도를 명확하게 전달하기 위해, 다음과 같이 `accept` 콜백 내에서 `invalidate`를 호출하는 것이 좋습니다:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept(module => {
  // 새로운 모듈 인스턴스를 사용하여 무효화할지 결정할 수 있습니다.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)` {#hot-on-event-cb}

HMR 이벤트에 대한 핸들러를 정의합니다.

다음 HMR 이벤트들은 Vite에서 자동적으로 호출됩니다:

- `'vite:beforeUpdate'`는 변경이 적용되기 전에 호출됩니다. (e.g. 모듈이 변경될 예정일 때)
- `'vite:afterUpdate'`는 변경이 적용된 후에 호출됩니다. (e.g. 모듈이 변경된 후)
- `'vite:beforeFullReload'`는 전체 리로드가 일어나기 전에 호출됩니다.
- `'vite:beforePrune'`은 모듈들이 필요가 없어져서 제거될 때 호출됩니다.
- `'vite:invalidate'`는 모듈이 `import.meta.hot.invalidate()`로 무효화될 때 호출됩니다.
- `'vite:error'`는 에러가 일어났을 때 호출됩니다. (e.g. 구문 오류)
- `'vite:ws:disconnect'`는 WebSocket 연결이 끊어졌을 때 호출됩니다.
- `'vite:ws:connect'`는 WebSocket 연결이 (다시)설정되었을 때 호출됩니다.

플러그인들로부터 새로운 HMR 이벤트들을 보낼 수 있습니다. 더 많은 정보는 [handleHotUpdate](./api-plugin#handlehotupdate)를 참고해 주세요.

## `hot.off(event, cb)` {#hot-off-event-cb}

이벤트 리스너에서 콜백을 제거합니다.

## `hot.send(event, data)` {#hot-send-event-data}

커스텀 이벤트를 Vite의 개발 서버로 되돌려 보냅니다.

만약 연결되기 전에 호출된다면 데이터는 버퍼에서 잠시 대기하고 이후 연결이 설정되었을 때 전송하게 됩니다.

[커스텀 이벤트 타입 정의](/guide/api-plugin.html#typescript-for-custom-events)에 대한 섹션을 포함한 자세한 내용은 [클라이언트-서버 커뮤니케이션](/guide/api-plugin.html#client-server-communication)을 참고해 주세요.

## Further Reading {#further-reading}

HMR API에 대한 사용 방법과 내부 작동 방식에 대해 자세히 알아보고 싶다면, 다음 리소스를 확인해 보세요:

- [Hot Module Replacement is Easy](https://bjornlu.com/blog/hot-module-replacement-is-easy)