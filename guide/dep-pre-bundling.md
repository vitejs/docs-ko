# 사전 번들링 된 디펜던시 {#dependency-pre-bundling}

처음 `vite`를 실행할 때, Vite는 로컬에 사이트를 불러오기 전에 프로젝트의 디펜던시를 사전 번들링합니다. 이는 기본적으로 자동으로 투명하게 진행됩니다.

## 왜 이런 메시지가 나타나나요? {#the-why}

이러한 메시지가 나타나는 이유는 Vite의 "디펜던시 사전 번들링" 기능으로 인한 것인데, 이 과정의 목적은 다음 두 가지입니다.

1. **CommonJS 및 UMD 호환성:** 개발 시, Vite는 모든 코드를 네이티브 ESM으로 제공합니다. 따라서 Vite는 CommonJS 또는 UMD로 배포되는 디펜던시를 먼저 ESM으로 변환해야 합니다.

   CommonJS 디펜던시를 변환할 때, Vite는 스마트 임포트 분석을 수행하여 익스포트가 동적으로 할당되더라도(예: React) CommonJS 모듈에 대한 named import가 예상대로 동작하도록 합니다.

   ```js
   // 예상대로 동작합니다.
   import React, { useState } from 'react'
   ```

2. **성능:** Vite는 내부 모듈이 많은 ESM 디펜던시를 하나의 모듈로 변환하여 이후 페이지 로드 성능을 향상시킵니다.

   일부 패키지는 ES 모듈 빌드를 서로를 임포트하는 여러 개의 개별 파일로 배포합니다. 예를 들어, [`lodash-es`는 600개가 넘는 내부 모듈을 가지고 있습니다](https://unpkg.com/browse/lodash-es/)! `import { debounce } from 'lodash-es'`를 실행하면, 브라우저는 동시에 600개가 넘는 HTTP 요청을 보냅니다! 서버가 이를 처리하는 데 문제가 없더라도, 많은 요청은 브라우저 측에서 네트워크 혼잡을 일으켜 페이지 로드가 눈에 띄게 느려집니다.

   `lodash-es`를 하나의 모듈로 사전 번들링하면, 이제 HTTP 요청은 하나만 필요합니다!

::: tip 참고
디펜던시 사전 번들링 기능은 개발 모드에서만 적용됩니다.
:::

## 자동으로 디펜던시 탐색하기 {#automatic-dependency-discovery}

기존 캐시를 찾을 수 없는 경우, Vite는 소스 코드를 순회하며 디펜던시 임포트(즉, `node_modules`에서 확인될 것으로 예상되는 "bare imports")를 자동으로 찾아내고, 발견된 임포트를 사전 번들의 엔트리 포인트로 사용합니다. 사전 번들링은 [Rolldown](https://rolldown.rs/)으로 수행되므로 일반적으로 매우 빠릅니다.

서버가 이미 시작된 이후에 캐시되지 않은 새로운 디펜던시가 추가되는 경우라면, vite는 디펜던시 번들링 과정을 재시작하고 이후 필요하다면 해당 페이지를 다시 불러오게 됩니다.

## 모노리포 디펜던시 {#monorepos-and-linked-dependencies}

모노리포 설정에서는 디펜던시가 같은 리포지토리의 연결된 패키지일 수 있습니다. Vite는 `node_modules`에서 확인되지 않는 디펜던시를 자동으로 감지하고, 연결된 디펜던시를 소스 코드로 취급합니다. 연결된 디펜던시를 번들링하려고 시도하지 않으며, 대신 연결된 디펜던시의 디펜던시 목록을 분석합니다.

그러나 이를 위해서는 연결된 디펜던시가 ESM으로 익스포트되어야 합니다. 그렇지 않다면 설정에서 해당 디펜던시를 [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include)에 추가할 수 있습니다.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
})
```

연결된 디펜던시를 변경한 경우, 변경 사항이 적용되도록 `--force` 커맨드 라인 옵션과 함께 개발 서버를 다시 시작하세요.

## 디펜던시 탐색 과정 커스터마이즈하기 {#customizing-the-behavior}

Vite의 디펜던시 탐색 휴리스틱이 항상 바람직한 것은 아닙니다. 만약 특정 디펜던시를 명시적으로 포함시키거나 포함시키지 않도록 설정하고자 한다면 [`optimizeDeps` 옵션](/config/dep-optimization-options.md)을 이용해주세요.

`optimizeDeps.include` 또는 `optimizeDeps.exclude`의 일반적인 사용 사례는 소스 코드에서 직접 탐색할 수 없는 Import가 있는 경우입니다. 플러그인 변환의 결과물에 Import가 사용된 경우를 예로 들 수 있습니다. 이는 Vite가 초기 스캔 시 해당 Import를 발견할 수 없음을 의미합니다. 브라우저에서 파일을 요청하고 변환된 이후에만 해당 Import를 발견할 수 있습니다. 이는 서버가 시작된 이후에 서버를 다시 번들링하게 만듭니다.

이를 해결하기 위해 `include`와 `exclude` 옵션 둘 다 사용될 수 있습니다. 만약 디펜던시가 크거나(내부 모듈이 많은 경우) CommonJS 포맷이라면 `include` 옵션에 명시해야 합니다. 만약 디펜던시가 작고 이미 ESM 스타일로 작성되어 있다면 `exclude` 옵션에 명시해 브라우저에서 바로 불러올 수 있도록 설정할 수 있습니다.

또한 [`optimizeDeps.rolldownOptions` 옵션](/config/dep-optimization-options.md#optimizedeps-rolldownoptions)을 통해 Rolldown을 더욱 세밀하게 커스터마이즈할 수 있습니다. 예를 들어, 디펜던시의 특수 파일을 처리하기 위한 Rolldown 플러그인을 추가하거나, [빌드 `target`](https://rolldown.rs/reference/InputOptions.transform#target)을 변경할 수 있습니다.

## 캐싱 {#caching}

### 파일 시스템 캐시 {#file-system-cache}

Vite는 사전 번들링 된 디펜던시를 `node_modules/.vite` 디렉터리 내에 캐시하고 있습니다. 다만 이를 다시 번들링하는 경우가 있는데, 다음과 같습니다.

- 패키지 매니저 락 파일 콘텐츠 (예: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` 또는 `bun.lock`)
- 폴더의 수정 시간을 패치
- `vite.config.js`와 관련되어 있는 필드가 변경되었을 때
- `NODE_ENV` 값

위의 변경 사항 중 하나가 발생한 경우에만 사전 번들링 과정을 다시 실행해야 합니다.

만약 강제로 디펜던시를 다시 번들링해야 하는 경우, 개발 서버를 `--force` 옵션과 함께 시작해주세요. 또는 그냥 `node_modules/.vite` 디렉터리를 삭제해줘도 됩니다.

### 브라우저 캐시 {#browser-cache}

확인된 디펜던시 요청은 개발 중 페이지 다시 로드 성능을 향상시키기 위해 HTTP 헤더 `max-age=31536000,immutable`로 강하게 캐시됩니다. 한 번 캐시되면, 이러한 요청은 다시는 개발 서버에 도달하지 않습니다. 다른 버전이 설치된 경우(패키지 매니저 락 파일에 반영된 대로) 추가된 버전 쿼리에 의해 자동으로 무효화됩니다. 로컬 편집으로 디펜던시를 디버그하려면 다음과 같이 할 수 있습니다.

1. 브라우저 개발자 도구의 Network 탭을 통해 일시적으로 캐시를 비활성화합니다.
2. `--force` 플래그와 함께 Vite 개발 서버를 재시작하여 디펜던시를 다시 번들링합니다.
3. 페이지를 다시 로드합니다.
