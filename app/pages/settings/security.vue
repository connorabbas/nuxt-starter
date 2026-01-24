<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Password Settings'
})

const toast = useToast()
const { csrf } = useCsrf()
const authStore = useAuthStore()

const updating = ref(false)
const serverError = ref('')
const isDeleteModalOpen = ref(false)
const deleting = ref(false)
const deleteError = ref('')

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
                headers: { 'csrf-token': csrf }
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

        // Fetch fresh session data
        await authStore.fetchFreshSession()

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

async function handleDeleteAccount() {
    if (deleting.value) return
    deleting.value = true
    deleteError.value = ''

    try {
        const { error } = await authClient.deleteUser({
            callbackURL: '/?account_deleted=true',
            fetchOptions: {
                headers: { 'csrf-token': csrf }
            }
        })

        if (error) {
            deleteError.value = error.message || error.statusText
            return
        }

        isDeleteModalOpen.value = false
        toast.add({
            title: 'Verification email sent',
            description: 'Please check your inbox to confirm your account deletion',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
    } catch (error) {
        deleteError.value = 'An unexpected error occurred. Please try again.'
        console.error('Delete account error:', error)
    } finally {
        deleting.value = false
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

        <UPageCard
            title="Account"
            description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
            class="bg-gradient-to-tl from-error/10 from-5% to-default"
        >
            <template #footer>
                <UButton
                    label="Delete account"
                    color="error"
                    @click="isDeleteModalOpen = true"
                />
            </template>
        </UPageCard>

        <!-- Delete Account Confirmation Modal -->
        <UModal
            v-model:open="isDeleteModalOpen"
            title="Delete Account"
            description="Please confirm you would like to delete your account"
        >
            <template #body>
                <div class="space-y-4 text-sm">
                    <p>
                        Are you sure you want to delete your account? This action cannot be undone and will permanently
                        delete:
                    </p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Your profile and account information</li>
                        <li>All your data and settings</li>
                        <li>Your access to all services</li>
                    </ul>
                    <p class="font-medium">
                        We'll send a verification email to
                        <span class="font-semibold">{{ authStore.user?.email }}</span>
                        for you to confirm this action.
                    </p>
                    <UAlert
                        v-if="deleteError"
                        :description="deleteError"
                        color="error"
                        variant="subtle"
                        title="Error"
                        icon="i-lucide-circle-x"
                    />
                </div>
            </template>

            <template #footer>
                <UButton
                    label="Send verification email"
                    color="error"
                    icon="i-lucide-mail"
                    :loading="deleting"
                    @click="handleDeleteAccount"
                />
            </template>
        </UModal>
    </UContainer>
</template>
