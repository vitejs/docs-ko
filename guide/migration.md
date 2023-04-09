# v3에서 마이그레이션하기 {#migration-from-v3}

## Rollup 3 {#rollup-3}

Vite는 이제 [Rollup 3](https://github.com/vitejs/vite/issues/9870)을 사용하며, Vite의 내부 에셋 처리를 단순화하고 많은 개선이 있습니다. 자세한 것은 [Rollup 3 릴리스 노트](https://github.com/rollup/rollup/releases/tag/v3.0.0)를 참고해주세요.

Rollup 3는 많은 부분에서 Rollup 2와 호환됩니다. 만약 커스텀 [`rollupOptions`](../config/build-options.md#build-rollupoptions)를 사용하는 프로젝트에서 문제가 발생된다면, [Rollup 마이그레이션 가이드](https://rollupjs.org/migration/)를 참고하여 설정을 업그레이드하세요.

## 모던 브라우저 표준 변경 {#modern-browser-baseline-change}

모던 브라우저 빌드는 이제 ES2020 호환성을 넓히기 위해 기본적으로 `safari14`를 대상으로 합니다. 이는 모던 빌드가 이제 [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)를 사용할 수 있고 [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)가 더 이상 트랜스파일되지 않는다는 것을 의미합니다. 만약 이전 브라우저를 지원해야 한다면, [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)를 사용해주세요.

## 일반적인 변경사항 {#general-changes}

### 인코딩 {#encoding}

빌드 시 이제 기본적으로 utf8을 사용합니다. 자세한 것은 [#10753](https://github.com/vitejs/vite/issues/10753)를 참고해주세요.

### 문자열로 CSS 가져오기 {#importing-css-as-a-string}

Vite 3에서, `.css` 파일의 `default export`를 가져오는 것은 CSS를 두 번 로드할 수 있습니다.

```ts
import cssString from './global.css'
```

이 중복 로딩은 가져온 `.css`에 대한 스타일이 생성됨과 동시에 CSS 문자열이 애플리케이션 코드에서도 사용될 수 있기 때문에 발생할 수 있습니다(예를 들어, 프레임워크 런타임에 의해 주입될 수 있습니다). Vite 4부터 `.css`의 `default export`는 [사용이 중단되었으며](https://github.com/vitejs/vite/issues/11094), 이 대신 `?inline` 쿼리 접미사 수정자를 사용해야 합니다. 이 경우에는 가져온 `.css`에 대해 스타일을 생성하지 않습니다.

```ts
import stuff from './global.css?inline'
```

### 기본적으로 Production 빌드를 수행 {#production-builds-by-default}

`vite build`는 이제 전달된 `--mode`에 관계없이 항상 프로덕션 빌드를 수행합니다. 이전에는 `mode`를 `production` 이외의 다른 값으로 변경하면 개발 모드로 빌드가 수행되었습니다. 이제 개발 모드 빌드를 수행하려면 `.env.{mode}` 파일에서 `NODE_ENV=development`를 설정하면 됩니다.

이 변경 사항의 일부로, `vite dev`와 `vite build`는 이미 정의된 경우 `process.env.NODE_ENV`를 더 이상 덮어쓰지 않습니다. 따라서 `process.env.NODE_ENV = 'development'`를 빌드하기 전에 설정했다면 개발 모드로 빌드할 수 있습니다. 이렇게 하면 여러 빌드 또는 병렬로 실행되는 개발 서버를 실행할 때 더 많은 제어를 할 수 있습니다.

더 자세한 정보는 [모드](./env-and-mode.md#modes) 문서를 참조하세요.

### 환경 변수 {#environment-variables}

Vite는 이제 `dotenv` 16과 `dotenv-expand` 9를 사용합니다(이전에는 `dotenv` 14와 `dotenv-expand` 5를 사용했습니다). `#` 또는 `` ` ``를 포함하는 값이 있다면, 이 값을 따옴표로 감싸주세요.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

자세한 내용은 [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md)과 [`dotenv-expand` CHANGELOG](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md)를 참고해주세요.

## Advanced {#advanced}

플러그인/툴 개발자에게만 영향을 미치는 변경사항이 있습니다.

- [[#11036] feat(client)!: remove never implemented hot.decline](https://github.com/vitejs/vite/issues/11036)
  - `hot.invalidate`를 대신 사용
- [[#9669] feat: align object interface for `transformIndexHtml` hook](https://github.com/vitejs/vite/issues/9669)
  - `order`를 `enforce` 대신 사용

다음은 많은 사용자에게 영향을 미치지 않는 변경사항입니다.

- [[#11101] feat(ssr)!: remove dedupe and mode support for CJS](https://github.com/vitejs/vite/pull/11101)
  - CJS의 SSR 지원은 다음 Vite 메이저 업데이트에서 제거될 수 있으므로, SSR을 위해 기본적으로 ESM을 사용하도록 마이그레이션해야 합니다.
- [[#10475] feat: handle static assets in case-sensitive manner](https://github.com/vitejs/vite/pull/10475)
  - 프로젝트는 파일 이름의 대소문자를 무시하는 OS에 의존하지 않아야 합니다.
- [[#10996] fix!: make `NODE_ENV` more predictable](https://github.com/vitejs/vite/pull/10996)
  - 이 변경사항에 대한 설명은 PR을 참고하세요.
- [[#10903] refactor(types)!: remove facade type files](https://github.com/vitejs/vite/pull/10903)

## v2에서 마이그레이션하기 {#migration-from-v2}

-> [v2에서 마이그레이션하기 가이드](./migration-from-v2.md)를 먼저 확인하여 앱을 Vite v3로 포팅하기 위해 필요한 변경사항을 확인한 다음 이 페이지의 변경사항을 진행하세요.