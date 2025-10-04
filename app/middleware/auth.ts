export default defineNuxtRouteMiddleware(async () => {
    const authStore = useAuthStore()
    await authStore.init()
    if (!authStore.session?.data) {
        console.log('User is not authenticated, navigating to ')
        return navigateTo(useRuntimeConfig().public.auth.redirectGuestTo)
    }
})
