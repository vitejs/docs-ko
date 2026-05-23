<script setup lang="ts">
import LogoGrid from '@components/shared/LogoGrid.vue'

const props = defineProps<{
  logos: string[]
}>()

const logos = props.logos.map((name) => ({
  src: `/trusted-by/${name}.svg`,
  alt: name,
}))
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t px-10 py-6 md:py-8 flex flex-col justify-center gap-5"
  >
    <h6 class="text-center md:text-start text-white">
      세계 최고 소프트웨어 팀들이 신뢰합니다
    </h6>
  </section>
  <section class="wrapper wrapper--ticks border-t">
    <LogoGrid :logos="logos" />
  </section>
</template>

<style scoped>
:deep(img) {
  filter: brightness(0) invert(1);
  opacity: 0.7;
}
</style>
