export default defineEventHandler(async (event) => {
    const { user, session } = event.context

    logger.info('Example server logging', { user })

    // Test error handling on front-end
    /* throw createError({
        statusCode: 500,
        statusMessage: 'Example Error'
    }) */

    return { test: 'Example application API route', user, session }
})
