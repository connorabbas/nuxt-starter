import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { actingAs, userFactory } from '../../helpers/auth'

describe('PUT /api/app/form-validation-example', async () => {
    await setup({
        server: true
    })

    const payload = {
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        phone: '(123) 456-7890',
        address: '123 Main Street'
    }

    it('returns 401 unauthenticated response with no user session', async () => {
        await expect($fetch('/api/app/form-validation-example', {
            method: 'PUT',
            body: payload
        })).rejects.toMatchObject({
            statusCode: 401,
            data: {
                message: 'Invalid User Session, please log back in.'
            }
        })
    })

    it('returns 403 for authenticated user with unverified email', async () => {
        const user = await userFactory()
        const { cookie } = await actingAs(user)

        await expect($fetch('/api/app/form-validation-example', {
            method: 'PUT',
            headers: {
                cookie
            },
            body: payload
        })).rejects.toMatchObject({
            statusCode: 403,
            data: {
                message: 'Email verification is required to perform this action.'
            }
        })
    })

    it('allows verified user submission with expected 422 validation error', async () => {
        const user = await userFactory({ verified: true })
        const { cookie } = await actingAs(user)

        await expect($fetch('/api/app/form-validation-example', {
            method: 'PUT',
            headers: {
                cookie
            },
            body: payload
        })).rejects.toMatchObject({
            statusCode: 422
        })
    })
})
