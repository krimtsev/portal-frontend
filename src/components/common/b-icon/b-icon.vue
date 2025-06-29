<script setup lang="ts">
import PrimeButton from "primevue/button"

type ButtonVariant = "outlined" | "text" | "link"
type ButtonSize = "small" | "large"

const props = withDefaults(defineProps<{
    icon:    string,
    variant: ButtonVariant
    size?:   ButtonSize
    rounded: boolean
}>(), {
    icon:    "pi pi-circle",
    variant: "text",
    rounded: false
})
</script>

<template>
    <div class="b-icon">
        <prime-button
            :icon="props.icon"
            :variant="props.variant"
            :size="props.size"
            :rounded="props.rounded"
        />
    </div>
</template>
