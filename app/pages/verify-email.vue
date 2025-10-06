<script setup lang="ts">
import * as z from 'zod'
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

const state = reactive<Partial<Schema>>({
    email: route.query.email as string || undefined
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
            color: 'error'
        })
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
            <div class="text-xl text-pretty font-semibold text-highlighted">Verify email</div>
            <div class="mt-1 text-sm text-pretty text-muted">
                Before logging in, please verify your email address by clicking on the link we emailed to you.
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
            label="Resend email"
            type="submit"
            :disabled="submitting"
            :loading="submitting"
        />
    </UForm>
</template>
