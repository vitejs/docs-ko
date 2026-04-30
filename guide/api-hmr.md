# HMR API {#hmr-api}

:::tip 참고
해당 문서는 클라이언트 HMR API입니다. 플러그인에서 HMR 업데이트를 처리하는 방법은 [handleHotUpdate](./api-plugin#handlehotupdate)를 참고해 주세요.

수동 HMR API는 주로 프레임워크 및 도구 원작자를 위해 만들어졌습니다. 최종 사용자라면, HMR은 프레임워크별 스타터 템플릿에서 이미 처리되어 있을 가능성이 높습니다.
:::

Vite는 특수한 `import.meta.hot` 객체를 통해 수동 HMR API를 노출합니다:

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
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
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

## 필수 Conditional Guard {#required-conditional-guard}

우선, 프로덕션에서 코드가 트리 셰이킹될 수 있도록 모든 HMR API 사용을 조건부 블록으로 감싸야 합니다:

```js
if (import.meta.hot) {
  // HMR code
}
```

## TypeScript를 위한 IntelliSense {#intellisense-for-typescript}

Vite는 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts)에서 `import.meta.hot`에 대한 타입 정의를 제공합니다. TypeScript가 타입 정의를 인식하도록 `tsconfig.json`에 "vite/client"를 추가할 수 있습니다:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## `hot.accept(cb)` {#hot-accept-cb}

모듈이 자체 수용하려면, 업데이트된 모듈을 받는 콜백과 함께 `import.meta.hot.accept`를 사용합니다:

