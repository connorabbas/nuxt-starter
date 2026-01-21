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
        action-text="Delete your account"
    >
        <template #subheading>
            Hey, {{ props.name }}!
        </template>

        <template #body>
            Please confirm you would like to delete your account. Please note, this action cannot be undone.
        </template>

        <template #remarks>
            If you don't own this account, you can safely ignore this email.
        </template>
    </Transactional>
</template>
