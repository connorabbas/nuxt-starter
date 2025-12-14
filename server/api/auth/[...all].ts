export default defineEventHandler((event) => {
    const url = getRequestURL(event)
    console.log('auth server', url.pathname)
    return auth.handler(toWebRequest(event))
})
