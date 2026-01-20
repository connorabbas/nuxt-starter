import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

export function useAppLayout() {

    const authStore = useAuthStore()
    const route = useRoute()
    const pageTitle = computed(() => route.meta.pageTitle as string)
    const subPageNavItems = computed(() => route.meta.subPageNavItems as NavigationMenuItem[])

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
        pageTitle,
        subPageNavItems,
        userMenuItems
    }
}
