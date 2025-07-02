---
title: Vite 4.3이 출시되었습니다!
author:
  name: The Vite Team
date: 2023-05-18
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.3이 출시되었습니다!
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Vite 4.3 릴리스 발표
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3이 출시되었습니다! {#vite-4-3-is-out}

_2023년 5월 18일_

![Vite 4.3 발표 커버 이미지](/og-image-announcing-vite4-3.png)

빠른 링크: [문서](/) | [변경 로그](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-05-18)

## 성능 개선 {#performance-improvements}

이번 마이너 릴리스에서는 Vite의 성능 개선에 중점을 두었습니다. 리졸버 로직을 최적화하고, 핫 패스를 개선하며, 스마트 캐싱을 구현하여 HMR과 콜드 스타트 시간을 단축했습니다.

## 프로파일링 {#profiling}

Vite 4.3에는 성능 병목 지점을 찾는 데 도움이 되는 새로운 프로파일링 기능이 포함되어 있습니다. `vite --profile`을 실행하면 (개발 서버가 시작된 후 `p`를 누름) 개발 서버가 시작되고 `.cpuprofile` 파일이 생성됩니다. [speedscope](https://www.speedscope.app)를 열고 CPU 프로파일을 드래그하여 결과를 확인할 수 있습니다. 커뮤니티에서 이슈를 신고할 때 이 프로파일을 공유할 수 있습니다.

## 개발 서버 성능 {#dev-server-performance}

Vite 4.3에는 여러 성능 개선사항이 적용되었습니다. 일반적인 사용 사례는 더 빠른 서버 시작 시간을 경험할 것입니다.

### 리졸버 성능 개선 {#resolver-performance-improvements}

핫 패스 리졸버 로직이 최적화되었습니다:

- 리졸버 로직에서 `fs.stat` 호출 감소 ([#12818](https://github.com/vitejs/vite/issues/12818))
- 절대 경로 리졸버 로직 최적화 ([#12747](https://github.com/vitejs/vite/issues/12747))
- 별칭 및 확장자 확인 로직 최적화 ([#12702](https://github.com/vitejs/vite/issues/12702))

### 개선된 HMR {#improved-hmr}

- 의존성 추적 개선으로 HMR 시간 단축 ([#12702](https://github.com/vitejs/vite/issues/12702))
- 스마트 무효화로 불필요한 작업 방지 ([#12747](https://github.com/vitejs/vite/issues/12747))

### 메모리 사용량 최적화 {#memory-usage-optimization}

- 메모리 사용량 감소를 위한 내부 캐시 개선 ([#12818](https://github.com/vitejs/vite/issues/12818))
- 더 나은 가비지 컬렉션을 위한 참조 정리 ([#12747](https://github.com/vitejs/vite/issues/12747))

## 벤치마크 결과 {#benchmark-results}

Vite 4.3에서는 다음과 같은 성능 개선을 확인할 수 있습니다:

### 콜드 스타트 시간 {#cold-start-time}

| 프로젝트 | Vite 4.2 | Vite 4.3 | 개선 |
| --- | --- | --- | --- |
| 10K 모듈 | 2.5초 | 2.0초 | **20% 개선** |
| 30K 모듈 | 12.8초 | 10.2초 | **20% 개선** |

### HMR 시간 {#hmr-time}

| 프로젝트 | Vite 4.2 | Vite 4.3 | 개선 |
| --- | --- | --- | --- |
| 10K 모듈 | 49ms | 32ms | **35% 개선** |
| 30K 모듈 | 160ms | 104ms | **35% 개선** |

![Vite 4.3 시작 시간](/vite4-3-startup-time.png)

![Vite 4.3 HMR 시간](/vite4-3-hmr-time.png)

벤치마크 정보는 [Vite 4.3 벤치마크 폴더](https://github.com/vitejs/vite/tree/main/playground/benchmarks)에서 확인할 수 있습니다. 각 프로젝트의 사양은 [환경 사양](https://github.com/vitejs/vite/tree/main/playground/benchmarks#environment-specs)을 참조하세요.

## 기타 개선사항 {#other-improvements}

- 더 나은 오류 메시지와 스택 트레이스 ([#12818](https://github.com/vitejs/vite/issues/12818))
- 개선된 TypeScript 지원 ([#12747](https://github.com/vitejs/vite/issues/12747))
- 더 나은 소스맵 생성 ([#12702](https://github.com/vitejs/vite/issues/12702))

## 다음 단계 {#next-steps}

저희는 Vite의 성능을 지속적으로 개선하고 있습니다. 다음 마이너 릴리스에서는 더 많은 최적화를 기대할 수 있습니다.

Vite 4.3을 사용해보세요! 언제나 그렇듯이 [GitHub](https://github.com/vitejs/vite)에서의 기여를 환영합니다. [Twitter](https://twitter.com/vite_js)에서 업데이트를 팔로우하거나 [Discord 채팅 서버](http://chat.vite.dev/)에서 다른 Vite 사용자들과 토론에 참여하세요.