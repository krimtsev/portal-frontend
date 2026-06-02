<script setup lang="ts">
import PrimeSelect from "primevue/select"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<any>()

const emit = defineEmits<{
    (e: "change"): void
    (e: "hide"): void
    (e: "clear"): void
}>()

const props = withDefaults(defineProps<{
    options:      any[]
    placeholder?: string
    disabled?:    boolean
    error?:       string
    filter?:      boolean
    optionLabel?: string
    optionValue?: string
    isLoading?:   boolean
    showClear?:   boolean
    checkmark?:   boolean
}>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
    optionLabel: "title",
    optionValue: "id",
    isLoading:   false,
    showClear:   false,
    filter:      undefined,
    checkmark:   true,
})

const onClear = (event: Event, clearCallback: Function) => {
    clearCallback(event)
    emit("clear")
    emit("change")
}
</script>

<template>
    <div class="b-select">
        <prime-select
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
            :checkmark="props.checkmark"
            class="select"
            @change="emit('change')"
            @hide="emit('hide')"
        >
            <template #clearicon="{ clearCallback }">
                <i
                    class="pi pi-times clear-icon"
                    @click.stop="onClear($event, clearCallback)"
                />
            </template>
        </prime-select>

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-select {
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

    .clear-icon {
        align-self: center;
        color: var(--p-form-field-icon-color);
        inset-inline-end: var(--p-multiselect-dropdown-width);
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }
}
</style>
