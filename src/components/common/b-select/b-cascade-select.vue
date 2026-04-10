<script setup lang="ts">
import PrimeCascadeSelect from "primevue/cascadeselect"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<any>()

const emit = defineEmits<{
    (e: "hide"): void
    (e: "clear"): void
}>()

const props = withDefaults(defineProps<{
    options:              any[]
    placeholder?:         string
    disabled?:            boolean
    error?:               string
    optionLabel?:         string
    optionValue?:         string
    optionGroupLabel?:    string | ((data: any) => string)
    optionGroupChildren?: string | string[] | ((data: any) => any[])
    isLoading?:           boolean
    showClear?:           boolean
    appendTo?:            "body" | "self"
}>(), {
    placeholder:         "",
    disabled:            false,
    error:               "",
    optionLabel:         "label",
    optionValue:         "value",
    isLoading:           false,
    showClear:           false,
    appendTo:            "self",
    optionGroupLabel:    undefined,
    optionGroupChildren: undefined,
})
</script>

<template>
    <div class="b-cascade-select">
        <prime-cascade-select
            v-model="model"
            :options="props.options"
            :disabled="props.disabled"
            :option-label="props.optionLabel"
            :option-value="props.optionValue"
            :option-group-label="props.optionGroupLabel"
            :option-group-children="props.optionGroupChildren"
            :placeholder="props.placeholder"
            :invalid="!!props.error"
            :loading="props.isLoading"
            :show-clear="props.showClear"
            :append-to="props.appendTo"
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
        </prime-cascade-select>

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-cascade-select {
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
