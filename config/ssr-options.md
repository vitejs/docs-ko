# SSR 옵션 {#ssr-options}

## ssr.external {#ssr-external}

- **타입:** `string[]`
- **관련 항목:** [SSR Externals](/guide/ssr#ssr-externals)

SSR을 위한 디펜던시를 강제로 외부화합니다.

## ssr.noExternal {#ssr-noexternal}

- **타입:** `string | RegExp | (string | RegExp)[] | true`
- **관련 항목:** [SSR Externals](/guide/ssr#ssr-externals)

SSR을 위한 디펜던시 중에 이 목록에 있는 디펜던시는 외부화되는 것이 방지됩니다. 만약 `true`인 경우, 어떠한 디펜던시도 외부화되지 않음을 의미합니다.

## ssr.target {#ssr-target}

- **타입:** `'node' | 'webworker'`
- **기본값:** `node`

SSR 서버를 위한 빌드 타깃입니다.

## ssr.format {#ssr-format}

- **실험적 기능:** [CJS 지원은 Vite 5에서 제거 예정](https://github.com/vitejs/vite/discussions/13816)
- **사용 중단** Vite 5에서는 ESM 빌드만 지원합니다.
- **타입:** `'esm' | 'cjs'`
- **기본값:** `esm`

SSR 서버를 위한 빌드 방식을 지정합니다. Vite v3부터 SSR 빌드는 기본적으로 ESM을 사용합니다. `'cjs'`를 선택해 CJS 빌드를 생성할 수는 있으나 권장되는 방식은 아닙니다. 이 옵션은 사용자가 ESM으로 마이그레이션 할 수 있도록 충분한 시간을 제공하기 위해 실험용으로 표시하고 있습니다. CJS 빌드에는 ESM 포맷에는 없는 외부화를 위한 복잡한 휴리스틱이 필요합니다.