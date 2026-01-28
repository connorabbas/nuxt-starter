<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { updateExampleSettingsSchema, type UpdateExampleSettingsInput } from '#shared/schemas/example-settings.schema'

const form = useTemplateRef('form')

const state = reactive<UpdateExampleSettingsInput>({
    city: 'Sioux Falls',
    state: 'SD',
    zip: '57104',
    phone: '(605) 555-0123',
    address: '',
    address2: ''
})
const loading = ref(false)
async function onSubmit(event: FormSubmitEvent<UpdateExampleSettingsInput>) {
    form.value?.clear()
    loading.value = true

    try {
        await useNuxtApp().$appFetch('/api/app/validation-example', {
            method: 'PUT',
            body: event.data
        })
        // handle success...
    } catch (error: unknown) {
        const apiErrors = extractValidationErrors(error)
        if (apiErrors) {
            form.value?.setErrors(apiErrors)
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
            title="Example"
            description="Form with server-side Zod validations mapped into the form (phone # should fail)"
            variant="subtle"
            :ui="{
                header: 'w-full'
            }"
        >
            <!-- empty validate-on prop to only check on form submit, to retain server errors in the form state -->
            <!-- @see https://ui.nuxt.com/docs/components/form#input-events -->
            <UForm
                ref="form"
                :schema="updateExampleSettingsSchema"
                :state="state"
                :validate-on="[]"
                class="space-y-4"
                @submit="onSubmit"
            >
                <UFormField
                    label="City"
                    name="city"
                    required
                >
                    <UInput
                        v-model="state.city"
                        placeholder="New York"
                        class="w-full"
                    />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField
                        label="State"
                        name="state"
                        required
                    >
                        <UInput
                            v-model="state.state"
                            placeholder="NY"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField
                        label="ZIP Code"
                        name="zip"
                        required
                    >
                        <UInput
                            v-model="state.zip"
                            placeholder="12345"
                            class="w-full"
                        />
                    </UFormField>
                </div>

                <UFormField
                    label="Phone"
                    name="phone"
                    required
                >
                    <UInput
                        v-model="state.phone"
                        placeholder="(123) 456-7890"
                        class="w-full"
                    />
                </UFormField>

                <UFormField
                    label="Address"
                    name="address"
                >
                    <UInput
                        v-model="state.address"
                        placeholder="123 Main St"
                        class="w-full"
                    />
                </UFormField>

                <UFormField
                    label="Address Line 2"
                    name="address2"
                    hint="Optional on client, required on server (for testing)"
                >
                    <UInput
                        v-model="state.address2"
                        placeholder="Apt 4B"
                        class="w-full"
                    />
                </UFormField>

                <div class="flex gap-3 pt-4">
                    <UButton
                        type="submit"
                        :loading="loading"
                    >
                        Submit
                    </UButton>

                    <UButton
                        variant="outline"
                        @click="form?.clear()"
                    >
                        Clear Errors
                    </UButton>
                </div>
            </UForm>
        </UPageCard>
    </UContainer>
</template>
