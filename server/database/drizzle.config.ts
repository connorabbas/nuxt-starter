import { defineConfig } from 'drizzle-kit'
import { runtimeConfig } from '../utils/config'

export default defineConfig({
    schema: './server/database/schema/index.ts',
    out: './server/database/migrations',
    casing: 'snake_case',
    dialect: 'postgresql',
    dbCredentials: {
        url: runtimeConfig.databaseUrl
    },
    verbose: true,
    strict: true
})
