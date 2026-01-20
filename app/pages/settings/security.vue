<script setup lang="ts">
import z from 'zod'
import type { FormError } from '@nuxt/ui'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings'
})

// TODO: https://www.better-auth.com/docs/concepts/users-accounts#change-password
const passwordSchema = z.object({
    current: z.string().min(8, 'Must be at least 8 characters'),
    new: z.string('Please confirm your new password')
}).refine(data => data.current === data.new, {
    message: 'Password confirmation does not match',
    path: ['new']
})
type PasswordSchema = z.output<typeof passwordSchema>
const password = reactive<Partial<PasswordSchema>>({
    current: undefined,
    new: undefined
})

// TODO: probably remove? Use hook on better-auth backend
const validate = (state: Partial<PasswordSchema>): FormError[] => {
    const errors: FormError[] = []
    if (state.current && state.new && state.current === state.new) {
        errors.push({ name: 'new', message: 'Passwords must be different' })
    }
    return errors
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
            title="Password"
            description="Confirm your current password before setting a new one."
            variant="subtle"
        >
            <UForm
                :schema="passwordSchema"
                :state="password"
                :validate="validate"
                class="flex flex-col gap-4 max-w-sm"
            >
                <UFormField name="current">
                    <UInput
                        v-model="password.current"
                        type="password"
                        placeholder="Current password"
                        class="w-full"
                    />
                </UFormField>
                <UFormField name="new">
                    <UInput
                        v-model="password.new"
                        type="password"
                        placeholder="New password"
                        class="w-full"
                    />
                </UFormField>
                <UButton
                    label="Update"
                    class="w-fit"
                    type="submit"
                />
            </UForm>
        </UPageCard>
        <UPageCard
            title="Account"
            description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
            class="bg-gradient-to-tl from-error/10 from-5% to-default"
        >
            <template #footer>
                <UButton
                    label="Delete account"
                    color="error"
                />
            </template>
        </UPageCard>
    </UContainer>
</template>
