# SSR 옵션 {#ssr-options}

## ssr.external {#ssr-external}

- **타입:** `string[] | true`
- **관련 항목:** [SSR Externals](/guide/ssr#ssr-externals)

SSR을 위한 디펜던시와 이들의 전이 디펜던시(설치한 디펜던시가 갖고 있는 디펜던시 - 옮긴이)를 외부화합니다. 기본적으로 (HMR을 위해)링크된 디펜던시를 제외한 모든 디펜던시가 외부화됩니다. 만약 링크된 디펜던시를 외부화하길 원한다면, 이 옵션에 디펜던시 이름을 전달해 주세요.

`true`인 경우, 링크된 디펜던시를 포함한 모든 디펜던시가 외부화됩니다.

`string[]` 타입을 사용한 경우, `ssr.noExternal`에 해당 디펜던시가 어떤 타입으로 존재하더라도 항상 우선권을 갖습니다.

## ssr.noExternal {#ssr-noexternal}

- **타입:** `string | RegExp | (string | RegExp)[] | true`
- **관련 항목:** [SSR Externals](/guide/ssr#ssr-externals)

이 옵션으로 전달된 디펜던시는 SSR을 위해 외부화되지 않고 빌드 시 번들로 제공됩니다. 기본적으로 (HMR을 위해)링크된 디펜던시만 외부화되지 않습니다. 만약 링크된 디펜던시를 외부화하길 원한다면, `ssr.external` 옵션에 디펜던시 이름을 전달해 주세요.

`true`인 경우, 모든 디펜던시가 외부화되지 않습니다. 다만 `ssr.external`에 `string[]` 타입으로 나열된 디펜던시는 우선권을 갖고 외부화됩니다. `ssr.target: 'node'`로 설정되어 있으면, 기본적으로 Node.js 내장 기능도 외부화됩니다.

만약 `ssr.noExternal: true`와 `ssr.external: true`가 모두 설정되어 있다면, `ssr.noExternal`이 우선권을 갖고 모든 디펜던시가 외부화되지 않습니다.

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