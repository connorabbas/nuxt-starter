<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings',
    subPageNavItems: [{
        label: 'General',
        icon: 'i-lucide-user',
        to: '/settings',
        exact: true
    }, {
        label: 'Security',
        icon: 'i-lucide-shield',
        to: '/settings/security'
    }] satisfies NavigationMenuItem[]
})
</script>

<template>
    <div class="flex flex-col gap-4 sm:gap-6">
        <NuxtPage />
    </div>
</template>
