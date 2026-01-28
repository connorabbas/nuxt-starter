<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings'
})

const authStore = useAuthStore()
const toast = useToast()
const { csrf } = useCsrf()
const route = useRoute()
const router = useRouter()

// TODO: check for error param (user_not_found)
// Check for email verification success
const showEmailUpdatedAlert = ref(false)
onMounted(() => {
    if (route.query.email_updated === 'true') {
        showEmailUpdatedAlert.value = true
    }
})
function dismissEmailAlert() {
    showEmailUpdatedAlert.value = false
    router.replace({ query: { ...route.query, email_updated: undefined } })
}

const updating = ref(false)
const settings = reactive({
    name: authStore.user?.name,
    email: authStore.user?.email
})

const settingsSchema = z.object({
    name: z.string('Please enter your name').min(2),
    email: z.email('Invalid email format')
})
type SettingsSchema = z.output<typeof settingsSchema>

const form = useTemplateRef('form')

async function submitSettings(event: FormSubmitEvent<SettingsSchema>) {
    if (updating.value) return
    updating.value = true

    try {
        const nameChanged = event.data.name !== authStore.user?.name
        const emailChanged = event.data.email !== authStore.user?.email

        // Update name if changed
        if (nameChanged) {
            const { error: nameError } = await authClient.updateUser({
                name: event.data.name,
                fetchOptions: {
                    headers: { 'csrf-token': csrf }
                }
            })
            if (
                nameError
                && nameError.status === 422
                && nameError?.message
            ) {
                form.value?.setErrors([{ name: 'name', message: nameError.message }])
                return
            }
        }

        // Update email if changed
        if (emailChanged) {
            const { error: emailError } = await authClient.changeEmail({
                newEmail: event.data.email,
                callbackURL: '/settings?email_updated=true',
                fetchOptions: {
                    headers: { 'csrf-token': csrf }
                }
            })
            if (
                emailError
                && emailError.status === 422
                && emailError?.message
            ) {
                form.value?.setErrors([{ name: 'email', message: emailError.message }])
                return
            }
        }

        // Fetch fresh session data
        await authStore.fetchFreshSession()

        // Show appropriate success message
        if (nameChanged && emailChanged) {
            toast.add({
                title: 'Settings successfully updated',
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
    } catch (err) {
        console.error('Updating user/email error:', err)
    } finally {
        updating.value = false
    }
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <UAlert
            v-if="showEmailUpdatedAlert"
            color="success"
            variant="subtle"
            title="New email successfully verified"
            description="Your email address has been updated"
            icon="i-lucide-circle-check-big"
            close
            @update:open="dismissEmailAlert"
        />

        <UPageCard
            title="Profile"
            description="Update your account information"
            variant="subtle"
            :ui="{
                header: 'w-full'
            }"
        >
            <UForm
                ref="form"
                :schema="settingsSchema"
                :state="settings"
                :validate-on="[]"
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
                    label="Save changes"
                    class="w-fit"
                    type="submit"
                    :loading="updating"
                />
            </UForm>
        </UPageCard>
    </UContainer>
</template>
