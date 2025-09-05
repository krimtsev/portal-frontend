<script setup lang="ts">
import PrimeButton from "primevue/button"
import { computed } from "vue"

const props = defineProps<{
    label: string
    href?: string
    asInternal?: boolean
}>()

const buttonProps = computed(() => {
    const isExternal = !!props.href

    return {
        variant: "link",
        ripple: false,
        class: [
            "button-link",
            { external: isExternal && !props.asInternal }
        ],
        ...(isExternal
            ? {
                target: "_blank",
                as: "a",
                iconPos: "right",
                icon: "pi pi-arrow-up-right"
            }
            : {})
    }
})
</script>

<template>
    <div class="b-link">
        <prime-button
            v-bind="buttonProps"
            :label="props.label"
            :href="props.href"
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

    :deep(.p-button) {
        // Основной стиль "ссылки-кнопки"
        &.button-link {
            color: var(--p-surface-0);
            text-decoration: none;
            padding: 0;
            border-radius: 0;

            &.external {
                color: var(--p-primary-600);
            }

            .p-button-label {
                text-decoration: none;
                text-align: start;
                white-space: nowrap;
            }
        }

        &.button-link:hover,
        &.button-link:focus-visible {
            color: var(--p-primary-600);
        }

        &.button-link:active {
            color: var(--p-primary-700);
        }
    }

    :deep(.p-button-icon-right) {
        padding-right: calc($indent-x1 / 2);
        font-size: 0.75rem;
    }
}
</style>
