<script setup lang="ts">
import Transactional from '../Transactional.vue'
import { cn, mb, text, textColor } from '~/mail/styles'

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
        action-text="Reset Password"
    >
        <template #subheading>
            Hey, {{ props.name }}!
        </template>

        <template #body>
            You are receiving this email because we received a password reset request for your account.
        </template>

        <template #remarks>
            <div :style="cn(text.sm, textColor.secondary, mb[4])">
                This password reset link will expire in 60 minutes.
            </div>
            <div :style="cn(text.sm, textColor.secondary)">
                If you did not request a password reset, no further action is required.
            </div>
        </template>
    </Transactional>
</template>
