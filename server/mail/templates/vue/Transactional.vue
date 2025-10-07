<script setup lang="ts">
import {
    Body as MBody,
    Button as MButton,
    Container as MContainer,
    Head as MHead,
    Heading as MHeading,
    Hr as MHr,
    Html as MHtml,
    Link as MLink,
    Preview as MPreview,
    Section as MSection,
    Text as MText
} from '@vue-email/components'

import {
    components,
    presets,
    textColor,
    text,
    cn,
    textAlign,
    py,
    mb,
    margin
} from '~~/server/mail/styles'

const props = defineProps<{
    subject: string
    actionUrl?: string
    actionText?: string
}>()

const config = useRuntimeConfig()
const currentYear = new Date().getFullYear()
</script>

<template>
    <MHtml>
        <MHead />
        <MPreview>{{ props.subject }}</MPreview>

        <MBody :style="components.body">
            <!-- Header -->
            <MContainer :style="presets.sectionHeader">
                <MHeading
                    :style="presets.heading"
                    as="h1"
                >
                    {{ config.public.appName }}
                </MHeading>
            </MContainer>

            <!-- Main Content Card -->
            <MContainer :style="components.card">
                <!-- Subheading slot -->
                <MHeading
                    :style="presets.subheading"
                    as="h2"
                >
                    <slot name="subheading" />
                </MHeading>

                <MSection>
                    <!-- Body slot -->
                    <MText :style="presets.body">
                        <slot name="body" />
                    </MText>

                    <!-- Optional call to link/action button -->
                    <div
                        v-if="props.actionText && props.actionUrl"
                        :style="cn(textAlign.center, py[6])"
                    >
                        <MButton
                            :href="props.actionUrl"
                            :style="presets.buttonPrimary"
                        >
                            {{ props.actionText }}
                        </MButton>
                    </div>
                </MSection>

                <!-- Ending remarks -->
                <MText :style="cn(text.sm, textColor.secondary, mb[4])">
                    <slot name="remarks" />
                </MText>

                <!-- Link trouble -->
                <template v-if="props.actionText && props.actionUrl">
                    <MHr :style="components.divider" />

                    <MText :style="cn(text.xs, textColor.muted, mb[1])">
                        If you're having trouble clicking the "{{ props.actionText }}" button,
                        copy and paste the URL below into your web browser:
                    </MText>

                    <MText :style="cn(text.xs, textColor.muted, components.breakWord, margin[0])">
                        <MLink
                            :href="props.actionUrl"
                            :style="cn(components.link, text.xs)"
                        >
                            {{ props.actionUrl }}
                        </MLink>
                    </MText>
                </template>
            </MContainer>

            <!-- Footer -->
            <MContainer :style="presets.sectionFooter">
                <MText :style="presets.footerText">
                    © {{ currentYear }} {{ config.public.appName }}. All rights reserved.
                </MText>
            </MContainer>
        </MBody>
    </MHtml>
</template>
