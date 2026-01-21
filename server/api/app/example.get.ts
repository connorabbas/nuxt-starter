export default defineEventHandler(async (event) => {
    const { user, session } = event.context

    // Test Error Handling
    /* throw createError({
        statusCode: 500,
        statusMessage: 'Example Error'
    }) */

    return { test: 'Example application API route', user, session }
})
