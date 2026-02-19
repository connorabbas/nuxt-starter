<script setup lang="ts">
const authStore = useAuthStore()
const { pageTitle, subPageNavItems, navMenuItems, userMenuItems } = useAppLayout()

const sidebarOpen = ref(false)

const groups = computed(() => [{
    id: 'links',
    label: 'Go to',
    items: navMenuItems.flat()
}])
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            id="default"
            v-model:open="sidebarOpen"
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
                    :items="navMenuItems[0]"
                    orientation="vertical"
                    tooltip
                    popover
                />

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="navMenuItems[1]"
                    orientation="vertical"
                    tooltip
                    class="mt-auto"
                />

                <UColorModeButton v-if="collapsed" />
                <UColorModeSelect v-else />

            </template>

            <template #footer="{ collapsed }">
                <UDropdownMenu
                    v-if="authStore.user"
                    :items="userMenuItems"
                    :content="{ align: 'center', collisionPadding: 12 }"
                    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
                >
                    <UTooltip
                        :disabled="!collapsed"
                        :content="{ side: 'right' }"
                        text="Account"
                    >
                        <UButton
                            class="data-[state=open]:bg-elevated"
                            color="neutral"
                            variant="ghost"
                            block
                            :label="collapsed ? undefined : authStore.user?.name"
                            :icon="collapsed ? 'i-lucide-user' : undefined"
                            :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
                            :square="collapsed"
                            :ui="{ trailingIcon: 'text-dimmed' }"
                        />
                    </UTooltip>
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
