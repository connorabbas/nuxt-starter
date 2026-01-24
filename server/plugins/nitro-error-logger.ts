// server/plugins/nitro-error-logger.ts
import type { H3Error } from 'h3'

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('error', (err, { event }) => {
        const isH3Error = (error: Error): error is H3Error => {
            return 'statusCode' in error
        }

        // Only log server errors
        const statusCode = isH3Error(err) ? err.statusCode : 500
        if (statusCode < 500) {
            return
        }

        const context = {
            url: event?.path,
            method: event?.method,
            statusCode,
            message: err.message,
            stack: err.stack,
            headers: event ? {
                'user-agent': getHeader(event, 'user-agent'),
                'referer': getHeader(event, 'referer'),
                'x-forwarded-for': getHeader(event, 'x-forwarded-for')
            } : undefined,
            query: event?.context?.params,
            ip: event ? (event.context?.ip || getHeader(event, 'x-real-ip')) : undefined
        }

        logger.error('Server Error', context)
    })
})
