export default defineEventHandler(async (event) => {
    logger.info('Test API route called', { url: event.node.req.url })

    // TODO: api route middleware for auth only requests
    // https://nuxt.com/docs/4.x/guide/directory-structure/server#server-middleware
    // https://www.better-auth.com/docs/integrations/nuxt#server-usage
    const session = await auth.api.getSession({
        headers: event.headers
    })
    console.log(session)

    // Example Drizzle query
    const users = await db.query.users.findMany()

    return users
})
