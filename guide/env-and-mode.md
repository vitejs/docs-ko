# Vite의 환경 변수와 모드 {#env-variables-and-modes}

Vite는 `import.meta.env`라는 특수한 객체를 통해 특정 상수들을 노출합니다. 이러한 상수들은 개발 시 전역 변수로 정의되나, 빌드 시에는 정적으로 치환되어 효과적인 트리 셰이킹이 가능합니다.

:::details 예제

```js
if (import.meta.env.DEV) {
  // 이 안의 코드는 프로덕션 빌드에서 트리 셰이킹됩니다
  console.log('Dev mode')
}
```

:::

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05an?via=vite" title="Vite의 환경 변수">Scrimba에서 인터랙티브 강의 보기</ScrimbaLink>

## 내장 상수 {#built-in-constants}

모든 상황에서 사용할 수 있는 내장 상수들은 다음과 같습니다:

- **`import.meta.env.MODE`**: {string} 현재 앱이 동작하고 있는 [모드](#modes)입니다.

- **`import.meta.env.BASE_URL`**: {string} 앱이 제공되는 베이스 URL이며, 이 값은 [`base` 설정 옵션](/config/shared-options.md#base)에 의해 결정됩니다.

- **`import.meta.env.PROD`**: {boolean} 앱이 프로덕션에서 실행 중인지 여부입니다(`NODE_ENV='production'`으로 개발 서버를 실행하거나, `NODE_ENV='production'`으로 빌드된 앱을 실행하는 경우).

- **`import.meta.env.DEV`**: {boolean} 앱이 개발 환경에서 실행 중인지 여부이며, 항상 `import.meta.env.PROD`와 반대되는 값을 가집니다.

- **`import.meta.env.SSR`**: {boolean} 앱이 [서버](./ssr.md#conditional-logic)에서 실행 중인지 여부입니다.

## 환경 변수 {#env-variables}

Vite는 `import.meta.env` 객체를 통해 자동으로 환경 변수를 문자열로 노출합니다.

`VITE_` 접두사가 붙은 변수는 Vite 번들링 후 클라이언트 사이드 소스 코드에 노출됩니다. 환경 변수가 클라이언트에 실수로 유출되는 것을 방지하려면 이 접두사를 사용하지 마세요. 예를 들어 다음과 같은 경우를 살펴보겠습니다:

```[.env]
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

`VITE_SOME_KEY`의 파싱된 값인 `"123"`은 클라이언트에 노출되지만, `DB_PASSWORD`의 값은 노출되지 않습니다. 코드에 다음을 추가해 확인할 수 있습니다:

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

환경 변수 접두사를 커스터마이징하려면 [envPrefix](/config/shared-options.html#envprefix) 옵션을 참고하세요.

:::tip 환경 변수 파싱
위와 같이 `VITE_SOME_KEY`는 숫자이지만 파싱 시 문자열로 반환됩니다. 불리언 환경 변수에 대해서도 동일하게 적용되며, 코드에서 사용할 때는 원하는 타입으로 변환해야 합니다.
:::

:::warning 시크릿 보호하기

`VITE_*` 변수에는 API 키와 같은 민감한 정보가 _포함되어서는 안 됩니다_. 이러한 변수의 값은 빌드 시 소스 코드에 번들링됩니다. 프로덕션 배포에서는 시크릿을 올바르게 보호하기 위해 백엔드 서버 또는 서버리스/엣지 함수를 고려하세요.

:::

### `.env` 파일들 {#env-files}

Vite는 [dotenv](https://github.com/motdotla/dotenv)를 이용해 [환경 변수가 저장된 디렉터리](/config/shared-options.md#envdir) 내 아래의 파일에서 추가 환경 변수를 로드합니다.

```
.env                # 모든 상황에서 로드됨
.env.local          # 모든 상황에서 로드되며, git에서 무시됨
.env.[mode]         # 지정된 모드에서만 로드됨
.env.[mode].local   # 지정된 모드에서만 로드되며, git에서 무시됨
```

:::tip 환경 변수 로드 우선순위

`.env.production`과 같이 특정 모드에 대한 환경 변수 파일은 일반적인 환경 변수 파일(예: `.env`)보다 높은 우선순위를 갖습니다.

Vite는 모드별 `.env.[mode]` 파일 외에도 항상 `.env`와 `.env.local` 파일을 로드합니다. 모드별 파일에 선언된 변수는 일반 파일에 있는 변수보다 우선하지만, `.env`나 `.env.local`에만 정의된 변수도 여전히 환경 변수로 사용할 수 있습니다.

또한 Vite가 실행될 때 이미 존재하던 환경 변수는 가장 높은 우선순위를 가지며, `.env` 파일로 인해 덮어씌워지지 않습니다. 예를 들어 `VITE_SOME_KEY=123 vite build`를 실행하는 경우입니다.

`.env` 파일은 Vite가 시작될 때 로드됩니다. 파일을 변경했다면 서버를 재시작하세요.

:::

:::warning Bun 사용자

[Bun](https://bun.sh)을 사용할 때는 Bun이 스크립트가 실행되기 전에 `.env` 파일을 자동으로 로드한다는 점에 유의하세요. 이 내장 동작은 환경 변수를 `process.env`에 직접 로드하며, 기존 `process.env` 값을 존중하는 Vite의 기능과 충돌할 수 있습니다. 대응 방법은 [oven-sh/bun#5515](https://github.com/oven-sh/bun/issues/5515)를 참고하세요.

:::

또한 Vite는 [dotenv-expand](https://github.com/motdotla/dotenv-expand)를 사용해 env 파일에 작성된 환경 변수를 별도 설정 없이 확장합니다. 문법에 대해 더 알아보려면 [해당 문서](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow)를 확인하세요.

환경 변수 값 안에서 `$`를 사용하려면 `\`로 이스케이프해야 합니다.

```[.env]
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

::: details 역순으로 변수 확장하기

Vite는 역순으로 변수를 확장하는 것을 지원합니다.
예를 들어, 아래의 `.env` 파일은 `VITE_FOO=foobar`, `VITE_BAR=bar`로 평가됩니다.

```[.env]
VITE_FOO=foo${VITE_BAR}
VITE_BAR=bar
```

이는 셸 스크립트나 `docker compose`와 같은 다른 도구에서는 작동하지 않습니다.
그렇지만 Vite는 이 동작을 지원하는데, 이는 `dotenv-expand`가 오랫동안 이 기능을 지원해 왔고, JavaScript 생태계 내 다른 도구들도 이 동작을 지원하는 이전 버전을 사용하고 있기 때문입니다.

상호 운용성 문제를 피하기 위해 이러한 동작에 의존하지 않는 것이 좋습니다. Vite는 향후 이러한 동작에 대해 경고를 표시할 수 있습니다.

:::

:::warning 로컬 `.env` 파일 무시하기

`.env.*.local` 파일은 로컬 전용이며 민감한 변수를 포함할 수 있습니다. 이러한 파일이 git에 체크인되지 않도록 `*.local`을 `.gitignore`에 추가해야 합니다.

:::

## TypeScript를 위한 IntelliSense {#intellisense-for-typescript}

기본적으로, Vite는 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts)의 `import.meta.env`에 대한 타입 정의를 제공합니다. 물론 `.env.[mode]` 파일에서 더 많은 커스텀 환경 변수를 정의할 수 있으며, `VITE_` 접두사가 붙은 사용자 정의 환경 변수에 대해서는 TypeScript IntelliSense 정의가 필요할 수 있습니다.

이를 위해 `src` 디렉터리 내 `vite-env.d.ts` 파일을 생성한 후, 아래와 같이 `ImportMetaEnv`를 확장할 수 있습니다:

```typescript [vite-env.d.ts]
interface ViteTypeOptions {
  // 아래 라인을 추가하면, ImportMetaEnv 타입을 엄격하게 설정해
  // 알 수 없는 키를 허용하지 않게 할 수 있습니다.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 다른 환경 변수들에 대한 타입 정의...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

만약 코드가 [DOM](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts)이나 [WebWorker](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts)와 같이 브라우저 환경의 타입에 의존한다면, `tsconfig.json`에서 [lib](https://www.typescriptlang.org/tsconfig#lib) 필드를 업데이트할 수 있습니다.

```json [tsconfig.json]
{
  "lib": ["WebWorker"]
}
```

:::warning 임포트는 타입 확장을 깨뜨립니다

만약 `ImportMetaEnv` 확장이 동작하지 않는다면, `vite-env.d.ts`에 `import` 구문이 없는지 확인해 주세요. 더 자세한 내용은 [TypeScript 문서](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined)에서 확인할 수 있습니다.

:::

## HTML 내 상수 치환 {#html-env-replacement}

Vite는 HTML 파일에서 상수를 치환하는 기능도 지원합니다. `import.meta.env`의 모든 속성은 특수한 `%CONST_NAME%` 구문을 통해 HTML 파일에서도 사용할 수 있습니다:

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

HTML에서 환경 변수가 `import.meta.env`에 존재하지 않으면, 예를 들어 `%NON_EXISTENT%`는 무시되며 치환되지 않습니다. 이와는 달리 JS에서 `import.meta.env.NON_EXISTENT`는 `undefined`로 치환됩니다.

Vite는 많은 프레임워크에서 사용되고 있기에, 조건문과 같은 복잡한 대체에 대해서는 의도적으로 의견을 제시하지 않고 있습니다. Vite는 [기존 사용자 영역 플러그인](https://github.com/vitejs/awesome-vite#transformers) 또는 [`transformIndexHtml` 훅](./api-plugin#transformindexhtml)을 구현한 커스텀 플러그인을 통해 확장할 수 있습니다.

## 모드 {#modes}

기본적으로, 개발 서버(`dev` 명령)는 `development` 모드로 동작하고, `build` 명령은 `production` 모드로 동작합니다.

다시 말해 `vite build` 명령을 실행하면 `.env.production`이 있는 경우 해당 파일에 정의된 환경 변수를 불러오게 됩니다:

```[.env.production]
VITE_APP_TITLE=My App
```

앱에서는 `import.meta.env.VITE_APP_TITLE`을 통해 제목을 렌더링할 수 있습니다.

특정 상황에서는 `vite build` 명령을 실행할 때 다른 모드를 사용하여 다른 타이틀을 렌더링하고 싶을 수 있습니다. `--mode` 옵션 플래그를 전달하여 명령에 사용되는 기본 모드를 덮어쓸 수 있습니다. 예를 들어 staging 모드용으로 앱을 빌드하고 싶다면 다음과 같이 실행할 수 있습니다:

```bash
vite build --mode staging
```

그리고 `.env.staging` 파일을 생성합니다:

```[.env.staging]
VITE_APP_TITLE=My App (staging)
```

`vite build` 명령은 기본적으로 프로덕션 빌드를 실행하므로, 다른 모드와 `.env` 파일 설정을 사용해 이를 변경하고 개발 빌드를 실행할 수도 있습니다:

```[.env.testing]
NODE_ENV=development
```

### NODE_ENV 그리고 모드 {#node-env-and-modes}

`NODE_ENV`(`process.env.NODE_ENV`)와 모드는 서로 다른 개념임을 유의해야 합니다. 아래는 명령이 `NODE_ENV`와 모드에 어떤 영향을 미치는지 보여줍니다:

| 명령                                                  | NODE_ENV        | 모드            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

`NODE_ENV`와 모드의 서로 다른 값은 이에 대응하는 `import.meta.env` 속성에도 반영됩니다:

| 명령                    | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| 명령                  | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `.env` 파일에서의 `NODE_ENV`

`NODE_ENV=...`는 명령뿐 아니라, `.env` 파일에서도 설정할 수 있습니다. 따라서 만약 `.env.[mode]` 파일에서 `NODE_ENV`가 설정되어 있다면, 모드를 통해서도 이를 제어할 수 있습니다. 그러나 `NODE_ENV`와 모드는 여전히 두 개의 다른 개념이라는 것을 유의하세요.

명령에서 `NODE_ENV=...`를 사용하는 주된 이점은 Vite가 그 값을 조기에 감지할 수 있다는 것입니다. 또한 Vite는 설정이 평가된 후에만 env 파일을 로드할 수 있으므로, 명령에서 지정하면 Vite 설정에서 `process.env.NODE_ENV`를 읽을 수 있습니다.
:::
