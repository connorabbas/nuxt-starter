import { z } from 'zod'

export const updateExampleSettingsSchema = z.object({
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().length(2, 'State must be 2 characters').toUpperCase(),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format: (123) 456-7890'),
    address: z.string().min(5, 'Address must be at least 5 characters').optional(),
    address2: z.string().optional()
})

export type UpdateExampleSettingsInput = z.infer<typeof updateExampleSettingsSchema>
