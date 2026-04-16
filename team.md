---
layout: page
title: Meet the Team
description: The development of Vite is guided by an international team.
---

<script setup>
import { core, emeriti } from './_data/team' // 팀 데이터
</script>

# 팀 소개 {#team}

Vite 개발은 국제적인 팀에 의해 진행되며, 그들 중 일부를 소개합니다.

<div class="team-list">
  <div v-for="member in core" :key="member.name" class="team-member">
    <a v-if="member.links?.[0]?.link" :href="member.links[0].link" target="_blank" rel="noopener">{{ member.name /* 이름 */ }}</a>
    <span v-else>{{ member.name /* 이름 */ }}</span>
    <p v-if="member.desc">{{ member.desc /* 설명 */ }}</p>
  </div>
</div>

## 명예 팀원 {#emeriti}

더 이상 활동하지는 않지만, 과거에 귀중한 공헌을 했던 팀원들을 소개합니다.

<div class="team-list">
  <div v-for="member in emeriti" :key="member.name" class="team-member">
    <a v-if="member.links?.[0]?.link" :href="member.links[0].link" target="_blank" rel="noopener">{{ member.name /* 이름 */ }}</a>
    <span v-else>{{ member.name /* 이름 */ }}</span>
    <p v-if="member.desc">{{ member.desc /* 설명 */ }}</p>
  </div>
</div>
