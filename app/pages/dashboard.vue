<script setup lang="ts">
definePageMeta({
    layout: 'app',
    middleware: ['auth']
})

const { data, execute, error } = await useFetch('/api/app/user-session', { immediate: false })
</script>

<template>
    <UContainer class="flex items-center justify-center py-8">
        <UCard
            class="w-full max-w-md"
            variant="subtle"
        >
            Dashboard - Logged in!
            <UButton
                label="test"
                @click="execute()"
            />
            <UAlert
                v-if="error"
                color="error"
                variant="subtle"
            >
                {{ error }}
            </UAlert>
            <div>
                <pre>{{ data }}</pre>
            </div>
        </UCard>
    </UContainer>
</template>
