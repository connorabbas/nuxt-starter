import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../database/schema'

const db = drizzle({
    connection: {
        connectionString: useRuntimeConfig().databaseUrl
    },
    casing: 'snake_case',
    schema
})

export default db
