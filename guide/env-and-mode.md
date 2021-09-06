# Vite의 환경 변수와 모드 {#env-variables-and-modes}

## 환경 변수 {#env-variables}

Vite는 **`import.meta.env`** 객체를 이용해 환경 변수에 접근할 수 있도록 하고 있으며, 아래와 같은 환경 변수에 접근이 가능합니다.

- **`import.meta.env.MODE`**: {string} 현재 앱이 동작하고 있는 [모드](#modes)입니다.

- **`import.meta.env.BASE_URL`**: {string} 앱이 제공되는 베이스 URL이며, 이 값은 [`base` 설정](/config/#base)에 의해 결정됩니다.

- **`import.meta.env.PROD`**: {boolean} 앱이 프로덕션에서 실행 중인지 여부입니다.

- **`import.meta.env.DEV`**: {boolean} 앱이 개발 환경에서 실행 중인지 여부이며, 항상 `import.meta.env.PROD`와 반대되는 값을 가집니다.

### 프로덕션에서의 환경 변수 {#production-replacement}

프로덕션에서는 환경 변수가 모두 **정적으로 교체됩니다**. 따라서 항상 환경 변수는 정적으로 참조해야만 하며, `import.meta.env[key]`와 같은 동적 참조는 작동하지 않습니다.

JavaScript 문자열 및 Vue 템플릿에서도 마찬가지로 환경 변수는 모두 정적으로 교체됩니다. 이로 인해 환경 변수와 동일한 네이밍을 갖지만 실제로는 환경 변수가 아닌 경우, 의도하지 않은 동작이 발생될 수 있습니다. 가령 `"process.env.NODE_ENV:"`가 `""development": "`로 교체되는 경우, `Missing Semicolon` 또는 `Unexpected token`과 같은 오류가 표시됩니다.

- JavaScript 문자열의 경우, `'import.meta\u200b.env.MODE'`와 같이 너비가 0인 공백으로 문자열을 분리

- Vue 템플릿 또는 JavaScript 문자열로 컴파일되는 HTML의 경우, [`<wbr>` 태그](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr)를 이용 (`import.meta.<wbr>env.MODE`)

## `.env` 파일들 {#env-files}

Vite는 [dotenv](https://github.com/motdotla/dotenv)를 이용해 [환경 변수가 저장된 디렉터리](/config/#envdir) 내 아래의 파일에서 환경 변수를 가져옵니다.

```
.env                # 모든 상황에서 사용될 환경 변수
.env.local          # 모든 상황에서 사용되나, 로컬 개발 환경에서만 사용될(Git에 의해 무시될) 환경 변수
.env.[mode]         # 특정 모드에서만 사용될 환경 변수
.env.[mode].local   # 특정 모드에서만 사용되나, 로컬 개발 환경에서만 사용될(Git에 의해 무시될) 환경 변수
```

마찬가지로 이렇게 설정된 환경 변수는 `import.meta.env` 객체를 통해 접근이 가능합니다.

참고로, Vite에서 접근 가능한 환경 변수는 일반 환경 변수와 구분을 위해 `VITE_` 라는 접두사를 붙여 나타냅니다. 가령, 아래와 같이 환경 변수를 정의했다면:

```
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```

`VITE_SOME_KEY` 변수만이 `import.meta.env.VITE_SOME_KEY`로 접근이 가능합니다. (`DB_PASSWORD`는 노출되지 않습니다.)

만약 환경 변수에 대한 접미사(Prefix)를 커스터마이즈 하고자 한다면, [envPrefix](/config/index#envPrefix) 옵션을 참고해주세요.

:::warning 보안 사항

- `.env.*.local` 파일은 오로지 로컬에서만 접근이 가능한 파일이며, 데이터베이스 비밀번호와 같은 민감한 정보를 이 곳에 저장하도록 합니다. 또한 `.gitignore` 파일에 `.local` 파일을 명시해 Git에 체크인되는 것을 방지하도록 합니다.

- Vite 소스 코드에 노출되는 모든 환경 변수는 번들링 시 포함되게 됩니다. 따라서, `VITE_*` 환경 변수에는 민감한 정보들이 _포함되어서는 안됩니다_.
  :::

### 인텔리센스 {#intellisense}

기본적으로, Vite는 `import.meta.env`에 대한 타입 정의를 제공하고 있습니다. 물론 `.env.[mode]` 파일에서 더 많은 사용자 정의 환경 변수를 정의할 수 있으며, `VITE_` 접두사가 붙은 사용자 정의 환경 변수에 대해서는 TypeScript 인텔리센스 정의가 가능합니다.

`src` 디렉터리 내 `env.d.ts` 파일을 생성한 후, 아래와 같이 `ImportMetaEnv`를 정의하여 `VITE_` 환경 변수에 대한 타입을 정의할 수 있습니다.

```typescript
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  // 다른 환경 변수들에 대한 타입 정의...
}
```

## 모드 {#modes}

기본적으로, `serve` 명령으로 실행되는 개발 서버는 `development` 모드로 동작하고, `build` 명령으로 실행되는 경우에는 `production` 모드로 동작합니다.

즉, `vite build` 명령을 실행하게 되면 `.env.production`에 정의된 환경 변수를 불러오게 됩니다.

```
# .env.production
VITE_APP_TITLE=My App
```

앱 내에서는 `My App` 이라는 문자열이 `import.meta.env.VITE_APP_TITLE` 환경 변수를 통해 나타나지게 됩니다.

이 **모드** 라는 개념은 단지 개발(`development`)이나 배포(`production`) 뿐만 아니라 더 넓은 개념을 다루고 있습니다. 가령, 배포 모드와 비슷한(그러나 일부 다른 환경 변수를 갖는) "staging" 이라는 모드가 필요하다면 어떻게 해야 할까요?

방법은 간단하게도, 그저 `--mode` 옵션을 전달해 사용할 모드를 지정하면 됩니다. 예를 들어 "staging" 모드로 서버를 동작(배포)하고 싶다면 아래와 같이 명령을 실행해주면 됩니다.

```bash
vite build --mode staging
```

"staging" 모드에서 사용될 환경 변수는 `.env.staging` 파일에 정의합니다.

```
# .env.staging
NODE_ENV=production
VITE_APP_TITLE=My App (staging)
```

위와 같이 환경 변수를 설정하게 되면 "staging" 모드에서는 `My App (staging)` 이라는 문자열이 `import.meta.env.VITE_APP_TITLE` 환경 변수를 통해 나타나지게 됩니다.
