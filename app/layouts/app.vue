<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()

const navMenuItems: NavigationMenuItem[] = [
    {
        label: 'Dashboard',
        to: '/dashboard'
    }
]
const userDropdownItems = ref<DropdownMenuItem[][]>([
    [
        {
            label: 'Settings',
            icon: 'i-lucide-settings',
            to: '/settings'
        }
    ],
    [
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            onSelect: () => authStore.signOut()
        }
    ]
])
</script>

<template>
    <UApp>
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
                    :items="userDropdownItems"
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

                <!-- <UButton
                    icon="i-lucide-log-out"
                    color="neutral"
                    variant="ghost"
                    label="Log out"
                    @click="signOut"
                /> -->
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
    </UApp>
</template>
