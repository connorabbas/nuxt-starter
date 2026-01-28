I have the following in a Nuxt 4 application:

```vue
<!-- pages/test-validation.vue -->
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { updateExampleSettingsSchema, type UpdateExampleSettingsInput } from '#shared/schemas/example-settings.schema'

const form = useTemplateRef('form')
const { csrf } = useCsrf()

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
        await $fetch('/api/app/user/example-settings', {
            method: 'PUT',
            body: event.data,
            headers: { 'csrf-token': csrf }
        })
        // handle success...
    } catch (error: any) {
        const apiErrors = error?.data?.data
        console.error(error)
        if (error?.status === 422 && Array.isArray(apiErrors)) {
            form.value?.setErrors(apiErrors)
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold">Validation Test Page</h1>
            <p class="text-gray-500 mt-2">
                This form demonstrates client-side (Zod schema) and server-side validation.
                The server has stricter rules (address2 is required) to test server validation.
            </p>
        </div>

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

        <!-- Debug panel -->
        <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 class="font-medium mb-2">Current Form State:</h3>
            <pre class="text-xs overflow-auto">{{ JSON.stringify(state, null, 2) }}</pre>
        </div>
    </div>
</template>
```

```ts
// app/plugins/fetch-config.ts

import { ofetch } from 'ofetch'
import type { Pinia } from 'pinia'

/**
 * Global $fetch configuration with general purpose error handling
 * Could also build as a custom useFetch() composable if desired
 * @see https://nuxt.com/docs/4.x/examples/advanced/use-custom-fetch-composable
 */
export default defineNuxtPlugin({
    name: 'fetch-config',
    enforce: 'default',
    parallel: true,
    async setup(nuxtApp) {
        const toast = useToast()
        const authStore = useAuthStore(nuxtApp.$pinia as Pinia)

        globalThis.$fetch = ofetch.create({
            retry: false,
            onRequestError({ error }) {
                if (import.meta.server) return
                if (error.name === 'AbortError') return

                toast.add({
                    title: 'Network Error',
                    description: 'Unable to reach the server. Please check your connection.',
                    color: 'error',
                    icon: 'i-lucide-wifi-off'
                })
            },
            onResponseError({ response }) {
                if (import.meta.server) return

                const status = response.status
                const data = response._data

                // 401 Unauthorized - Invalid/missing authentication
                if (status === 401) {
                    authStore.invalidateClientSession()
                    toast.add({
                        title: 'Unauthorized',
                        description: data?.message || 'Please log in to continue.',
                        color: 'warning',
                        icon: 'i-lucide-log-in'
                    })
                    navigateTo('/login')
                    return
                }

                // 403 Forbidden - Authenticated but not authorized
                if (status === 403) {
                    toast.add({
                        title: 'Access Denied',
                        description: data?.message || 'You don\'t have permission to access this resource.',
                        color: 'warning',
                        icon: 'i-lucide-shield-alert'
                    })
                    return
                }

                // 404 Not Found
                if (status === 404) {
                    toast.add({
                        title: 'Not Found',
                        description: data?.message || 'The requested resource was not found.',
                        color: 'warning',
                        icon: 'i-lucide-search-x'
                    })
                    return
                }

                // 422 Unprocessable Entity - Validation errors
                if (status === 422) {
                    const validationMessage = data?.message || 'Invalid input provided, please try again.'
                    toast.add({
                        title: 'Validation Error',
                        description: validationMessage,
                        color: 'warning',
                        icon: 'i-lucide-alert-circle'
                    })
                    return
                }

                // 429 Too Many Requests - Rate limiting
                if (status === 429) {
                    toast.add({
                        title: 'Too Many Requests',
                        description: data?.message || 'Please slow down and try again later.',
                        color: 'warning',
                        icon: 'i-lucide-timer'
                    })
                    return
                }

                // 400-499 Other Client Errors (catch-all)
                if (status >= 400 && status < 500) {
                    toast.add({
                        title: 'Request Error',
                        description: data?.message || 'There was a problem with your request.',
                        color: 'error',
                        icon: 'i-lucide-alert-triangle'
                    })
                    return
                }

                // 500-599 Server Errors
                if (status >= 500) {
                    toast.add({
                        title: 'Server Error',
                        description: data?.message || 'Something went wrong on our end. Please try again later.',
                        color: 'error',
                        icon: 'i-lucide-server-crash'
                    })
                }
            }
        }) as typeof globalThis.$fetch
    }
})
```

