<script setup lang="ts">
definePageMeta({
    layout: 'app',
    middleware: ['auth']
})
</script>

<template>
    <UContainer class="flex items-center justify-center py-8">
        <UCard
            class="w-full max-w-md"
            variant="outline"
        >
            Dashboard - Logged in!
        </UCard>
    </UContainer>
</template>
