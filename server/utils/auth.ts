import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { runtimeConfig } from './config'
import db from './db'
import { sendMail } from './mailer'
import { render } from '@vue-email/render'
import WelcomeEmail from '~~/server/mail/templates/vue/auth/verify-email.vue'

export const auth = betterAuth({
    baseURL: runtimeConfig.public.baseURL,
    trustedOrigins: [runtimeConfig.public.baseURL as string],
    secret: runtimeConfig.betterAuthSecret,
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: runtimeConfig.public.auth.mustVerifyEmail,
        revokeSessionsOnPasswordReset: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const subject = 'Verify your email address'
            const html = await render(WelcomeEmail, {
                subject,
                name: user.name,
                actionUrl: url
            }, { pretty: true })

            await sendMail({
                to: user.email,
                subject,
                html
            })
        }
    }
})
