import { authClient } from '~/lib/auth-client'
import type { User, Session } from 'better-auth'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    interface SessionData {
        user: User
        session: Session
    }

    const config = useRuntimeConfig()

    const session = ref<SessionData | null>(null)
    const isPending = ref(false)
    const sessionPromise = ref<Promise<void> | null>(null)

    const user = computed<User | null>(() => session.value?.user ?? null)
    const loading = computed(() => isPending.value)
    const isAuthenticated = computed(() => !!session.value?.session)

    // For initial load and reactive updates
    // Uses Better Auth's cookie cache by default
    async function fetchSession() {
        isPending.value = true
        try {
            const data = await authClient.useSession(useFetch)
            session.value = data.data.value
        } catch (err) {
            console.error('Fetch session error:', err)
            session.value = null
        } finally {
            isPending.value = false
        }
    }

    // Get fresh session from the database (bypasses cookie cache)
    async function fetchFreshSession() {
        isPending.value = true
        try {
            const freshData = await authClient.getSession({
                query: {
                    disableCookieCache: true // Force database fetch
                }
            })
            session.value = freshData.data
        } catch (err) {
            console.error('Fetch fresh session error:', err)
            session.value = null
        } finally {
            isPending.value = false
        }
    }

    // Session check (for middleware) with race condition prevention
    async function ensureSession() {
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

        // On client-side navigation, session is cached by Better Auth's cookie cache
        // Used if we specifically want fresh data on each page request
        if (import.meta.client && !config.public.auth.sessionCookieCacheTTL) {
            await fetchFreshSession()
        }
    }

    function invalidateClientSession() {
        session.value = null
    }

    async function signOut() {
        const { csrf } = useCsrf()
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        invalidateClientSession()
                        navigateTo('/')
                    },
                    headers: { 'csrf-token': csrf }
                }
            })
        } catch (err) {
            console.error('Sign out error:', err)
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
