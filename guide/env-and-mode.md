# Vite의 환경 변수와 모드 {#env-variables-and-modes}

## 환경 변수 {#env-variables}

Vite는 **`import.meta.env`** 객체를 이용해 환경 변수에 접근할 수 있도록 하고 있으며, 아래와 같은 환경 변수에 접근이 가능합니다.

- **`import.meta.env.MODE`**: {string} 현재 앱이 동작하고 있는 [모드](#modes)입니다.

- **`import.meta.env.BASE_URL`**: {string} 앱이 제공되는 베이스 URL이며, 이 값은 [`base` 설정](/config/shared-options.md#base)에 의해 결정됩니다.

- **`import.meta.env.PROD`**: {boolean} 앱이 프로덕션에서 실행 중인지 여부입니다(개발 서버 실행 혹은 프로덕션 빌드 시 `NODE_ENV='production'`로 설정).

- **`import.meta.env.DEV`**: {boolean} 앱이 개발 환경에서 실행 중인지 여부이며, 항상 `import.meta.env.PROD`와 반대되는 값을 가집니다.

- **`import.meta.env.SSR`**: {boolean} 앱이 [서버](./ssr.md#conditional-logic)에서 실행 중인지 여부입니다.

## `.env` 파일들 {#env-files}

Vite는 [dotenv](https://github.com/motdotla/dotenv)를 이용해 [환경 변수가 저장된 디렉터리](/config/shared-options.md#envdir) 내 아래의 파일에서 환경 변수를 가져옵니다.

```
.env                # 모든 상황에서 사용될 환경 변수
.env.local          # 모든 상황에서 사용되나, 로컬 개발 환경에서만 사용될(Git에 의해 무시될) 환경 변수
.env.[mode]         # 특정 모드에서만 사용될 환경 변수
.env.[mode].local   # 특정 모드에서만 사용되나, 로컬 개발 환경에서만 사용될(Git에 의해 무시될) 환경 변수
```

:::tip 환경 변수 우선순위

`.env.production`과 같이 특정 모드에 대한 환경 변수는 일반적인 환경 변수(`.env`)보다 높은 우선순위를 갖습니다.

또한 Vite가 실행될 때 이미 존재하던 환경 변수는 가장 높은 우선 순위를 가지며, `.env` 파일로 인해 덮어씌워지지 않습니다. 가령 `VITE_SOME_KEY=123 vite build` 와 같이 말이죠.

`.env` 파일은 Vite가 시작될 때 가져와집니다. 따라서 파일을 변경했다면 서버를 재시작해주세요.
:::

마찬가지로 이렇게 설정된 환경 변수는 `import.meta.env` 객체를 통해 문자열 형태로 접근이 가능합니다.

참고로, Vite에서 접근 가능한 환경 변수는 일반 환경 변수와 구분을 위해 `VITE_` 라는 접두사를 붙여 나타냅니다. 가령, 아래와 같이 환경 변수를 정의했다면:

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

`VITE_SOME_KEY` 변수만이 `import.meta.env.VITE_SOME_KEY`로 접근이 가능합니다. (`DB_PASSWORD`는 노출되지 않습니다.)

```js
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

또한 Vite는 [dotenv-expand](https://github.com/motdotla/dotenv-expand)를 사용해 기본적으로 환경 변수를 확장합니다. 문법에 대해 더 알아보고 싶다면 [이 문서](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow)를 참고하세요.

참고로 만약 환경 변수의 값에 `$`를 사용하고 싶다면 `\`를 사용해야 합니다.

```
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

환경 변수에 대한 접미사(Prefix)를 커스터마이즈 하고자 한다면, [envPrefix](/config/shared-options.html#envprefix) 옵션을 참고해주세요.

:::warning 보안 권고 사항

- `.env.*.local` 파일은 오로지 로컬에서만 접근이 가능한 파일이며, 데이터베이스 비밀번호와 같은 민감한 정보를 이 곳에 저장하도록 합니다. 또한 `.gitignore` 파일에 `*.local` 파일을 명시해 Git에 체크인되는 것을 방지하도록 합니다.

- Vite 소스 코드에 노출되는 모든 환경 변수는 번들링 시 포함되게 됩니다. 따라서, `VITE_*` 환경 변수에는 민감한 정보들이 _포함되어서는 안됩니다_.
  :::

### TypeScript를 위한 인텔리센스 {#intellisense-for-typescript}

기본적으로, Vite는 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts)의 `import.meta.env`에 대한 타입 정의를 제공하고 있습니다. 물론 `.env.[mode]` 파일에서 더 많은 사용자 정의 환경 변수를 정의할 수 있으며, `VITE_` 접두사가 붙은 사용자 정의 환경 변수에 대해서는 TypeScript 인텔리센스 정의가 가능합니다.

`src` 디렉터리 내 `env.d.ts` 파일을 생성한 후, 아래와 같이 `ImportMetaEnv`를 정의하여 `VITE_` 환경 변수에 대한 타입을 정의할 수 있습니다.

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 다른 환경 변수들에 대한 타입 정의...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

만약 코드가 [DOM](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts)이나 [WebWorker](https://github.com/microsoft/TypeScript/blob/main/lib/lib.webworker.d.ts)와 같이 브라우저 환경의 타입이 필요하다면, `tsconfig.json`에서 [lib](https://www.typescriptlang.org/tsconfig#lib) 필드에 이를 명시해줄 수 있습니다.

```json
{
  "lib": ["WebWorker"]
}
```

## HTML 환경 변수 대체 {#html-env-replacement}

Vite는 HTML 파일에서 환경 변수를 대체하는 기능도 지원합니다. `import.meta.env`의 모든 속성은 특수한 `%ENV_NAME%` 구문을 사용해 HTML 파일에서도 사용할 수 있습니다.

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

다만 환경 변수가 `import.meta.env`에 존재하지 않는다면 HTML에서는 무시되고 대체되지 않습니다. 예를 들어 `%NON_EXISTENT%`라는 환경 변수가 `import.meta.env`에 존재하지 않는다면, JS에서는 `import.meta.env.NON_EXISTENT`가 `undefined`로 대체되지만, HTML에서는 무시되고 대체되지 않습니다.

## 모드 {#modes}

기본적으로, `dev` 명령으로 실행되는 개발 서버는 `development` 모드로 동작하고, `build` 명령으로 실행되는 경우에는 `production` 모드로 동작합니다.

다시말해 `vite build` 명령을 실행하게 되면 `.env.production`에 정의된 환경 변수를 불러오게 됩니다.

```
# .env.production
VITE_APP_TITLE=My App
```

특정 상황에서는 `vite build` 명령을 실행할 때 다른 모드를 사용하여 다른 타이틀을 렌더링하고 싶을 수 있습니다. `--mode` 옵션 플래그를 통해 기본 동작을 덮어쓸 수 있습니다. 예를 들어, "staging" 모드를 위해 앱을 빌드하고 싶다면 다음과 같이 실행할 수 있습니다:

```bash
vite build --mode staging
```

그리고 `.env.staging` 파일을 생성합니다:

```
# .env.staging
VITE_APP_TITLE=My App (staging)
```

`vite build` 명령은 기본적으로 `production` 모드로 동작하기 때문에, 다른 모드와 `.env` 파일 설정을 통해 `development` 모드로 빌드를 실행할 수 있습니다:

```
# .env.testing
NODE_ENV=development
```