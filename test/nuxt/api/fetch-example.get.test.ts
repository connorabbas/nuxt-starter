import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { actingAs, userFactory } from '../../helpers/auth'
import { expectDatabaseHas } from '../assertions'
import { users } from '~~/server/database/schema/auth'

describe('GET /api/app/fetch-example', async () => {
    await setup({
        server: true
    })

    it('returns 401 unauthenticated response with no user session', async () => {
        await expect($fetch('/api/app/fetch-example')).rejects.toMatchObject({
            statusCode: 401,
            data: {
                message: 'Invalid User Session, please log back in.'
            }
        })
    })

    it('returns authenticated response for user with unverified email on GET request', async () => {
        const user = await userFactory()
        const { cookie } = await actingAs(user)

        const response = await $fetch<{
            test: string
            user: { email: string }
            session: unknown
        }>('/api/app/fetch-example', {
            headers: {
                cookie
            }
        })

        expect(response.test).toBe('Example application API route')
        expect(response.user.email).toBe(user.email)
        expect(response.session).toBeTruthy()
        await expectDatabaseHas(users, { email: user.email, emailVerified: false })
    })

    it('returns authenticated response for logged in user', async () => {
        const user = await userFactory({ verified: true })
        const { cookie } = await actingAs(user)

        const response = await $fetch<{
            test: string
            user: { email: string }
            session: unknown
        }>('/api/app/fetch-example', {
            headers: {
                cookie
            }
        })

        expect(response.test).toBe('Example application API route')
        expect(response.user.email).toBe(user.email)
        expect(response.session).toBeTruthy()
        await expectDatabaseHas(users, { email: user.email, emailVerified: true })
    })
})
