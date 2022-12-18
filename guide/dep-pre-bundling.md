# 사전 번들링 된 디펜던시 {#dependency-pre-building}

맨 처음 `vite` 명령을 실행했을 때, 다음 메시지를 마주했을 것입니다.

```
Pre-bundling dependencies:
  react
  react-dom
(this will be run only when your dependencies or config have changed)
```

## 왜 이런 메시지가 나타나나요? {#the-why}

이러한 메시지가 나타나는 이유는 Vite의 "사전 번들링(Pre-bundling)" 기능으로 인한 것인데, 이를 사용하는 목적은 다음과 같습니다.

1. **CommonJS 그리고 UMD 모듈을 ESM으로 가져오기:** 개발 시, Vite의 개발 서버는 모든 코드를 네이티브 ESM으로 가져오게 됩니다. 따라서, vite는 반드시 모든 CommonJS 및 UMD 파일을 ESM으로 불러올 수 있도록 변환 작업을 진행해줘야 합니다.

   vite는 조금 영리하게 ESM 파일로 변환을 진행하는데, 가령 CommonJS 디펜던시를 변환해주는 경우 아래와 같이 이름을 지정해 CommonJS 형태의 모듈을 가져올 수도 있습니다.

   ```js
   // 아래 코드는 정상적으로 동작합니다.
   import React, { useState } from 'react'
   ```

