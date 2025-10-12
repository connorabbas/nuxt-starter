<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const route = useRoute()
const toast = useToast()

const schema = z.object({
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const showPw = ref(false)
const state = reactive<Partial<Schema>>({
    password: undefined,
    confirmPassword: undefined
})

const submitting = ref(false)
const token = route.query.token as string // TODO: Error UI is no token in URL
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.resetPassword({
        newPassword: event.data.password,
        token
    })

    if (error) {
        toast.add({
            title: error.message || error.statusText,
            color: 'error',
            icon: 'i-lucide-circle-x'
        })
    } else {
        toast.add({
            title: 'Password successfully reset',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
        state.password = undefined
        state.confirmPassword = undefined
        navigateTo('/login')
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
            <div class="text-xl text-pretty font-semibold text-highlighted">Reset password</div>
            <div class="mt-1 text-sm text-pretty text-muted">
                Please enter your new password below
            </div>
        </div>

        <UFormField
            label="Password"
            name="password"
            required
        >
            <UInput
                v-model="state.password"
                placeholder="Enter your new password"
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
                placeholder="Confirm your new password"
                class="w-full"
            />
        </UFormField>

        <UButton
            label="Reset password"
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
