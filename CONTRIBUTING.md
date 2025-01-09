# Vite 한국어 번역 가이드

Vite 한국어 번역 리포지토리에 오신 것을 환영합니다. 이 문서는 Vite 한국어 번역에 기여하시는 분들을 위한 가이드입니다.

## 🚀 시작하기

### 설치

요구 사항:

- Node.js: `>=22`
- PNPM: `9.15.3`

이 프로젝트는 [Node.js@22](https://nodejs.org/ko) 및 [PNPM@9.14.4](https://pnpm.io/ko/)를 이용합니다. PNPM은 [Node Corepack](https://nodejs.org/api/corepack.html)을 이용합니다. 자세한 설정은 [package.json](./package.json) 파일을 참고해 주세요.

```bash
# 1. 이 리포지토리를 클론합니다.
git clone https://github.com/vitejs/docs-ko
cd docs-ko

# 2. 모듈을 설치합니다.
corepack enable # 만약 Corepack이 활성화 되어있지 않다면 이 명령어를 실행해 주세요.
pnpm install

# 3. 개발 서버를 시작합니다. (http://localhost:5173/)
pnpm dev

# 4. 프로젝트를 빌드합니다. (dist 디렉터리에 빌드 결과물이 위치합니다)
pnpm build
```

### 브랜치

- `main` 브랜치는 번역 작업을 진행하는 목적으로 사용됩니다.

### 기여하기

번역에 기여해 주신 모든 분께 감사드립니다.

1. [GitHub Issues](https://github.com/vitejs/docs-ko/issues)에서 아직 할당되지 않은 번역 작업을 **오래된 것부터** 찾아주세요. 최신 문서를 번역하는 경우 충돌이 발생할 수 있습니다.
1. 해당 Issue에서 "번역 작업을 진행하겠습니다"와 같은 코멘트를 남겨 작업을 진행하겠다는 의사를 표현해주세요. 승인된 경우, 번역 담당자로 자신이 Assign 된 것을 확인할 수 있습니다. (메인테이너의 경우 Self-Assign 기능을 이용할 수 있습니다.)
1. 이 리포지토리를 Fork하고, 브랜치를 생성한 후, 번역 작업을 진행합니다. (작업을 진행하며 `pnpm dev` 명령을 통해 브라우저에서 실시간으로 확인할 수 있습니다.)
1. 커밋, 그리고 자신의 번역 리포지토리로 Push 후, 이 리포지토리의 `main` 브랜치로 PR을 생성해주세요.
1. 리뷰 단계에서 수정이 필요한 부분이 있을 경우 해당 부분을 수정하고 다시 Push 합니다.
1. 더 이상 수정이 필요하지 않으면 메인테이너가 브랜치를 병합합니다. 감사합니다! 🎉

### 번역 대상

번역은 번경 사항 중 `docs` 디렉터리에 있는 파일을 대상으로 진행합니다(예: `docs/guide/index.md`). 다만 다음의 파일은 일반적으로 최신 내용만 유지하며, 번역하지 않습니다:

- `blogs/*.md`

## 📄 번역 스타일

### 번역 규칙

- 경어체를 사용합니다.
- PR 전 [맞춤법 검사기](http://speller.cs.pusan.ac.kr/)를 사용해 문서를 검사합니다.
- 줄 바꿈 및 단락은 원본 문서와 동일하게 유지합니다.
- 공백(` `), 큰따옴표(`""`), 작은따옴표(`''`), 대시(`-`), 백틱(`` ` ``) 등 모든 특수문자는 최대한 남겨 수정합니다.
- 소스 코드는 주석만 번역하며, 나머지는 원본 문서와 동일하게 유지합니다. 에러 내용은 번역하지 않습니다.
- ko.javascript.info의 [번역 모법 사례](https://github.com/javascript-tutorial/ko.javascript.info/wiki/%EB%B2%88%EC%97%AD-%EB%AA%A8%EB%B2%94-%EC%82%AC%EB%A1%80)를 읽고 작업에 참여해주세요.
- 원문에는 없으나 이해를 돕기 위해 추가하고자 하는 내용은 문장 중간이나 끝에 `(... - 옮긴이)` 형태로 작성해주세요. 길어지는 경우, 미주(Footnote)를 이용할 수 있습니다. 단, 이 경우에도 줄 바꿈 및 단락은 원본 문서와 동일하게 유지합니다.

  ```md
  이것은 예시입니다. (... - 옮긴이)
  이것은 예시입니다. ^[(... - 옮긴이)]
  ```

### 번역 팁

- 번역은 단어를 그대로 옮기는 것이 아니라 의미를 전달하는 것이 목적입니다. 누락, 오역, 번역투가 아닌 문장이면 좋습니다.

### 번역 시 참고할 수 있는 자료

- [국립국어원 외래어 표기법 용례](https://kornorms.korean.go.kr//example/exampleList.do)

### 용어집

용어집은 [TERMINOLOGY.md](./TERMINOLOGY.md) 문서에서 관리하고 있습니다.

### 원본 문서와의 차이점

- 본 프로젝트는 마지막으로 배포된 공식 배포 버전의 Vite 문서를 번역하는 것을 목표로 하고 있습니다. 따라서, 번역 문서는 원본 문서의 마지막 공식 배포 버전을 기준으로 작성합니다.
  - 이전 버전의 Vite 문서를 참조하는 경우에는 원본 문서를 참조하도록 합니다:
    ```md
    ... 설정하여 동일한 [Vite v2 외부화 휴리스틱](https://v2.vite.dev/guide/ssr.html#ssr-externals)을 사용하여 ...
    ```
- 번역 문서는 원본 문서와 동일한 디렉터리 구조를 가지고 있습니다.
- 번역 문서는 원본 문서의 파일명을 그대로 사용합니다.
  - 예외: 마이그레이션 가이드의 경우 [v2](https://github.com/vitejs/docs-ko/blob/main/guide/migration-from-v1.md), [v3](https://github.com/vitejs/docs-ko/blob/main/guide/migration-from-v2.md) 문서가 추가로 존재합니다.

#### 공식적으로 배포되지 않은 다음 버전의 Vite 문서를 번역하는 경우

이 문제는 Vite 5 베타 버전에 대한 문서 번역에서 확인되었습니다. [#737 이슈](https://github.com/vitejs/docs-ko/issues/737)에서 언급된 것과 같이, 본 프로젝트는 다음 버전의 Vite 문서를 번역하는 경우에는 다음과 같은 방법을 사용합니다:

- 다음 버전에 대한 sync 이슈가 처음 등록되면
  - 다음 버전에 대한 브랜치를 생성(예: `v5`) 및 main으로의 Draft PR을 생성
  - 번역 PR은 해당 브랜치를 타깃으로 생성
- 이후, 다음 버전에 대한 sync 이슈가 등록되면
  - 구분을 위해 해당 버전에 대한 라벨을 붙임
  - 동일하게, 번역 PR은 해당 브랜치를 타깃으로 생성
- 다음 버전이 정식으로 배포되면
  - 현재의 main 브랜치의 이름을 이전 버전으로 변경(예: `v4`)
  - 다음 버전에 대한 PR을 main 브랜치로 머지

위 사항은 Vite 6 베타 버전부터 적용될 예정입니다.

## 🤝 컨벤션

### PR 및 커밋 타이틀

PR과 커밋 타이틀은 [시멘틱 커밋 메시지](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)를 기반으로 합니다:

```
<type>(<scope>): <subject>
```

- **type**: 커밋의 타입을 나타냅니다.
  - `docs`: 문서 수정
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `style`: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
  - `refactor`: 코드 리팩토링
  - `test`: 테스트 코드, 리팩토링 테스트 코드 추가
  - `chore`: 빌드 및 패키지 매니저 수정
- **scope**: 커밋의 범위를 나타냅니다. (선택사항)
- **subject**: 커밋의 제목을 나타냅니다.

### PR 규칙

- 논의가 필요한 PR은 수정 요청을 할 수 있습니다.
- PR 생성 시 체크리스트를 확인해주세요.

### 커스텀 앵커

본 리포지토리는 올바른 앵커 참조를 위해 커스텀 앵커를 사용하고 있습니다. **문서의 모든 제목은 커스텀 앵커를 지정해야 합니다.**

제목 마지막에 `{#custom-anchor-name}`와 같은 형태로 커스텀 앵커의 지정이 가능하며, 앵커 이름은 원본 문서를 기준으로 합니다. 예를 들면 다음과 같습니다:

```md
<!-- 원본 -->

# Get Started with Node.js
```

```md
<!-- 한글 번역 -->

# Node.js 시작하기 {#get-started-with-node-js}
```

규칙은 [Vitepress에서 사용하는](https://github.com/vuejs/vitepress/blob/00dc1e6742273fe6fde74e7abbd160bd7724af4d/src/node/markdown/index.ts#L13) [`@mdit-vue/shared` 패키지의 `slugify` 함수](https://github.com/mdit-vue/mdit-vue/blob/main/packages/shared/src/slugify.ts)와 동일합니다. [이 곳에서](https://stackblitz.com/edit/stackblitz-starters-e8bzip?file=index.js) 직접 테스트해 볼 수도 있습니다.

이렇게 지정된 앵커는 다음과 같이 참조가 가능합니다:

```
[Node.js 시작하기](#get-started-with-node-js)
```

커스텀 앵커를 이용하기에 일반적으로 원본 Vite 문서에 대한 한글 문서는 도메인 네임만 `ko.vite.dev`로 바꿔주면 참조가 가능합니다:

- 원본: https://vite.dev/guide/ssr.html#generating-preload-directives
- 한글 문서: https://ko.vite.dev/guide/ssr.html#generating-preload-directives

[guide/cli.md](https://github.com/vitejs/docs-ko/blob/main/guide/cli.md) 문서에서와 같이 중복된 타이틀이 존재할 수 있습니다. 이 경우 중복되는 타이틀에는 `{#title-1}` 형태로 커스텀 앵커를 지정해주세요:

```md
## 옵선 {#options}

...

## 옵션 {#options-1}

...

## 옵션 {#options-2}

...
```

## 🤨 FAQ

### 광고가 보여요

본 번역 프로젝트는 영리 목적으로 시작된 것이 아니며, 어떠한 방식으로도 수익을 내지 않습니다. 또한 앞으로도 그럴 계획이 없습니다.

프로젝트는 [Vite 리포지토리](https://github.com/vitejs/vite)를 포크해 시작했습니다. 이 과정에서 대부분의 설정값을 그대로 사용하게 되었고, 광고와 관련된 설정 또한 원본과 동일하게 유지했습니다. 이로 인해 [Vite 번역 문서](https://ko.vite.dev/)에서 광고가 나타나게 되었으며 광고의 설정 및 내용은 [Vite 공식 문서](https://vite.dev/)와 동일합니다.

## 🍍 그 외

### 문서 최신화 방법

본 리포지토리는 매 10분마다 원본이 되는 [vitejs/vite](https://github.com/vitejs/vite) 리포지토리의 `docs` 디렉터리의 변경 사항을 추적합니다. 이 작업은 [GitHub Actions](./.github/workflows/sync.yml)를 통해 진행되며, [ryu-cho](https://github.com/vuejs-translations/ryu-cho) 오픈소스를 사용합니다. 원본 문서에 변경 사항이 생길 경우 이를 GitHub Issues에 남겨 알리도록 구성되어 있습니다.

다만, 간혹 커밋 순서가 잘못되는 경우가 있습니다(예: [#686 및 #687](https://github.com/vitejs/docs-ko/issues/686)). 이는 번역 시 줄 수가 맞지 않는 것으로 확인할 수 있으며, 해당 이슈의 코멘트로 남겨 알려주시기를 부탁드립니다(예: [#686 코멘트](https://github.com/vitejs/docs-ko/issues/686#issuecomment-1779351146)).
