import type { Pinia } from 'pinia'

/**
 * https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch#custom-fetch
 */
export default defineNuxtPlugin((nuxtApp) => {
    const { csrf } = useCsrf()
    const toast = useToast()
    const authStore = useAuthStore(nuxtApp.$pinia as Pinia)

    const appFetch = $fetch.create({
        retry: false,
        onRequest({ options }) {
            options.headers.set('csrf-token', csrf)
        },
        onRequestError({ error }) {
            if (import.meta.server) return
            if (error.name === 'AbortError') return

            toast.add({
                title: 'Network Error',
                description: 'Unable to reach the server. Please check your connection.',
                color: 'error',
                icon: 'i-lucide-wifi-off'
            })
        },
        async onResponseError({ response }) {
            if (import.meta.server) return

            const status = response.status
            const data = response._data

            // 401 Unauthorized - Invalid/missing authentication
            if (status === 401) {
                authStore.invalidateClientSession()
                toast.add({
                    title: 'Unauthorized',
                    description: data?.message || 'Please log in to continue.',
                    color: 'warning',
                    icon: 'i-lucide-log-in'
                })
                await nuxtApp.runWithContext(() => navigateTo('/login'))
                return
            }

            // 403 Forbidden - Authenticated but not authorized
            if (status === 403) {
                toast.add({
                    title: 'Access Denied',
                    description: data?.message || 'You don\'t have permission to access this resource.',
                    color: 'warning',
                    icon: 'i-lucide-shield-alert'
                })
                return
            }

            // 404 Not Found
            if (status === 404) {
                toast.add({
                    title: 'Not Found',
                    description: data?.message || 'The requested resource was not found.',
                    color: 'warning',
                    icon: 'i-lucide-search-x'
                })
                return
            }

            // 422 Unprocessable Entity - Validation errors
            if (status === 422) {
                const validationMessage = data?.message || 'Invalid input provided, please try again.'
                toast.add({
                    title: 'Validation Error',
                    description: validationMessage,
                    color: 'error',
                    icon: 'i-lucide-alert-circle'
                })
                return
            }

            // 429 Too Many Requests - Rate limiting
            if (status === 429) {
                toast.add({
                    title: 'Too Many Requests',
                    description: data?.message || 'Please slow down and try again later.',
                    color: 'error',
                    icon: 'i-lucide-timer'
                })
                return
            }

            // 400-499 Other Client Errors (catch-all)
            if (status >= 400 && status < 500) {
                toast.add({
                    title: 'Request Error',
                    description: data?.message || 'There was a problem with your request.',
                    color: 'error',
                    icon: 'i-lucide-alert-triangle'
                })
                return
            }

            // 500-599 Server Errors
            if (status >= 500) {
                toast.add({
                    title: 'Server Error',
                    description: data?.message || 'Something went wrong on our end. Please try again later.',
                    color: 'error',
                    icon: 'i-lucide-server-crash'
                })
            }
        }
    })

    // Expose to useNuxtApp().$appFetch
    return {
        provide: {
            appFetch
        }
    }
})
