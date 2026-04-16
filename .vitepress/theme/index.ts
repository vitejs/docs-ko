import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from '@voidzero-dev/vitepress-theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import 'vitepress-plugin-graphviz/style.css'
import './styles.css'

import AsideSponsors from './components/AsideSponsors.vue'
import NonInheritBadge from './components/NonInheritBadge.vue'
import ScrimbaLink from './components/ScrimbaLink.vue'
import SponsorBanner from './components/SponsorBanner.vue'
import SvgImage from './components/SvgImage.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(SponsorBanner),
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('NonInheritBadge', NonInheritBadge)
    ctx.app.component('ScrimbaLink', ScrimbaLink)
    ctx.app.component('SvgImage', SvgImage)
    ctx.app.component('YouTubeVideo', YouTubeVideo)
    ctx.app.use(TwoslashFloatingVue)
  },
} satisfies Theme
