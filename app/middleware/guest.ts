export default defineNuxtRouteMiddleware(async () => {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()

    await authStore.fetchSession()

    if (authStore.isAuthenticated) {
        return navigateTo(runtimeConfig.public.auth.redirectUserTo)
    }
})
