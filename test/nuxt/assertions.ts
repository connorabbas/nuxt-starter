import type { AnyPgTable } from 'drizzle-orm/pg-core'
import { expect } from 'vitest'
import type { MockMailPayload } from '../helpers/mail-mock'
import { databaseHas, type DatabaseWhere } from '../helpers/db'

export async function expectDatabaseHas<TTable extends AnyPgTable>(
    table: TTable,
    where: DatabaseWhere<TTable>
) {
    const exists = await databaseHas(table, where)
    expect(exists).toBe(true)
}

type SendMailMock = {
    mock: {
        calls: [MockMailPayload][]
    }
}

export function expectMailMockSentTimes(sendMailMock: SendMailMock, expectedCalls: number) {
    expect(sendMailMock.mock.calls.length).toBe(expectedCalls)
}

export function expectMailMockSent(
    sendMailMock: SendMailMock,
    expected: {
        to?: string | string[]
        subjectIncludes?: string
        htmlIncludes?: string
    }
) {
    const didMatch = sendMailMock.mock.calls.some(([payload]) => {
        const payloadTo = Array.isArray(payload.to) ? payload.to : [payload.to]
        const expectedTo = typeof expected.to === 'undefined'
            ? undefined
            : (Array.isArray(expected.to) ? expected.to : [expected.to])

        if (expectedTo && !expectedTo.every(email => payloadTo.includes(email))) {
            return false
        }

        if (expected.subjectIncludes && !payload.subject.includes(expected.subjectIncludes)) {
            return false
        }

        if (expected.htmlIncludes && !payload.html.includes(expected.htmlIncludes)) {
            return false
        }

        return true
    })

    expect(didMatch).toBe(true)
}
