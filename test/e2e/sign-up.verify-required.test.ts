import { beforeEach, afterAll, describe, expect, it } from 'vitest'
import { $fetch, createPage, setup } from '@nuxt/test-utils/e2e'
import { expectMailSent, waitForMailCount } from './assertions'
import { createUniqueEmail } from '../helpers/utils'
import { getSentMails, resetSentMails, startMailFake, stopMailFake } from '../helpers/mail-fake'
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

describe('sign-up flow (email verification required)', async () => {
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

    beforeEach(() => {
        resetSentMails()
    })

    afterAll(async () => {
        restoreProcessEnv()
        await stopMailFake()
    })

    it('redirects to verify-email and sends verification email', async () => {
        const email = createUniqueEmail('sign-up-required')
        const page = await createPage('/sign-up')

        await fillSignUpForm(page, {
            name: 'Signup User',
            email,
            password: 'password123456',
            confirmPassword: 'password123456'
        })

        await page.getByRole('button', { name: 'Submit' }).click()
        await page.waitForURL('**/verify-email**')

        const redirectUrl = new URL(page.url())
        expect(redirectUrl.pathname).toBe('/verify-email')
        expect(redirectUrl.searchParams.get('email')).toBe(email)

        await waitForMailCount(getSentMails, 1, 45000)

        expectMailSent(getSentMails(), {
            to: email,
            subjectIncludes: 'Verify your email address'
        })
    }, 60000)

    it('shows client-side validation messages', async () => {
        const page = await createPage('/sign-up')

        await fillSignUpForm(page, {
            name: 'Valid Name',
            email: 'not-an-email',
            password: '1234',
            confirmPassword: '1234'
        })

        expect(await page.getByText('Invalid email format').isVisible()).toBe(false)
        expect(await page.getByText('Must be at least 8 characters').isVisible()).toBe(false)

        await page.getByRole('button', { name: 'Submit' }).click()

        expect(await page.getByText('Invalid email format').isVisible()).toBe(true)
        expect(await page.getByText('Must be at least 8 characters').isVisible()).toBe(true)

        expect(page.url()).not.toContain('/dashboard')
        expect(page.url()).not.toContain('/verify-email')

        await page.locator('input[name="email"]').fill(createUniqueEmail('sign-up-validation'))
        await page.locator('input[name="password"]').fill('password123456')
        await page.locator('input[name="confirmPassword"]').fill('password000000')
        await page.getByRole('button', { name: 'Submit' }).click()

        expect(await page.getByText('Password confirmation does not match').isVisible()).toBe(true)
    })

    it('shows duplicate email validation from the server', async () => {
        const email = createUniqueEmail('sign-up-duplicate')

        await $fetch('/api/auth/sign-up/email', {
            method: 'POST',
            body: {
                name: 'Existing User',
                email,
                password: 'password123456'
            }
        })

        resetSentMails()

        const page = await createPage('/sign-up')
        await fillSignUpForm(page, {
            name: 'Another User',
            email,
            password: 'password123456',
            confirmPassword: 'password123456'
        })

        const signUpResponsePromise = page.waitForResponse(response => {
            return response.url().includes('/api/auth/sign-up/email')
                && response.request().method() === 'POST'
        })

        await page.getByRole('button', { name: 'Submit' }).click()

        const signUpResponse = await signUpResponsePromise
        const signUpPayload = await signUpResponse.json()
        const pageText = (await page.textContent('body')) || ''

        expect(signUpResponse.status()).toBe(422)
        expect(String(signUpPayload.code)).toContain('USER_ALREADY_EXISTS')
        expect(page.url()).not.toContain('/dashboard')
        expect(pageText).toContain(signUpPayload.message)
        expect(getSentMails().length).toBe(0)
    })
})
