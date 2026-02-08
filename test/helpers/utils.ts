import { faker } from '@faker-js/faker'

export function createUniqueEmail(prefix = 'test') {
    const email = faker.internet.email().toLowerCase()
    const [localPart, domain] = email.split('@')

    return `${localPart}+${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@${domain}`
}
