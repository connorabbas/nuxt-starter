import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { runtimeConfig } from './config'
import * as schema from '../database/schema'

const db = drizzle({
    connection: {
        connectionString: runtimeConfig.databaseUrl
    },
    casing: 'snake_case',
    schema
})

export default db
