import type { H3Event } from 'h3'
import { type z, ZodError } from 'zod'
import type { ApiFormError } from '#shared/types/api'

export function sendValidationError(event: H3Event, error: ZodError) {
    const errors: ApiFormError[] = error.issues.map(issue => ({
        name: issue.path.join('.'),
        message: issue.message
    }))

    throw createError({
        status: 422,
        message: 'Invalid input provided, please try again.',
        data: errors
    })
}

export async function validateBody<T extends z.ZodType>(
    event: H3Event,
    schema: T
): Promise<z.infer<T>> {
    const body = await readBody(event)
    try {
        return await schema.parseAsync(body)
    } catch (err) {
        if (err instanceof ZodError) {
            sendValidationError(event, err)
        }
        throw err
    }
}
