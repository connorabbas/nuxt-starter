import { updateExampleSettingsSchema } from '#shared/schemas/example-settings.schema'

export default defineEventHandler(async (event) => {
    // Extend the shared schema with server-side specific validations
    const serverSchema = updateExampleSettingsSchema.superRefine(async (data, ctx) => {
        // Check if phone is already taken by another user with data.phone value
        // Simulate checking the database or API call with falsy result...
        await new Promise(resolve => setTimeout(resolve, 500))
        const phoneNumberInUse = true
        if (phoneNumberInUse) {
            ctx.addIssue({
                code: 'custom',
                path: ['phone'],
                message: 'This phone number is already in use'
            })
        }
    })

    const data = await validateBody(event, serverSchema)

    return {
        message: 'Settings updated successfully',
        data
    }
})
