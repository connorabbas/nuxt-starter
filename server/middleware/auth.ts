export default defineEventHandler(async (event) => {
    const path = event.node.req.url || ''
    if (path.startsWith('/api/app/')) {
        const session = await auth.api.getSession({
            headers: event.headers
        })

        if (!session) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid User Session, please log back in.'
            })
        }

        // Attach session and user to event context for resulting api route
        event.context.session = session.session
        event.context.user = session.user
    }
})
