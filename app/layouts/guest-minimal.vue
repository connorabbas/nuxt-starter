<script setup>

</script>

<template>
    <UApp>
        <UMain class="flex flex-col items-center justify-center gap-4">
            <div class="flex items-center justify-center">
                <NuxtLink to="/">
                    <AppLogo class="w-auto h-8 shrink-0" />
                </NuxtLink>
            </div>
            <div v-if="$slots.message">
                <slot name="message" />
            </div>
            <div>
                <slot />
            </div>
        </UMain>
    </UApp>
</template>
