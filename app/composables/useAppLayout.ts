import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

export function useAppLayout() {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const route = useRoute()
    const toast = useToast()

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
    const navMenuItems = [[{
        label: 'Home',
        icon: 'i-lucide-house',
        to: '/'
    }, {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/dashboard'
    }], [{
        label: 'Feedback',
        icon: 'i-lucide-message-circle',
        to: `${config.public.repoURL}/issues`,
        target: '_blank'
    }]] satisfies NavigationMenuItem[][]

    onMounted(async () => {
        const cookie = useCookie('cookie-consent')
        if (cookie.value === 'accepted') {
            return
        }

        toast.add({
            title: 'We use first-party cookies to enhance your experience on our website.',
            duration: 0,
            close: false,
            actions: [{
                label: 'Accept',
                color: 'neutral',
                variant: 'outline',
                onClick: () => {
                    cookie.value = 'accepted'
                }
            }, {
                label: 'Opt out',
                color: 'neutral',
                variant: 'ghost'
            }]
        })
    })

    return {
        pageTitle,
        userMenuItems,
        navMenuItems,
        subPageNavItems
    }
}
