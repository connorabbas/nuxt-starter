<script setup lang="ts">
definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings'
})
</script>

<template>
    <UContainer class="flex items-center justify-center py-8">
        <UCard
            class="w-full max-w-md"
            variant="subtle"
        >
            Settings - TODO
        </UCard>
    </UContainer>
</template>
