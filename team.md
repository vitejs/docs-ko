---
layout: page
title: 팀 소개
description: Vite 개발은 국제적인 팀이 이끌고 있습니다.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from '@voidzero-dev/vitepress-theme'
import { core, advisors, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>팀 소개</template>
    <template #lead>
      Vite 개발은 국제적인 팀이 이끌고 있으며, 그중 일부는
      아래에 소개되기를 선택했습니다.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>자문단</template>
    <template #lead>
      자문단은 생태계의 관점에서 경험을 공유해 Vite의 방향 설정을 돕고,
      환경 API와 향후 API 설계를 구체화합니다.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="advisors" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>명예 팀원</template>
    <template #lead>
      여기서는 과거에 귀중한 공헌을 했지만 더 이상 활동하지 않는
      일부 팀원을 기립니다.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
