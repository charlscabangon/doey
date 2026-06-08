import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxtjs/google-fonts',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'shadcn-nuxt'
    ],
    devtools: { enabled: true },

    app: {
        head: {
            title: 'Doey',
            meta: [{ name: 'description', content: 'Project management tool' }]
        }
    },

    css: ['~/assets/css/tailwind.css'],

    alias: {
        '#data': fileURLToPath(new URL('./server/data', import.meta.url))
    },
    compatibilityDate: '2025-07-15',

    typescript: {
        strict: true,
        typeCheck: false
    },

    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs',
                indent: 4,
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
});
