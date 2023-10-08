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

## ssr.resolve.conditions {#ssr-resolve-conditions}

- **타입:** `string[]`
- **관련 항목:** [Resolve Conditions](./shared-options.md#resolve-conditions)

기본값은 루트 [`resolve.conditions`](./shared-options.md#resolve-conditions)입니다.

이 조건은 플러그인 파이프라인에서 사용되며, SSR 빌드 중에 외부화되지 않은 디펜던시에만 영향을 미칩니다. 외부화된 임포트에 영향을 미치려면 `ssr.resolve.externalConditions`를 사용하세요.

## ssr.resolve.externalConditions {#ssr-resolve-externalconditions}

- **타입:** `string[]`
- **기본값:** `[]`

외부화된 디펜던시를 SSR로 임포트(`ssrLoadModule` 포함)할 때 사용되는 조건들입니다.