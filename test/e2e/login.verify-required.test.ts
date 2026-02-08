import { afterAll, describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { userFactory } from '../helpers/auth'
import { createUniqueEmail } from '../helpers/utils'
import { startMailFake, stopMailFake } from '../helpers/mail-fake'
import { applyProcessEnv, createFakeMailSMTPEnv } from './helpers/env'

async function fillLoginForm(
    page: Awaited<ReturnType<typeof createPage>>,
    values: { email: string, password: string }
) {
    await page.locator('input[name="email"]').fill(values.email)
    await page.locator('input[name="password"]').fill(values.password)
}

async function submitLoginForm(page: Awaited<ReturnType<typeof createPage>>) {
    await page.locator('button[type="submit"]').click()
}

async function waitForRateLimitWindow() {
    await new Promise(resolve => setTimeout(resolve, 11000))
}

describe('login flow (email verification required)', async () => {
    const smtp = await startMailFake()
    const env = createFakeMailSMTPEnv(smtp, true)
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

    it('redirects to dashboard after successful login', async () => {
        const user = await userFactory({ verified: true })
        const page = await createPage('/login')

        await fillLoginForm(page, {
            email: user.email,
            password: user.password
        })

        await submitLoginForm(page)
        await page.waitForURL('**/dashboard**')

        const redirectUrl = new URL(page.url())
        expect(redirectUrl.pathname).toBe('/dashboard')
    }, 30000)

    it('redirects unverified user to verify-email', async () => {
        const user = await userFactory({ verified: false })
        const page = await createPage('/login')

        await fillLoginForm(page, {
            email: user.email,
            password: user.password
        })

        await submitLoginForm(page)
        await page.waitForURL('**/verify-email**')

        const redirectUrl = new URL(page.url())
        expect(redirectUrl.pathname).toBe('/verify-email')
        expect(redirectUrl.searchParams.get('email')).toBe(user.email)
    }, 30000)

    it('shows server error when password is incorrect', async () => {
        await waitForRateLimitWindow()

        const user = await userFactory({ verified: true })
        const page = await createPage('/login')

        await fillLoginForm(page, {
            email: user.email,
            password: 'password000000'
        })

        const signInResponsePromise = page.waitForResponse(response => {
            return response.url().includes('/api/auth/sign-in/email')
                && response.request().method() === 'POST'
        })

        await submitLoginForm(page)

        const signInResponse = await signInResponsePromise
        const signInPayload = await signInResponse.json()
        const pageText = (await page.textContent('body')) || ''

        expect(signInResponse.status()).toBe(401)
        expect(String(signInPayload.code)).toContain('INVALID_EMAIL_OR_PASSWORD')
        expect(pageText).toContain(String(signInPayload.message))
        expect(page.url()).not.toContain('/dashboard')
    }, 30000)

    it('shows zod validation errors only after submit', async () => {
        const page = await createPage('/login')

        await fillLoginForm(page, {
            email: 'not-an-email',
            password: '1234'
        })

        expect(await page.getByText('Invalid email format').isVisible()).toBe(false)
        expect(await page.getByText('Must be at least 8 characters').isVisible()).toBe(false)

        await submitLoginForm(page)

        expect(await page.getByText('Invalid email format').isVisible()).toBe(true)
        expect(await page.getByText('Must be at least 8 characters').isVisible()).toBe(true)
        expect(page.url()).not.toContain('/dashboard')
        expect(page.url()).not.toContain('/verify-email')
    })

    it('shows server error when email is not registered', async () => {
        const page = await createPage('/login')

        await fillLoginForm(page, {
            email: createUniqueEmail('login-unregistered'),
            password: 'password123456'
        })

        const signInResponsePromise = page.waitForResponse(response => {
            return response.url().includes('/api/auth/sign-in/email')
                && response.request().method() === 'POST'
        })

        await submitLoginForm(page)

        const signInResponse = await signInResponsePromise
        const signInPayload = await signInResponse.json()
        const pageText = (await page.textContent('body')) || ''

        expect(signInResponse.status()).toBe(401)
        expect(String(signInPayload.code)).toContain('INVALID_EMAIL_OR_PASSWORD')
        expect(pageText).toContain(String(signInPayload.message))
        expect(page.url()).not.toContain('/dashboard')
    })
})
