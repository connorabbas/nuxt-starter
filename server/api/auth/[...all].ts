export default defineEventHandler((event) => {
    logger.info('Auth API hit')
    return auth.handler(toWebRequest(event))
})
