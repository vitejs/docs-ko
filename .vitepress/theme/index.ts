import { h } from 'vue'
import Theme from 'vitepress/theme'
import './styles/vars.css'
import './styles/custom.css'
import HomeSponsors from './components/HomeSponsors.vue'
import ASideSponsors from './components/ASideSponsors.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-outline-after': () => h(ASideSponsors)
    })
  }
}