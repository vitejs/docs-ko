import { h } from 'vue'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import 'vitepress-plugin-graphviz/style.css'
import Theme from '@voidzero-dev/vitepress-theme/src/vite'
import './styles.css'

// components
import SvgImage from './components/SvgImage.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'
import SponsorBanner from './components/SponsorBanner.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import ScrimbaLink from './components/ScrimbaLink.vue'
import 'virtual:group-icons.css'

  extends: DefaultTheme,
    return h((Theme as any).Layout, null, {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(SponsorBanner),
      'aside-ads-before': () => h(AsideSponsors),
  enhanceApp(ctx: any) {
    const { app } = ctx

  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
    app.component('ScrimbaLink', ScrimbaLink)
    app.component('YouTubeVideo', YouTubeVideo)

    Theme.enhanceApp(ctx)
     app.component('NonInheritBadge', NonInheritBadge)
}
  },
} satisfies Theme