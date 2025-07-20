<script setup lang="ts">
import AccordionHeader from "primevue/accordionheader"
</script>

<template>
    <AccordionHeader class="portal-accordion-header">
        <slot />
    </AccordionHeader>
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
}
</style>
