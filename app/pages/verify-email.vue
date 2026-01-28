<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { z } from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const toast = useToast()
const route = useRoute()
const { csrf } = useCsrf()

const presetEmail = route.query.email as string
const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    defaultValue: presetEmail,
    placeholder: 'Enter your email',
    required: true
}]

const schema = z.object({
    email: z.email('Invalid email format')
})
type VerifyEmailSchema = z.output<typeof schema>

const serverError = ref('')
const submitting = ref(false)

async function onSubmit(event: FormSubmitEvent<VerifyEmailSchema>) {
    if (submitting.value) return
    submitting.value = true
    serverError.value = ''

    try {
        const { error } = await authClient.sendVerificationEmail({
            email: event.data.email,
            callbackURL: '/dashboard?welcome=true',
            fetchOptions: {
                headers: { 'csrf-token': csrf }
            }
        })

        if (error) {
            serverError.value = error.message || error.statusText
            return
        }

        toast.add({
            title: 'Verification email has been resent',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
    } catch (err) {
        serverError.value = 'An unexpected error occurred. Please try again.'
        console.error('Send verification email error:', err)
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :loading="submitting"
        :submit="{
            label: 'Resend verification email'
        }"
        title="Please verify your email"
        icon="i-lucide-user-check"
        @submit="onSubmit"
    >
        <template #description>
            <div class="flex flex-col gap-2 text-sm">
                <div>
                    Almost there, we sent you an email to verify your email address. Just click the link in that email
                    to
                    complete the signup and login to your account.
                </div>
                <div>
                    You may need to check your <span class="font-bold">spam folder</span>.
                </div>
                <div>
                    Still can't find the email?
                </div>
            </div>
        </template>
        <template #validation>
            <UAlert
                v-if="serverError"
                color="error"
                variant="subtle"
                title="Error"
                :description="serverError"
                icon="i-lucide-circle-x"
            />
        </template>
    </UAuthForm>
</template>
