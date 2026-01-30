import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { sendMail } from './mailer'
import { render } from '@vue-email/render'
import ConfirmDeleteUser from '~/mail/auth/ConfirmDeleteUser.vue'
import WelcomeEmail from '~/mail/auth/VerifyEmail.vue'
import ResetPwEmail from '~/mail/auth/ResetPassword.vue'

const config = useRuntimeConfig()

const authOptions: BetterAuthOptions = {
    appName: config.public.appName,
    baseURL: config.public.baseURL,
    trustedOrigins: [config.public.baseURL as string],
    secret: config.betterAuthSecret,
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    user: {
        changeEmail: {
            enabled: true
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                const subject = 'Confirm account deletion'
                const html = await render(ConfirmDeleteUser, {
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
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: config.public.auth.mustVerifyEmail,
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
    }
}

// https://www.better-auth.com/docs/concepts/session-management#session-caching
const sessionCookieTTL = config.public.auth.sessionCookieCacheTTL
if (sessionCookieTTL) {
    authOptions.session = {}
    authOptions.session.cookieCache = {
        enabled: true,
        maxAge: sessionCookieTTL * 60 // Cache duration in seconds
    }
}

export const auth = betterAuth(authOptions)
