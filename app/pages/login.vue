<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const config = useRuntimeConfig()
const route = useRoute()
const { csrf } = useCsrf()

const fields: AuthFormField[] = [{
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
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
    defaultValue: true
}]

// TODO: GitHub Auth
/* const providers = [{
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
        toast.add({ title: 'GitHub', description: 'TODO: Login with GitHub' })
    }
}] */

const schema = z.object({
    email: z.email('Invalid email format'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    rememberMe: z.boolean().optional()
})

type Schema = z.output<typeof schema>

const serverError = ref('')
const submitting = ref(false)
const redirectTo = computed(() => {
    const redirect = route.query.redirect as string
    return redirect || '/dashboard'
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true
    serverError.value = ''

    try {
        const { error } = await authClient.signIn.email({
            email: event.data.email,
            password: event.data.password,
            rememberMe: event.data.rememberMe,
            callbackURL: redirectTo.value,
            fetchOptions: {
                headers: { 'csrf-token': csrf }
            }
        })

        if (error) {
            if (config.public.auth.mustVerifyEmail && error.code === 'EMAIL_NOT_VERIFIED') {
                navigateTo({ name: 'verify-email', query: { email: event.data.email } })
                return
            }
            serverError.value = error.message || error.statusText
            return
        }
    } catch (error) {
        serverError.value = 'An unexpected error occurred. Please try again.'
        console.error('Login error:', error)
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="[]"
        :loading="submitting"
        title="Welcome back!"
        icon="i-lucide-lock"
        @submit="onSubmit"
    >
        <template #description>
            Don't have an account? <ULink
                to="/sign-up"
                class="text-primary font-medium"
            >Sign up</ULink>.
        </template>
        <template #password-hint>
            <ULink
                to="/forgot-password"
                class="text-primary font-medium"
                tabindex="-1"
            >Forgot password?</ULink>
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
