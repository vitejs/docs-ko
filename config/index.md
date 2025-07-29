---
title: Vite 설정하기
---

# Vite 설정하기 {#configuring-vite}

명령 줄에서 `vite`를 실행시킬 때, Vite는 자동으로 [프로젝트 루트](/guide/#index-html-and-project-root)의 `vite.config.js` 파일 확인을 시도합니다. (다른 JS 및 TS 확장도 지원)

가장 기본적인 설정 파일의 내용은 다음과 같습니다:

```js [vite.config.js]
export default {
  // 설정 옵션들
}
```

Note Vite supports using ES modules syntax in the config file even if the project is not using native Node ESM, e.g. `"type": "module"` in `package.json`. In this case, the config file is auto pre-processed before load.

또한 `--config` CLI 옵션을 사용하여 명시적으로 특정 설정 파일을 지정할 수도 있습니다. (경로는 `cwd`를 기준으로 하여 상대적으로 처리됩니다.)

```bash
vite --config my-config.js
```

::: tip 설정 파일 로딩
기본적으로 Vite는 `esbuild`를 사용해 설정 파일을 임시 파일로 번들링한 뒤 로드합니다. 다만 이는 모노리포에서 TypeScript 파일을 불러올 때 문제가 발생할 수 있습니다. 이러한 문제가 발생한다면 `--configLoader runner`를 지정해 [모듈 러너](/guide/api-environment-runtimes.html#modulerunner)를 대신 사용할 수 있습니다. 모듈 러너는 임시 설정 파일을 생성하지 않고 파일을 즉시 변환합니다. 참고로 모듈 러너는 설정 파일에서 CJS를 지원하지 않으나, 그럼에도 외부 CJS 패키지는 정상적으로 동작합니다.

또는 TypeScript를 지원하는 환경(예: `node --experimental-strip-types`)을 사용하거나 순수 JavaScript만 작성하는 경우, `--configLoader native`를 지정하여 현재 환경의 네이티브 런타임으로 설정 파일을 로드할 수 있습니다. 단, 설정 파일에서 불러온 모듈의 업데이트는 감지되지 않으므로 Vite 서버가 자동으로 재시작되지 않습니다.
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

만약 설정에서 명령(`serve` 또는 `build`), 사용 중인 [모드](/guide/env-and-mode#modes), SSR 빌드 여부(`isSsrBuild`), 또는 빌드 프리뷰(`isPreview`) 여부에 따라 조건부로 옵션을 결정해야 하는 경우, 아래와 같이 함수를 내보낼 수 있습니다:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // 개발 서버 설정
    }
  } else {
    // command === 'build'
    return {
      // 빌드 설정
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
    // Vite 설정 값 전달
  }
})
```

## 설정에서 환경 변수 사용하기 {#using-environment-variables-in-config}

환경 변수 역시 `process.env` 객체를 통해 가져올 수 있습니다.

참고로 Vite는 Vite의 설정을 끝마친 뒤 어떻게 파일을 불러올 것인지 알 수 있기 때문에, 기본적으로 `.env` 파일을 로드하지 않습니다. 가령 `root` 또는 `envDir` 설정 값에 따라 어떻게 파일을 불러올 것인지 달라집니다. 다만 필요하다면 `loadEnv` 헬퍼를 사용해 `.env` 파일을 불러올 수도 있습니다.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 현재 작업 디렉터리의 `mode`를 기반으로 env 파일을 불러옴
  // 세 번째 매개변수를 ''로 설정하면 `VITE_` 접두사에 관계없이
  // 모든 환경 변수를 불러옴
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Vite 설정
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
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