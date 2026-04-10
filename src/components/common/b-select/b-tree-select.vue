<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import PrimeTreeSelect from "primevue/treeselect"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<any>()

const emit = defineEmits<{
    (e: "hide"): void
    (e: "clear"): void
}>()

const props = withDefaults(defineProps<{
    options:             any[]
    disabled?:           boolean
    placeholder?:        string
    error?:              string
    filter?:             boolean
    isLoading?:          boolean
    showClear?:          boolean
    appendTo?:           "body" | "self"
    maxSelectedLabels?:  number
    selectedItemsLabel?: string
    selectedCount?:      number
    selectionMode?:      "single" | "multiple" | "checkbox"
    mapValue?:           boolean
}>(), {
    placeholder:        "",
    disabled:           false,
    error:              "",
    isLoading:          false,
    showClear:          false,
    appendTo:           "self",
    maxSelectedLabels:  1,
    selectionMode:      "single",
    filter:             undefined,
    selectedCount:      undefined,
    selectedItemsLabel: undefined,
})

const { t } = useI18n()

const selectedItemsLabel = computed(() => {
    if (props.selectedItemsLabel) return props.selectedItemsLabel

    if (!!props.selectedCount) {
        return t("mc.select.elements", props.selectedCount)
    }
})

const internalSelection = computed({
    get: () => {
        if (!props.mapValue) return model.value

        // Преобразуем число/строку в { [val]: true }
        return (model.value !== null && model.value !== undefined)
            ? { [model.value]: true }
            : null
    },
    set: (val) => {
        if (!props.mapValue) {
            model.value = val
            return
        }

        // Преобразуем { [id]: true } обратно в ID
        if (val && typeof val === "object") {
            const keys = Object.keys(val)
            const result = keys.length > 0 ? keys[0] : null
            model.value = result && !isNaN(Number(result)) ? Number(result) : result
        } else {
            model.value = null
        }
    },
})
</script>

<template>
    <div class="b-tree-select">
        <prime-tree-select
            v-model="internalSelection"
            :options="props.options"
            :disabled="props.disabled"
            :filter="props.filter"
            :placeholder="props.placeholder"
            :invalid="!!props.error"
            :loading="props.isLoading"
            :show-clear="props.showClear"
            :max-selected-labels="props.maxSelectedLabels"
            :append-to="props.appendTo"
            :selection-mode="props.selectionMode"
            :selected-items-label="selectedItemsLabel"
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
        </prime-tree-select>

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-tree-select {
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
