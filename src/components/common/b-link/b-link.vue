<script setup lang="ts">
import PrimeButton from "primevue/button"
import { computed } from "vue"

const props = defineProps<{
    label: string
    target?: string
    href?: string
    simple?: boolean
}>()

// Определяем ссылку как внешнюю
const isExternal = computed(() => {
    return !!props.href
})

</script>

<template>
    <div class="b-link">
        <prime-button
            :label="props.label"
            :href="props.href"
            :target="isExternal ? '_blank' : undefined"
            :as="isExternal ? 'a' : undefined"
            variant="link"
            class="button-link"
            :class="{
                'simple': props.simple
            }"

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
        text-decoration: none;
        padding: 0;

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
