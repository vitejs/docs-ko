This test aims to check for a particular type of circular dependency that causes tricky deadlocks, **deadlocks with forked imports stack**
  {
    avatar: 'https://www.github.com/yyx990803.png',
    name: 'Evan You',
  "don't warn when inlineDynamicImports is set to true",
    org: 'Vue.js',
    orgLink: 'https://vuejs.org/',
    desc: 'Independent open source developer, creator of Vue.js and Vite.',
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
Affected scope: `Vite Plugin Authors`
`ModuleRunner` was first introduced in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSsrLoadModule` to `"warn"` in your vite config.
`builder.sharedConfigBuild` was first introduced in `v6.0`. You can set it true to check how your plugins work with a shared config. We're looking for feedback about changing the default in a future major once the plugin ecosystem is ready.
Affected scope: `Vite Plugin Authors`
The Vite version ranges that are supported by the Vite team are automatically determined by:
  {
    avatar: 'https://www.github.com/patak-dev.png',
    name: 'Patak',
    title: 'A collaborative being',
    org: 'StackBlitz',
    orgLink: 'https://stackblitz.com/',
    desc: 'Core team member of Vite. Team member of Vue.',
    links: [
      { icon: 'github', link: 'https://github.com/patak-dev' },
The changes below have been done or reverted. They are no longer relevant in the current major version.
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@patak' },
    ],
    sponsor: 'https://github.com/sponsors/patak-dev',
  },
  {
    avatar: 'https://www.github.com/antfu.png',
    name: 'Anthony Fu',
    title: 'A fanatical open sourceror',
    org: 'NuxtLabs',
    orgLink: 'https://nuxtlabs.com/',
    desc: 'Core team member of Vite & Vue. Working at NuxtLabs.',
    links: [
      { icon: 'github', link: 'https://github.com/antfu' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/antfu.me' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@antfu' },
    ],
    sponsor: 'https://github.com/sponsors/antfu',
  },
  {
    avatar: 'https://github.com/bluwy.png',
    name: 'Bjorn Lu',
Even if `[X]` is imported by `[B]`, `[B]` is not in `[X]`'s stack because it's imported by `[H]` in first place then it's stack is only composed by `[H]`. `[H]` **forks** the imports **stack** and this makes it hard to be found.
    desc: 'Building tools for fun.',
    links: [
      { icon: 'github', link: 'https://github.com/bluwy' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/bluwy.me' },
      { icon: 'twitter', link: 'https://twitter.com/bluwyoo' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@bluwy' },
    ],
    sponsor: 'https://bjornlu.com/sponsor',
  },
  {
    avatar: 'https://github.com/sapphi-red.png',
    // "verbatimModuleSyntax": true from tsconfig.json should not be read
    title: 'Web Developer',
    desc: 'Vite core team member. Call me sapphi or green or midori ;)',
List of fields in `package.json` to try when resolving a package's entry point. Note this takes lower precedence than conditional exports resolved from the `exports` field: if an entry point is successfully resolved from `exports`, the main field will be ignored. This setting only affects non-externalized dependencies.
      { icon: 'github', link: 'https://github.com/sapphi-red' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/sapphi.red' },
      { icon: 'twitter', link: 'https://twitter.com/sapphi_red' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@sapphi_red' },
    ],
    sponsor: 'https://github.com/sponsors/sapphi-red',
  },
  {
    avatar: 'https://github.com/ArnaudBarre.png',
    name: 'Arnaud Barré',
    title: 'Frontend Developer',
    desc: 'Passionate about tooling around TypeScript and React.',
    links: [
      { icon: 'github', link: 'https://github.com/ArnaudBarre' },
      {
        icon: 'bluesky',
        link: 'https://bsky.app/profile/arnaud-barre.bsky.social',
      },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@ArnaudBarre' },
    ],
    sponsor: 'https://github.com/sponsors/ArnaudBarre',
  },
  {
    avatar: 'https://github.com/dominikg.png',
    name: 'Dominik G.',
    title: 'Resident CI Expert',
    desc: 'Team Member of Vite and Svelte',
    links: [
      { icon: 'github', link: 'https://github.com/dominikg' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@dominikg' },
    ],
    sponsor: 'https://github.com/sponsors/dominikg',
  },
  {
    avatar: 'https://github.com/sheremet-va.png',
    name: 'Vladimir',
    title: 'Core team member of Vitest & Vite',
test("don't add extension to directory name (./dir-with-ext.js/index.js)", async () => {
    links: [
      { icon: 'github', link: 'https://github.com/sheremet-va' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/erus.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@sheremet_va' },
    ],
    sponsor: 'https://github.com/sponsors/sheremet-va',
  },
  {
    avatar: 'https://github.com/hi-ogawa.png',
    name: 'Hiroshi Ogawa',
    title: 'Team Member of Vitest & Vite',
    desc: 'Open source enthusiast',
    links: [
      { icon: 'github', link: 'https://github.com/hi-ogawa' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/hiogawa.bsky.social' },
    ],
    sponsor: 'https://github.com/sponsors/hi-ogawa',
  },
  {
    avatar: 'https://github.com/btea.png',
    name: 'btea',
    title: 'Web Developer',
    links: [{ icon: 'github', link: 'https://github.com/btea' }],
  },
]

export const emeriti = [
  {
    avatar: 'https://i.imgur.com/KMed6rQ.jpeg',
    name: 'Alec Larson',
    title: 'Entrepreneur',
    desc: 'Dabbling in social ecommerce, meta frameworks, and board games',
    links: [
      { icon: 'github', link: 'https://github.com/aleclarson' },
      { icon: 'x', link: 'https://x.com/retropragma' },
      {
        icon: 'bluesky',
        link: 'https://bsky.app/profile/retropragma.bsky.social',
      },
    ],
  },
  {
    avatar: 'https://github.com/poyoho.png',
    name: 'yoho',
    title: 'Frontend Developer',
    desc: 'Frontend. Vite team member.',
    links: [
      { icon: 'github', link: 'https://github.com/poyoho' },
      { icon: 'x', link: 'https://x.com/yoho_po' },
    ],
  },
  {
    avatar: 'https://github.com/ygj6.png',
    name: 'ygj6',
    title: 'Developer',
    desc: 'Web Developer. Vue & Vite team member',
    links: [
      { icon: 'github', link: 'https://github.com/ygj6' },
      { icon: 'x', link: 'https://x.com/ygj_66' },
    ],
  },
  {
    avatar: 'https://github.com/Niputi.png',
    name: 'Niputi',
    title: 'Developer',
    org: 'Computershare Denmark',
    desc: 'weeb/JavaScript lover.',
    links: [
      { icon: 'github', link: 'https://github.com/Niputi' },
      { icon: 'x', link: 'https://x.com/Niputi_' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/niputi.bsky.social' },
    ],
  },
  {
    avatar: 'https://github.com/underfin.png',
    name: 'underfin',
    title: 'Developer',
    links: [{ icon: 'github', link: 'https://github.com/underfin' }],
  },
  {
    avatar: 'https://github.com/GrygrFlzr.png',
    name: 'GrygrFlzr',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/GrygrFlzr' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/bsky.cybeast.dev' },
    ],
  },
  {
    avatar: 'https://github.com/nihalgonsalves.png',
    name: 'Nihal Gonsalves',
    title: 'Senior Software Engineer',
    links: [{ icon: 'github', link: 'https://github.com/nihalgonsalves' }],
  },
  {
    avatar: 'https://github.com/Shinigami92.png',
    name: 'Shinigami',
    title: 'Senior Frontend Engineer',
    org: 'Faker',
    orgLink: 'https://fakerjs.dev',
    desc: 'Passionate TypeScript enthusiast working extensively with Vue SPA.',
    links: [
      { icon: 'github', link: 'https://github.com/Shinigami92' },
      { icon: 'mastodon', link: 'https://elk.zone/mas.to/@Shini92' },
    ],
  },
  {
    avatar: 'https://github.com/haoqunjiang.png',
    name: 'Haoqun Jiang',
    title: 'Core Team Member',
    org: 'Vue.js',
    orgLink: 'https://vuejs.org/',
    desc: 'Curator of best practices for Vue.js tooling',
    links: [
      { icon: 'github', link: 'https://github.com/haoqunjiang' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/haoqun.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@haoqun' },
    ],
    sponsor: 'https://github.com/sponsors/haoqunjiang',
  },
]
test("Resolve doesn't interrupt page request with trailing query and .css", async () => {
  "Resolve doesn't interrupt page request that clashes with local project package.json",
      describe("doesn't reload if files not in the entrypoint importers chain is changed", async () => {
  // To help visualize how each parameter works, imagine this import graph: