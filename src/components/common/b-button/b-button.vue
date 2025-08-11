<script setup lang="ts">
import { computed } from "vue"
import PrimeButton from "primevue/button"

type ButtonType = "submit" | "reset" | "button"
type ButtonVariant = "primary" | "secondary"

const props = defineProps<{
    label: string,
    type?: ButtonType
    widthFull?: boolean
    disabled?: boolean
    loading?: boolean
    variant?: ButtonVariant
    outline?: boolean
}>()

const severity = computed(() => {
    if (props.outline) return "secondary"
    return props.variant ?? "primary"
})
</script>

<template>
    <div class="b-button">
        <prime-button
            :label="props.label"
            :type="props.type"
            :disabled="props.disabled"
            :loading="props.loading"
            class="button"
            :severity="severity"
            :class="{
                'width-full': props.widthFull,
                'outline': props.outline,
            }"
        />
    </div>
</template>

<style scoped lang="scss">
.b-button {
    .button {
        min-width: 104px;

        &.width-full {
            width: 100%;
        }

        &.outline {
            background: transparent;
            border: 1px solid var(--p-portal-button-outline-border-color);
        }
    }
}
</style>
