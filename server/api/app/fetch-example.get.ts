export default defineEventHandler(async (event) => {
    const { user, session } = event.context

    logger.info('Example server logging', { user })

    // Test error handling on front-end
    /* throw createError({
        status: 500,
        message: 'Example Error TEST'
    }) */

    return { test: 'Example application API route', user, session }
})
