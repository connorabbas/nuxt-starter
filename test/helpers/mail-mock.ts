import { vi } from 'vitest'

export interface MockMailPayload {
    to: string | string[]
    subject: string
    html: string
    from?: string
}

export function createMailMockState() {
    const sendMailMock = vi.fn(async (_payload: MockMailPayload) => {
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
}
