import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './server/database/schema/index.ts',
    out: './server/database/migrations',
    casing: 'snake_case',
    dialect: 'postgresql',
    dbCredentials: {
        url: `postgres://${process.env.NUXT_DB_USERNAME}:${process.env.NUXT_DB_PASSWORD}` +
            `@${process.env.NUXT_DB_HOST}:${process.env.NUXT_DB_PORT}/${process.env.NUXT_DB_DATABASE}`
    },
    verbose: true,
    strict: true
})
