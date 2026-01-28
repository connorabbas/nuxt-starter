<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// Check for account deletion success
const showAccountDeletedAlert = ref(false)
onMounted(() => {
    if (route.query.account_deleted === 'true') {
        showAccountDeletedAlert.value = true
    }
})
function dismissAccountDeletedAlert() {
    showAccountDeletedAlert.value = false
    router.replace({ query: { ...route.query, account_deleted: undefined } })
}
</script>

<template>
    <div>
        <!-- Account Deleted Success Alert -->
        <UContainer
            v-if="showAccountDeletedAlert"
            class="py-4"
        >
            <UAlert
                color="success"
                variant="subtle"
                title="Account successfully deleted"
                description="Your account and all associated data have been permanently removed. We're sorry to see you go, but you're always welcome back."
                icon="i-lucide-circle-check-big"
                close
                @update:open="dismissAccountDeletedAlert"
            />
        </UContainer>

        <UPageHero
            title="Nuxt Starter Template"
            description="A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours."
            :links="[{
                label: 'Get started',
                to: 'https://ui.nuxt.com/docs/getting-started',
                target: '_blank',
                trailingIcon: 'i-lucide-arrow-right',
                size: 'xl'
            }, {
                label: 'Use this template',
                to: config.public.repoURL,
                target: '_blank',
                icon: 'i-simple-icons-github',
                size: 'xl',
                color: 'neutral',
                variant: 'subtle'
            }]"
        >
            <template #top>
                <HeroBackground />
            </template>
        </UPageHero>
        <UPageSection
            id="features"
            title="Everything you need to build modern Nuxt apps"
            description="Start with a solid foundation. This template includes all the essentials for building production-ready applications with Nuxt UI's powerful component system."
            :features="[{
                icon: 'i-lucide-rocket',
                title: 'Production-ready from day one',
                description: 'Pre-configured with TypeScript, ESLint, Tailwind CSS, and all the best practices. Focus on building features, not setting up tooling.'
            }, {
                icon: 'i-lucide-palette',
                title: 'Beautiful by default',
                description: 'Leveraging Nuxt UI\'s design system with automatic dark mode, consistent spacing, and polished components that look great out of the box.'
            }, {
                icon: 'i-lucide-zap',
                title: 'Lightning fast',
                description: 'Optimized for performance with SSR/SSG support, automatic code splitting, and edge-ready deployment. Your users will love the speed.'
            }, {
                icon: 'i-lucide-blocks',
                title: '100+ components included',
                description: 'Access Nuxt UI\'s comprehensive component library. From forms to navigation, everything is accessible, responsive, and customizable.'
            }, {
                icon: 'i-lucide-code-2',
                title: 'Developer experience first',
                description: 'Auto-imports, hot module replacement, and TypeScript support. Write less boilerplate and ship more features.'
            }, {
                icon: 'i-lucide-shield-check',
                title: 'Built for scale',
                description: 'Enterprise-ready architecture with proper error handling, SEO optimization, and security best practices built-in.'
            }]"
        />
        <UPageSection>
            <UPageCTA
                title="Ready to build your next Nuxt app?"
                description="Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today."
                variant="subtle"
                :links="[{
                    label: 'Start building',
                    to: 'https://ui.nuxt.com/docs/getting-started',
                    target: '_blank',
                    trailingIcon: 'i-lucide-arrow-right',
                    color: 'neutral'
                }, {
                    label: 'View on GitHub',
                    to: config.public.repoURL,
                    target: '_blank',
                    icon: 'i-simple-icons-github',
                    color: 'neutral',
                    variant: 'outline'
                }]"
            />
        </UPageSection>
    </div>
</template>
