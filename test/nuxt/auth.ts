import { betterAuth, type User } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { faker } from '@faker-js/faker'
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

type NonEditableUserFields = 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'
type EditableUserFields = Omit<User, NonEditableUserFields>

export type UserFactoryInput = Partial<EditableUserFields> & {
    password?: string
    verified?: boolean
}

export type TestAuthUser = User & {
    password: string
}

type CreateTestUserInput = Pick<EditableUserFields, 'name' | 'email'> & {
    password: string
    image?: User['image']
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

function buildTestUser(input: Omit<UserFactoryInput, 'verified'> = {}): CreateTestUserInput {
    return {
        name: input.name ?? faker.person.fullName(),
        email: input.email ?? faker.internet.email().toLowerCase(),
        password: input.password ?? 'password123456',
        image: input.image ?? faker.image.avatar()
    }
}

export async function createTestUser(user: CreateTestUserInput, verified = false): Promise<TestAuthUser> {
    await testAuth.api.signUpEmail({
        body: {
            name: user.name,
            email: user.email,
            password: user.password
        }
    })

    const updateData: Partial<typeof users.$inferInsert> = {}

    if (verified) {
        updateData.emailVerified = true
    }

    if (typeof user.image !== 'undefined') {
        updateData.image = user.image
    }

    if (Object.keys(updateData).length > 0) {
        await testDb
            .update(users)
            .set(updateData)
            .where(eq(users.email, user.email))
    }

    const [createdUser] = await testDb
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1)

    if (!createdUser) {
        throw new Error(`Unable to create test user for email: ${user.email}`)
    }

    return {
        ...createdUser,
        password: user.password
    }
}

export async function userFactory(input: UserFactoryInput = {}): Promise<TestAuthUser> {
    const { verified = false, ...overrides } = input
    const user = buildTestUser(overrides)

    return await createTestUser(user, verified)
}

export async function actingAs(user: TestAuthUser) {
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
