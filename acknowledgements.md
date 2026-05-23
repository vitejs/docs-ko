---
title: 감사의 말
description: Vite는 거인들의 어깨 위에 세워졌습니다. Vite의 기반이 된 모든 프로젝트와 기여자에게 감사드립니다.
---

<script setup>
import { computed } from 'vue'
import { data } from './_data/acknowledgements.data'
import { useSponsor } from './.vitepress/theme/composables/sponsor'
import VPSponsors from '@components/vitepress-default/VPSponsors.vue'

const sponsors = useSponsor()

function npmUrl(name) {
  return `https://www.npmjs.com/package/${name}`
}
</script>

# 감사의 말 {#acknowledgements}

Vite는 거인들의 어깨 위에 세워졌습니다. Vite의 기반이 된 모든 프로젝트, 기여자, 후원자에게 감사의 마음을 전합니다.

## 기여자 {#contributors}

Vite는 전 세계 기여자들로 이루어진 팀이 개발합니다. 코어 팀 멤버는 [팀 페이지](/team)에서 확인할 수 있습니다.

또한 코드 기여, 버그 리포트, 문서, 문서 번역을 통해 Vite 개선에 도움을 준 모든 [GitHub 기여자](https://github.com/vitejs/vite/graphs/contributors)에게도 감사드립니다.

## 후원자 {#sponsors}

Vite 개발은 관대한 후원자들의 지원을 받고 있습니다. [GitHub Sponsors](https://github.com/sponsors/vitejs) 또는 [Open Collective](https://opencollective.com/vite)를 통해 Vite를 후원할 수 있습니다.

<div class="sponsors-container">
  <VPSponsors :data="sponsors ?? []" />
</div>

## 디펜던시 {#dependencies}

Vite는 다음의 훌륭한 오픈 소스 프로젝트들에 의존합니다.

### 주요 디펜던시 {#notable-dependencies}

<div class="deps-list notable">
  <div v-for="dep in data.notableDependencies" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">저장소</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">후원</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      작성자: <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

### 번들된 디펜던시 작성자 {#bundled-dependency-authors}

<table class="authors-table">
  <thead>
    <tr>
      <th>작성자</th>
      <th>패키지</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="author in data.authors" :key="author.name">
      <td>
        <a v-if="author.url" :href="author.url" target="_blank" rel="noopener">{{ author.name }}</a>
        <template v-else>{{ author.name }}</template>
        <a v-if="author.funding" :href="author.funding" target="_blank" rel="noopener" class="sponsor-link">후원</a>
      </td>
      <td>
        <template v-for="(pkg, index) in author.packages" :key="pkg.name">
          <span class="pkg-item"><a :href="npmUrl(pkg.name)" target="_blank" rel="noopener"><code>{{ pkg.name }}</code></a><a v-if="pkg.funding" :href="pkg.funding" target="_blank" rel="noopener" class="sponsor-link">후원</a></span><template v-if="index < author.packages.length - 1">, </template>
        </template>
      </td>
    </tr>
  </tbody>
</table>

::: tip 패키지 작성자를 위해
이 섹션은 각 패키지의 `package.json`에 있는 `author`와 `funding` 필드에서 자동으로 생성됩니다. 이곳에 패키지가 표시되는 방식을 업데이트하려면 패키지에서 해당 필드를 수정하면 됩니다.
:::

## 개발 도구 {#development-tools}

Vite의 개발 워크플로는 다음 도구들로 구동됩니다.

<div class="deps-list notable">
  <div v-for="dep in data.devTools" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">저장소</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">후원</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      작성자: <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author }}</a><template v-else>{{ dep.author }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description }}</p>
  </div>
</div>

## 이전 주요 디펜던시 {#past-notable-dependencies}

이전 버전의 Vite가 사용했던 다음 프로젝트의 유지보수자들에게도 감사드립니다.

<table>
  <thead>
    <tr>
      <th>패키지</th>
      <th>설명</th>
      <th>링크</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="dep in data.pastNotableDependencies" :key="dep.name">
      <td><a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name }}</code></a></td>
      <td>{{ dep.description }}</td>
      <td><a :href="dep.repository" target="_blank" rel="noopener">저장소</a></td>
    </tr>
  </tbody>
</table>

<style scoped>
.deps-list {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.deps-list.notable {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.dep-item {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.dep-item .dep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dep-item a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.dep-item a:hover {
  text-decoration: underline;
}

.dep-item .dep-links {
  display: flex;
  gap: 0.5rem;
}

.dep-item .dep-link {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
}

.dep-item .dep-author {
  margin: 0.25rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.dep-item .dep-link.sponsor {
  background: var(--vp-c-brand-soft);
}

.dep-item p {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.authors-table .sponsor-link {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.authors-table .sponsor-link:hover {
  text-decoration: underline;
}
</style>
