import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

export const getMailTransporter = () => {
    if (transporter) return transporter

    const config = useRuntimeConfig()

    transporter = nodemailer.createTransport({
        host: config.mailHost,
        port: Number(config.mailPort),
        secure: Number(config.mailPort) === 465,
        auth: {
            user: config.mailUsername,
            pass: config.mailPassword
        }
    })

    return transporter
}

interface SendMailOptions {
    to: string | string[]
    subject: string
    html: string
    from?: string
}

export const sendMail = async ({
    to,
    subject,
    html,
    from
}: SendMailOptions) => {
    const config = useRuntimeConfig()
    const transporter = getMailTransporter()

    const mailOptions = {
        from: from || `"${config.public.appName}" <${config.mailFrom}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        return { success: true, messageId: info.messageId }
    } catch (err) {
        console.error('Failed to send email:', err)
        throw err
    }
}
