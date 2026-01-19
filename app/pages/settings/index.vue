<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import { authClient } from '~/lib/auth-client'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings'
})

const { csrf } = useCsrf()
const authStore = useAuthStore()

const updatingInfo = ref(false)
const infoServerError = ref('')
const info = reactive({
    name: authStore.user?.name
})
const infoSchema = z.object({
    name: z.string('Please enter your new password').min(2)
})
type InfoSchema = z.output<typeof infoSchema>
// https://www.better-auth.com/docs/concepts/users-accounts#update-user-information
async function submitInfo(event: FormSubmitEvent<InfoSchema>) {
    if (updatingInfo.value) return
    updatingInfo.value = true

    const { error } = await authClient.updateUser({
        name: event.data.name,
        fetchOptions: {
            headers: {
                'csrf-token': csrf
            }
        }
    })
    if (error) {
        infoServerError.value = error.message || error.statusText
    } else {
        await authStore.fetchFreshSession()
    }

    // TODO: try catch finally block
    updatingInfo.value = false
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
            title="Info"
            description="Update your information"
            variant="subtle"
        >
            <template
                v-if="infoServerError"
                #header
            >
                <!-- TODO: full width -->
                <UAlert
                    color="error"
                    variant="subtle"
                    title="Error"
                    :description="infoServerError"
                    icon="i-lucide-circle-x"
                />
            </template>
            <UForm
                :schema="infoSchema"
                :state="info"
                class="flex flex-col gap-4 max-w-xs"
                @submit="submitInfo"
            >
                <UFormField name="name">
                    <UInput
                        v-model="info.name"
                        type="text"
                        placeholder="Current password"
                        class="w-full"
                    />
                </UFormField>
                <UButton
                    label="Update"
                    class="w-fit"
                    type="submit"
                    :loading="updatingInfo"
                />
            </UForm>
        </UPageCard>
        <!-- <UPageCard
            title="Password"
            description="Confirm your current password before setting a new one."
            variant="subtle"
        >
            <UForm
                :schema="passwordSchema"
                :state="password"
                :validate="validate"
                class="flex flex-col gap-4 max-w-xs"
            >
                <UFormField name="current">
                    <UInput
                        v-model="password.current"
                        type="password"
                        placeholder="Current password"
                        class="w-full"
                    />
                </UFormField>
                <UFormField name="new">
                    <UInput
                        v-model="password.new"
                        type="password"
                        placeholder="New password"
                        class="w-full"
                    />
                </UFormField>
                <UButton
                    label="Update"
                    class="w-fit"
                    type="submit"
                />
            </UForm>
        </UPageCard> -->
    </UContainer>
</template>
