<script setup>
const config = useRuntimeConfig()
const route = useRoute()

const appName = config.public.appName || 'Nuxt Starter Template'
const defaultDescription = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

const title = computed(() => {
    const pageTitle = route.meta.pageTitle
    return pageTitle ? `${pageTitle} - ${appName}` : appName
})

const description = computed(() => route.meta.description || defaultDescription)

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: '/favicon.ico' }
    ],
    htmlAttrs: {
        lang: 'en'
    }
})

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
    twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
    twitterCard: 'summary_large_image'
})
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtLoadingIndicator color="var(--ui-primary)" />
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
