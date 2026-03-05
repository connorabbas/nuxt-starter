import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { drizzle } from 'drizzle-orm/node-postgres'
import { and, eq, getTableColumns, getTableName, sql } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import type { AnyPgTable } from 'drizzle-orm/pg-core'
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

export type DatabaseWhere<TTable extends AnyPgTable> = Partial<InferSelectModel<TTable>>

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

export async function databaseHas<TTable extends AnyPgTable>(
    table: TTable,
    where: DatabaseWhere<TTable>
) {
    const entries = Object.entries(where).filter(([, value]) => value !== undefined)

    if (entries.length === 0) {
        throw new Error('databaseHas requires at least one where condition')
    }

    const columns = getTableColumns(table)
    const filters = entries.map(([key, value]) => {
        const column = columns[key as keyof typeof columns]

        if (!column) {
            throw new Error(`Unknown column '${key}' for table '${getTableName(table)}'`)
        }

        return eq(column, value)
    })

    const rows = await testDb
        .select()
        .from(table as never)
        .where(and(...filters))
        .limit(1)

    return rows.length > 0
}

export async function closeTestDb() {
    await pool.end()
}
