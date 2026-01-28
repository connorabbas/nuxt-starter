import type { FormError } from '@nuxt/ui'

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
    message: string
    statusCode: number
    data?: FormError[] | Record<string, any>
}

/**
 * Strongly typed FormError with required fields
 */
export type ApiFormError = Required<FormError>
