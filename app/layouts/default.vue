<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
    /* {
        label: 'Sign in',
        to: '/login'
    },
    {
        label: 'Sign up',
        to: '/sign-up'
    },
    {
        label: 'Dashboard',
        to: '/dashboard'
    } */
]
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
                :items="items"
                variant="link"
            />

            <template #right>
                <UColorModeButton />

                <UButton
                    icon="i-lucide-log-in"
                    color="neutral"
                    variant="ghost"
                    to="/login"
                    class="lg:hidden"
                />

                <UButton
                    label="Sign in"
                    color="neutral"
                    variant="outline"
                    to="/login"
                    class="hidden lg:inline-flex"
                />

                <UButton
                    label="Sign up"
                    color="neutral"
                    trailing-icon="i-lucide-arrow-right"
                    class="hidden lg:inline-flex"
                    to="/sign-up"
                />
            </template>

            <template #body>
                <UNavigationMenu
                    :items="items"
                    orientation="vertical"
                    class="-mx-2.5"
                />

                <USeparator class="my-6" />

                <UButton
                    label="Sign in"
                    color="neutral"
                    variant="subtle"
                    to="/login"
                    block
                    class="mb-3"
                />
                <UButton
                    label="Sign up"
                    color="neutral"
                    to="/sign-up"
                    block
                />
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
