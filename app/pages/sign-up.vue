<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const toast = useToast()

const schema = z.object({
    name: z.string('Name is required').min(5),
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const showPw = ref(false)
const state = reactive<Partial<Schema>>({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined
})

const submitting = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.signUp.email({
        name: event.data.name,
        email: event.data.email,
        password: event.data.password
    })

    if (error) {
        toast.add({
            title: error.message || error.statusText,
            color: 'error'
        })
    } else {
        toast.add({
            title: 'Successfully signed up',
            color: 'success'
        })
        state.name = undefined
        state.email = undefined
        state.password = undefined
        state.confirmPassword = undefined
        navigateTo('/dashboard')
    }

    submitting.value = false
}
</script>

<template>
    <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
    >
        <div class="flex flex-col text-center">
            <div class="text-xl text-pretty font-semibold text-highlighted">Create an account</div>
            <div class="mt-1 text-base text-pretty text-muted">
                Already have an account? <ULink
                    to="/sign-in"
                    class="text-primary hover:underline"
                >Sign in</ULink>.
            </div>
        </div>

        <UFormField
            label="Name"
            name="name"
            required
        >
            <UInput
                v-model="state.name"
                placeholder="Enter your name"
                class="w-full"
            />
        </UFormField>

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
            required
        >
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

        <UFormField
            label="Confirm Password"
            name="confirmPassword"
            required
        >
            <UInput
                v-model="state.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                class="w-full"
            />
        </UFormField>

        <UButton
            label="Submit"
            type="submit"
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
