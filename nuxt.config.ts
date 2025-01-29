const isDevelopment = process.env.NODE_ENV === 'development'
const title: string = 'EhroTok（エロトック） - 大人のためのショート動画プラットフォーム'
const description: string =
  'EhroTok（エロトック）は、大人向けの特別なショート動画を楽しむためのプラットフォームです。手軽に楽しめる短い動画で、あなたの日常に新しい刺激をお届けします。'
const url = 'https://ehrotok.com'
const imagePath: string = 'ogp.png'
const twitterCard: string = 'summary'
const image = `${url}/${imagePath}`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content:
            'EhroTok, ショート動画, 大人向け動画, エンターテインメント, 短い動画, 動画プラットフォーム, 高品質動画, プライベート動画, 大人専用, 短時間エンタメ, ショートムービー, 動画共有サービス, スマホ動画, オンライン動画, ユーザー投稿動画, 短編動画',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: url,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'EhroTok',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: image,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: twitterCard,
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: url,
        },
        {
          hid: 'robots',
          name: 'robots',
          content: 'noarchive',
        },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'theme-color', content: '#1a1a1a' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', 'nuxt-gtag'],
  runtimeConfig: {
    public: {
      token: process.env.TOKEN,
      development: {
        gistId: process.env.GISTID_DEV,
        fileName: process.env.FILENAME_DEV,
      },
      isDevelopment: isDevelopment,
      bearerToken: process.env.BEARER_TOKEN,
      googleTag: process.env.GTAG,
    },
  },
  imports: {
    dirs: ['models/**', 'config/**', 'repositories/**'],
  },

  routeRules: {
    '/v1/**': {
      proxy: `${process.env.PROXY_URL}/**`,
    },
  },

  gtag: {
    id: process.env.GTAG,
    loadingStrategy: 'async',
  },
})
