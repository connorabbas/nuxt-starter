import type { NitroRuntimeConfig } from 'nitropack/types'
import dotenv, { config } from 'dotenv'
import dotenvExpand from 'dotenv-expand'

const myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

let runtimeConfigInstance: NitroRuntimeConfig

export const generateRuntimeConfig = () => ({
    preset: process.env.NUXT_NITRO_PRESET,
    betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
    databaseUrl: process.env.NUXT_DB_URL,
    public: {
        appEnv: process.env.NODE_ENV,
        baseURL: process.env.NUXT_APP_URL,
        appName: process.env.NUXT_APP_NAME,
        auth: {
            redirectUserTo: '/dashboard',
            redirectGuestTo: '/sign-up'
        }
    }
})

if (typeof useRuntimeConfig !== 'undefined') {
    runtimeConfigInstance = useRuntimeConfig()
} else {
    // for cli: npm run auth:schema
    config()
    runtimeConfigInstance = generateRuntimeConfig() as NitroRuntimeConfig
}

export const runtimeConfig = runtimeConfigInstance
