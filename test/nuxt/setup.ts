import { afterAll, beforeAll, beforeEach } from 'vitest'
import { closeTestDb, migrateTestDb, truncateAllTables } from '../helpers/db'

beforeAll(async () => {
    await migrateTestDb()
})

beforeEach(async () => {
    await truncateAllTables()
})

afterAll(async () => {
    await truncateAllTables()
    await closeTestDb()
})
