import type { User } from 'better-auth'
import { createAuthClient } from 'better-auth/vue'

const authClient = createAuthClient()

export const useAuthStore = defineStore('useAuthStore', () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)

    async function init() {
        const data = await authClient.useSession(useFetch)
        session.value = data
    }

    const user = computed<User | undefined>(() => session.value?.data?.user)
    const loading = computed<boolean | undefined>(() => session.value?.isPending)

    async function signIn() {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/dashboard',
            errorCallbackURL: '/error',
            fetchOptions: {
                headers
            }
        })
    }

    async function signOut() {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        await authClient.signOut({
            fetchOptions: {
                headers
            }
        })
        navigateTo('/')
    }

    return {
        user,
        session,
        loading,
        init,
        signIn,
        signOut
    }
})