```ts
// shared/schemas/example-settings.schema.ts
import { z } from 'zod'

export const updateExampleSettingsSchema = z.object({
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().length(2, 'State must be 2 characters').toUpperCase(),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format: (123) 456-7890'),
    address: z.string().min(5, 'Address must be at least 5 characters').optional(),
    address2: z.string().optional()
})

export type UpdateExampleSettingsInput = z.infer<typeof updateExampleSettingsSchema>
```

```ts
// server/utils/validation.ts
import type { H3Event } from 'h3'
import { type z, ZodError } from 'zod'

export function sendValidationError(event: H3Event, error: ZodError) {
    const errors = error.issues.map(issue => ({
        name: issue.path.join('.'),
        message: issue.message
    }))

    throw createError({
        status: 422,
        message: 'Invalid input provided, please try again.',
        data: errors
    })
}

export async function validateBody<T extends z.ZodType>(
    event: H3Event,
    schema: T
): Promise<z.infer<T>> {
    const body = await readBody(event)
    try {
        return await schema.parseAsync(body)
    } catch (error) {
        if (error instanceof ZodError) {
            sendValidationError(event, error)
        }
        throw error
    }
}
```

```ts
// server/api/app/user/example-settings.put.ts
import { updateExampleSettingsSchema } from '#shared/schemas/example-settings.schema'

export default defineEventHandler(async (event) => {
    // Extend the shared schema with server-side specific validations
    const serverSchema = updateExampleSettingsSchema.superRefine(async (data, ctx) => {
        // Check if phone is already taken by another user with data.phone value
        // Simulate checking the database or API call...
        await new Promise(resolve => setTimeout(resolve, 500))
        const phoneNumberInUse = true
        if (phoneNumberInUse) {
            ctx.addIssue({
                code: 'custom',
                path: ['phone'],
                message: 'This phone number is already in use'
            })
        }
    })

    const data = await validateBody(event, serverSchema)

    return {
        message: 'Settings updated successfully',
        data
    }
})
```

This setup allows me to have my Nuxt UI (v4) form: https://ui.nuxt.com/raw/docs/components/form.md to handle both client side, and server side Zod schema errors, and correctly display the errors within the FormField: https://ui.nuxt.com/raw/docs/components/form-field.md component's (shows red bordered input, error under the input, etc.)

This is because the server validation util formats the errors in a consumable way that the nuxt form can handle:
```ts
const errors = error.issues.map(issue => ({
    name: issue.path.join('.'),
    message: issue.message
}))
```

The NuxtUI form types: 

