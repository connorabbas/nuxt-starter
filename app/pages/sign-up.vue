<script setup lang="ts">
import z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const config = useRuntimeConfig()
const { csrf } = useCsrf()
const toast = useToast()

const fields: AuthFormField[] = [{
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true
}, {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
}, {
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
    name: z.string('Name is required').min(5),
    email: z.email('Invalid email format'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const serverError = ref('')
const submitting = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.signUp.email({
        name: event.data.name,
        email: event.data.email,
        password: event.data.password,
        callbackURL: '/dashboard?welcome=true',
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
            title: 'Successfully signed up',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
        if (config.public.auth.mustVerifyEmail) {
            navigateTo({ name: 'verify-email', query: { email: event.data.email } })
        } else {
            navigateTo('/dashboard')
        }
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
            label: 'Submit'
        }"
        title="Create an account"
        icon="i-lucide-user-plus"
        @submit="onSubmit"
    >
        <template #description>
            Already have an account? <ULink
                to="/login"
                class="text-primary font-medium"
            >Sign in</ULink>.
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
