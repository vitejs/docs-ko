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

참고로 Vite는 프로젝트가 네이티브 Node ESM을 사용하지 않는 경우에도 설정 파일에서 ES 모듈 구문을 사용할 수 있도록 지원하고 있습니다(예: `package.json`의 `type: "module"`). 이 때 설정 파일은 사용되기 전에 자동으로 미리 처리됩니다.

또한 `--config` CLI 옵션을 사용하여 명시적으로 특정 설정 파일을 지정할 수도 있습니다. (경로는 `cwd`를 기준으로 하여 상대적으로 처리됩니다.)

```bash
vite --config my-config.js
```

## 인텔리센스 설정 {#config-intellisense}

Vite는 TypeScript 형식을 포함하고 있기 때문에, jsdoc 형식의 힌트를 통해 사용자 IDE의 인텔리센스를 활용할 수 있습니다:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
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

만약 설정에서 명령(`dev`/`serve` 또는 `build`), 사용 중인 [모드](/guide/env-and-mode), 또는 SSR 빌드 여부(`ssrBuild`)에 따라 조건부로 옵션을 결정해야 하는 경우, 아래와 같이 함수를 내보낼 수 있습니다:

```js
export default defineConfig(({ command, mode, ssrBuild }) => {
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

Vite의 API에서 `command` 값은 개발 서버(참고로 CLI `vite`는 `vite dev` 및 `vite serve`의 별칭)에서 `serve`이며, 프로덕션으로 빌드 시(`vite build`)에는 `build`가 들어가게 됩니다.

`ssrBuild`는 실험적인 기능입니다. 개발 중에는 옵션 값이 SSR 및 이를 사용하지 않는 비-SSR(Non-SSR) 요청이 단일 서버에서 공유되기에, 빌드 시에는 보다 일반적인 의미를 담고 있는 `ssr` 플래그를 대신해 사용할 수 있습니다. 브라우저 및 SSR 빌드에 대한 별도의 명령을 지정하지 않은 경우, 값이 `undefined`로 정의될 수 있기 때문에 `true` 및 `false` 값을 이용해 명시적으로 비교해주세요.

## 비동기 설정 {#async-config}

만약 설정에서 비동기 함수를 호출해야 하는 경우, 이 대신 비동기 함수를 내보낼 수 있습니다. 또한 이 비동기 함수는 인텔리센스 지원을 위해 `defineConfig`를 통해 전달할 수도 있습니다:

```js
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