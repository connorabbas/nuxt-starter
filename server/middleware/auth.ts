import type { Session, User } from 'better-auth'

export default defineEventHandler(async (event) => {
    const path = event.node.req.url || ''
    const method = (event.node.req.method || 'GET').toUpperCase()
    const config = useRuntimeConfig()
    const verifyEmailMethods = ['POST', 'PATCH', 'PUT', 'DELETE']

    // always check for fresh auth session status for /api/app requests
    if (path.startsWith('/api/app/')) {
        const session = await auth.api.getSession({
            query: {
                disableCookieCache: true
            },
            headers: event.headers
        })

        if (!session) {
            throw createError({
                status: 401,
                message: 'Invalid User Session, please log back in.'
            })
        }

        if (
            verifyEmailMethods.includes(method)
            && config.public.auth.mustVerifyEmail
            && !session.user.emailVerified
        ) {
            throw createError({
                status: 403,
                message: 'Email verification is required to perform this action.'
            })
        }

        // Attach session and user to event context for resulting api route
        event.context.session = session.session as Session
        event.context.user = session.user as User
    }
})
