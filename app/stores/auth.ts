import type { User, Session } from 'better-auth'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authClient } from '~/lib/auth-client'

export const useAuthStore = defineStore('auth', () => {
    interface SessionData {
        user: User
        session: Session
    }

    const session = ref<SessionData | null>(null)
    const isPending = ref(false)
    const sessionPromise = ref<Promise<void> | null>(null)

    const user = computed<User | null>(() => session.value?.user ?? null)
    const loading = computed(() => isPending.value)
    const isAuthenticated = computed(() => !!session.value?.session)

    // For initial load and reactive updates
    // Uses Better Auth's cookie cache by default
    const fetchSession = async () => {
        isPending.value = true
        try {
            const data = await authClient.useSession(useFetch)
            session.value = data.data.value
        } catch (error) {
            console.error('Fetch session error:', error)
            session.value = null
        } finally {
            isPending.value = false
        }
    }

    // Get fresh session from the database (bypasses cookie cache)
    const fetchFreshSession = async () => {
        isPending.value = true
        try {
            const freshData = await authClient.getSession({
                query: {
                    disableCookieCache: true // Force database fetch
                }
            })
            session.value = freshData.data
        } catch (error) {
            console.error('Fetch fresh session error:', error)
            session.value = null
        } finally {
            isPending.value = false
        }
    }

    // Session check (for middleware) with race condition prevention
    const ensureSession = async () => {
        // If already fetching, wait for that request
        if (sessionPromise.value) {
            return sessionPromise.value
        }

        // If no session, fetch it (uses cookie cache if enabled)
        if (!session.value) {
            sessionPromise.value = fetchSession()
            await sessionPromise.value
            sessionPromise.value = null
            return
        }

        // On client-side navigation, session is already cached by Better Auth's cookie cache
        // No need to refetch unless we specifically need fresh data
    }

    const invalidateClientSession = () => {
        session.value = null
    }

    const signOut = async () => {
        const { csrf } = useCsrf()
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        invalidateClientSession()
                        navigateTo('/')
                    },
                    headers: {
                        'csrf-token': csrf
                    }
                }
            })
        } catch (error) {
            console.error('Sign out error:', error)
            // Still invalidate local session even if server request fails
            invalidateClientSession()
            navigateTo('/')
        }
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
