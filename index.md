---
title: Vite
titleTemplate: 프런트엔드 개발의 새로운 기준
# add `dark` here to apply dark mode on initial load,
# since `onMounted` doesn't run during SSR
pageClass: landing dark

layout: home
editLink: false
import Hero from '.vitepress/theme/components/landing/1. hero-section/HeroSection.vue'
import FeatureSection from './.vitepress/theme/components/landing/2. feature-section/FeatureSection.vue'
import FrameworksSection from './.vitepress/theme/components/landing/3. frameworks-section/FrameworksSection.vue'
import CommunitySection from './.vitepress/theme/components/landing/4. community-section/CommunitySection.vue'
import GetStartedSection from '.vitepress/theme/components/landing/6. get-started-section/GetStartedSection.vue'
import { useData } from 'vitepress'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import Hero from './.vitepress/theme/components/landing/1. hero-section/HeroSection.vue'
import FeatureHMR from './.vitepress/theme/components/landing/2. feature-section/FeatureHMR.vue'
import FeatureRichFeatures from './.vitepress/theme/components/landing/2. feature-section/FeatureRichFeatures.vue'
import FeatureOptimizedBuild from './.vitepress/theme/components/landing/2. feature-section/FeatureOptimizedBuild.vue'
</script>
import GetStartedSection from './.vitepress/theme/components/landing/6. get-started-section/GetStartedSection.vue'
<div class="VPHome">
  <Hero/>
  <FeatureSection title="개발자 경험 혁신" description="웹 개발의 단순함을 Vite로 되찾으세요" type="blue">
    <FeatureInstantServerStart />
    <FeatureHMR />
    <FeatureRichFeatures />
    <FeatureOptimizedBuild />
  </FeatureSection>

const { isDark } = useData()

onMounted(() => {
  document.documentElement.classList.add('dark')
})

onBeforeUnmount(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
  <FeatureSection title="견고한 기반, 강력한 빌드" type="pink" class="feature-section--flip">
    <FeatureFlexiblePlugins />
    <FeatureTypedAPI />
    <FeatureSSRSupport />
    <FeatureCI />
  </FeatureSection>
  <FrameworksSection />
  <CommunitySection />
  <SponsorSection />
  <GetStartedSection />
</div>
const relativePrefixRE = /^\.\.?(?:[/\\]|$)/
          relativePrefixRE.test(id) ||