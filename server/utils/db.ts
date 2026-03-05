import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../database/schema'

const connectionString = `postgres://${process.env.NUXT_DB_USERNAME}:${process.env.NUXT_DB_PASSWORD}@${process.env.NUXT_DB_HOST}:${process.env.NUXT_DB_PORT}/${process.env.NUXT_DB_DATABASE}`

export default drizzle({
    connection: connectionString,
    casing: 'snake_case',
    schema
})

export { schema }
