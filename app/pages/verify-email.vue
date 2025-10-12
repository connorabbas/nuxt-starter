<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const toast = useToast()
const route = useRoute()

const schema = z.object({
    email: z.email('Invalid email format')
})

type Schema = z.output<typeof schema>

const presetEmail = route.query.email as string
const state = reactive<Partial<Schema>>({
    email: presetEmail || undefined
})

const submitting = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.sendVerificationEmail({
        email: event.data.email,
        callbackURL: '/dashboard?welcome=true'
    })

    if (error) {
        toast.add({
            title: error.message || error.statusText,
            color: 'error',
            icon: 'i-lucide-circle-x'
        })
    } else {
        toast.add({
            title: 'Verification email has been resent',
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
            <div class="text-xl text-pretty font-semibold text-highlighted">Please verify your email</div>
            <div class="space-y-4 text-sm text-pretty text-muted">
                <div>
                    Almost there, we sent you an email to verify your email address. Just click the link in that email
                    to complete the signup and login to your account.
                </div>
                <div>
                    You may need to <span class="font-bold">check your spam folder</span>.
                </div>
                <div>
                    Still can't find the email?
                </div>
            </div>
        </div>

        <UFormField
            v-if="!presetEmail"
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
            label="Resend verification email"
            type="submit"
            class="w-full flex justify-center"
            :disabled="submitting"
            :loading="submitting"
        />
    </UForm>
</template>
