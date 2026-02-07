interface MailServerConfig {
    host: string
    port: number
}

const defaultMailEnv = {
    NUXT_SMTP_MAIL_FROM: 'nuxt-starter@example.com',
    NUXT_SMTP_MAIL_USERNAME: 'test-user',
    NUXT_SMTP_MAIL_PASSWORD: 'test-password'
}

export function createSignUpE2EEnv(mailServer: MailServerConfig, mustVerifyEmail: boolean) {
    return {
        NUXT_BETTER_AUTH_VERIFY_EMAIL: String(mustVerifyEmail),
        NUXT_SMTP_MAIL_FROM: defaultMailEnv.NUXT_SMTP_MAIL_FROM,
        NUXT_SMTP_MAIL_HOST: mailServer.host,
        NUXT_SMTP_MAIL_PORT: String(mailServer.port),
        NUXT_SMTP_MAIL_USERNAME: defaultMailEnv.NUXT_SMTP_MAIL_USERNAME,
        NUXT_SMTP_MAIL_PASSWORD: defaultMailEnv.NUXT_SMTP_MAIL_PASSWORD
    }
}

export function applyProcessEnv(env: Record<string, string>) {
    const previousValues = new Map<string, string | undefined>()

    for (const [key, value] of Object.entries(env)) {
        previousValues.set(key, process.env[key])
        process.env[key] = value
    }

    return () => {
        for (const [key, previousValue] of previousValues) {
            if (typeof previousValue === 'undefined') {
                Reflect.deleteProperty(process.env, key)
                continue
            }

            process.env[key] = previousValue
        }
    }
}
