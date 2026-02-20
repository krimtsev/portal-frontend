<script setup lang="ts">
import { computed } from "vue"
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = withDefaults(defineProps<{
    label:     string,
    disabled?: boolean
    active?:   boolean
}>(), {
    active:    false,
    disabled:  false,
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
        background: transparent;
        border: 1px solid var(--p-portal-button-outline-border-color);

        &[disabled] {
            background: var(--p-form-field-disabled-background);
            color: var(--p-form-field-disabled-color);
        }
    }
}
</style>
