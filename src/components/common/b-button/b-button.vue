<script setup lang="ts">
import { computed } from "vue"
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

type ButtonType = "submit" | "reset" | "button"
type ButtonVariant = "primary" | "secondary" | "danger"

const props = withDefaults(defineProps<{
    label:      string,
    type?:      ButtonType
    disabled?:  boolean
    isLoading?: boolean
    variant?:   ButtonVariant
}>(), {
    label:    "",
    disabled: false,
})

const severity = computed(() => {
    return props.variant ?? "primary"
})
</script>

<template>
    <prime-button
        :label="props.label"
        :type="props.type"
        :disabled="props.disabled"
        :loading="props.isLoading"
        :severity="severity"
        class="b-button"
        @click="emit('click')"
    />
</template>

<style scoped lang="scss">
.b-button {
    :deep(.p-button) {
        white-space: nowrap;
        box-sizing: border-box;
    }

    min-width: 104px;
    text-decoration: none;

    &.full-width {
        width: 100%;
    }
}
</style>
