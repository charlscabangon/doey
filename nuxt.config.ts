import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt'
  ],

  app: {
    head: {
      title: 'Doey',
      meta: [{ name: 'description', content: 'Project management tool' }]
    }
  },

  css: ['~/assets/css/tailwind.css'],


  typescript: {
    strict: true,
    typeCheck: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        quotes: 'single',
        semi: true
      }
    }
  },

  googleFonts: {
    families: {
      'Inter': '100..900',
      'DM Sans': '100..900',
      'DM Mono': [400, 500]
    },
    display: 'swap',
    preconnect: true
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  }
})