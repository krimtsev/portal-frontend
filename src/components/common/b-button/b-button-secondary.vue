<script setup lang="ts">
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = defineProps<{
    label:     string
    disabled?: boolean
    icon?:     string
}>()
</script>

<template>
    <prime-button
        :label="props.label"
        :disabled="props.disabled"
        :icon="props.icon"
        class="b-button-secondary"
        @click="emit('click')"
    />
</template>

<style scoped lang="scss">
.b-button-secondary {
    white-space: nowrap;
    min-width: 104px;
    background: transparent;
    color: var(--p-surface-300);
    border: 1px solid var(--p-form-field-border-color);

    &:not(:disabled):hover {
        background: transparent;
        color: var(--p-primary-hover-color);
    }

    &:not(:disabled):active {
        background: transparent;
        color: var(--p-primary-color);
        border: 1px solid var(--p-primary-color);
    }
}
</style>
