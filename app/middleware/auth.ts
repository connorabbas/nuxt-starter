export default defineNuxtRouteMiddleware(async () => {
    console.log('auth middleware')
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()

    await authStore.fetchSession()

    if (!authStore.isAuthenticated) {
        return navigateTo(runtimeConfig.public.auth.redirectGuestTo)
    }
})
