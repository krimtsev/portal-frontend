<script setup lang="ts">
import { computed } from "vue"
import PrimeButton from "primevue/button"

type ButtonType = "submit" | "reset" | "button"
type ButtonVariant = "primary" | "secondary"

const props = defineProps<{
    label: string,
    type?: ButtonType
    widthFull?: boolean
    disabled?: boolean
    loading?: boolean
    variant?: ButtonVariant
    outline?: boolean
    external?: string
    download?: boolean
}>()

const severity = computed(() => {
    if (props.outline) return "secondary"
    return props.variant ?? "primary"
})

const commonProps = computed(() => {
    if (props.external) return {
        iconPos: "right",
        icon: "pi pi-arrow-up-right",
        as: "a",
        href: props.external,
        target: "_blank",
        rel: "noopener"
    }
    if (props.download) return {
        iconPos: "right",
        icon: "pi pi-download",
    }
    return {}
})
</script>

<template>
    <div class="b-button">
        <prime-button
            v-bind="commonProps"
            :label="props.label"
            :type="props.type"
            :disabled="props.disabled"
            :loading="props.loading"
            class="button"
            :severity="severity"
            :class="{
                'width-full': props.widthFull,
                'outline': props.outline,
            }"
        />
    </div>
</template>

<style scoped lang="scss">
.b-button {
    .button {
        min-width: 104px;
        text-decoration: none;

        &.width-full {
            width: 100%;
        }

        &.outline {
            background: transparent;
            border: 1px solid var(--p-portal-button-outline-border-color);
        }

        :deep(.p-button-icon-right) {
            padding-right: calc($indent-x1 / 2);
            font-size: 0.75rem;
        }
    }
}
</style>
