<script setup lang="ts">
import AccordionContent from "primevue/accordioncontent"
</script>

<template>
    <AccordionContent class="portal-accordion-content">
        <slot />
    </AccordionContent>
</template>

<style scoped lang="scss">
.portal-accordion-content {
    :deep(.p-accordioncontent-content){
        background: var(--p-portal-card-background);
    }
}
</style>
