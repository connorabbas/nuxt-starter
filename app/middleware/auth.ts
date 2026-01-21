export default defineNuxtRouteMiddleware(async () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    await authStore.ensureSession()

    if (!authStore.isAuthenticated) {
        return navigateTo(config.public.auth.redirectGuestTo)
    }
})
