<script setup lang="ts">
import PrimeAccordionHeader from "primevue/accordionheader"

const props = defineProps<{ disable?: boolean }>()
</script>

<template>
    <prime-accordion-header
        class="portal-accordion-header"
        :class="{ disable: props.disable }"
    >
        <slot />
    </prime-accordion-header>
</template>

<style lang="scss" scoped>
.portal-accordion-header {
    background: var(--p-portal-card-background) !important;
    color: rgba(255, 255, 255, 0.9);
    min-height: 39px;
    font-size: 1.1428rem;
    font-weight: 500;
    padding-left: $indent-x3;
    padding-right: $indent-x4;

    :deep(.p-accordionheader-toggle-icon) {
        font-size: 1.7142rem;
    }

    &.disable {
        :deep(.p-accordionheader-toggle-icon) {
            visibility: hidden !important;
        }
    }
}
</style>
