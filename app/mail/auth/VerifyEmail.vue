<script setup lang="ts">
import Transactional from '../Transactional.vue'

const props = defineProps<{
    subject: string
    name: string
    actionUrl: string
}>()
</script>

<template>
    <Transactional
        :subject="props.subject"
        :action-url="props.actionUrl"
        action-text="Verify Email Address"
    >
        <template #subheading>
            Hey, {{ props.name }}!
        </template>

        <template #body>
            Please verify your email address for security reasons.
        </template>

        <template #remarks>
            If you didn't create or update this account, you can safely ignore this email.
        </template>
    </Transactional>
</template>
