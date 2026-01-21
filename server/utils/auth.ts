import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { sendMail } from './mailer'
import { render } from '@vue-email/render'
import ConfirmDeleteUser from '~/mail/auth/ConfirmDeleteUser.vue'
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
    session: {
        cookieCache: {
            enabled: true, // @see https://www.better-auth.com/docs/concepts/session-management#session-caching
            maxAge: 5 * 60 // Cache duration in seconds (5 minutes)
        }
    },
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
