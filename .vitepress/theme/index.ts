import { h } from 'vue'
import type { Theme } from 'vitepress'
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

const BaseTheme = {
  Layout(_props: unknown, { slots }: any) {
    return h('div', [
      slots['layout-top']?.(),
      h('main', slots.default?.()),
      slots['aside-ads-before']?.(),
    ])
  },
  enhanceApp() {},
}

export default {
  extends: BaseTheme,
  Layout() {
    return h(BaseTheme.Layout, null, {
      'layout-top': () => h(SponsorBanner),
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp(ctx) {
    BaseTheme.enhanceApp()
    ctx.app.component('NonInheritBadge', NonInheritBadge)
    ctx.app.component('ScrimbaLink', ScrimbaLink)
    ctx.app.component('SvgImage', SvgImage)
    ctx.app.component('YouTubeVideo', YouTubeVideo)
    ctx.app.use(TwoslashFloatingVue)
  },
} satisfies Theme
