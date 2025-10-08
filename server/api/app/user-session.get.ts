export default defineEventHandler(async (event) => {
    // TODO: types for context data
    const { user, session } = event.context

    return { user, session }
})
