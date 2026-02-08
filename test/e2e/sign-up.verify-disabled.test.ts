import { afterAll, describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { createUniqueEmail } from '../helpers/utils'
import { startMailFake, stopMailFake } from '../helpers/mail-fake'
import { applyProcessEnv, createFakeMailSMTPEnv } from './helpers/env'

async function fillSignUpForm(
    page: Awaited<ReturnType<typeof createPage>>,
    values: { name: string, email: string, password: string, confirmPassword: string }
) {
    await page.locator('input[name="name"]').fill(values.name)
    await page.locator('input[name="email"]').fill(values.email)
    await page.locator('input[name="password"]').fill(values.password)
    await page.locator('input[name="confirmPassword"]').fill(values.confirmPassword)
}

describe('sign-up flow (email verification disabled)', async () => {
    const smtp = await startMailFake()
    const env = createFakeMailSMTPEnv(smtp, false)
    const restoreProcessEnv = applyProcessEnv(env)

    await setup({
        server: true,
        browser: true,
        setupTimeout: 240000,
        teardownTimeout: 60000,
        env
    })

    afterAll(async () => {
        restoreProcessEnv()
        await stopMailFake()
    })

    it('redirects to dashboard after successful signup', async () => {
        const email = createUniqueEmail('sign-up-disabled')
        const page = await createPage('/sign-up')

        await fillSignUpForm(page, {
            name: 'Signup User',
            email,
            password: 'password123456',
            confirmPassword: 'password123456'
        })

        await page.getByRole('button', { name: 'Submit' }).click()
        await page.waitForURL('**/dashboard**')

        const redirectUrl = new URL(page.url())
        expect(redirectUrl.pathname).toBe('/dashboard')
    }, 30000)
})
