import { authClient } from '~/lib/auth-client'

export default defineNuxtRouteMiddleware(async () => {
    const { data: session } = await authClient.useSession(useFetch)
    // TODO: get intended route, attach as query param
    // TODO: check config if mustVerifyEmail, if so redirect to verify-email
    if (!session.value) {
        return navigateTo(useRuntimeConfig().public.auth.redirectGuestTo)
    }
})