```ts
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { ComputedRef, DeepReadonly, Ref } from 'vue';
import type { GetObjectField } from './utils';
import type { Struct as SuperstructSchema } from 'superstruct';
export interface Form<S extends FormSchema> {
    validate<T extends boolean>(opts?: {
        name?: keyof FormData<S, false> | (keyof FormData<S, false>)[];
        silent?: boolean;
        nested?: boolean;
        transform?: T;
    }): Promise<FormData<S, T> | false>;
    clear(path?: keyof FormData<S, false> | string | RegExp): void;
    errors: Ref<FormError[]>;
    setErrors(errs: FormError[], name?: keyof FormData<S, false> | string | RegExp): void;
    getErrors(name?: keyof FormData<S, false> | string | RegExp): FormError[];
    submit(): Promise<void>;
    disabled: ComputedRef<boolean>;
    dirty: ComputedRef<boolean>;
    loading: Ref<boolean>;
    dirtyFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>;
    touchedFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>;
    blurredFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>;
}
export type FormSchema<I extends object = object, O extends object = I> = SuperstructSchema<any, any> | StandardSchemaV1<I, O>;
export type InferInput<Schema> = Schema extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Schema> : Schema extends SuperstructSchema<infer I, any> ? I : Schema extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Schema> : never;
export type InferOutput<Schema> = Schema extends StandardSchemaV1 ? StandardSchemaV1.InferOutput<Schema> : Schema extends SuperstructSchema<infer O, any> ? O : never;
export type FormData<S extends FormSchema, T extends boolean = true> = T extends true ? InferOutput<S> : InferInput<S>;
export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus';
export interface FormError<P extends string = string> {
    name?: P;
    message: string;
}
export interface FormErrorWithId extends FormError {
    id?: string;
}
export type FormSubmitEvent<T> = SubmitEvent & {
    data: T;
};
export type FormValidationError = {
    errors: FormErrorWithId[];
    children?: FormErrorWithId[];
};
export type FormErrorEvent = SubmitEvent & FormValidationError;
export type FormEventType = FormInputEvents;
export type FormChildAttachEvent<S extends FormSchema> = {
    type: 'attach';
    formId: string | number;
    validate: Form<any>['validate'];
    name?: string;
    api: Form<S>;
};
export type FormChildDetachEvent = {
    type: 'detach';
    formId: string | number;
};
export type FormInputEvent<T extends object> = {
    type: FormEventType;
    name: keyof T;
    eager?: boolean;
};
export type FormEvent<T extends object> = FormInputEvent<T> | FormChildAttachEvent<any> | FormChildDetachEvent;
export interface FormInjectedOptions {
    disabled?: boolean;
    validateOnInputDelay?: number;
}
export interface FormFieldInjectedOptions<T> {
    name?: string;
    size?: GetObjectField<T, 'size'>;
    error?: string | boolean;
    eagerValidation?: boolean;
    validateOnInputDelay?: number;
    errorPattern?: RegExp;
    hint?: string;
    description?: string;
    help?: string;
    ariaId: string;
}
export interface ValidateReturnSchema<T> {
    result: T;
    errors: FormError[] | null;
}
export declare class FormValidationException extends Error {
    formId: string | number;
    errors: FormErrorWithId[];
    constructor(formId: string | number, errors: FormErrorWithId[]);
}
```

Matching/extending the shape of the FormError type from NuxtUI, using the Required utility type: https://www.geeksforgeeks.org/typescript/typescript-requiredtype-utility-type/

This is all working together, but I am curious if I could have better type handling for the errors coming from my server util, or within the error catch in the vue page? I know I can't catch for specific exceptions that are coming from a fetch request, but could I create a helper that would expect a certain structure coming from a FetchError type from ofetch?

Should I also create a custom wrapper composable to use with the $fetch for automatically handling theses errors? I could have loading state variable, include the csrf token, make the default base prefix /api/app, and automatically check/inject the form errors? Something like useAppForm()? It would only be for forms that I would typically use $fetch() with, so no GET requests.

I am new to Nuxt, and am not super familiar with the createError() helper, the Nitro server and H3 in general, see:
https://nuxt.com/raw/docs/4.x/getting-started/error-handling.md & https://nuxt.com/raw/docs/4.x/api/utils/create-error.md

I'm guessing I should utilize the /shared/types and shared/utils dir for sharing the types and helper functions across the front and backend as well, with auto imports: https://nuxt.com/raw/docs/4.x/directory-structure/shared.md

I don't want to over-complicate things, but I also want reliable end-to-end type safety, and a repeatable pattern I can use for other forms in my app without duplicating logic.
