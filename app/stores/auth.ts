import type { User } from 'better-auth'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authClient } from '~/lib/auth-client'

export const useAuthStore = defineStore('auth', () => {
    type AuthClient = typeof authClient
    type UseSessionReturn = Awaited<ReturnType<AuthClient['useSession']>>
    type GetSessionReturn = Awaited<ReturnType<AuthClient['getSession']>>

    const session = ref<UseSessionReturn | GetSessionReturn | null>(null)

    const user = computed<User | null>(() => session.value?.data?.user)
    const loading = computed(() => session.value?.isPending ?? false)
    const isAuthenticated = computed(() => !!session.value?.data?.session)

    // For initial load and reactive updates
    const fetchSession = async () => {
        const data = await authClient.useSession(useFetch)
        session.value = data
    }

    // Get fresh session from the database
    const fetchFreshSession = async () => {
        const freshData = await authClient.getSession({
            query: {
                disableCookieCache: true
            }
        })
        session.value = freshData
    }

    // Session check (for middleware)
    const ensureSession = async () => {
        if (!session.value) {
            await fetchSession()
            return
        }
        if (import.meta.client) {
            await fetchFreshSession()
        }
    }

    const invalidateClientSession = () => {
        session.value = null
    }

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigateTo('/')
                }
            }
        })
        invalidateClientSession()
    }

    return {
        session,
        user,
        loading,
        isAuthenticated,
        fetchSession,
        fetchFreshSession,
        ensureSession,
        invalidateClientSession,
        signOut
    }
})
