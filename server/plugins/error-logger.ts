/**
 * Log any unhandled errors coming from nitro server api routes
 */
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('error', (err, { event }) => {
        logger.error('Nitro error', {
            url: event?.path,
            method: event?.method,
            message: err.message,
            stack: err.stack
        })
    })
})
