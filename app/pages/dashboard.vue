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


const { data, error, status, execute } = await useFetch('/api/app/user-session', { immediate: false })
const fetchingSession = computed(() => status.value === 'pending')
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
        >
            {{ error }}
        </UAlert>

        <UPageCard
            class="w-full max-w-md mx-auto"
            title="Dashboard"
            description="Logged in!"
            variant="subtle"
        >
            <UButton
                class="justify-center"
                label="Test - Fetch Session"
                icon="lucide-test-tube-diagonal"
                :loading="fetchingSession"
                @click="execute()"
            />
            <div v-if="data">
                <code><pre class="whitespace-pre-wrap">{{ data }}</pre></code>
            </div>
        </UPageCard>
    </UContainer>
</template>
