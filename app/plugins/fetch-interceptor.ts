import { ofetch } from 'ofetch'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin({
    name: 'fetch-interceptor',
    enforce: 'default',
    parallel: true,
    async setup(nuxtApp) {
        const toast = useToast()
        const authStore = useAuthStore(nuxtApp.$pinia as Pinia)

        // ofetch configuration with error handling
        globalThis.$fetch = ofetch.create({
            retry: false,
            onRequestError({ error }) {
                if (import.meta.server) return
                if (error.name === 'AbortError') return
                toast.add({
                    title: 'Network Error',
                    description: 'Something went wrong on our end...',
                    color: 'error',
                    icon: 'i-lucide-circle-x'
                })
            },
            onResponseError({ response }) {
                // TODO: other response codes
                if (response.status === 401) {
                    authStore.invalidateSession()
                    if (import.meta.client) {
                        toast.add({
                            title: 'Unauthorized',
                            description: 'Please log in.',
                            color: 'info',
                            icon: 'i-lucide-log-in'
                        })
                    }
                    navigateTo('/login')
                } else if (response.status >= 500) {
                    toast.add({
                        title: 'Network Error',
                        description: 'A critical error occurred.',
                        color: 'error',
                        icon: 'i-lucide-circle-x'
                    })
                }
            }
        }) as typeof globalThis.$fetch
    }
})
