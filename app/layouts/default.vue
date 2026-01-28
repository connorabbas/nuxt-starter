<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const config = useRuntimeConfig()
const items: NavigationMenuItem[] = [
    {
        label: 'Feedback',
        icon: 'i-lucide-message-circle',
        to: `${config.public.repoURL}/issues`,
        target: '_blank'
    }
]
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
                :items="items"
                variant="link"
            />

            <template #right>
                <div class="flex gap-3">
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
                        variant="subtle"
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
                </div>
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
