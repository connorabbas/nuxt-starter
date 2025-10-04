import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { runtimeConfig } from './config'
import db from './db'

export const auth = betterAuth({
    baseURL: runtimeConfig.public.baseURL,
    trustedOrigins: [runtimeConfig.public.baseURL],
    secret: runtimeConfig.betterAuthSecret,
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    emailAndPassword: {
        enabled: true
    }
})
