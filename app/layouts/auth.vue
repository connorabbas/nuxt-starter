<template>
    <UApp>
        <div class="h-screen flex items-center justify-center px-4">
            <UButton
                icon="i-lucide-chevron-left"
                to="/"
                size="xl"
                color="neutral"
                variant="subtle"
                class="absolute left-8 top-8 rounded-full z-10"
            />
            <UPageCard
                variant="outline"
                class="max-w-md w-full"
            >
                <slot />
            </UPageCard>
        </div>
    </UApp>
</template>
