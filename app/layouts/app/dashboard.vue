<!-- TODO: WIP https://ui.nuxt.com/docs/components#dashboard -->
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()

const pageTitle = computed(() => route.meta.pageTitle as string)

const open = ref(false)

const links = [[{
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
    onSelect: () => {
        open.value = false
    }
}, {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard'
}], [{
    label: 'Feedback',
    icon: 'i-lucide-message-circle',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
}, {
    label: 'Help & Support',
    icon: 'i-lucide-info',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
    id: 'links',
    label: 'Go to',
    items: links.flat()
}, {
    id: 'code',
    label: 'Code',
    items: [{
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
        target: '_blank'
    }]
}])

onMounted(async () => {
    const cookie = useCookie('cookie-consent')
    if (cookie.value === 'accepted') {
        return
    }

    toast.add({
        title: 'We use first-party cookies to enhance your experience on our website.',
        duration: 0,
        close: false,
        actions: [{
            label: 'Accept',
            color: 'neutral',
            variant: 'outline',
            onClick: () => {
                cookie.value = 'accepted'
            }
        }, {
            label: 'Opt out',
            color: 'neutral',
            variant: 'ghost'
        }]
    })
})
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            id="default"
            v-model:open="open"
            collapsible
            resizable
            class="bg-elevated/25"
            :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
            <template #header>
                Nuxt Starter
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton
                    :collapsed="collapsed"
                    class="bg-transparent ring-default"
                />

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="links[0]"
                    orientation="vertical"
                    tooltip
                    popover
                />

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="links[1]"
                    orientation="vertical"
                    tooltip
                    class="mt-auto"
                />
            </template>

            <!-- TODO -->
            <template #footer="{ collapsed }">
                <LayoutUserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <UDashboardSearch :groups="groups" />

        <!-- TODO: might not work here in the layout with multiple slots... -->
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar :title="pageTitle">
                    <template #leading>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <slot name="navbar-right" />
                    </template>
                </UDashboardNavbar>
            </template>
            <template #body>
                <slot />
            </template>
        </UDashboardPanel>

        <!-- TODO -->
        <!-- <NotificationsSlideover /> -->
    </UDashboardGroup>
</template>
