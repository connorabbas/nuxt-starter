import { randomUUID } from 'node:crypto'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema/auth'
import { testDb } from '../helpers/db'

const testAuth = betterAuth({
    appName: process.env.NUXT_APP_NAME || 'Nuxt Starter',
    baseURL: process.env.NUXT_APP_URL || 'http://localhost:3000',
    trustedOrigins: [process.env.NUXT_APP_URL || 'http://localhost:3000'],
    secret: process.env.NUXT_BETTER_AUTH_SECRET,
    database: drizzleAdapter(testDb, {
        provider: 'pg',
        usePlural: true
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    }
})

export interface TestUserInput {
    name?: string
    email?: string
    password?: string
    verified?: boolean
}

export interface TestUser {
    name: string
    email: string
    password: string
}

interface CreateTestUserOptions {
    verified?: boolean
}

function makeCookieHeader(headers: Headers) {
    const cookies = typeof headers.getSetCookie === 'function'
        ? headers.getSetCookie()
        : (headers.get('set-cookie') ? [headers.get('set-cookie') as string] : [])

    const values = cookies
        .map(cookie => cookie.split(';')[0])
        .filter(Boolean)

    return values.join('; ')
}

function buildTestUser(input: TestUserInput = {}): TestUser {
    const token = randomUUID()
    return {
        name: input.name ?? `Test User ${token.slice(0, 8)}`,
        email: input.email ?? `test-${token}@example.com`,
        password: input.password ?? 'password1234'
    }
}

export async function createTestUser(user: TestUser, options: CreateTestUserOptions = {}) {
    await testAuth.api.signUpEmail({
        body: {
            name: user.name,
            email: user.email,
            password: user.password
        }
    })

    if (options.verified) {
        await testDb
            .update(users)
            .set({ emailVerified: true })
            .where(eq(users.email, user.email))
    }

    return user
}

export async function userFactory(input: TestUserInput = {}) {
    const user = buildTestUser(input)

    return await createTestUser(user, { verified: input.verified })
}

export async function actingAs(user: TestUser) {
    const signIn = await testAuth.api.signInEmail({
        body: {
            email: user.email,
            password: user.password
        },
        returnHeaders: true
    })

    return {
        user,
        cookie: makeCookieHeader(signIn.headers)
    }
}
