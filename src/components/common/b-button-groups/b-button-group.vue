<script setup lang="ts">
import { computed } from "vue"
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = withDefaults(defineProps<{
    label:     string
    disabled?: boolean
    active?:   boolean
}>(), {
    active:   false,
    disabled: false,
})

const severity = computed(() => {
    if (props.active) return "primary"
    return "secondary"
})
</script>

<template>
    <prime-button
        :label="props.label"
        :disabled="props.disabled"
        :severity="severity"
        class="b-button-group"
        :class="{
            'inactive': !props.active,
        }"
        @click="emit('click')"
    />
</template>

<style scoped lang="scss">
.b-button-group {
    min-width: 104px;
    text-decoration: none;

    &.inactive {
        color: var(--p-btn-group-color);
        background: var(--p-btn-group-background);
        border: 1px solid var(--p-btn-group-border-color);

        &:disabled {
            background: var(--p-form-field-disabled-background);
            color: var(--p-form-field-disabled-color);
        }

        &:not(:disabled):hover {
            background: var(--p-btn-group-hover-background);
            color: var(--p-btn-group-hover-color);
            border-color: var(--p-btn-group-hover-border-color);
        }

        &:not(:disabled):active {
            background: var(--p-btn-group-active-background);
            color: var(--p-btn-group-active-color);
            border-color: var(--p-btn-group-hover-active-color);
        }

    }
}
</style>
