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

// Example authenticated application-level data fetching
const data = ref()
const error = ref()
const loading = ref(false)
async function fetchExample() {
    try {
        loading.value = true
        const response = await useNuxtApp().$appFetch('/api/app/fetch-example')
        data.value = response
    } catch (err: unknown) {
        error.value = err
    } finally {
        loading.value = false
    }
}

const errorMessage = computed(() => {
    if (!error.value) return ''
    return error.value.data?.statusMessage || error.value.message || 'An error occurred'
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
                icon="i-lucide-flask-conical"
                :loading="loading"
                @click="fetchExample()"
            />
            <div v-if="data">
                <code><pre class="whitespace-pre-wrap">{{ data }}</pre></code>
            </div>
        </UPageCard>
    </UContainer>
</template>
