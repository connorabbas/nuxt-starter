import vue from '@vitejs/plugin-vue'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'nuxt-csurf'],
    devtools: {
        enabled: Boolean(process.env.NUXT_DEVTOOLS) || false
    },
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        preset: process.env.NUXT_NITRO_PRESET || 'node-server',
        betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
        databaseUrl: `postgres://${process.env.NUXT_DB_USERNAME}:${process.env.NUXT_DB_PASSWORD}` +
            `@${process.env.NUXT_DB_HOST}:${process.env.NUXT_DB_PORT}/${process.env.NUXT_DB_DATABASE}`,
        mailFrom: process.env.NUXT_SMTP_MAIL_FROM,
        mailHost: process.env.NUXT_SMTP_MAIL_HOST,
        mailPort: process.env.NUXT_SMTP_MAIL_PORT,
        mailUsername: process.env.NUXT_SMTP_MAIL_USERNAME,
        mailPassword: process.env.NUXT_SMTP_MAIL_PASSWORD,
        public: {
            repoURL: 'https://github.com/connorabbas/nuxt-starter',
            appEnv: process.env.NODE_ENV,
            baseURL: process.env.NUXT_APP_URL,
            appName: process.env.NUXT_APP_NAME,
            auth: {
                mustVerifyEmail: Boolean(process.env.NUXT_BETTER_AUTH_VERIFY_EMAIL || 1),
                redirectUserTo: '/dashboard',
                redirectGuestTo: '/login'
            }
        }
    },
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
    },
    nitro: {
        rollupConfig: {
            plugins: [vue()] // for vue-email
        }
    }
})
