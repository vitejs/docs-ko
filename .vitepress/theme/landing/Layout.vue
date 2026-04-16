<script setup>
// these components live in @voidzero-dev/vitepress-theme
import Hero from './Hero.vue'
import ViteFeatureGrid1 from './FeatureGrid1.vue'
import ViteFeatureGrid2 from './FeatureGrid2.vue'
import ViteFrameworks from './Frameworks.vue'
import ViteCommunity from './Community.vue'
import TrustedBy from '@components/oss/TrustedBy.vue'
import HeadingSection from '@components/oss/HeadingSection.vue'
import Sponsors from '@components/oss/Sponsors.vue'
import Spacer from '@components/shared/Spacer.vue'
import Footer from '@components/oss/Footer.vue'
import { useSponsor } from '../composables/sponsor'

const { data: sponsors } = useSponsor()
</script>

<template>
  <Hero />
  <TrustedBy
    :logos="['openai', 'shopify', 'stripe', 'linear', 'clickup', 'wiz']" data-ko-22="표시"
  />
  <HeadingSection
    heading="개발자 경험을 다시 정의합니다"
    subheading="Vite는 웹 개발을 다시 즐겁게 만듭니다"
  />
  <ViteFeatureGrid1 />
  <HeadingSection heading="함께 구축할 공유 기반" />
  <ViteFeatureGrid2 />
  <HeadingSection heading="좋아하는 프레임워크와 도구를 구동합니다" />
  <ViteFrameworks />
  <ViteCommunity />
  <Sponsors :sponsors="sponsors" />
  <Spacer />
  <Footer
    heading="Vite로 구축을 시작하세요"
    subheading="마침내 생각의 속도를 따라잡는 개발 환경을 준비하세요."
    button-text="시작하기"
    button-link="/guide/"
  />
</template>
