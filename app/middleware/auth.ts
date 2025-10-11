// TODO: get intended route, attach as query param for login page
export default defineNuxtRouteMiddleware(async () => {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
        return navigateTo(runtimeConfig.public.auth.redirectGuestTo)
    }
})
