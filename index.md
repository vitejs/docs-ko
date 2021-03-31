---
home: true
heroImage: /logo.svg
actionText: 시작하기
actionLink: /guide/

altActionText: 더 알아보기
altActionLink: /guide/why

features:
  - title: 💡 간편한 서버 구축
    details: 네이티브 ESM을 이용해 번들링 없이 온-디맨드 형태로 파일을 제공할 수 있어요!
  - title: ⚡️ 빛처럼 빠른 HMR
    details: 앱 크기에 상관없이 Hot Module Replacement(HMR)는 언제나 빠르게 동작해요.
  - title: 🛠️ 다양한 기능들
    details: 추가적인 모듈의 설치 없이 TypeScript, JSX, CSS 등을 사용할 수 있어요.
  - title: 📦 빌드 최적화
    details: 멀티-페이지 및 앱 내에서 사용하는 라이브러리의 빌드 최적화를 위한 설정을 제공해요.
  - title: 🔩 범용적인 플러그인들
    details: 개발 및 빌드 시 모두 사용 가능한 Rollup 플러그인 인터페이스를 제공해요.
  - title: 🔑 Typed API
    details: 유연하게 작성된 API는 TypeScript 역시 완벽하게 지원해요.
footer: MIT Licensed | Copyright © 2019-present Evan You & Vite Contributors
---

<div class="frontpage sponsors">
  <h2>스폰서</h2>
  <a v-for="{ href, src, name } of sponsors" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
    <img :src="src" :alt="name">
  </a>
  <br>
  <a href="https://github.com/sponsors/yyx990803" target="_blank" rel="noopener">GitHub을 통해 후원할 수 있어요</a>
</div>

<script setup>
import sponsors from './.vitepress/theme/sponsors.json'
</script>
