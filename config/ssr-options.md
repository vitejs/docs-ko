# SSR 옵션 {#ssr-options}

별도로 명시되지 않은 한, 이 섹션의 옵션들은 개발과 빌드 모두에게 적용됩니다.

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
- **기본값:** `['module', 'node', 'development|production']` (`defaultClientConditions`) (`ssr.target === 'webworker'` 이면 `['module', 'browser', 'development|production']` (`defaultClientConditions`))
- **관련 항목:** [Resolve Conditions](./shared-options.md#resolve-conditions)

이 조건은 플러그인 파이프라인에서 사용되며, SSR 빌드 중에 외부화되지 않은 디펜던시에만 영향을 미칩니다. 외부화된 임포트에 영향을 미치려면 `ssr.resolve.externalConditions`를 사용하세요.

## ssr.resolve.externalConditions {#ssr-resolve-externalconditions}

- **타입:** `string[]`
- **기본값:** `['node']`

외부화된 직접 디펜던시(Vite에 의해 임포트된 외부 디펜던시)의 SSR 임포트(`ssrLoadModule` 포함) 중에 사용되는 조건입니다.

:::tip

이 옵션을 사용할 때는 개발과 빌드 모두 동일한 값을 전달하고 Node를 [`--conditions` 플래그](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition)와 함께 실행해야 일관된 동작을 수행합니다.

예를 들어, `['node', 'custom']`을 설정할 때는 개발 시에는 `NODE_OPTIONS='--conditions custom' vite`를, 빌드 후에는 `NODE_OPTIONS="--conditions custom" node ./dist/server.js`를 실행해야 합니다.

:::

## ssr.resolve.mainFields

- **타입:** `string[]`
- **기본값:** `['module', 'jsnext:main', 'jsnext']`

패키지의 진입점을 확인할 때 시도할 `package.json` 내 필드 목록입니다. 이는 `exports` 필드에서 처리되는 조건부 내보내기보다 우선순위가 낮습니다: 만약 진입점이 `exports`로부터 성공적으로 확인되면, 메인 필드는 무시됩니다. 이 설정은 외부화되지 않은 디펜던시에만 영향을 미칩니다.