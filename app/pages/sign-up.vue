<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { z } from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

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

// TODO: password enhancement: https://www.better-auth.com/docs/authentication/email-password#configuration
const schema = z.object({
    name: z.string('Name is required').min(5),
    email: z.email('Invalid email format'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmPassword']
})
type SignUpSchema = z.output<typeof schema>

const form = useTemplateRef('form')

const generalError = ref('')
const submitting = ref(false)

async function onSubmit(event: FormSubmitEvent<SignUpSchema>) {
    if (submitting.value) return
    submitting.value = true
    generalError.value = ''

    try {
        const { error } = await authClient.signUp.email({
            name: event.data.name,
            email: event.data.email,
            password: event.data.password,
            callbackURL: '/dashboard?success_message=welcome',
            fetchOptions: {
                headers: { 'csrf-token': csrf }
            }
        })

        if (
            error
            && error.status >= 400
            && error.status < 500
            && error?.code
            && error?.message
        ) {
            if (error.code.toLowerCase().includes('password')) {
                form.value?.formRef?.setErrors([{ name: 'password', message: error.message }])
                return
            }
            if (error.code.toLowerCase().includes('email')) {
                form.value?.formRef?.setErrors([{ name: 'email', message: error.message }])
                return
            }
        }

        if (error) {
            generalError.value = error.message || error.statusText
            return
        }

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
    } catch (err) {
        generalError.value = 'An unexpected error occurred. Please try again.'
        console.error('Sign up error:', err)
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <UAuthForm
        ref="form"
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
                v-if="generalError"
                color="error"
                variant="subtle"
                title="Error"
                :description="generalError"
                icon="i-lucide-circle-x"
            />
        </template>
    </UAuthForm>
</template>
