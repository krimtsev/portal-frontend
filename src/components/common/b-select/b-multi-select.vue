<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import PrimeMultiSelect from "primevue/multiselect"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const emit = defineEmits<{
    (e: "hide"): void
    (e: "clear"): void
}>()

const model = defineModel<any>()

const props = withDefaults(defineProps<{
    options:             any[],
    placeholder?:        string
    disabled?:           boolean
    error?:              string
    filter?:             boolean
    optionLabel?:        string
    optionValue?:        string
    isLoading?:          boolean
    showClear?:          boolean
    maxSelectedLabels?:  number
    selectedItemsLabel?: string
    selectedCount?:      number
    showToggleAll?:      boolean
    appendTo?:           "body" | "self"
}>(), {
    placeholder:       "",
    disabled:          false,
    error:             "",
    optionLabel:       "label",
    optionValue:       "value",
    isLoading:         false,
    showClear:         false,
    maxSelectedLabels: 1,
    appendTo:          "self",
    showToggleAll:     false,
})

const { t } = useI18n()

const selectedItemsLabel = computed(() => {
    if (props.selectedItemsLabel) return props.selectedItemsLabel

    if (!!props.selectedCount) {
        return t("mc.select.elements", props.selectedCount)
    }
})
</script>

<template>
    <div class="b-multi-select">
        <prime-multi-select
            v-model="model"
            :options="props.options"
            :disabled="props.disabled"
            :filter="props.filter"
            :option-label="props.optionLabel"
            :option-value="props.optionValue"
            :placeholder="props.placeholder"
            :invalid="!!props.error"
            :loading="props.isLoading"
            :show-clear="props.showClear"
            :max-selected-labels="props.maxSelectedLabels"
            :append-to="props.appendTo"
            :selected-items-label="selectedItemsLabel"
            :show-toggle-all="props.showToggleAll"
            class="select"
            @hide="emit('hide')"
        >
            <template #clearicon="{ clearCallback }">
                <i
                    class="pi pi-times clear-icon"
                    @click.stop="(event) => {
                        clearCallback(event)
                        emit('clear')
                    }"
                />
            </template>
        </prime-multi-select>

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-multi-select {
    display: flex;
    flex-direction: column;
    width: $input-width;

    &.full-width {
        width: 100%;
    }

    :deep(.p-inputtext)  {
        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }

    .clear-icon {
        align-self: center;
        color: var(--p-form-field-icon-color);
        inset-inline-end: var(--p-multiselect-dropdown-width);
    }
}
</style>
