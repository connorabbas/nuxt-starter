<script setup lang="ts">
definePageMeta({
    layout: 'authenticated',
    middleware: ['authenticated']
})
</script>

<template>
    <UContainer class="flex items-center justify-center py-8">
        <UCard
            class="w-full max-w-md"
            variant="subtle"
        >
            Dashboard - Logged in!
        </UCard>
    </UContainer>
</template>
