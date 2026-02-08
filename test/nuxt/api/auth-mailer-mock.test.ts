import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectMailMockSent, expectMailMockSentTimes } from '../assertions'
import { testDb } from '../../helpers/db'
import { createUniqueEmail } from '../../helpers/utils'

const mailMock = vi.hoisted(() => {
    const sendMailMock = vi.fn(async (_payload: {
        to: string | string[]
        subject: string
        html: string
        from?: string
    }) => {
        return {
            success: true,
            messageId: 'mock-message-id'
        }
    })

    const getMailTransporterMock = vi.fn()

    function reset() {
        sendMailMock.mockClear()
        getMailTransporterMock.mockClear()
    }

    return {
        sendMailMock,
        getMailTransporterMock,
        reset
    }
})

function mockedMailerModule() {
    return {
        sendMail: mailMock.sendMailMock,
        getMailTransporter: mailMock.getMailTransporterMock
    }
}
vi.mock('~/server/utils/mailer', () => mockedMailerModule())
vi.mock('~~/server/utils/mailer', () => mockedMailerModule())

describe('auth mailer integration with vi.mock', () => {
    let auth: Awaited<typeof import('~~/server/utils/auth')>['auth']

    beforeAll(async () => {
        vi.stubGlobal('db', testDb)
        const authModule = await import('~~/server/utils/auth')
        auth = authModule.auth
    })

    beforeEach(() => {
        mailMock.reset()
    })

    afterAll(() => {
        vi.unstubAllGlobals()
    })

    it('calls mocked sendMail when signing up a user', async () => {
        const email = createUniqueEmail('mock-send')

        await auth.api.signUpEmail({
            body: {
                name: 'Mock Mail User',
                email,
                password: 'password123456'
            }
        })

        expectMailMockSentTimes(mailMock.sendMailMock, 1)
        expectMailMockSent(mailMock.sendMailMock, {
            to: email,
            subjectIncludes: 'Verify your email address'
        })
    })

    it('returns duplicate user error code and does not send mail again', async () => {
        const email = createUniqueEmail('mock-duplicate')

        await auth.api.signUpEmail({
            body: {
                name: 'Original User',
                email,
                password: 'password123456'
            }
        })

        mailMock.reset()

        const response = await auth.api.signUpEmail({
            body: {
                name: 'Duplicate User',
                email,
                password: 'password123456'
            },
            asResponse: true
        })

        const payload = await response.json()

        expect(response.status).toBe(422)
        expect(String(payload.code)).toContain('USER_ALREADY_EXISTS')
        expectMailMockSentTimes(mailMock.sendMailMock, 0)
    })
})
