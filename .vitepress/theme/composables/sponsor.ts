import { onMounted, ref } from 'vue'
import type { Sponsor, SponsorTier } from '@voidzero-dev/vitepress-theme'

interface Sponsors {
  main: Sponsor[]
  partnership: Sponsor[]
  platinum: Sponsor[]
  gold: Sponsor[]
}

export const MAIN_SPONSOR_TIER = 'Brought to you by'

// shared data across instances so we load only once.
const data = ref<SponsorTier[]>()

export function useSponsor() {
  onMounted(async () => {
    if (data.value) return

    const result = await fetch('https://sponsors.vite.dev/sponsors.json')
    const sponsors: Sponsors = await result.json()

    data.value = [
      {
        tier: MAIN_SPONSOR_TIER,
        size: 'big',
        items: sponsors.main,
      },
      {
        tier: '함께하는 파트너',
        size: 'big',
        items: sponsors.partnership,
      },
      {
        tier: '플래티넘 스폰서',
        size: 'big',
        items: sponsors.platinum,
      },
      {
        tier: '골드 스폰서',
        size: 'medium',
        items: sponsors.gold,
      },
    ]
  })

  return data
}
