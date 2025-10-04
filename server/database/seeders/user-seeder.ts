import { seed } from 'drizzle-seed'
import { users } from '../schema/auth'
import db from '../../utils/db'

async function seedUsers() {
    await seed(db, { users }, { count: 100 })
}

seedUsers()
