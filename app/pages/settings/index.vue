<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings'
})

// TODO: check for email_updated query param, show message component

const authStore = useAuthStore()
const toast = useToast()
const { csrf } = useCsrf()

const updating = ref(false)
const serverError = ref('')
const settings = reactive({
    name: authStore.user?.name,
    email: authStore.user?.email
})

const settingsSchema = z.object({
    name: z.string('Please enter your name').min(2),
    email: z.email('Invalid email format')
})
type SettingsSchema = z.output<typeof settingsSchema>

async function submitSettings(event: FormSubmitEvent<SettingsSchema>) {
    if (updating.value) return
    updating.value = true
    serverError.value = ''

    try {
        const nameChanged = event.data.name !== authStore.user?.name
        const emailChanged = event.data.email !== authStore.user?.email

        if (!nameChanged && !emailChanged) {
            toast.add({
                title: 'Information was not updated',
                description: 'You entered the same profile information',
                color: 'info',
                icon: 'i-lucide-info'
            })
            return
        }

        // Update name if changed
        if (nameChanged) {
            const { error: nameError } = await authClient.updateUser({
                name: event.data.name,
                fetchOptions: {
                    headers: {
                        'csrf-token': csrf
                    }
                }
            })

            if (nameError) {
                serverError.value = nameError.message || nameError.statusText
                return
            }
        }

        // Update email if changed
        if (emailChanged) {
            const { error: emailError } = await authClient.changeEmail({
                newEmail: event.data.email,
                callbackURL: '/settings?email_updated=true',
                fetchOptions: {
                    headers: {
                        'csrf-token': csrf
                    }
                }
            })

            if (emailError) {
                serverError.value = emailError.message || emailError.statusText
                return
            }
        }

        // Fetch fresh session data
        await authStore.fetchFreshSession()

        // Show appropriate success message
        if (nameChanged && emailChanged) {
            toast.add({
                title: 'Settings updated successfully',
                description: 'Please check your inbox to verify your new email',
                color: 'success',
                icon: 'i-lucide-circle-check-big'
            })
        } else if (nameChanged) {
            toast.add({
                title: 'Your information has been updated',
                color: 'success',
                icon: 'i-lucide-circle-check-big'
            })
        } else if (emailChanged) {
            toast.add({
                title: 'Your email change request has been submitted',
                description: 'Please check your inbox',
                color: 'success',
                icon: 'i-lucide-circle-check-big'
            })
        }
    } finally {
        updating.value = false
    }
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
            title="Profile"
            description="Update your account information"
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
                :schema="settingsSchema"
                :state="settings"
                class="flex flex-col gap-4 max-w-sm"
                @submit="submitSettings"
            >
                <UFormField
                    name="name"
                    label="Name"
                >
                    <UInput
                        v-model="settings.name"
                        type="text"
                        placeholder="Your name"
                        class="w-full"
                    />
                </UFormField>

                <UFormField
                    name="email"
                    label="Email"
                >
                    <UInput
                        v-model="settings.email"
                        type="email"
                        placeholder="Your email"
                        class="w-full"
                    />
                </UFormField>

                <UButton
                    label="Update Settings"
                    class="w-fit"
                    type="submit"
                    :loading="updating"
                />
            </UForm>
        </UPageCard>
    </UContainer>
</template>
