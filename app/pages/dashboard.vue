<script setup lang="ts">
definePageMeta({
    layout: 'guest-minimal',
    middleware: ['auth']
})
</script>

<template>
    <div>
        <UCard
            class="w-full max-w-md"
            variant="subtle"
        >
            Dashboard
        </UCard>
    </div>
</template>
