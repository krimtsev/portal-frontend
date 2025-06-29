<script setup lang="ts">
import PrimeButton from "primevue/button"

const props = defineProps<{
    label: string
}>()
</script>

<template>
    <div class="b-link">
        <prime-button
            :label="props.label"
            variant="link"
            class="button-link"
        />
    </div>
</template>

<style scoped lang="scss">
.b-link {
    display: inline-block;

    // Убираем ripple
    :deep(.p-ink) {
        display: none;
    }

    // Основной стиль "ссылки-кнопки"
    :deep(.p-button.button-link) {
        color: var(--p-surface-0);

        .p-button-label {
            text-decoration: none;
        }
    }

    :deep(.p-button.button-link:hover),
    :deep(.p-button.button-link:focus-visible) {
        color: var(--p-primary-600);
    }

    :deep(.p-button.button-link:active) {
        color: var(--p-primary-700);
    }
}
</style>
