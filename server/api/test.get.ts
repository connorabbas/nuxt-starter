export default defineEventHandler(async (event) => {
    logger.info('Test API route called', { url: event.node.req.url })

    // Example Drizzle query
    const users = await db.query.users.findMany()

    return users
})
