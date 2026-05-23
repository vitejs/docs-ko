<script setup>
import RiveAnimation from '@components/shared/RiveAnimation.vue'
import viteAnimation from '@assets/vite/animations/563_x_420_rich_features.riv'
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-nickel"
  >
    <div class="flex flex-col gap-3 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-balance sm:text-pretty text-white">
          즉시 시작되는 서버
        </h5>
        <p class="sm:max-w-[28rem] text-pretty">
          네이티브 ESM으로 필요한 소스 파일만 제공하고, 디펜던시는 매우 빠르게
          사전 번들링합니다.
        </p>
      </div>
      <div class="relative p-10 sm:p-15 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-1-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-featurepanel-1-terminal.svg"
          width="493"
          height="230"
          alt="터미널"
          inert
          loading="lazy"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3 justify-between border-r-0">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">번개처럼 빠른 HMR</h5>
        <p class="max-w-[26rem] text-pretty">
          앱이 아무리 커도 저장하는 순간 변경 사항을 즉시 반영합니다.
        </p>
      </div>
      <div class="flex justify-end">
        <img
          src="@assets/vite/vite-featurepanel-2-terminal.png"
          width="1126"
          height="734"
          class="md:max-w-[80%]"
          inert
          loading="lazy"
          alt="매우 빠른 Hot Module Replacement"
        />
      </div>
    </div>

    <div class="p-5 sm:p-10 pb-0 sm:pb-0 flex flex-col gap-3 lg:border-b-0">
      <h5 class="text-white">기본으로 제공되는 풍부한 기능</h5>
      <p class="sm:max-w-[28rem] text-pretty">
        TypeScript, JSX, CSS, Workers, WebAssembly 등을 기본 지원하며,
        플러그인으로 더 많은 기능을 추가할 수 있습니다.
      </p>
      <RiveAnimation
        :desktop-src="viteAnimation"
        :mobile-src="viteAnimation"
        :desktop-width="563"
        :desktop-height="300"
        :mobile-width="563"
        :mobile-height="420"
        canvas-class="w-full"
      />
    </div>

    <div class="flex flex-col gap-3 justify-between border-r-0 border-b-0">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">최적화된 빌드</h5>
        <p class="max-w-[25rem] text-pretty">
          Rolldown 기반의 고급 트리 셰이킹, 내장 minify, 세밀한 청크 제어를
          제공합니다.
        </p>
      </div>
      <div class="relative p-10 sm:p-15 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-4-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-featurepanel-4-terminal.svg"
          width="436"
          height="209"
          inert
          loading="lazy"
          alt="최적화된 빌드"
        />
      </div>
    </div>
  </section>
</template>
