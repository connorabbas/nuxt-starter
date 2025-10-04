<script setup lang="ts">
definePageMeta({
    layout: 'auth',
    middleware: ['guest']
})
</script>

<template>
    <UCard
        class="w-full max-w-md"
        variant="subtle"
    >
        Sign in
    </UCard>
</template>
