<script setup lang="ts">
const config = useRuntimeConfig()
const authStore = useAuthStore()
const { subPageNavItems, navMenuItems, userMenuItems } = useAppLayout()
</script>

<template>
    <div>
        <UHeader>
            <template #left>
                <NuxtLink to="/">
                    <AppLogo class="w-auto h-6 shrink-0" />
                </NuxtLink>
            </template>

            <UNavigationMenu
                :items="navMenuItems.flat()"
                variant="link"
            />

            <template #right>
                <UColorModeButton />

                <UDropdownMenu
                    v-if="authStore.isAuthenticated"
                    :items="userMenuItems"
                    :content="{
                        align: 'end',
                        side: 'bottom',
                    }"
                    :ui="{
                        content: 'w-48'
                    }"
                >
                    <UButton
                        trailing-icon="i-lucide-chevron-down"
                        color="neutral"
                        variant="ghost"
                        :label="authStore?.user?.name"
                    />
                </UDropdownMenu>
            </template>

            <template #body>
                <UNavigationMenu
                    :items="navMenuItems.flat()"
                    orientation="vertical"
                    class="-mx-2.5"
                />
            </template>
        </UHeader>

        <div
            v-if="subPageNavItems"
            class="border-default sticky top-(--ui-header-height) z-50 w-full border-b bg-default/75 backdrop-blur"
        >
            <UContainer>
                <UNavigationMenu
                    class="w-full -mx-2.5"
                    variant="pill"
                    :items="subPageNavItems"
                    :ui="{
                        list: 'min-w-auto overflow-auto', // scrollable on mobile
                        item: 'min-w-auto',
                    }"
                    highlight
                />
            </UContainer>
        </div>

        <UMain>
            <div class="py-4 sm:py-6">
                <slot />
            </div>
        </UMain>

        <USeparator icon="i-simple-icons-nuxtdotjs" />

        <UFooter>
            <template #left>
                <p class="text-sm text-muted">
                    Built with Nuxt UI • © {{ new Date().getFullYear() }}
                </p>
            </template>

            <template #right>
                <UButton
                    :to="config.public.repoURL"
                    target="_blank"
                    icon="i-simple-icons-github"
                    aria-label="GitHub"
                    color="neutral"
                    variant="ghost"
                />
            </template>
        </UFooter>
    </div>
</template>
