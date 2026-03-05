export function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
    if (typeof value === 'undefined') {
        return defaultValue
    }

    const normalizedValue = value.trim().toLowerCase()

    if (['1', 'true'].includes(normalizedValue)) {
        return true
    }

    if (['0', 'false'].includes(normalizedValue)) {
        return false
    }

    return defaultValue
}
