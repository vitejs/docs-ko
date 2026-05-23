<template>
  <div
    class="wrapper wrapper--ticks grid md:grid-cols-2 w-full border-nickel md:divide-x"
  >
    <div
      class="flex flex-col items-center text-center md:text-left md:items-start p-10 gap-5 justify-center"
    >
      <h1 class="text-white text-pretty max-w-[35rem]">
        Vite 팀 결성 5주년
      </h1>
      <p class="text-white text-3xl text-pretty max-w-[35rem]">
        Vite: The Documentary 재상영
      </p>
      <p class="text-white/70 md:text-lg max-w-[35rem] text-pretty">
        3월 19일 15:00 UTC에 생태계와 함께 우리가 써 내려온 이야기를
        되돌아봅니다. 라이브 스테이지에 참여해 우리의 과거, 현재, 미래를
        함께 이야기해 주세요. 여러분을 기다리겠습니다!
      </p>
      <div class="flex items-start justify-between w-full gap-5 mt-8">
        <div class="flex items-center gap-5">
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vite.%20The%20documentary&dates=20260319T150000/20260319T160000&ctz=Europe/London&details=5th%20anniversary%20Community%20time%0A%0AJoin%20on%20Discord:%20https%3A%2F%2Fdiscord.gg%2FPsQ3SfhhDQ"
            target="_blank"
          rel="noopener noreferrer"
          class="button button--primary inline-block w-fit"
        >
            캘린더에 추가
          </a>
          <a
            href="https://chat.vite.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="button inline-block w-fit"
          >
            커뮤니티 참여하기
          </a>
        </div>
        <a
          href="https://www.cultrepo.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block w-fit grayscale hover:grayscale-0 hover:scale-105 transition-all duration-100"
        >
          <img
            src="../../../images/cultrepo-tv.svg"
            width="60"
            height="44"
            class="block"
            inert
            loading="lazy"
            alt="Cult.Repo"
          />
        </a>
      </div>
    </div>
    <div class="flex items-center justify-center p-10 md:min-h-[30rem]">
      <img
        src="../../../images/vite-live-community.webp"
        width="1832"
        height="1388"
        class="block sm:max-w-[80%] lg:max-w-[70%]"
        inert
        loading="lazy"
        alt="Vite 커뮤니티: Evan You, Matias Capeletto, Bjorn Lu, Anthony Fu, Sapphi Red, Dominik Göpel, Vladimir Sheremet, Ryan Carniato, Pedro Cattori, Mark Dalgleish, Rich Harris, Fred Schott, Eric Simons, Theo Browne, David Cramer, Misko Hevery"
      />
    </div>
  </div>
</template>
