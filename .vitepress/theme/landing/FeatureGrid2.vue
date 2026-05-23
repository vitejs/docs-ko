<script setup>
import RiveAnimation from '@components/shared/RiveAnimation.vue'
import flexiblePluginAnimation from '@assets/vite/animations/640_x_300_flexible_plugin.riv'
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-nickel"
  >
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5 class="text-balance sm:text-pretty text-white">
        유연한 플러그인 시스템
      </h5>
      <p class="sm:max-w-[28rem] text-pretty">
        Vite 플러그인은 잘 설계된 Rollup 플러그인 인터페이스를 확장하고,
        Vite 전용 옵션을 몇 가지 더 제공합니다.
      </p>
      <RiveAnimation
        :desktop-src="flexiblePluginAnimation"
        :desktop-width="640"
        :desktop-height="300"
        canvas-class="w-[calc(100%_+_2.5rem)] mt-5 -mx-5"
      />
    </div>

    <div class="flex flex-col gap-3 border-r-0 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">완전한 타입 지원 API</h5>
        <p class="max-w-[26rem] text-pretty">
          그 위에 무언가를 만들기 쉽도록 설계되었습니다.
        </p>
      </div>
      <div class="relative p-5 sm:p-10 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-4-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-typed-api.svg"
          width="454"
          height="252"
          inert
          loading="lazy"
          alt="타입이 지정된 API"
        />
      </div>
    </div>

    <div class="p-5 sm:p-10 flex flex-col gap-3 lg:border-b-0">
      <h5 class="text-white">SSR 기본 지원</h5>
      <p class="sm:max-w-[28rem] text-pretty mb-12 sm:mb-16">
        커스텀 SSR(Server-Side Rendering)을 설정하거나 직접 SSR 프레임워크를
        만드는 일이 그 어느 때보다 쉬워졌습니다.
      </p>
      <img
        src="@assets/vite/vite-ssr-support.png"
        width="1008"
        height="466"
        alt="SSR 지원"
        loading="lazy"
        class="w-full px-5"
      />
    </div>

    <div class="flex flex-col gap-3 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">지속적인 생태계 통합</h5>
        <p class="max-w-[25rem] text-pretty">
          Vite의 CI는 다운스트림 프로젝트를 대상으로 변경 사항을 지속적으로
          테스트해, 안정성과 확신을 바탕으로 Vite를 개선합니다.
        </p>
      </div>
      <div class="px-5 sm:px-10 flex justify-center">
        <img
          src="@assets/vite/vite-ci.svg"
          width="476"
          height="272"
          inert
          loading="lazy"
          alt="지속적인 생태계 통합"
        />
      </div>
    </div>
  </section>
</template>
