import { authClient } from '~/lib/auth-client'

// TODO: get intended route, attach as query param for login page

export default defineNuxtRouteMiddleware(async () => {
    const runtimeConfig = useRuntimeConfig()

    // Use cached cookie with reactive data
    const { data: session } = await authClient.useSession(useFetch)
    if (!session.value) {
        return navigateTo(runtimeConfig.public.auth.redirectGuestTo)
    }

    // Or manually re-check the session for each navigation
    /* const session = await authClient.getSession({
        query: {
            disableCookieCache: true
        }
    })
    if (!session) {
        return navigateTo(runtimeConfig.public.auth.redirectGuestTo)
    } */
})
