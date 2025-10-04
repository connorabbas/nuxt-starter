import db from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
    console.log(event)
    const users = await db.query.users.findMany()
    return users
})
