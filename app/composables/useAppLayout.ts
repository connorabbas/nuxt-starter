import type { DropdownMenuItem } from '@nuxt/ui'

export function useAppLayout() {

    const authStore = useAuthStore()

    const userMenuItems = computed<DropdownMenuItem[][]>(() => ([
        [{
            label: 'Settings',
            icon: 'i-lucide-settings',
            to: '/settings'
        }], [{
            label: 'Log out',
            icon: 'i-lucide-log-out',
            onSelect: () => authStore.signOut()
        }]
    ]))

    return {
        userMenuItems
    }
}
