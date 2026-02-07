import { expect } from 'vitest'
import type { CapturedMail } from '../helpers/mail-fake'

export function expectMailSent(
    sentMails: CapturedMail[],
    expected: {
        to?: string | string[]
        subjectIncludes?: string
        htmlIncludes?: string
        textIncludes?: string
    }
) {
    const expectedTo = typeof expected.to === 'undefined'
        ? undefined
        : (Array.isArray(expected.to) ? expected.to : [expected.to])

    const didMatch = sentMails.some((mail) => {
        if (expectedTo && !expectedTo.every(email => mail.to.includes(email))) {
            return false
        }

        if (expected.subjectIncludes && !mail.subject.includes(expected.subjectIncludes)) {
            return false
        }

        if (expected.htmlIncludes && !mail.html.includes(expected.htmlIncludes)) {
            return false
        }

        if (expected.textIncludes && !mail.text.includes(expected.textIncludes)) {
            return false
        }

        return true
    })

    expect(didMatch).toBe(true)
}

export async function waitForMailCount(
    getMails: () => CapturedMail[],
    expectedCount: number,
    timeoutMs = 5000,
    intervalMs = 100
) {
    const startedAt = Date.now()

    while (Date.now() - startedAt < timeoutMs) {
        if (getMails().length >= expectedCount) {
            return
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs))
    }

    expect(getMails().length).toBeGreaterThanOrEqual(expectedCount)
}
