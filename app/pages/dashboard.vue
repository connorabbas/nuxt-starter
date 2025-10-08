<script setup lang="ts">
definePageMeta({
    layout: 'app',
    middleware: ['auth']
})

// TODO: abstract redirect logic to ofetch configuration within plugin/module
// /login redirect won't work here because of session cookie cache within the guest middleware: https://www.better-auth.com/docs/concepts/session-management#cookie-cache
/* const { data, error } = await useFetch('/api/app/user-session')
if (error.value?.statusCode === 401) {
    await navigateTo('/login')
} */
</script>

<template>
    <UContainer class="flex items-center justify-center py-8">
        <UCard
            class="w-full max-w-md"
            variant="subtle"
        >
            Dashboard - Logged in!
            <!-- <div>
                <pre>{{ data }}</pre>
            </div> -->
        </UCard>
    </UContainer>
</template>
