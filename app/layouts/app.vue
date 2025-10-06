<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

async function signOut() {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                navigateTo('/')
            }
        }
    })
}
</script>

<template>
    <UApp>
        <UHeader>
            <template #left>
                <NuxtLink to="/">
                    <AppLogo class="w-auto h-6 shrink-0" />
                </NuxtLink>
            </template>

            <template #right>
                <UColorModeButton />

                <UButton
                    icon="i-lucide-log-out"
                    color="neutral"
                    variant="ghost"
                    label="Log out"
                    @click="signOut"
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
