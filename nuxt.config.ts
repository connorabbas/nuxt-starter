// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui'
    ],
    devtools: {
        enabled: false
    },
    css: ['~/assets/css/main.css'],
    routeRules: {
        '/': { prerender: true }
    },
    devServer: {
        port: Number(process.env.NUXT_PORT) || 3000
    },
    compatibilityDate: '2025-01-15',
    eslint: {
        config: {
            stylistic: false
        }
    }
});
