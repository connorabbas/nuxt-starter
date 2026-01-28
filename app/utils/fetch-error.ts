import type { FetchError } from 'ofetch'
import type { ApiFormError } from '#shared/types/api'

/**
 * Type guard to check if error is a FetchError from ofetch
 */
export function isFetchError(error: unknown): error is FetchError {
    return (
        error !== null &&
        typeof error === 'object' &&
        'status' in error &&
        'statusCode' in error &&
        'data' in error
    )
}

/**
 * Type guard to check if error data contains form validation errors
 */
export function isValidationErrorData(data: unknown): data is ApiFormError[] {
    return (
        Array.isArray(data) &&
        data.length > 0 &&
        data.every(
            (item) =>
                typeof item === 'object' &&
                item !== null &&
                'name' in item &&
                'message' in item &&
                typeof item.name === 'string' &&
                typeof item.message === 'string'
        )
    )
}

/**
 * Extract validation errors from a fetch error with proper type checking
 */
export function extractValidationErrors(error: unknown): ApiFormError[] | null {
    // First check if it's a FetchError
    if (!isFetchError(error)) {
        return null
    }

    // Check if it's a 422 validation error
    if (error.status !== 422 && error.statusCode !== 422) {
        return null
    }

    // Extract the data - could be nested in error.data.data or directly in error.data
    const data = error.data?.data ?? error.data

    // Validate the structure
    if (isValidationErrorData(data)) {
        return data
    }

    return null
}

/**
 * Type guard to check if a FetchError is specifically a validation error (422)
 */
export function isValidationError(error: unknown): error is FetchError {
    return (
        isFetchError(error) &&
        (error.status === 422 || error.statusCode === 422) &&
        isValidationErrorData(error.data?.data ?? error.data)
    )
}
