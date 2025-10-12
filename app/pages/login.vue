<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const config = useRuntimeConfig()
const route = useRoute()

const schema = z.object({
    email: z.email('Invalid email format'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    rememberMe: z.boolean().optional()
})

type Schema = z.output<typeof schema>

const showPw = ref(false)
const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
    rememberMe: true
})

const serverError = ref('')
const submitting = ref(false)
const redirectTo = computed(() => {
    const redirect = route.query.redirect as string
    return redirect || '/dashboard'
})
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.signIn.email({
        email: event.data.email,
        password: event.data.password,
        rememberMe: event.data.rememberMe,
        callbackURL: redirectTo.value
    })

    if (error) {
        const errMessage = error.message || error.statusText
        if (config.public.auth.mustVerifyEmail && error.code === 'EMAIL_NOT_VERIFIED') {
            navigateTo({ name: 'verify-email', query: { email: event.data.email } })
        } else {
            serverError.value = errMessage
        }
    }

    submitting.value = false
}
</script>

<template>
    <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
    >
        <div class="flex flex-col text-center">
            <div class="text-xl text-pretty font-semibold text-highlighted">Welcome back</div>
            <div class="mt-1 text-sm text-pretty text-muted">
                Don't have an account? <ULink
                    to="/sign-up"
                    class="text-primary hover:underline"
                >Sign up</ULink>.
            </div>
        </div>

        <UAlert
            v-if="serverError"
            color="error"
            variant="subtle"
            title="Error"
            :description="serverError"
            icon="i-lucide-circle-x"
        />

        <UFormField
            label="Email"
            name="email"
            autocomplete="email"
            required
        >
            <UInput
                v-model="state.email"
                type="email"
                placeholder="Enter your email"
                class="w-full"
            />
        </UFormField>

        <UFormField
            label="Password"
            name="password"
            autocomplete="current-password"
            required
        >
            <template #hint>
                <ULink
                    to="/forgot-password"
                    class="text-primary hover:underline"
                >
                    Forgot your password?
                </ULink>
            </template>
            <UInput
                v-model="state.password"
                placeholder="Enter your password"
                class="w-full"
                :type="showPw ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }"
            >
                <template #trailing>
                    <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        :icon="showPw ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showPw ? 'Hide password' : 'Show password'"
                        :aria-pressed="showPw"
                        aria-controls="password"
                        @click="showPw = !showPw"
                    />
                </template>
            </UInput>
        </UFormField>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <UFormField name="rememberMe">
                <UCheckbox
                    v-model="state.rememberMe"
                    label="Remember me"
                />
            </UFormField>
        </div>

        <UButton
            label="Log in"
            type="submit"
            class="w-full flex justify-center"
            :disabled="submitting"
            :loading="submitting"
        />
    </UForm>
</template>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
    display: none;
}
</style>
