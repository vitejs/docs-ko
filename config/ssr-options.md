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