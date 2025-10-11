export default defineNuxtRouteMiddleware(async () => {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
        return navigateTo(useRuntimeConfig().public.auth.redirectUserTo)
    }
})
