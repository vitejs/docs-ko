# Vitejs Document (korean)

<p align="center">
  <img width="400" src="./docs/logo-white.png">
</p>

[![Deploy](https://github.com/vitejs-kr/vitejs-kr.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/vitejs-kr/vitejs-kr.github.io/actions/workflows/deploy.yml) [![Sync](https://github.com/vitejs-kr/vitejs-kr.github.io/actions/workflows/sync.yml/badge.svg)](https://github.com/vitejs-kr/vitejs-kr.github.io/actions/workflows/sync.yml)

[ViteJS 공식 문서](https://vitejs.dev/) 한글 번역 목적의 리포지터리 입니다.

## 시작하기

### 설치

이 프로젝트는 [PNPM](https://pnpm.io/ko/)을 이용합니다.

```bash
# 1. 이 리포지터리를 클론합니다
git clone https://github.com/vitejs-kr/vitejs-kr.github.io
cd vitejs-kr.github.io

# 2. 모듈을 설치합니다
pnpm install

# 3. 개발 서버를 시작합니다 (http://localhost:3000/)
pnpm dev

# 4. 프로젝트를 빌드합니다 (./dist/)
pnpm build
```

### 커밋

커밋 시 `./scripts/verifyCommit.js` 스크립트를 기반으로 커밋 메시지 내용을 검증하게 됩니다. 따라서, 아래와 같은 형태로 커밋 메시지를 남겨주세요.

```bash
"docs(ko): translate <document-name>.md"
```

커밋 메시지 검증과 관련되어 자세한 사항은 `verifyCommit.js` 스크립트를 참고해주세요.

## 번역

### 브랜치

- `main` 브랜치는 번역 작업을 진행하는 목적으로 사용됩니다.
- `sync` 브랜치는 매일 원본 문서와의 동기화를 진행하는 목적으로 사용됩니다.
- `gh-pages` 브랜치는 https://vitejs-kr.github.io/ 사이트 소스로 사용됩니다.

### 기여하기

번역에 기여해 주신 모든 분께 감사드립니다.

1. 이 리포지터리의 우측 상단에 위치한 Fork 버튼을 눌러 자신의 계정으로 리포지터리를 복사해주세요.
2. `git clone https://github.com/<계정명>/vitejs-kr.github.io` 명령을 통해 로컬로 Fork한 리포지터리를 복사해주세요.
3. [Issues](https://github.com/vitejs-kr/vitejs-kr.github.io/issues)를 참고해 번역되지 못한 부분을 번역해주세요.
4. 번역을 완료한 후, 자신의 번역 리포지터리로 커밋 및 `main` 브랜치로 PR을 생성해주세요.

### 커스텀 앵커(Anchor)

본 리포지터리는 올바른 앵커 참조를 위해 커스텀 앵커를 사용하고 있습니다.

Heading 마지막에 `{#custom-anchor-name}`와 같은 형태로 커스텀 앵커의 지정이 가능하며, 앵커 이름은 원본 문서를 기준으로 합니다.

가령, 아래와 같은 문서를 번역한다고 했을 때:

```
# Getting Started
```

아래와 같이 커스텀 앵커를 지정해주세요.

```
# 시작하기 {#getting-started}
```

위 앵커는 다음과 같이 참조가 가능합니다.

```
[시작하기](#getting-started)
```

커스텀 앵커를 이용하기에 일반적으로 원본 Vite 문서에 대한 한글 문서는 도메인 네임만 `vitejs-kr.github.io`로 바꿔주면 참조가 가능합니다:

- 원본: https://vitejs.dev/guide/ssr.html#generating-preload-directives
- 한글 문서: https://vitejs-kr.github.io/guide/ssr.html#generating-preload-directives

## 기여해 주신 분들

<p align="center">
   <a target="_blank" href="https://github.com/eterv"><img width="150" src="https://github.com/eterv.png" alt="eterv"></a>
   <a target="_blank" href="https://github.com/proceane"><img width="150" src="https://github.com/proceane.png" alt="proceane"></a>
   <a target="_blank" href="https://github.com/eddie0329"><img width="150" src="https://github.com/eddie0329.png" alt="eddie0329"></a>
   <a target="_blank" href="https://github.com/junghyeonsu"><img width="150" src="https://github.com/junghyeonsu.png" alt="junghyeonsu"></a>
   <a target="_blank" href="https://github.com/dante01yoon"><img width="150" src="https://github.com/dante01yoon.png" alt="dante01yoon"></a>
   <a target="_blank" href="https://github.com/hyjoong"><img width="150" src="https://github.com/hyjoong.png" alt="hyjoong"></a>
   <a target="_blank" href="https://github.com/Jogeonsang"><img width="150" src="https://github.com/Jogeonsang.png" alt="Jogeonsang"></a>
  <a target="_blank" href="https://github.com/marshallku"><img width="150" src="https://github.com/marshallku.png" alt="marshallku"></a>
 </p>

 기여에 감사드립니다.

## FAQ

### 광고가 보여요

본 번역 프로젝트는 영리 목적으로 시작된 것이 아니며, 어떠한 방식으로도 수익을 내지 않습니다. 또한 앞으로도 그럴 계획이 없습니다.

프로젝트는 [ViteJS 리포지터리](https://github.com/vitejs/vite)를 포크해 시작했습니다. 이 과정에서 대부분의 설정 값을 그대로 사용하게 되었고, 광고와 관련된 설정 또한 원본과 동일하게 유지했습니다([config.js](https://github.com/vitejs-kr/vitejs-kr.github.io/blob/eae7c247bfc1ad0056428987f4f781eef762d6b5/.vitepress/config.js#L26)). 이로 인해 [ViteJS 번역 문서](https://vitejs-kr.github.io/)에서 광고가 나타나게 되었으며 광고의 설정 및 내용은 [ViteJS 공식 문서](https://vitejs.dev/)와 동일합니다.

### 검색 기능이 제대로 동작하지 않아요

ViteJS **공식** 문서의 검색 기능은 [Algolia DocSearch](https://docsearch.algolia.com/) 서비스를 이용해 제공되고 있습니다. 이 서비스는 API Key를 발급받아 사용이 가능하며, 신청한 순서에 따라 차례대로 발급이 진행됩니다.

본 번역 프로젝트 또한 2월 경 신청하였으며, 향후 API Key를 발급받게 되면 프로젝트에 적용할 예정입니다.
