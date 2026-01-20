<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Password Settings'
})

const toast = useToast()
const { csrf } = useCsrf()

const updating = ref(false)
const serverError = ref('')

const passwordSchema = z.object({
    current: z.string().min(8, 'Must be at least 8 characters'),
    new: z.string().min(8, 'Must be at least 8 characters'),
    confirm: z.string().min(8, 'Must be at least 8 characters')
}).refine(data => data.new === data.confirm, {
    message: 'Password confirmation does not match',
    path: ['confirm']
}).refine(data => data.current !== data.new, {
    message: 'New password must be different from current password',
    path: ['new']
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
    current: undefined,
    new: undefined,
    confirm: undefined
})

async function submitNewPassword(event: FormSubmitEvent<PasswordSchema>) {
    if (updating.value) return
    updating.value = true
    serverError.value = ''

    try {
        const { error } = await authClient.changePassword({
            newPassword: event.data.new,
            currentPassword: event.data.current,
            revokeOtherSessions: true,
            fetchOptions: {
                headers: {
                    'csrf-token': csrf
                }
            }
        })

        if (error) {
            serverError.value = error.message || error.statusText
            return
        }

        // Success - clear form and show toast
        password.current = undefined
        password.new = undefined
        password.confirm = undefined

        toast.add({
            title: 'Password successfully updated',
            description: 'All other sessions have been revoked',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
    } catch (error) {
        serverError.value = 'An unexpected error occurred. Please try again.'
        console.error('Password change error:', error)
    } finally {
        updating.value = false
    }
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
            title="Password"
            description="Confirm your current password before setting a new one."
            variant="subtle"
            :ui="{
                header: 'w-full'
            }"
        >
            <template
                v-if="serverError"
                #header
            >
                <UAlert
                    color="error"
                    variant="subtle"
                    title="Error"
                    :description="serverError"
                    icon="i-lucide-circle-x"
                />
            </template>
            <UForm
                :schema="passwordSchema"
                :state="password"
                class="flex flex-col gap-4 max-w-sm"
                @submit="submitNewPassword"
            >
                <UFormField
                    name="current"
                    label="Current Password"
                >
                    <UInput
                        v-model="password.current"
                        type="password"
                        placeholder="Enter current password"
                        class="w-full"
                    />
                </UFormField>
                <UFormField
                    name="new"
                    label="New Password"
                >
                    <UInput
                        v-model="password.new"
                        type="password"
                        placeholder="Enter new password"
                        class="w-full"
                    />
                </UFormField>
                <UFormField
                    name="confirm"
                    label="Confirm New Password"
                >
                    <UInput
                        v-model="password.confirm"
                        type="password"
                        placeholder="Confirm new password"
                        class="w-full"
                    />
                </UFormField>
                <UButton
                    label="Update Password"
                    class="w-fit"
                    type="submit"
                    :loading="updating"
                />
            </UForm>
        </UPageCard>

        <!-- TODO: https://www.better-auth.com/docs/concepts/users-accounts#delete-user -->
        <!-- <UPageCard
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
        </UPageCard> -->
    </UContainer>
</template>
