import type { NitroRuntimeConfig } from 'nitropack/types'
import dotenv, { config } from 'dotenv'
import dotenvExpand from 'dotenv-expand'

const myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

export type AppRuntimeConfig = ReturnType<typeof generateRuntimeConfig>
let runtimeConfigInstance: AppRuntimeConfig | NitroRuntimeConfig

export const generateRuntimeConfig = () => ({
    preset: process.env.NUXT_NITRO_PRESET || 'node-server',
    betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
    databaseUrl: process.env.NUXT_DB_URL,
    mailFrom: process.env.NUXT_SMTP_MAIL_FROM,
    mailHost: process.env.NUXT_SMTP_MAIL_HOST,
    mailPort: process.env.NUXT_SMTP_MAIL_PORT,
    mailUsername: process.env.NUXT_SMTP_MAIL_USERNAME,
    mailPassword: process.env.NUXT_SMTP_MAIL_PASSWORD,
    public: {
        appEnv: process.env.NODE_ENV,
        baseURL: process.env.NUXT_APP_URL,
        appName: process.env.NUXT_APP_NAME,
        auth: {
            mustVerifyEmail: Boolean(process.env.NUXT_BETTER_AUTH_VERIFY_EMAIL || 1),
            redirectUserTo: '/dashboard',
            redirectGuestTo: '/sign-in'
        }
    }
})

if (typeof useRuntimeConfig !== 'undefined') {
    runtimeConfigInstance = useRuntimeConfig()
} else {
    // for cli use
    config()
    runtimeConfigInstance = generateRuntimeConfig()
}

export const runtimeConfig = runtimeConfigInstance
