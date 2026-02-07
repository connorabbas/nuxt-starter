import type { AnyPgTable } from 'drizzle-orm/pg-core'
import { expect } from 'vitest'
import { databaseHas, type DatabaseWhere } from '../helpers/db'

export async function expectDatabaseHas<TTable extends AnyPgTable>(
    table: TTable,
    where: DatabaseWhere<TTable>
) {
    const exists = await databaseHas(table, where)
    expect(exists).toBe(true)
}
