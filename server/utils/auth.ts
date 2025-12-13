import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { sendMail } from './mailer'
import { render } from '@vue-email/render'
import WelcomeEmail from '~/mail/auth/VerifyEmail.vue'
import ResetPwEmail from '~/mail/auth/ResetPassword.vue'

const runtimeConfig = useRuntimeConfig()
export const auth = betterAuth({
    appName: runtimeConfig.public.appName,
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
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
            const subject = 'Reset your password'
            const html = await render(ResetPwEmail, {
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
    },
    logger: {
        level: 'error',
        log: (level, message, ...args) => {
            logger.log(level, message, ...args)
        }
    }
})
