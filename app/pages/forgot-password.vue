<script setup lang="ts">
import z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const config = useRuntimeConfig()
const toast = useToast()
const { csrf } = useCsrf()

const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
}]

const schema = z.object({
    email: z.email('Invalid email format')
})

type Schema = z.output<typeof schema>

const serverError = ref('')
const submitting = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { data, error } = await authClient.requestPasswordReset({
        email: event.data.email,
        redirectTo: `${config.public.baseURL}/reset-password`,
        fetchOptions: {
            headers: {
                'csrf-token': csrf
            }
        }
    })

    if (error) {
        serverError.value = error.message || error.statusText
    } else {
        toast.add({
            title: 'Password reset requested',
            description: data?.message ?? 'We have emailed your password reset link',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
    }

    // TODO: try catch finally block
    submitting.value = false
}
</script>

<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :loading="submitting"
        :submit="{
            label: 'Email password reset link'
        }"
        title="Forgot password"
        icon="i-lucide-shield-question-mark"
        @submit="onSubmit"
    >
        <template #description>
            Enter your email address to receive a password reset link
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
