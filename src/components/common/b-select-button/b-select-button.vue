<script setup lang="ts">
import PrimeSelectButton from "primevue/selectbutton"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<any>()

const props = withDefaults(defineProps<{
    name?:        string
    disabled?:    boolean
    error?:       string
    options:      any[]
    optionLabel?: string
    optionValue?: string
    allowEmpty?:  boolean
    optionClass?: string | Record<string, string> | ((option: any) => string)
}>(), {
    name:        undefined,
    disabled:    false,
    error:       "",
    allowEmpty:  false,
    optionLabel: undefined,
    optionValue: undefined,
    optionClass: undefined,
})

function resolveOptionClass(option: any): string {
    if (!props.optionClass) return ""

    if (typeof props.optionClass === "function") {
        return props.optionClass(option)
    }

    if (typeof props.optionClass === "object") {
        const val = props.optionValue ? option[props.optionValue] : option
        return props.optionClass[val] || ""
    }

    return option[props.optionClass] || ""
}
</script>

<template>
    <div class="b-select-button">
        <prime-select-button
            v-model="model"
            :disabled="props.disabled"
            :options="props.options"
            :option-label="props.optionLabel"
            :option-value="props.optionValue"
            :allow-empty="props.allowEmpty"
            :name="props.name"
            :invalid="!!props.error"
            class="select-button"
        >
            <template #option="slotProps">
                <span :class="resolveOptionClass(slotProps.option)">
                    <slot name="option" v-bind="slotProps">
                        {{ slotProps.option[props.optionLabel || 'name'] }}
                    </slot>
                </span>
            </template>
        </prime-select-button>

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-select-button {
    &.full-width {
        width: 100%;
    }

    :deep(.p-selectbutton) {
        .p-togglebutton:has(.status-danger).p-togglebutton-checked {
            .p-togglebutton-content {
                background-color: var(--p-red-400);
                border-color: var(--p-red-400);
            }
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }
}
</style>
