---
title: Vite 4.3이 출시되었습니다!
author:
  name: Vite 팀
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.3 발표
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

_2023년 4월 20일_

![Vite 4.3 발표 커버 이미지](/og-image-announcing-vite4-3.png)

빠른 링크:

- 문서: [English](/), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/)
- [Vite 4.3 변경 로그](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## 성능 개선 {#performance-improvements}

이번 마이너 릴리스에서는 개발 서버의 성능 향상에 집중했습니다. 리졸브 로직을 간소화하여 핫 패스를 개선하고, `package.json`, TypeScript 설정 파일, 그리고 일반적인 리졸브된 URL을 찾는 과정에서 더 스마트한 캐싱을 구현했습니다.

Vite 기여자 중 한 분이 작성한 이 블로그 포스트에서 이번에 수행된 성능 작업에 대한 자세한 설명을 읽어보실 수 있습니다: [How we made Vite 4.3 faaaaster 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html).

이번 개발 스프린트는 Vite 4.2 대비 전반적인 속도 개선을 가져왔습니다.

다음은 [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare)로 측정한 성능 개선 결과입니다. 이 벤치마크는 1000개의 React 컴포넌트를 가진 앱에서 콜드/웜 개발 서버 시작 시간과 루트 및 리프 컴포넌트의 HMR 시간을 테스트했습니다:

| **Vite (babel)**   |  Vite 4.2 | Vite 4.3 | 개선율 |
| :----------------- | --------: | -------: | ----------: |
| **개발 콜드 스타트** | 17249.0ms | 5132.4ms |      -70.2% |
| **개발 웜 스타트** |  6027.8ms | 4536.1ms |      -24.7% |
| **루트 HMR**       |    46.8ms |   26.7ms |      -42.9% |
| **리프 HMR**       |    27.0ms |   12.9ms |      -52.2% |

| **Vite (swc)**     |  Vite 4.2 | Vite 4.3 | 개선율 |
| :----------------- | --------: | -------: | ----------: |
| **개발 콜드 스타트** | 13552.5ms | 3201.0ms |      -76.4% |
| **개발 웜 스타트** |  4625.5ms | 2834.4ms |      -38.7% |
| **루트 HMR**       |    30.5ms |   24.0ms |      -21.3% |
| **리프 HMR**       |    16.9ms |   10.0ms |      -40.8% |

![Vite 4.3 vs 4.2 시작 시간 비교](/vite4-3-startup-time.png)

![Vite 4.3 vs 4.2 HMR 시간 비교](/vite4-3-hmr-time.png)

벤치마크에 대한 자세한 정보는 [여기](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e)에서 확인하실 수 있습니다. 이번 성능 테스트의 사양과 버전은 다음과 같습니다:

- CPU: Ryzen 9 5900X, 메모리: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Vite 및 React 플러그인 버전
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

얼리 어답터들도 Vite 4.3 베타를 테스트하면서 실제 앱에서 1.5배~2배의 개발 시작 시간 개선을 경험했다고 보고했습니다. 여러분의 앱에서는 어떤 결과가 나오는지 알려주시면 감사하겠습니다.

## 프로파일링 {#profiling}

Vite의 성능 개선 작업을 지속적으로 진행할 예정입니다. 각 풀 리퀘스트마다 성능 지표를 얻을 수 있는 공식 [벤치마크 도구](https://github.com/vitejs/vite-benchmark)를 개발하고 있습니다.

그리고 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)에 성능 관련 기능이 추가되어 어떤 플러그인이나 미들웨어가 애플리케이션의 병목 지점인지 식별하는 데 도움이 됩니다.

`vite --profile`을 사용하고 페이지가 로드된 후 `p`를 누르면 개발 서버 시작 시의 CPU 프로파일이 저장됩니다. 이를 [speedscope](https://www.speedscope.app/)와 같은 앱에서 열어 성능 이슈를 식별할 수 있습니다. 발견한 내용은 [Discussion](https://github.com/vitejs/vite/discussions)이나 [Vite Discord](https://chat.vite.dev)에서 Vite 팀과 공유해주세요.

## 다음 단계 {#next-steps}

올해는 9월 [Node.js 16의 EOL](https://endoflife.date/nodejs)에 맞춰 단일 Vite 메이저 릴리스를 진행하기로 결정했으며, 이때 Node.js 14와 16에 대한 지원을 모두 중단할 예정입니다. 참여를 원하신다면 조기 피드백을 수집하기 위한 [Vite 5 Discussion](https://github.com/vitejs/vite/discussions/12466)을 시작했습니다.