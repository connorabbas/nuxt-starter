export default defineEventHandler(async (event) => {
    const { user, session } = event.context

    return { user, session }
})
