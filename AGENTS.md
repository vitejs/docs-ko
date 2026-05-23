# AGENTS.md

이 저장소는 Vite 한국어 문서를 유지하는 프로젝트입니다. 에이전트는 upstream Vite 문서의 최신 상태를 반영하면서, 한국어 문서로서 자연스럽고 일관된 번역 품질을 유지해야 합니다.

## Scope

- 이 파일은 저장소 루트 기준 전체 문서 작업에 적용됩니다.
- 더 구체적인 하위 디렉터리 규칙이 필요해지면 해당 디렉터리에 별도 `AGENTS.md`를 둘 수 있습니다.
- 사용자 요청과 이 파일이 충돌하면 확인하고 진행합니다.

## Setup Commands

- 디펜던시 설치: `pnpm install`
- 개발 서버 실행: `pnpm dev --host 127.0.0.1`
- 프로덕션 빌드 확인: `pnpm build`
- 빌드 결과 프리뷰: `pnpm serve`

## Upstream Sync

- upstream 기준은 `vitejs/vite` 저장소의 `/docs` 디렉터리에 있는 릴리스된 커밋이나 태그를 사용합니다.
- 동기화 작업을 시작할 때 기준 upstream ref를 명확히 기록합니다. 예: `v8.0.13:docs`.
- 번역 대상 텍스트뿐 아니라 upstream 문서 구조, VitePress theme 구조, asset, redirect/header, package metadata, public 파일 변경도 최신화 대상입니다.
- 기존 한국어 문서에 이미 번역된 범위를 먼저 확인한 뒤, 그 범위를 기준으로 새 번역 대상을 추출합니다.
- 큰 동기화 작업은 batch 단위로 나누고, 각 batch가 검증 가능한 상태일 때 커밋합니다.

## Translation Scope

번역 대상:

- Markdown 본문과 사용자에게 보이는 frontmatter 값
- VitePress config의 사용자 표시 문자열
- Vue template 문자열과 theme component copy
- `_data/*` 중 한국어 문서에서 사용자에게 보이는 설명 문구
- docs 코드 블록 안의 설명용 주석

번역하지 않는 대상:

- 코드 식별자, API 이름, 옵션 이름, CLI flag, package 이름
- 파일 경로, anchor, URL, import/export specifier, 환경 변수 이름
- 외부 서비스나 패키지의 고유 metadata
- homepage/community testimonial 같은 직접 인용문
- upstream 동작을 설명하기 위한 sample output, sentinel, directive

## Line Parity

- 기본 원칙은 upstream 문서와 섹션 순서, 문단 구조, 예제 위치를 유지하는 것입니다.
- line-by-line parity 대상 파일에서는 upstream과 줄 구조를 가능한 한 맞춥니다.
- 한국어 문장 압축이나 Vue localization wrapper 때문에 줄 수가 달라지면, 리뷰 가능한 이유를 남깁니다.
- line-by-line parity 제외 파일은 다음과 같습니다.
  - `.vitepress/config.ts`
  - `_data/*`
  - `package.json`
- `_data/*`와 `package.json`은 line parity 대상은 아니지만, upstream 최신화 대상에서는 제외하지 않습니다.

## Korean Style

- 사용자와의 대화, 작업 요약, 리뷰 설명은 한국어로 작성합니다.
- 직역투보다 문맥에 맞는 자연스러운 한국어를 우선합니다.
- 용어 선택은 `TERMINOLOGY.md`를 따릅니다.
- 새 금지어, 선호어, 번역어 결정이 생기면 `TERMINOLOGY.md` 갱신을 검토합니다.
- 불필요한 `의`, `것`, `게`, `저희`를 줄입니다.
- 주어가 필요 없으면 생략하고, 필요하면 `Vite 팀`, `Vite 문서`, `이 문서`처럼 구체적으로 씁니다.
- `해줍니다`, `가능하게 합니다`, `열어줍니다`, `느끼게 합니다` 같은 번역투를 피하고 직접적인 동사로 고칩니다.

## Code Blocks

- docs 코드 블록의 설명용 주석은 한국어로 번역합니다.
- 실제 코드, 식별자, 타입, API 이름, 옵션 이름, import/export, 환경 변수 이름은 번역하지 않습니다.
- 다음과 같은 directive나 sentinel은 그대로 둡니다.
  - `// ---cut---`
  - `// @filename`
  - `// @errors`
  - `// @noErrors`
- 주석이 sample output이나 protocol 예시 역할을 하면 upstream 원문을 유지할 수 있습니다.

## Workflow

- 작업용 spec, plan, audit, inventory 문서는 `.context/` 아래에 둘 수 있지만 커밋하지 않습니다.
- 커밋 메시지는 `<type>: <description>` 형식을 사용합니다.
- 번역 외 최신화와 번역 품질 개정이 섞이는 대형 작업은 batch commit으로 분리합니다.
- 외부 push, PR 생성, PR comment 작성, merge 같은 네트워크 쓰기 작업은 사용자 승인 후에만 합니다.
- 기존 사용자 변경은 되돌리지 않습니다.

## Verification

주요 변경 후에는 가능한 범위에서 다음을 확인합니다.

```bash
pnpm build
git diff --check origin/main...HEAD
```

리뷰 전에 확인할 항목:

- upstream 기준 ref가 명확한가
- 새 upstream 문서/섹션/asset이 누락되지 않았는가
- Vue 파일과 VitePress UI 문자열까지 번역 대상으로 봤는가
- line parity 제외 파일 외에 줄 수 차이가 있다면 이유가 설명 가능한가
- 직접 인용문과 코드 식별자가 의도치 않게 번역되지 않았는가
- `pnpm build`가 통과하는가
