<script setup lang="ts">
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

type ButtonVariant = "outlined" | "text" | "link"
type ButtonSize = "small" | "large"
type ButtonSeverity = "secondary" | "success" | "info" | "warn" | "help" | "danger" | "contrast"

const props = withDefaults(defineProps<{
    icon?:      string,
    variant?:   ButtonVariant
    size?:      ButtonSize
    rounded?:   boolean
    severity?:  ButtonSeverity
    label?:     string
    isLoading?: boolean
}>(), {
    icon:      "pi pi-circle",
    variant:   "text",
    rounded:   false,
    label:     "",
    isLoading: false,
})
</script>

<template>
    <prime-button
        class="b-button-icon"
        :icon="props.icon"
        :variant="props.variant"
        :size="props.size"
        :rounded="props.rounded"
        :severity="props.severity"
        :label="props.label"
        :loading="isLoading"
        @click="emit('click')"
    />
</template>

<style scoped lang="scss">
.b-button-icon {
    &.p-button-icon-only {
        width: var(--p-button-icon-only-width);
        height: var(--p-button-icon-only-width);

        &.p-button-sm {
            width: var(--p-button-sm-icon-only-width);
            height: var(--p-button-sm-icon-only-width);
        }

        &.p-button-lg {
            width: var(--p-button-lg-icon-only-width);
            height: var(--p-button-lg-icon-only-width);
        }
    }
}
</style>
