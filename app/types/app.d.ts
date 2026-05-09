import type { $Fetch } from 'ofetch'

declare module '#app' {
    interface PageMeta {
        description?: string
    }
}

declare module 'nuxt/app' {
    interface NuxtApp {
        $appFetch: $Fetch
    }
}
