# Vitejs Document (korean)

<p align="center">
  <img width="200" src="./public/logo.svg">
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
