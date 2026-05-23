<script setup>
import Hero from './Hero.vue'
import Timer from './Timer.vue'
import TimeoutSwitcher from './TimeoutSwitcher.vue'
import VideoIframe from './VideoIframe.vue'
import Events from './Events.vue'
import Footer from '@components/oss/Footer.vue'
const startTime = '2026-03-19T15:00:00.000Z'
</script>

<template>
  <TimeoutSwitcher :at="startTime">
    <template #default>
      <Hero />
      <Timer :at="startTime" />
    </template>
    <template #timeout>
      <VideoIframe :at="startTime" />
    </template>
  </TimeoutSwitcher>
  <TimeoutSwitcher :at="startTime">
    <template #default>
      <Events />
    </template>
  </TimeoutSwitcher>
  <Footer
    heading="Vite로 빌드를 시작하세요"
    subheading="아이디어의 속도를 따라잡는 개발 환경을 준비하세요."
    button-text="시작하기"
    button-link="/guide/"
  />
</template>
