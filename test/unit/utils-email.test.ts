import { describe, expect, it } from 'vitest'
import { createUniqueEmail } from '../helpers/utils'

describe('createUniqueEmail', () => {
    it('uses default prefix and valid email shape', () => {
        const email = createUniqueEmail()

        expect(email).toContain('@')
        expect(email).toContain('+test-')
        expect(email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    })

    it('uses custom prefix', () => {
        const email = createUniqueEmail('ci-check')

        expect(email).toContain('+ci-check-')
    })
})
