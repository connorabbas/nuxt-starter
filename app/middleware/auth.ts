import { authClient } from '~/lib/auth-client'

// TODO: get intended route, attach as query param for login page

export default defineNuxtRouteMiddleware(async () => {
    const runtimeConfig = useRuntimeConfig()

    // Use cached cookie with reactive data
    const { data: session } = await authClient.useSession(useFetch)
    if (!session.value) {
        return navigateTo(runtimeConfig.public.auth.redirectGuestTo)
    }

    // Or manually check the session for each navigation
    /* const { data: session } = await useFetch('/api/app/user-session')
    if (!session) {
        return navigateTo(runtimeConfig.public.auth.redirectGuestTo)
    } */
})
