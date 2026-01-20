<script setup lang="ts">
import z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const route = useRoute()
const toast = useToast()
const { csrf } = useCsrf()

const fields: AuthFormField[] = [{
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
}, {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    required: true
}]

const schema = z.object({
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const serverError = ref('')
const submitting = ref(false)
const token = route.query.token as string // TODO: Error UI is no token in URL
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.resetPassword({
        newPassword: event.data.password,
        token,
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
            title: 'Password successfully reset',
            description: 'You may now login with your new password',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
        navigateTo('/login')
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
            label: 'Reset password'
        }"
        title="Reset password"
        icon="i-lucide-user-lock"
        @submit="onSubmit"
    >
        <template #description>
            Please enter your new password below
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
