<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'

const { data } = useSponsor()
</script>

<template>
  <VPHomeSponsors
    v-if="data"
    message="Vite는 멋진 스폰서들 덕분에 누구나 사용 가능한 오픈 소스가 될 수 있었습니다."
    action-text="후원하기"
    action-link="https://github.com/sponsors/yyx990803"
    :data="data"
  />
</template>
