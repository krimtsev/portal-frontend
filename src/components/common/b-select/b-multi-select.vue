<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import PrimeMultiSelect from "primevue/multiselect"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

export interface MultiSelectItem {
    id:            string | number | boolean
    items?:        MultiSelectItem[]
    [key: string]: any
}

const model = defineModel<any>()

const emit = defineEmits<{
    (e: "hide"): void
    (e: "clear"): void
    (e: "submit", value: any): void
}>()

const props = withDefaults(defineProps<{
    options:             MultiSelectItem[]
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
    showToggleAll?:      boolean
    appendTo?:           "body" | "self"
    submitLabel?:        string
    overlayWidth?:       string
    fullWidth?:          boolean
}>(), {
    placeholder:        "",
    disabled:           false,
    error:              "",
    optionLabel:        "title",
    optionValue:        "id",
    isLoading:          false,
    showClear:          false,
    maxSelectedLabels:  1,
    appendTo:           "self",
    showToggleAll:      false,
    selectedItemsLabel: undefined,
    submitLabel:        "Применить",
    overlayWidth:       "296px",
    fullWidth:          false,
})

const { t } = useI18n()

const multiselectRef = useTemplateRef<InstanceType<typeof PrimeMultiSelect>>("multiselectRef")

const internalValue = ref<any>()

const isGrouped = computed(() => Array.isArray(props.options[0]?.items))

const isOptionsEmpty = computed(() => {
    return (model.value?.length ?? 0) > 0 && props.options.length === 0
})

const selectedItemsLabel = computed(() => {
    if (isOptionsEmpty.value) return props.placeholder

    if (props.selectedItemsLabel) return props.selectedItemsLabel

    if (Array.isArray(internalValue.value) && internalValue.value.length) {
        return t("mc.select.elements", internalValue.value.length)
    }

    return props.placeholder
})

const maxSelectedLabels = computed(() => {
    if (isOptionsEmpty.value) return 0
    return props.maxSelectedLabels
})

const applyChanges = () => {
    if (Array.isArray(internalValue.value)) {
        model.value = [...internalValue.value]
    } else {
        model.value = internalValue.value
    }

    emit("submit", model.value)
    multiselectRef.value?.hide()
}

const handleHide = () => {
    if (Array.isArray(model.value)) {
        internalValue.value = [...model.value]
    } else {
        internalValue.value = model.value
    }
    emit("hide")
}

watch(model, (newValue) => {
    if (Array.isArray(newValue)) {
        internalValue.value = [...newValue]
    } else {
        internalValue.value = newValue
    }
}, { immediate: true })

const onClear = (event: Event, clearCallback: Function) => {
    clearCallback(event)
    internalValue.value = []
    model.value = []
    emit("submit", model.value)
    emit("clear")
}

watch(
    () => (multiselectRef.value as any)?.overlayVisible,
    (isVisible) => {
        if (isVisible && props.filter) {
            nextTick(() => {
                const selectInstance = multiselectRef.value as any
                const overlayElement = selectInstance?.overlay

                if (overlayElement) {
                    const input = overlayElement.querySelector('input[role="searchbox"]') as HTMLInputElement | null
                    if (input) {
                        input.focus()
                    }
                }
            })
        }
    },
)

const panelStyle = computed(() => {
    if (props.fullWidth) {
        return props.appendTo === "self"
            ? { width: "100%", "min-width": "100%" }
            : { width: "auto" }
    }
    return {
        "min-width": props.overlayWidth,
        width:       props.overlayWidth,
    }
})
</script>

<template>
    <div
        class="b-multi-select"
        :class="{
            'full-width': props.fullWidth,
        }"
    >
        <prime-multi-select
            ref="multiselectRef"
            v-model="internalValue"
            :options="options"
            :disabled="props.disabled"
            :filter="props.filter"
            :option-label="props.optionLabel"
            :option-value="props.optionValue"
            :placeholder="props.placeholder"
            :invalid="!!props.error"
            :loading="props.isLoading"
            :show-clear="props.showClear"
            :max-selected-labels="maxSelectedLabels"
            :append-to="props.appendTo"
            :selected-items-label="selectedItemsLabel"
            :show-toggle-all="props.showToggleAll"
            :auto-filter-focus="false"
            :option-group-label="isGrouped
                ? props.optionLabel
                : undefined"
            :option-group-children="isGrouped
                ? 'items'
                : undefined"
            :panel-style="panelStyle"
            class="select"
            @hide="handleHide"
        >
            <template #clearicon="{ clearCallback }">
                <i
                    class="pi pi-times clear-icon"
                    @click.stop="onClear($event, clearCallback)"
                />
            </template>

            <template #optiongroup="{ option }">
                <div
                    class="option-group-label"
                    :data-empty="!option[props.optionLabel]"
                >
                    {{ option[props.optionLabel] }}
                </div>
            </template>

            <template #footer>
                <div class="footer">
                    <prime-button
                        :label="props.submitLabel"
                        class="submit-button"
                        @click="applyChanges"
                    />
                </div>
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

    :deep(.p-multiselect-option-group:has([data-empty="true"])) {
        display: none;
    }

    .footer {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding: $indent-x2 $indent-x2;
        box-shadow: inset 0 1px 0 0 var(--p-divider-border-color);
        cursor: default;

        .submit-button {
            min-width: 104px;
            padding: var(--p-multiselect-option-padding);
        }
    }
}
</style>
