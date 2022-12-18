---
layout: page
title: Meet the Team
description: The development of Vite is guided by an international team.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>팀 소개</template>
    <template #lead>
      Vite 개발은 국제적인 팀에 의해 진행되며, 그들 중 일부를 소개합니다.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>명예 팀원</template>
    <template #lead>
      더 이상 활동하지는 않지만, 과거에 귀중한 공헌을 했던 팀원들을 소개합니다.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>