import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { drizzle } from 'drizzle-orm/node-postgres'
import { getTableName, sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from '../../server/database/schema'

dotenvExpand.expand(dotenv.config({ path: '.env.test', override: true }))

const connectionString = `postgres://${process.env.NUXT_DB_USERNAME}:${process.env.NUXT_DB_PASSWORD}@${process.env.NUXT_DB_HOST}:${process.env.NUXT_DB_PORT}/${process.env.NUXT_DB_DATABASE}`

const pool = new Pool({
    connectionString
})

export const testDb = drizzle({
    client: pool,
    casing: 'snake_case',
    schema
})

function getSchemaTableNames() {
    const names = Object.values(schema).flatMap((value) => {
        try {
            return [getTableName(value as never)]
        } catch {
            return []
        }
    })

    return [...new Set(names)]
        .filter(name => name && name !== '__drizzle_migrations')
}

export async function migrateTestDb() {
    await migrate(testDb, {
        migrationsFolder: './server/database/migrations'
    })
}

export async function truncateAllTables() {
    const tableNames = getSchemaTableNames()
    if (tableNames.length === 0) return

    const list = tableNames
        .map(name => `"public"."${name}"`)
        .join(', ')

    await testDb.execute(sql.raw(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`))
}

export async function closeTestDb() {
    await pool.end()
}
