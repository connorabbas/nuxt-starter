/* export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore()
    if (!nuxtApp.payload.serverRendered) {
        await authStore.fetchSession()
    }
    else if (Boolean(nuxtApp.payload.prerenderedAt) || Boolean(nuxtApp.payload.isCached)) {
        // To avoid hydration mismatch
        nuxtApp.hook('app:mounted', async () => {
            await authStore.fetchSession()
        })
    }
}) */
