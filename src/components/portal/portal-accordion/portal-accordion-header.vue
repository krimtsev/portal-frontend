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
}
</style>
