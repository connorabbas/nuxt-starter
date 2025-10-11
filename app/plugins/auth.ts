export default defineNuxtPlugin(async () => {
    console.log('fetch session')
    const authStore = useAuthStore()
    await authStore.fetchSession()
})
