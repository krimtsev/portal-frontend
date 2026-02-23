<script setup lang="ts">
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = defineProps<{
    label: string,
    disabled?: boolean
}>()
</script>

<template>
    <prime-button
        :label="props.label"
        :disabled="props.disabled"
        class="b-button-secondary"
        @click="emit('click')"
    />
</template>

<style scoped lang="scss">
.b-button-secondary {
    white-space: nowrap;
    min-width: 104px;
    background: transparent;
    color: var(--p-surface-400);
    border: 1px solid var(--p-portal-button-outline-border-color);

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
