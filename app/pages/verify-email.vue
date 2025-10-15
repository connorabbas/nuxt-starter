<script setup lang="ts">
import z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})

const toast = useToast()
const route = useRoute()

const presetEmail = route.query.email as string
const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    defaultValue: presetEmail,
    placeholder: 'Enter your email',
    required: true
}]

const schema = z.object({
    email: z.email('Invalid email format')
})

type Schema = z.output<typeof schema>

const serverError = ref('')
const submitting = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (submitting.value) return
    submitting.value = true

    const { error } = await authClient.sendVerificationEmail({
        email: event.data.email,
        callbackURL: '/dashboard?welcome=true'
    })

    if (error) {
        serverError.value = error.message || error.statusText
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
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :loading="submitting"
        :submit="{
            label: 'Resend verification email'
        }"
        title="Please verify your email"
        icon="i-lucide-user-check"
        @submit="onSubmit"
    >
        <template #description>
            <div class="flex flex-col gap-2 text-sm">
                <div>
                    Almost there, we sent you an email to verify your email address. Just click the link in that email
                    to
                    complete the signup and login to your account.
                </div>
                <div>
                    You may need to check your <span class="font-bold">spam folder</span>.
                </div>
                <div>
                    Still can't find the email?
                </div>
            </div>
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
