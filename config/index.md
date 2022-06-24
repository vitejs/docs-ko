---
title: Vite 설정하기
---

# Vite 설정하기 {#configuring-vite}

명령 줄에서 `vite`를 실행시킬 때, Vite는 자동으로 [프로젝트 루트](/guide/#index-html-and-project-root)의 `vite.config.js` 파일 확인을 시도합니다.

가장 기본적인 설정 파일의 내용은 다음과 같습니다:

```js
// vite.config.js
export default {
  // 설정 옵션들
}
```

비록 프로젝트에서 `type: "module"`을 통한 네이티브 노드 ESM을 사용하지 않더라도 Vite는 설정 파일에서 ES 모듈 구문 사용을 지원함을 참고해주세요. 이 경우에 설정 파일은 로드되기 전에 자동으로 미리 처리됩니다.

또한 `--config` CLI 옵션을 사용하여 명시적으로 특정 설정 파일을 지정할 수도 있습니다. (경로는 `cwd`를 기준으로 하여 상대적으로 처리됩니다.)

```bash
vite --config my-config.js
```

::: tip 참고
Vite는 설정 파일과 해당 디펜던시에서 `__filename` 및 `__dirname`을 삽입합니다. 따라서 코드 파일 내 최상위 수준에서 이러한 이름의 변수를 선언하면 오류가 발생됩니다:

```js
const __filename = 'value' // SyntaxError: Identifier '__filename' has already been declared

const func = () => {
  const __filename = 'value' // no error
}
```

:::

## 인텔리센스 설정 {#config-intellisense}

Vite는 TypeScript 형식을 포함하고 있기 때문에, jsdoc 형식의 힌트를 통해 사용자 IDE의 인텔리센스를 활용할 수 있습니다:

```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

대안으로 jsdoc 주석이 없어도 인텔리센스가 제공되는 `defineConfig` 도우미 함수를 사용할 수도 있습니다:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite는 또한 TS 설정 파일을 직접 지원합니다. `defineConfig` 도우미 함수와 함께 `vite.config.ts` 를 사용할 수 있습니다.

## 조건부 설정 {#conditional-config}

만약 설정에서 명령 (`dev`/`serve` 또는 `build`) 또는 사용 중인 [모드](/guide/env-and-mode)에 따라 조건부로 옵션을 결정해야 하는 경우, 아래와 같이 함수를 내보낼 수 있습니다:

```js
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // 개발 서버 설정
    }
  } else {
    return {
      // 빌드 설정
    }
  }
})
```

Vite의 API에서 `command` 값은 개발 서버(참고로 CLI `vite`는 `vite dev` 및 `vite serve`의 별칭)에서 `serve`이며, 프로덕션으로 빌드 시(`vite build`)에는 `build`가 들어가게 됩니다.

## 비동기 설정 {#async-config}

만약 설정에서 비동기(async) 함수를 호출해야 한다면, async 함수를 내보낼 수 있습니다:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // Vite 설정 값 전달
  }
})
```

## 환경 변수 {#environment-variables}

환경 변수 역시 `process.env` 객체를 통해 가져올 수 있습니다.

참고로 Vite는 Vite의 설정을 끝마친 뒤 어떻게 파일을 불러올 것인지 알 수 있기 때문에, 기본적으로 `.env` 파일을 로드하지 않습니다. 가령 `root` 또는 `envDir` 설정 값에 따라 어떻게 파일을 불러올 것인지 달라집니다. 다만 필요하다면 `loadEnv` 헬퍼를 사용해 `.env` 파일을 불러올 수도 있습니다.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // 현재 작업 디렉터리의 `mode`를 기반으로 env 파일을 불러옴
  // 세 번째 매개변수를 ''로 설정하면 `VITE_` 접두사에 관계없이 모든 환경 변수를 불러옴
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Vite 설정
    define: {
      __APP_ENV__: env.APP_ENV
    }
  }
})
```