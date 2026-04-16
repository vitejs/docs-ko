---
title: 감사의 말
description: Vite는 거인의 어깨 위에 세워졌습니다. Vite를 가능하게 한 모든 프로젝트와 기여자에게 감사드립니다.
---

<script setup>
import { computed } from 'vue' // 계산된 값
import { data } from './_data/acknowledgements.data' // 감사 데이터
import { useSponsor, voidZero } from './.vitepress/theme/composables/sponsor' // 후원자 데이터

const { data: sponsorData } = useSponsor() // 후원자 목록

const allSponsors = computed(() => { // 전체 후원자
  if (!sponsorData.value) return [] // 데이터가 없으면 빈 배열
  return [
    {
      tier: '제공',
      size: 'big',
      items: [voidZero],
    },
    ...sponsorData.value,
  ]
})

function npmUrl(name) { // npm 주소
  return `https://www.npmjs.com/package/${name}`
}
</script>

# 감사의 말 {#acknowledgements}

Vite는 거인의 어깨 위에 세워졌습니다. Vite를 가능하게 한 모든 프로젝트, 기여자, 후원자에게 깊은 감사를 전합니다.

## 기여자 {#contributors}

Vite는 전 세계 기여자 팀이 개발합니다. 코어 팀 구성원은 [팀 페이지](/team)에서 확인할 수 있습니다.

코드 기여, 버그 리포트, 문서, 문서 번역을 통해 Vite 개선에 도움을 준 모든 [GitHub 기여자](https://github.com/vitejs/vite/graphs/contributors)에게도 감사드립니다.

## 후원자 {#sponsors}

Vite 개발은 너그러운 후원자들의 지원을 받고 있습니다. [GitHub Sponsors](https://github.com/sponsors/vitejs) 또는 [Open Collective](https://opencollective.com/vite)를 통해 Vite를 후원할 수 있습니다.

<div class="sponsors-container">
  <div v-for="tier in allSponsors" :key="tier.tier" class="dep-item">
    <h3>{{ tier.tier /* 티어 */ }}</h3>
    <p>
      <a v-for="item in tier.items" :key="item.name" :href="item.url" target="_blank" rel="noopener">
        {{ item.name /* 이름 */ }}
      </a>
    </p>
  </div>
</div>

## 디펜던시 {#dependencies}

Vite는 다음의 훌륭한 오픈 소스 프로젝트에 의존합니다:

### 주요 디펜던시 {#notable-dependencies}

<div class="deps-list notable">
  <div v-for="dep in data.notableDependencies" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name /* 이름 */ }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">리포지토리</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">후원</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      작성자: <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author /* 작성자 */ }}</a><template v-else>{{ dep.author /* 작성자 */ }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description /* 설명 */ }}</p>
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
        <a v-if="author.url" :href="author.url" target="_blank" rel="noopener">{{ author.name /* 작성자 */ }}</a>
        <template v-else>{{ author.name /* 작성자 */ }}</template>
        <a v-if="author.funding" :href="author.funding" target="_blank" rel="noopener" class="sponsor-link">후원</a>
      </td>
      <td>
        <template v-for="(pkg, index) in author.packages" :key="pkg.name">
          <span class="pkg-item"><a :href="npmUrl(pkg.name)" target="_blank" rel="noopener"><code>{{ pkg.name /* 패키지 */ }}</code></a><a v-if="pkg.funding" :href="pkg.funding" target="_blank" rel="noopener" class="sponsor-link">후원</a></span><template v-if="index < author.packages.length - 1">, </template>
        </template>
      </td>
    </tr>
  </tbody>
</table>

::: tip 패키지 작성자에게
이 섹션은 각 패키지의 `package.json`에 있는 `author`와 `funding` 필드에서 자동으로 생성됩니다. 여기에 표시되는 패키지 정보를 업데이트하려면 패키지에서 해당 필드를 수정할 수 있습니다.
:::

## 개발 도구 {#development-tools}

Vite의 개발 워크플로는 다음 도구를 기반으로 합니다:

<div class="deps-list notable">
  <div v-for="dep in data.devTools" :key="dep.name" class="dep-item">
    <div class="dep-header">
      <a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name /* 이름 */ }}</code></a>
      <span class="dep-links">
        <a v-if="dep.repository" :href="dep.repository" target="_blank" rel="noopener" class="dep-link">리포지토리</a>
        <a v-if="dep.funding" :href="dep.funding" target="_blank" rel="noopener" class="dep-link sponsor">후원</a>
      </span>
    </div>
    <p v-if="dep.author" class="dep-author">
      작성자: <a v-if="dep.authorUrl" :href="dep.authorUrl" target="_blank" rel="noopener">{{ dep.author /* 작성자 */ }}</a><template v-else>{{ dep.author /* 작성자 */ }}</template>
    </p>
    <p v-if="dep.description">{{ dep.description /* 설명 */ }}</p>
  </div>
</div>

## 이전 주요 디펜던시 {#past-notable-dependencies}

이전 버전의 Vite에서 사용했던 다음 프로젝트의 메인테이너들에게도 감사드립니다:

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
      <td><a :href="npmUrl(dep.name)" target="_blank" rel="noopener"><code>{{ dep.name /* 이름 */ }}</code></a></td>
      <td>{{ dep.description /* 설명 */ }}</td>
      <td><a :href="dep.repository" target="_blank" rel="noopener">리포지토리</a></td>
    </tr>
  </tbody>
</table>

<style scoped>
.deps-list {
  display: grid;
  gap: 1rem;
  margin: 1rem 0; /* 여백 */
}

.deps-list.notable {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 그리드 */
}

.dep-item {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider); /* 테두리 */
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.dep-item .dep-header { /* 헤더 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dep-item a { /* 링크 */
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.dep-item a:hover { /* 호버 */
  text-decoration: underline;
}

.dep-item .dep-links { /* 링크 목록 */
  display: flex;
  gap: 0.5rem;
}

.dep-item .dep-link { /* 링크 버튼 */
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem; /* 패딩 */
  border-radius: 4px;
  background: var(--vp-c-default-soft);
}

.dep-item .dep-author { /* 작성자 */
  margin: 0.25rem 0 0; /* 여백 */
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.dep-item .dep-link.sponsor { /* 후원 */
  background: var(--vp-c-brand-soft);
}

.dep-item p { /* 문단 */
  margin: 0.5rem 0 0; /* 여백 */
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.authors-table .sponsor-link { /* 후원 링크 */
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem; /* 패딩 */
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.authors-table .sponsor-link:hover { /* 호버 */
  text-decoration: underline;
}
</style>
