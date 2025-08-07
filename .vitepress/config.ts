import path from 'node:path'
import fs from 'node:fs'
import type { DefaultTheme, HeadConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
// @ts-ignore
import markdownItCustomAnchor from './markdown-it-custom-anchor'
// @ts-ignore
import renderPermalink from './render-permalink'
import markdownItFootnote from 'markdown-it-footnote'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import { buildEnd } from './buildEnd.config'
import { markdownItImageSize } from 'markdown-it-image-size'

const ogDescription = 'Vite, 프런트엔드 개발의 새로운 기준'
const ogImage = 'https://ko.vite.dev/og-image.jpg'
const ogTitle = 'Vite'
const ogUrl = 'https://ko.vite.dev'

// netlify 환경 변수
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-ko.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()

const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Vite 6 문서',
      link: 'https://v6.vite.dev',
    },
    {
      text: 'Vite 5 문서',
      link: 'https://v5.vite.dev',
    },
    {
      text: 'Vite 4 문서',
      link: 'https://v4.vite.dev',
    },
    {
      text: 'Vite 3 문서',
      link: 'https://v3.vite.dev',
    },
    {
      text: 'Vite 2 문서',
      link: 'https://v2.vite.dev',
    },
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 7 문서 (릴리스)',
          link: 'https://ko.vite.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8',
    ),
  ]
}

export default defineConfig({
  title: 'Vite',
  lang: 'ko',
  description: '프런트엔드 개발의 새로운 기준',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      { src: 'https://www.googletagmanager.com/gtag/js?id=G-V8ZS1G7X21' },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-V8ZS1G7X21');`,
    ],
  ],

  locales: {
    root: { label: '한국어' },
    en: { label: 'English', link: 'https://vite.dev' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
    fa: { label: 'فارسی', link: 'https://fa.vite.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/docs-ko/edit/main/:path',
      text: '이 페이지 수정하기',
    },

    socialLinks: [
      // @ts-ignore
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    search: {
      provider: 'local',
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    footer: {
      message: `Released under the MIT License. (${commitRef})`,
      copyright: 'Copyright © 2019-present VoidZero Inc. & Vite Contributors',
    },

    nav: [
      { text: '가이드', link: '/guide/', activeMatch: '/guide/' },
      { text: '설정', link: '/config/', activeMatch: '/config/' },
      { text: '플러그인', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: '리소스',
        items: [
          { text: 'Vite 팀', link: '/team' },
          { text: '블로그', link: '/blog' },
          { text: '릴리스', link: '/releases' },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js',
              },
              {
                text: 'Discord',
                link: 'https://chat.vite.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'DEV',
                link: 'https://dev.to/t/vite',
              },
              {
                text: '변경 사항',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
              {
                text: '기여하기',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
      {
        text: '버전',
        items: versionLinks,
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '소개',
          items: [
            {
              text: '시작하기',
              link: '/guide/',
            },
            {
              text: '프로젝트 철학',
              link: '/guide/philosophy',
            },
            {
              text: 'Vite를 사용해야 하는 이유',
              link: '/guide/why',
            },
          ],
        },
        {
          text: '가이드',
          items: [
            {
              text: '지원하는 기능들',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: '플러그인 사용하기',
              link: '/guide/using-plugins',
            },
            {
              text: '사전 번들링 된 디펜던시',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: '에셋 가져오기',
              link: '/guide/assets',
            },
            {
              text: '프로덕션 버전으로 빌드하기',
              link: '/guide/build',
            },
            {
              text: '정적 웹 페이지로 배포하기',
              link: '/guide/static-deploy',
            },
            {
              text: 'Vite의 환경 변수와 모드',
              link: '/guide/env-and-mode',
            },
            {
              text: '서버 측 렌더링 (SSR)',
              link: '/guide/ssr',
            },
            {
              text: '백엔드 프레임워크와 함께 사용하기',
              link: '/guide/backend-integration',
            },
            {
              text: '트러블슈팅',
              link: '/guide/troubleshooting',
            },
            {
              text: '성능',
              link: '/guide/performance',
            },
            {
              text: 'Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: 'v6에서 마이그레이션하기',
              link: '/guide/migration'
            },
            {
              text: 'v5에서 마이그레이션하기',
              link: '/guide/migration-from-v5',
            },
            {
              text: 'v4에서 마이그레이션하기',
              link: '/guide/migration-from-v4',
            },
            {
              text: 'v3에서 마이그레이션하기',
              link: '/guide/migration-from-v3',
            },
            {
              text: 'v2에서 마이그레이션하기',
              link: '/guide/migration-from-v2',
            },
            {
              text: 'v1에서 마이그레이션하기',
              link: '/guide/migration-from-v1',
            },
            {
              text: '주요 변경 사항',
              link: '/changes/',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: '플러그인 API',
              link: '/guide/api-plugin',
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr',
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript',
            },
            {
              text: 'Vite 설정 레퍼런스',
              link: '/config/',
            },
          ],
        },
        {
          text: '환경 API',
          items: [
            {
              text: '환경 API',
              link: '/guide/api-environment',
            },
            {
              text: '환경 인스턴스',
              link: '/guide/api-environment-instances',
            },
            {
              text: '플러그인',
              link: '/guide/api-environment-plugins',
            },
            {
              text: '프레임워크',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: '런타임',
              link: '/guide/api-environment-runtimes',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: '설정',
          items: [
            {
              text: 'Vite 설정하기',
              link: '/config/',
            },
            {
              text: '공용 옵션',
              link: '/config/shared-options',
            },
            {
              text: '서버 옵션',
              link: '/config/server-options',
            },
            {
              text: '빌드 옵션',
              link: '/config/build-options',
            },
            {
              text: '프리뷰 옵션',
              link: '/config/preview-options',
            },
            {
              text: '디펜던시 최적화 옵션',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'SSR 옵션',
              link: '/config/ssr-options',
            },
            {
              text: '워커 옵션',
              link: '/config/worker-options',
            },
          ],
        },
      ],
      '/changes/': [
        {
          text: '주요 변경 사항',
          link: '/changes/',
        },
        {
          text: '최신 버전',
          items: [],
        },
        {
          text: '예정된 변경 사항',
          items: [
            {
              text: '훅에서 this.environment 사용하기',
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'HMR hotUpdate 플러그인 훅',
              link: '/changes/hotupdate-hook',
            },
            {
              text: '환경별 API로 마이그레이션',
              link: '/changes/per-environment-apis',
            },
            {
              text: 'ModuleRunner API를 사용하는 SSR',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: '빌드 중 공유되는 플러그인',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: '지난 변경 사항',
          items: [],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    // languages used for twoslash and jsdocs in twoslash
    languages: ['ts', 'js', 'json'],
    codeTransformers: [transformerTwoslash()],
    anchor: {
      // @ts-ignore
      renderPermalink,
    },
    config: (md) => {
      md.use(markdownItCustomAnchor)
      // @ts-ignore
      md.use(markdownItFootnote)
      // @ts-ignore
      md.use(groupIconMdPlugin)
      // @ts-ignore
      md.use(markdownItImageSize, {
        publicDir: path.resolve(import.meta.dirname, '../public')
      })
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin',
      ],
    },
  },
  buildEnd,
})
