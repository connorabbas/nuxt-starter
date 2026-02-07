import { and, eq, getTableColumns, getTableName } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import type { AnyPgTable } from 'drizzle-orm/pg-core'
import { expect } from 'vitest'
import { testDb } from '../helpers/db'

type DatabaseWhere<TTable extends AnyPgTable> = Partial<InferSelectModel<TTable>>

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

export async function expectDatabaseHas<TTable extends AnyPgTable>(
    table: TTable,
    where: DatabaseWhere<TTable>
) {
    const exists = await databaseHas(table, where)
    expect(exists).toBe(true)
}
