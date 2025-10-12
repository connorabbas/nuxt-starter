<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const config = useRuntimeConfig()
const toast = useToast()

const schema = z.object({
    email: z.email('Invalid email format')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    email: undefined
})

const submitting = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.requestPasswordReset({
        email: event.data.email,
        redirectTo: `${config.public.baseURL}/reset-password`
    })

    if (error) {
        toast.add({
            title: error.message || error.statusText,
            color: 'error',
            icon: 'i-lucide-circle-x'
        })
    } else {
        toast.add({
            title: 'We have emailed your password reset link',
            color: 'success',
            icon: 'i-lucide-circle-check-big'
        })
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
        <div class="flex flex-col gap-4 text-center">
            <div class="text-xl text-pretty font-semibold text-highlighted">Forgot password</div>
            <div class="space-y-4 text-sm text-pretty text-muted">
                <div>
                    Enter your email address to receive a password reset link
                </div>
            </div>
        </div>

        <UFormField
            label="Email"
            name="email"
            autocomplete="email"
            required
        >
            <UInput
                v-model="state.email"
                type="email"
                placeholder="Enter your email to resend verification link"
                class="w-full"
            />
        </UFormField>

        <UButton
            label="Email password reset link"
            type="submit"
            class="w-full flex justify-center"
            :disabled="submitting"
            :loading="submitting"
        />
    </UForm>
</template>
