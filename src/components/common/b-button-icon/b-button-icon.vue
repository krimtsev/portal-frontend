<script setup lang="ts">
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

type ButtonVariant = "outlined" | "text" | "link"
type ButtonSize = "small" | "large"
type ButtonSeverity = "secondary" | "success" | "info" | "warn" | "help" | "danger" | "contrast"

const props = withDefaults(defineProps<{
    icon?:     string,
    variant?:  ButtonVariant
    size?:     ButtonSize
    rounded?:  boolean
    severity?: ButtonSeverity
}>(), {
    icon:    "pi pi-circle",
    variant: "text",
    rounded: false
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
        @click="emit('click')"
    />
</template>
