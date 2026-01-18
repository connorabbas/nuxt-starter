<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const { userMenuItems } = useAppLayout()

const navMenuItems = [[{
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/'
}, {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard'
}, {
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
                :items="navMenuItems"
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
        </UHeader>

        <UMain>
            <slot />
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
                    to="https://github.com/nuxt-ui-templates/starter"
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
