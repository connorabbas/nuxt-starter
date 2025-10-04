import { generateRuntimeConfig } from './server/utils/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        '@pinia/nuxt',
        'nuxt-csurf'
    ],
    devtools: {
        enabled: Boolean(process.env.NUXT_DEVTOOLS) || false
    },
    css: ['~/assets/css/main.css'],
    runtimeConfig: generateRuntimeConfig(),
    routeRules: {
        '/': { prerender: true }
    },
    devServer: {
        port: Number(process.env.NUXT_APP_PORT) || 3000
    },
    compatibilityDate: '2025-01-15',
    eslint: {
        config: {
            stylistic: false
        }
    }
})
