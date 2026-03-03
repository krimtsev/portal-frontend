<script setup lang="ts">
import PrimeMessage from "primevue/message"

defineProps<{
    error: string
}>()
</script>

<template>
    <prime-message
        v-if="error"
        severity="error"
        size="small"
        variant="simple"
        class="b-input-error"
    >
        {{ error }}
    </prime-message>
</template>
