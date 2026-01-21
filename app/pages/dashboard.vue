<script setup lang="ts">
definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Dashboard'
})

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const showSuccessMessage = route.query.success_message as string
function dismissSuccessMessageAlert() {
    router.replace({ query: { ...route.query, success_message: undefined } })
    successMessage.value = ''
}
const successMessage = ref('')
onMounted(() => {
    if (showSuccessMessage && showSuccessMessage === 'welcome') {
        successMessage.value = `Thanks for signing up, welcome to ${config.public.appName}!`
    }
})

// Example authenticated application-level data fetching utilizing route prefix (see auth server middleware)
const { data, error, status, execute: fetchExample } = await useFetch('/api/app/example', {
    immediate: false
})

const fetchingExample = computed(() => status.value === 'pending')
const errorMessage = computed(() => {
    if (!error.value) return ''
    return error.value.data?.statusMessage || error.value.statusText || error.value.message || 'An error occurred'
})

function dismissError() {
    error.value = undefined
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 sm:gap-6 w-full">
        <UAlert
            v-if="showSuccessMessage && successMessage"
            color="success"
            variant="subtle"
            title="Success!"
            :description="successMessage"
            icon="i-lucide-circle-check-big"
            close
            @update:open="dismissSuccessMessageAlert"
        />

        <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            title="Error"
            :description="errorMessage"
            icon="i-lucide-circle-x"
            close
            @update:open="dismissError"
        />

        <UPageCard
            class="w-full max-w-md mx-auto"
            title="Dashboard"
            description="Logged in!"
            variant="subtle"
        >
            <UButton
                class="justify-center"
                label="Test - Fetch Example"
                icon="lucide-test-tube-diagonal"
                :loading="fetchingExample"
                @click="fetchExample()"
            />
            <div v-if="data">
                <code><pre class="whitespace-pre-wrap">{{ data }}</pre></code>
            </div>
        </UPageCard>
    </UContainer>
</template>
