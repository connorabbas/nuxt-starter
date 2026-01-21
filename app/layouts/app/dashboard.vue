<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const route = useRoute()
const toast = useToast()
const { pageTitle, subPageNavItems, userMenuItems } = useAppLayout()

const open = ref(false)

const links = [[{
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/'
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
            <template #header="{ collapsed }">
                <div class="w-full flex justify-center">
                    <NuxtLink to="/">
                        <div class="flex gap-3 items-center">
                            <AppLogo class="w-auto h-4 shrink-0" />
                            <span v-if="!collapsed">Nuxt Starter</span>
                        </div>
                    </NuxtLink>
                </div>
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

                <UColorModeButton v-if="collapsed" />
                <UColorModeSelect v-else />

            </template>

            <template #footer="{ collapsed }">
                <UDropdownMenu
                    :items="userMenuItems"
                    :content="{ align: 'center', collisionPadding: 12 }"
                    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
                >
                    <UButton
                        v-bind="{
                            ...authStore.user,
                            label: collapsed ? undefined : authStore.user?.name,
                            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
                        }"
                        class="data-[state=open]:bg-elevated"
                        color="neutral"
                        variant="ghost"
                        block
                        :icon="collapsed ? 'i-lucide-user' : null"
                        :square="collapsed"
                        :ui="{
                            trailingIcon: 'text-dimmed'
                        }"
                    />

                    <template #chip-leading="{ item }">
                        <div class="inline-flex items-center justify-center shrink-0 size-5">
                            <span
                                class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
                                :style="{
                                    '--chip-light': `var(--color-${(item as any).chip}-500)`,
                                    '--chip-dark': `var(--color-${(item as any).chip}-400)`
                                }"
                            />
                        </div>
                    </template>
                </UDropdownMenu>
            </template>
        </UDashboardSidebar>

        <UDashboardSearch :groups="groups" />

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

                <UDashboardToolbar v-if="subPageNavItems">
                    <UNavigationMenu
                        :items="subPageNavItems"
                        highlight
                        class="-mx-1 flex-1"
                    />
                </UDashboardToolbar>
            </template>
            <template #body>
                <slot />
            </template>
        </UDashboardPanel>
    </UDashboardGroup>
</template>