```js twoslash
import 'vite/client'
// ---cut---
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // SyntaxError가 발생하면 newModule은 undefined입니다
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

Hot 업데이트를 "수락한" 모듈은 **HMR 경계**로 간주됩니다.

```dot
digraph hmr_boundary {
  rankdir=RL
  ranksep=0.3
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  root [label="main.js" fillcolor="${#f6f6f7|#2e2e32}"]
  parent [label="App.vue" fillcolor="${#f6f6f7|#2e2e32}"]
  boundary [label="Component.vue\n(HMR boundary)\nhot.accept()" fillcolor="${#def5ed|#15312d}" color="${#18794e|#3dd68c}" penwidth=2]
  edited [label="utils.js\n(edited)" fillcolor="${#fcf4dc|#38301a}" color="${#915930|#f9b44e}" penwidth=2]

  boundary -> edited [label="imports" color="${#915930|#f9b44e}" style=bold]
  parent -> boundary [label="imports" style=dashed]
  root -> parent [label="imports" style=dashed]
}
```

Vite의 HMR은 원래 임포트된 모듈을 실제로 교체하지 않습니다: HMR 경계 모듈이 dep에서 임포트한 것을 다시 익스포트한다면, 해당 re-exports를 업데이트할 책임이 있습니다 (그리고 이러한 exports는 `let`을 사용해야 합니다). 또한, 경계 모듈에서 체인 위에 있는 importers에게는 변경이 통지되지 않습니다. 이렇게 단순화된 HMR 구현은 대부분의 개발 사용 사례에 충분하며, 프록시 모듈 생성처럼 비용이 큰 작업을 건너뛸 수 있게 합니다.

모듈이 업데이트를 수락하려면, 이 함수 호출이 소스 코드에 `import.meta.hot.accept(` (공백 구분)로 나타나야 합니다. 이는 Vite가 모듈에 대한 HMR 지원을 활성화하기 위해 수행하는 정적 분석의 요구사항입니다.

## `hot.accept(deps, cb)` {#hot-accept-deps-cb}

모듈은 자체를 다시 로드하지 않고도 직접 디펜던시의 업데이트를 수락할 수 있습니다:

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
    // 콜백은 업데이트된 './foo.js' 모듈을 받습니다
    newFoo?.foo()
  })

  // dep 모듈의 배열도 수락할 수 있습니다:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // 콜백은 업데이트된 모듈만
      // null이 아닌 배열을 받습니다. 업데이트가 성공하지 못했다면 (예: 구문 오류),
      // 배열은 비어 있습니다
    },
  )
}
```

## `hot.dispose(cb)` {#hot-dispose-cb}

자체 수용 모듈 또는 다른 모듈에 의해 수락될 것으로 예상되는 모듈은 업데이트된 복사본이 만든 지속적인 사이드 이펙트를 정리하기 위해 `hot.dispose`를 사용할 수 있습니다:

```js twoslash
import 'vite/client'
// ---cut---
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // 사이드 이펙트 정리
  })
}
```

## `hot.prune(cb)` {#hot-prune-cb}

모듈이 페이지에서 더 이상 임포트되지 않을 때 호출될 콜백을 등록합니다. `hot.dispose`와 비교했을 때, 소스 코드가 업데이트 시 사이드 이펙트를 자체적으로 정리하고 페이지에서 제거될 때만 정리하면 되는 경우에 사용할 수 있습니다. Vite는 현재 `.css` 임포트에 대해 이를 사용하고 있습니다.

```js twoslash
import 'vite/client'
// ---cut---
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // 사이드 이펙트 정리
  })
}
```

## `hot.data` {#hot-data}

`import.meta.hot.data` 객체는 동일한 업데이트된 모듈의 여러 인스턴스 간에 유지됩니다. 해당 객체는 이전 버전의 모듈 정보를 다음 버전으로 전달하는 데 사용할 수 있습니다.

`data` 자체에 대한 재할당은 지원되지 않습니다. 대신 다른 핸들러에서 추가된 정보가 보존되도록 `data` 객체의 프로퍼티를 변경해야 합니다.

```js twoslash
import 'vite/client'
// ---cut---
// ok
import.meta.hot.data.someValue = 'hello'

// 지원되지 않음
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()` {#hot-decline}

이는 현재 noop이며, 이전 버전과의 호환성을 위해 존재합니다. 새로운 사용법이 생기면 향후 변경될 수 있습니다. 모듈이 Hot 업데이트 가능하지 않음을 나타내려면 `hot.invalidate()`를 사용하세요.

## `hot.invalidate(message?: string)` {#hot-invalidate-message-string}

자체 수용 모듈은 런타임 중 HMR 업데이트를 처리할 수 없음을 인지할 수 있으며, 따라서 업데이트를 importers로 강제로 전파해야 합니다. `import.meta.hot.invalidate()`를 호출하면 HMR 서버는 호출자의 importers를 무효화하며, 호출자가 자체 수용 모듈이 아닌 것처럼 처리합니다. 이때 브라우저 콘솔과 터미널 모두에 메시지가 기록됩니다. 무효화가 발생한 이유에 대한 문맥을 제공하기 위해 메시지를 전달할 수 있습니다.

직후에 `invalidate`를 호출할 계획이더라도 항상 `import.meta.hot.accept`를 호출해야 합니다. 그렇지 않으면 HMR 클라이언트가 자체 수용 모듈에 대한 향후 변경 사항을 수신하지 않습니다. 의도를 명확하게 전달하기 위해, 다음과 같이 `accept` 콜백 내에서 `invalidate`를 호출하는 것을 권장합니다:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // 새 모듈 인스턴스를 사용해 무효화할지 결정할 수 있습니다.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)` {#hot-on-event-cb}

HMR 이벤트를 수신합니다.

다음 HMR 이벤트들은 Vite에서 자동으로 디스패치됩니다:

- `'vite:beforeUpdate'`는 업데이트가 적용되기 직전에 호출됩니다 (예: 모듈이 교체될 예정일 때)
- `'vite:afterUpdate'`는 업데이트가 막 적용된 후에 호출됩니다 (예: 모듈이 교체된 후)
- `'vite:beforeFullReload'`는 전체 리로드가 발생하기 직전에 호출됩니다
- `'vite:beforePrune'`은 더 이상 필요하지 않은 모듈들이 제거되기 직전에 호출됩니다
- `'vite:invalidate'`는 모듈이 `import.meta.hot.invalidate()`로 무효화될 때 호출됩니다
- `'vite:error'`는 에러가 발생했을 때 호출됩니다 (예: 구문 오류)
- `'vite:ws:disconnect'`는 WebSocket 연결이 끊어졌을 때 호출됩니다
- `'vite:ws:connect'`는 WebSocket 연결이 (다시) 설정되었을 때 호출됩니다

플러그인에서도 커스텀 HMR 이벤트를 보낼 수 있습니다. 자세한 내용은 [handleHotUpdate](./api-plugin#handlehotupdate)를 참고해 주세요.

## `hot.off(event, cb)` {#hot-off-event-cb}

이벤트 리스너에서 콜백을 제거합니다.

## `hot.send(event, data)` {#hot-send-event-data}

커스텀 이벤트를 Vite의 개발 서버로 되돌려 보냅니다.

연결되기 전에 호출되면, 데이터는 버퍼링되었다가 연결이 설정되면 전송됩니다.

[커스텀 이벤트 타입 지정](/guide/api-plugin.html#typescript-for-custom-events)에 대한 섹션을 포함한 자세한 내용은 [클라이언트-서버 커뮤니케이션](/guide/api-plugin.html#client-server-communication)을 참고해 주세요.

## 추가 자료 {#further-reading}

HMR API 사용 방법과 내부 작동 방식에 대해 더 자세히 알아보고 싶다면, 다음 리소스를 확인해 보세요:

- [Hot Module Replacement is Easy](https://bjornlu.com/blog/hot-module-replacement-is-easy)
