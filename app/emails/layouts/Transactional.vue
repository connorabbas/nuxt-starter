<script setup lang="ts">
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
} from '../styles'

const props = defineProps<{
    subject: string
    actionUrl?: string
    actionText?: string
}>()

const config = useRuntimeConfig()
const currentYear = new Date().getFullYear()
</script>

<template>
    <EHtml>
        <EHead />
        <EPreview>{{ props.subject }}</EPreview>

        <EBody :style="components.body">
            <!-- Header -->
            <EContainer :style="presets.sectionHeader">
                <EHeading
                    :style="presets.heading"
                    as="h1"
                >
                    {{ config.public.appName }}
                </EHeading>
            </EContainer>

            <!-- Main Content Card -->
            <EContainer :style="components.card">
                <!-- Subheading slot -->
                <EHeading
                    :style="presets.subheading"
                    as="h2"
                >
                    <slot name="subheading" />
                </EHeading>

                <ESection>
                    <!-- Body slot -->
                    <EText :style="presets.body">
                        <slot name="body" />
                    </EText>

                    <!-- Optional call to link/action button -->
                    <div
                        v-if="props.actionText && props.actionUrl"
                        :style="cn(textAlign.center, py[6])"
                    >
                        <EButton
                            :href="props.actionUrl"
                            :style="presets.buttonPrimary"
                        >
                            {{ props.actionText }}
                        </EButton>
                    </div>
                </ESection>

                <!-- Ending remarks -->
                <EText :style="cn(text.sm, textColor.secondary, mb[4])">
                    <slot name="remarks" />
                </EText>

                <!-- Link trouble -->
                <template v-if="props.actionText && props.actionUrl">
                    <EHr :style="components.divider" />

                    <EText :style="cn(text.xs, textColor.muted, mb[1])">
                        If you're having trouble clicking the "{{ props.actionText }}" button,
                        copy and paste the URL below into your web browser:
                    </EText>

                    <EText :style="cn(text.xs, textColor.muted, components.breakWord, margin[0])">
                        <ELink
                            :href="props.actionUrl"
                            :style="cn(components.link, text.xs)"
                        >
                            {{ props.actionUrl }}
                        </ELink>
                    </EText>
                </template>
            </EContainer>

            <!-- Footer -->
            <EContainer :style="presets.sectionFooter">
                <EText :style="presets.footerText">
                    © {{ currentYear }} {{ config.public.appName }}. All rights reserved.
                </EText>
            </EContainer>
        </EBody>
    </EHtml>
</template>
