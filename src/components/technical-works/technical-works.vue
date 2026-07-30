<script setup lang="ts">
import PrimeMessage from "primevue/message"
import { useMaintenanceStore } from "@s/maintenance/maintenance"

const maintenanceStore = useMaintenanceStore()
</script>

<template>
    <prime-message
        v-if="maintenanceStore.showNotice"
        severity="error"
        class="technical-works"
    >
        Технические работы
    </prime-message>
</template>

<style scoped lang="scss">
.technical-works {
    position: fixed;
    top: 0;
    left: 0;

    //width: 100%;
    border-radius: 0;
    z-index: 101;

    :deep(.p-message-content) {
        justify-content: center;
        background: var(--p-red-800);
        color: var(--p-surface-0);
    }
}
</style>
