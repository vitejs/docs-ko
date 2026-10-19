---
title: Vite 설정하기
---

# Vite 설정하기 {#configuring-vite}

명령 줄에서 `vite`를 실행시킬 때, Vite는 자동으로 [프로젝트 루트](/guide/#index-html-and-project-root)의 `vite.config.js` 파일 확인을 시도합니다. (다른 JS 및 TS 확장도 지원)

가장 기본적인 설정 파일의 내용은 다음과 같습니다:

```js [vite.config.js]
export default {
  // 설정 옵션
}
```

참고로 설정 파일에서 ES 모듈 문법을 사용하려면 Node.js가 해당 파일을 ESM으로 인식해야 합니다(예: `.mjs` 파일, 또는 가장 가까운 `package.json`에 `"type": "module"`이 지정된 `.js` 파일).

또한 `--config` CLI 옵션을 사용하여 명시적으로 특정 설정 파일을 지정할 수도 있습니다. (경로는 `cwd`를 기준으로 하여 상대적으로 처리됩니다.)

```bash
vite --config my-config.js
```

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05jg?via=vite" title="Vite 설정하기">Scrimba에서 인터랙티브 강의 보기</ScrimbaLink>

::: tip 설정 파일 로딩
기본적으로 Vite는 [Rolldown](https://rolldown.rs/)을 사용해 설정 파일을 임시 파일로 번들링한 뒤 로드합니다. TypeScript를 지원하는 환경(예: Node 22.18+)을 사용하거나 순수 JavaScript만 작성하는 경우, `--configLoader native`를 지정하여 현재 환경의 네이티브 런타임으로 설정 파일을 로드할 수 있습니다. `configLoader: 'native'`는 향후 메이저 버전에서 기본값이 될 예정입니다.
:::

## 인텔리센스 설정 {#config-intellisense}

Vite는 TypeScript 타입을 포함하고 있기 때문에, jsdoc 힌트를 통해 IDE 인텔리센스를 활용할 수 있습니다:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

또는, jsdoc 대신 `defineConfig` 도우미 함수를 통해 인텔리센스를 활용할 수 있습니다:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

TypeScript 설정 파일 또한 지원합니다. 위 `defineConfig` 도우미 함수 또는 `satisfies` 연산자를 사용해 `vite.config.ts` 파일을 사용할 수 있습니다:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## 조건부 설정 {#conditional-config}

만약 설정에서 명령(`serve` 또는 `build`), 사용 중인 [모드](/guide/env-and-mode#modes), SSR 빌드인지(`isSsrBuild`), 또는 빌드 프리뷰인지(`isPreview`)에 따라 조건부로 옵션을 결정해야 한다면, 아래와 같이 함수를 내보낼 수 있습니다:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // 개발 전용 설정
    }
  } else {
    // command === 'build'
    return {
      // 빌드 전용 설정
    }
  }
})
```

Vite의 API에서 `command` 값은 개발 서버(CLI [`vite`](/guide/cli#vite)는 `vite dev` 및 `vite serve`의 별칭)에서 `serve`이며, 프로덕션으로 빌드 시([`vite build`](/guide/cli#vite-build))에는 `build`가 들어가게 됩니다.

`isSsrBuild`와 `isPreview`는 각각 `build`와 `serve` 명령을 구분하기 위한 추가적인 선택적 플래그입니다. Vite 설정을 불러오는 일부 툴은 이러한 플래그를 지원하지 않을 수 있으며, 이 경우에는 `undefined`를 전달합니다. 따라서 `true`와 `false`에 대한 명시적인 비교를 사용하는 것이 좋습니다.

## 비동기 설정 {#async-config}

만약 설정에서 비동기 함수를 호출해야 하는 경우, 이 대신 비동기 함수를 내보낼 수 있습니다. 또한 이 비동기 함수는 인텔리센스 지원을 위해 `defineConfig`를 통해 전달할 수도 있습니다:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // Vite 설정
  }
})
```

## 설정에서 환경 변수 사용하기 {#using-environment-variables-in-config}

설정 자체가 평가되는 동안 사용할 수 있는 환경 변수는 현재 프로세스 환경(`process.env`)에 이미 존재하는 값뿐입니다. Vite는 사용자 설정이 해결된 _뒤에_ `.env*` 파일 로딩을 의도적으로 지연합니다. 로드할 파일 집합이 [`root`](/guide/#index-html-and-project-root), [`envDir`](/config/shared-options.md#envdir) 같은 설정 옵션과 최종 `mode`에 따라 달라지기 때문입니다.

즉, `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`에 정의된 변수는 `vite.config.*`가 실행되는 동안 `process.env`에 자동으로 주입되지 않습니다. 이 변수들은 나중에 자동으로 로드되어 [환경 변수와 모드](/guide/env-and-mode.html)에 문서화된 대로 기본 `VITE_` 접두사 필터를 거쳐 애플리케이션 코드의 `import.meta.env`에 노출됩니다. 따라서 `.env*` 파일의 값을 앱에 전달하기만 하면 된다면 설정에서 별도로 호출할 필요가 없습니다.

하지만 `.env*` 파일의 값이 설정 자체에 영향을 주어야 한다면(예: `server.port` 설정, 플러그인 조건부 활성화, `define` 치환 값 계산), 내보내진 [`loadEnv`](/guide/api-javascript.html#loadenv) 헬퍼를 사용해 직접 로드할 수 있습니다.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 현재 작업 디렉터리에서 `mode`에 맞는 env 파일을 로드합니다.
  // 세 번째 매개변수를 ''로 설정하면 `VITE_` 접두사와 관계없이
  // 모든 env를 로드합니다.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // env 변수에서 파생한 앱 수준 상수를 명시적으로 제공합니다.
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    // 예: env 변수를 사용해 개발 서버 포트를 조건부로 설정합니다.
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    },
  }
})
```

## VS Code에서 설정 파일 디버깅하기 {#debugging-the-config-file-on-vs-code}

기본 설정인 `--configLoader bundle` 모드에서, Vite는 `node_modules/.vite-temp` 폴더에 임시 설정 파일을 작성합니다. 이 경우 중단점을 이용해 Vite 설정 파일을 디버깅하면 파일을 찾을 수 없다는 오류가 발생합니다. 이 문제는 다음과 같이 `.vscode/settings.json` 설정을 추가해 해결할 수 있습니다:

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```
