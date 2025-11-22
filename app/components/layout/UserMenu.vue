<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
    collapsed?: boolean
}>()

const authStore = useAuthStore()

const items = computed<DropdownMenuItem[][]>(() => ([[{
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings'
}], [{
    label: 'Log out',
    icon: 'i-lucide-log-out',
    onSelect: () => authStore.signOut()
}]]))
</script>

<template>
    <UDropdownMenu
        :items="items"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: props.collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
    >
        <UButton
            v-bind="{
                ...authStore.user,
                label: props.collapsed ? undefined : authStore.user?.name,
                trailingIcon: props.collapsed ? undefined : 'i-lucide-chevrons-up-down'
            }"
            color="neutral"
            variant="ghost"
            block
            :square="props.collapsed"
            class="data-[state=open]:bg-elevated"
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
