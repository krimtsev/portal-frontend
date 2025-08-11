<script setup lang="ts">
import PrimeAccordionContent from "primevue/accordioncontent"
</script>

<template>
    <prime-accordion-content class="portal-accordion-content">
        <slot />
    </prime-accordion-content>
</template>

<style scoped lang="scss">
.portal-accordion-content {
    :deep(.p-accordioncontent-content) {
        background: var(--p-portal-card-background);
    }
}
</style>