2. **퍼포먼스:** vite는 여러 디펜던시가 존재하는 ESM 모듈을 하나의 모듈로 변환하여 페이지 로드에 대한 퍼포먼스를 향상시킵니다.

   600개의 모듈을 갖고 있는 [`lodash-es`](https://unpkg.com/browse/lodash-es/)와 같이 매우 많은 모듈을 필요로 하는 경우, 그 수만큼 HTTP 요청을 전송하게 됩니다(`import { debounce } from 'lodash-es'`를 한다고 해도 말이죠). 서버가 이 요청들을 모두 정상적으로 처리한다고 해도, 브라우저 자체에서 이러한 네트워크 요청에 대한 오버헤드가 존재하기에 페이지 로드 퍼포먼스는 떨어질 수 밖에 없습니다. 즉, `lodash-es` 모듈을 가져오게 된다면... 600개의 HTTP 요청을 전송하게 되는 것이죠.

   만약 `lodash-es` 모듈을 하나의 모듈로 번들링하게 된다면 어떻게 될까요? 브라우저는 단지 하나의 HTTP 요청만을 전송하게 됩니다.

::: tip 참고
디펜던시 사전 번들링 기능은 개발 모드에서만 적용되며, `esbuild`를 이용해 디펜던시를 ESM으로 변환합니다. 프로덕션 빌드의 경우, 이 대신 `@rollup/plugin-commonjs`가 대신 사용됩니다.
:::

## 자동으로 디펜던시 탐색하기 {#automatic-dependency-discovery}

만약 디펜던시가 캐시되지 않았다면 어떻게 될까요? vite는 프로젝트 내 모든 소스 코드를 탐색하여 디펜던시를 찾아낸 뒤, 사전 번들링을 이용해 Import 합니다(`node_modules`에서 디펜던시를 가져오듯이 말이죠). 물론, 이 사전 번들링 과정은 `esbuild`를 이용하기에 보통 매우 빠른 속도로 진행됩니다.

서버가 이미 시작된 이후에 캐시되지 않은 새로운 디펜던시가 추가되는 경우라면, vite는 디펜던시 번들링 과정을 재시작하고 이후 해당 페이지를 다시 불러오게 됩니다.

## 모노리포 디펜던시 {#monorepos-and-linked-dependencies}

모노리포 프로젝트의 경우 디펜던시는 동일한 하나의 리포지토리에 연결된 패키지일 수 있습니다. Vite는 사용하는 디펜던시가 `node_modules`에 존재하지 않더라도 스스로 탐색하여 이를 소스 코드로 가져올 수 있지만, 이를 번들로 묶지는 않습니다. 그저 연결된 디펜던시 목록을 분석할 뿐이죠.

이를 위해서는 연결된 디펜던시가 ESM 형태로 내보내져야 합니다. 만약 그렇지 않다면, 해당되는 디펜던시들을 [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include)와 [`build.commonjsOptions.include`](/config/build-options.md#build-commonjsoptions) 설정에 추가해주세요.

```js
export default defineConfig({
   optimizeDeps: {
      include: ['linked-dep']
   },
   build: {
      commonjsOptions: {
         include: [/linked-dep/, /node_modules/]
      }
   }
})
```

설정 값 변경 이후 `--force` 플래그를 이용해 개발 서버를 다시 시작하게 되면 해당 내용이 적용됩니다.

::: warning 중복 제거
디펜던시를 찾는 과정의 차이로 인해 중복된 디펜던시가 잘못 제거되어 런타임에서 문제가 발생될 수 있습니다. 만약 이런 문제가 발생된다면 연결된 모든 디펜던시에 대해 `npm pack` 명령을 사용해주세요.
:::

## 디펜던시 탐색 과정 커스터마이즈하기 {#customizing-the-behavior}

기본적으로 Vite의 사전 번들링 될 디펜던시 탐색은 휴리스틱(Heuristics) 기반으로 이루어집니다. 물론 모든 상황에서 적절하게 동작할 것이라는 보장은 없죠. 만약 특정 디펜던시를 포함시키거나 포함시키지 않도록 설정하고자 한다면 [`optimizeDeps` 옵션](/config/dep-optimization-options.md)을 이용해주세요.

이 옵션은 일반적으로 소스 코드에서 바로 가져올 수 없는 파일에 대해 `optimizeDeps.include` 또는 `optimizeDeps.exclude`에 명시하는 방식으로 사용합니다. 플러그인을 통해 생성된 어떤 파일을 명시적으로 Import 하고자 하는 경우와 같이 말이죠. 다시말해 vite는 첫 번째 스캐닝 시 모든 디펜던시를 스캔하지 않으며, 오로지 브라우저가 요청했을 때에만 해당 디펜던시를 변환해 가져오는 방식으로 동작합닌다. 물론 서버가 이미 실행된 이후에도 말이죠.

`include`나 `exclude`를 사용하는 예시를 들어 볼까요? 만약 디펜던시가 매우 크거나, 많은 모듈을 포함하고 있거나, CommonJS 포맷으로 되어있는 경우 이 디펜던시들을 사전 번들링 과정에 포함시킬 수 있도록 `include` 옵션에 명시해야 합니다. 만약 디펜던시가 작거나, 이미 ESM 스타일로 작성된 경우라면 굳이 사전 번들링 과정에 포함시킬 필요가 없으니 `exclude` 옵션에 명시해 브라우저에서 바로 불러올 수 있도록 설정할 수도 있습니다.

## 캐싱 {#caching}

### 파일 시스템 캐시 {#file-system-cache}

Vite는 사전 번들링 된 디펜던시를 `node_modules/.vite` 디렉터리 내에 캐시하고 있습니다. 다만 이를 다시 번들링하는 경우가 있는데, 다음과 같습니다.

- 패키지 매니저의 락파일 내용, 예를 들어 `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` 또는 `bun.lockb`
- 폴더의 수정 시간을 패치
- `vite.config.js`와 관련되어 있는 필드가 변경되었을 때
- `NODE_ENV` 값

위의 변경 사항이 발생된 경우 사전 번들링 과정을 다시 시작하게 됩니다.

만약 강제로 디펜던시를 다시 번들링해야 하는 경우, 개발 서버를 `--force` 옵션과 함께 시작해주세요. 또는 그냥 `node_modules/.vite` 디렉터리를 삭제해줘도 됩니다.

### 브라우저 캐시 {#browser-cache}

HTTP 헤더를 `max-age=31536000,immutable`과 같이 디펜던시가 반드시 캐시되도록 설정한 경우\*, 개발 시 페이지를 다시 불러올 때의 퍼포먼스를 향상시킬 수 있습니다. 한 번 캐시된 디펜던시는 다시 서버에 요청하지 않기 때문이죠. 물론 캐시된 디펜던시와 다른 버전이 설치된 경우, 기존 버전은 자동으로 무효화됩니다. 물론 아래의 과정을 통해 버전 변경 없이 직접 디펜던시를 수정(디버그)할 수도 있습니다. (\* 사전 번들링 된 디펜던시의 경우 이 헤더가 추가됩니다.)

1. 브라우저의 개발자 도구를 이용해 캐시를 사용하지 않도록 설정합니다.
2. 디펜던시를 다시 번들링하는 `--force` 옵션과 함께 Vite의 개발 서버를 재시작합니다.
3. 페이지를 다시 로드합니다.
