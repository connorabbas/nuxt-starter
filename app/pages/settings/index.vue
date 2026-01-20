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

const config = useRuntimeConfig()
const authStore = useAuthStore()
const toast = useToast()
const { csrf } = useCsrf()

const updatingInfo = ref(false)
const infoServerError = ref('')
const info = reactive({
    name: authStore.user?.name
})
const infoSchema = z.object({
    name: z.string('Please enter your new password').min(2)
})
type InfoSchema = z.output<typeof infoSchema>
// https://www.better-auth.com/docs/concepts/users-accounts#update-user-information
async function submitInfo(event: FormSubmitEvent<InfoSchema>) {
    if (updatingInfo.value) return
    updatingInfo.value = true

    const { error } = await authClient.updateUser({
        name: event.data.name,
        fetchOptions: {
            headers: {
                'csrf-token': csrf
            }
        }
    })
    if (error) {
        infoServerError.value = error.message || error.statusText
    } else {
        toast.add({
            title: 'Your information has been updated',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
        await authStore.fetchFreshSession()
    }

    // TODO: try catch finally block
    updatingInfo.value = false
}

// TODO: email template check if new account or changing email for template verbiage
// TODO: why redirecting to dashboard?
const updatingEmail = ref(false)
const emailServerError = ref('')
const email = reactive({
    new: authStore.user?.email
})
const emailSchema = z.object({
    new: z.email('Invalid email format')
})
type EmailSchema = z.output<typeof emailSchema>
// https://www.better-auth.com/docs/concepts/users-accounts#change-email
async function submitEmail(event: FormSubmitEvent<EmailSchema>) {
    if (updatingEmail.value) return
    updatingEmail.value = true

    const { error } = await authClient.changeEmail({
        newEmail: event.data.new,
        callbackURL: '/settings?email_updated=true',
        fetchOptions: {
            headers: {
                'csrf-token': csrf
            }
        }
    })
    if (error) {
        emailServerError.value = error.message || error.statusText
    } else {
        await authStore.fetchFreshSession()
        toast.add({
            title: 'Your email change request has been submitted',
            description: 'Please check your inbox',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
        if (config.public.auth.mustVerifyEmail) {
            navigateTo({ name: 'verify-email', query: { email: event.data.new } })
        } else {
            navigateTo('/settings')
        }
    }

    // TODO: try catch finally block
    updatingEmail.value = false
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <!-- TODO: consolidate to one form/card -->
        <UPageCard
            title="Info"
            description="Update your information"
            variant="subtle"
            :ui="{
                header: 'w-full'
            }"
        >
            <template
                v-if="infoServerError"
                #header
            >
                <UAlert
                    color="error"
                    variant="subtle"
                    title="Error"
                    :description="infoServerError"
                    icon="i-lucide-circle-x"
                />
            </template>
            <UForm
                :schema="infoSchema"
                :state="info"
                class="flex flex-col gap-4 max-w-sm"
                @submit="submitInfo"
            >
                <UFormField name="name">
                    <UInput
                        v-model="info.name"
                        type="text"
                        placeholder="Your name"
                        class="w-full"
                    />
                </UFormField>
                <UButton
                    label="Update"
                    class="w-fit"
                    type="submit"
                    :loading="updatingInfo"
                />
            </UForm>
        </UPageCard>

        <UPageCard
            title="Email"
            description="Update your email address"
            variant="subtle"
            :ui="{
                header: 'w-full'
            }"
        >
            <template
                v-if="emailServerError"
                #header
            >
                <UAlert
                    color="error"
                    variant="subtle"
                    title="Error"
                    :description="emailServerError"
                    icon="i-lucide-circle-x"
                />
            </template>
            <UForm
                :schema="emailSchema"
                :state="email"
                class="flex flex-col gap-4 max-w-sm"
                @submit="submitEmail"
            >
                <UFormField name="email">
                    <UInput
                        v-model="email.new"
                        type="text"
                        placeholder="Your email"
                        class="w-full"
                    />
                </UFormField>
                <UButton
                    label="Update"
                    class="w-fit"
                    type="submit"
                    :loading="updatingEmail"
                />
            </UForm>
        </UPageCard>
    </UContainer>
</template>
