export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore()
    await authStore.fetchSession()

    // Mark that we fetched on server
    nuxtApp.payload.authFetched = true
})
