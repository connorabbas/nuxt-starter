import { createAuthClient } from 'better-auth/vue'

// https://www.better-auth.com/docs/concepts/client
export const authClient = createAuthClient({
    //baseURL: process.env.NUXT_APP_URL! // TODO: not working?
})
