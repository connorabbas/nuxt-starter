import type { AddressInfo } from 'node:net'
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'

export interface CapturedMail {
    from: string
    to: string[]
    subject: string
    html: string
    text: string
    messageId: string
    raw: string
}

interface MailFakeServer {
    host: string
    port: number
}

let smtpServer: SMTPServer | null = null
let smtpAddress: MailFakeServer | null = null
const sentMails: CapturedMail[] = []

type MailAddressObject = {
    value: Array<{ address?: string }>
}

function extractAddresses(address: MailAddressObject | MailAddressObject[] | undefined): string[] {
    if (!address) return []

    const list = Array.isArray(address) ? address : [address]

    return list
        .flatMap(item => item.value)
        .map((entry: { address?: string }) => entry.address || '')
        .filter(Boolean)
}

function normalizeAddress(address: string | AddressInfo | null): MailFakeServer {
    if (!address || typeof address === 'string') {
        throw new Error('Unable to determine SMTP fake server address')
    }

    return {
        host: address.address,
        port: address.port
    }
}

export async function startMailFake(): Promise<MailFakeServer> {
    if (smtpServer && smtpAddress) {
        return smtpAddress
    }

    sentMails.splice(0, sentMails.length)

    smtpServer = new SMTPServer({
        authOptional: true,
        disabledCommands: ['STARTTLS'],
        onAuth(_auth, _session, callback) {
            callback(null, { user: 'test' })
        },
        onData(stream, _session, callback) {
            const chunks: Buffer[] = []

            stream.on('data', chunk => chunks.push(Buffer.from(chunk)))

            stream.on('end', async () => {
                try {
                    const rawBuffer = Buffer.concat(chunks)
                    const parsed = await simpleParser(rawBuffer)

                    sentMails.push({
                        from: extractAddresses(parsed.from)[0] || '',
                        to: extractAddresses(parsed.to),
                        subject: parsed.subject || '',
                        html: typeof parsed.html === 'string' ? parsed.html : '',
                        text: parsed.text || '',
                        messageId: parsed.messageId || '',
                        raw: rawBuffer.toString('utf8')
                    })

                    callback()
                } catch (error) {
                    callback(error as Error)
                }
            })
        }
    })

    await new Promise<void>((resolve, reject) => {
        smtpServer?.once('error', reject)
        smtpServer?.listen(0, '127.0.0.1', () => resolve())
    })

    smtpAddress = normalizeAddress(smtpServer.server.address())

    return smtpAddress
}

export async function stopMailFake() {
    if (!smtpServer) return

    await new Promise<void>((resolve, reject) => {
        try {
            smtpServer?.close(() => resolve())
        } catch (error) {
            reject(error)
        }
    })

    smtpServer = null
    smtpAddress = null
    sentMails.splice(0, sentMails.length)
}

export function resetSentMails() {
    sentMails.splice(0, sentMails.length)
}

export function getSentMails() {
    return [...sentMails]
}
