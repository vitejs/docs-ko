import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vite',
  lang: 'ko',
  description: '차세대 프런트엔드 개발 툴',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-V8ZS1G7X21' }],
    ['script', {}, `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-V8ZS1G7X21');`]
  ],

  vue: {
    reactivityTransform: true
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      repo: 'vitejs-kr/vitejs-kr.github.io',
      branch: 'main',
      text: '이 페이지 수정하기'
    },

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      apiKey: 'b573aa848fd57fb47d693b531297403c',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en']
      }
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    localeLinks: {
      text: '한국어',
      items: [
        { text: 'English', link: 'https://vitejs.dev' },
        { text: '简体中文', link: 'https://cn.vitejs.dev' },
        { text: '日本語', link: 'https://ja.vitejs.dev' }
      ]
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You & Vite Contributors'
    },

    nav: [
      { text: '가이드', link: '/guide/' },
      { text: '설정', link: '/config/' },
      { text: '플러그인', link: '/plugins/' },
      {
        text: '관련 링크',
        items: [
          {
            text: '트위터',
            link: 'https://twitter.com/vite_js'
          },
          {
            text: '디스코드',
            link: 'https://chat.vitejs.dev'
          },
          {
            text: 'Awesome Vite',
            link: 'https://github.com/vitejs/awesome-vite'
          },
          {
            text: '개발 커뮤니티',
            link: 'https://dev.to/t/vite'
          },
          {
            text: '호환 가능한 Rollup 플러그인',
            link: 'https://vite-rollup-plugins.patak.dev/'
          },
          {
            text: '변경 사항',
            link:
              'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
          }
        ]
      },
      {
        text: 'v3 (next)',
        items: [
          {
            text: 'v2.x (stable)',
            link: 'https://v2.vitejs.dev'
          }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '가이드',
          items: [
            {
              text: 'Vite를 사용해야 하는 이유',
              link: '/guide/why'
            },
            {
              text: '시작하기',
              link: '/guide/'
            },
            {
              text: '지원하는 기능들',
              link: '/guide/features'
            },
            {
              text: '플러그인 사용하기',
              link: '/guide/using-plugins'
            },
            {
              text: '사전 번들링 된 디펜던시',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: '에셋 가져오기',
              link: '/guide/assets'
            },
            {
              text: '프로덕션 버전으로 빌드하기',
              link: '/guide/build'
            },
            {
              text: '정적 웹 페이지로 배포하기',
              link: '/guide/static-deploy'
            },
            {
              text: 'Vite의 환경 변수와 모드',
              link: '/guide/env-and-mode'
            },
            {
              text: '서버 측 렌더링 (SSR)',
              link: '/guide/ssr'
            },
            {
              text: '백엔드 프레임워크와 함께 사용하기',
              link: '/guide/backend-integration'
            },
            {
              text: '다른 빌드 도구와의 차이점',
              link: '/guide/comparisons'
            },
            {
              text: 'v1에서 마이그레이션하기',
              link: '/guide/migration'
            }
          ]
        },
        {
          text: 'APIs',
          items: [
            {
              text: '플러그인 API',
              link: '/guide/api-plugin'
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr'
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript'
            },
            {
              text: 'Vite 설정 레퍼런스',
              link: '/config/'
            }
          ]
        }
      ],
      '/config/': [
        {
          text: 'Config',
          items: [
            {
              text: 'Configuring Vite',
              link: '/config/'
            },
            {
              text: 'Shared Options',
              link: '/config/shared-options'
            },
            {
              text: 'Server Options',
              link: '/config/server-options'
            },
            {
              text: 'Build Options',
              link: '/config/build-options'
            },
            {
              text: 'Preview Options',
              link: '/config/preview-options'
            },
            {
              text: 'Dep Optimization Options',
              link: '/config/dep-optimization-options'
            },
            {
              text: 'SSR Options',
              link: '/config/ssr-options'
            },
            {
              text: 'Worker Options',
              link: '/config/worker-options'
            }
          ]
        }
      ]
    }
  },
  markdown: {
    anchor: {
      // @ts-ignore
      renderPermalink: require('./render-permalink'),
    },
    config: md => md.use(require('./custom-anchor')),
  }
})
