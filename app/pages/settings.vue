<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
    layout: 'app',
    middleware: ['auth'],
    pageTitle: 'Settings'
})

const route = useRoute()
const pageTitle = computed(() => (route.meta.pageTitle as string) || 'Settings')
const description = computed(() => (route.meta.description as string) || '')

const items = computed(() => [
    {
        label: 'General',
        icon: 'i-lucide-user',
        to: '/settings',
        exact: true
    },
    {
        label: 'Security',
        icon: 'i-lucide-shield',
        to: '/settings/security'
    },
    {
        label: 'Example',
        icon: 'i-lucide-flask-conical',
        to: '/settings/example'
    }
] satisfies NavigationMenuItem[])
</script>

<template>
    <div>
        <UPageHeader
            :title="pageTitle"
            :description="description"
        />

        <UPage>
            <template #left>
                <UPageAside>
                    <UNavigationMenu
                        :items="items"
                        orientation="vertical"
                        variant="pill"
                    />
                </UPageAside>
            </template>

            <div class="lg:hidden">
                <UNavigationMenu
                    :items="items"
                    orientation="vertical"
                    variant="pill"
                    class="w-full mt-6"
                />
            </div>

            <UPageBody>
                <NuxtPage />
            </UPageBody>
        </UPage>
    </div>
</template>
