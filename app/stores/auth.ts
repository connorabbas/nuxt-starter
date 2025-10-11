import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createAuthClient } from 'better-auth/vue'

export const useAuthStore = defineStore('auth', () => {
    type AuthClient = ReturnType<typeof createAuthClient>
    type UseSessionReturn = Awaited<ReturnType<AuthClient['useSession']>>
    type GetSessionReturn = Awaited<ReturnType<AuthClient['getSession']>>

    const session = ref<UseSessionReturn | GetSessionReturn | null>(null)

    const user = computed(() => session.value?.data?.user)
    const loading = computed(() => session.value?.isPending ?? false)
    const isAuthenticated = computed(() => !!session.value?.data?.session)

    const getAuthClient = (): AuthClient => {
        //const url = useRequestURL()
        //const headers = import.meta.server ? useRequestHeaders() : undefined
        return createAuthClient({
            //baseURL: url.origin,
            //fetchOptions: { headers }
        })
    }

    // For initial load and reactive updates
    const fetchSession = async () => {
        const authClient = getAuthClient()
        const data = await authClient.useSession(useFetch)
        session.value = data
    }

    // Get fresh session from the database
    const fetchFreshSession = async () => {
        const authClient = getAuthClient()
        const freshData = await authClient.getSession({
            query: {
                disableCookieCache: true
            }
        })
        session.value = freshData
    }

    const signOut = async () => {
        const authClient = getAuthClient()
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigateTo('/')
                }
            }
        })
        session.value = null
    }

    return {
        session,
        user,
        loading,
        isAuthenticated,
        fetchSession,
        fetchFreshSession,
        signOut
    }
})
