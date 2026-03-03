<script setup lang="ts">
import { computed } from "vue"
import PrimeDatePicker from "primevue/datepicker"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import { DateTime } from "luxon"

interface DatePicker {
    name?:            string
    placeholder?:     string
    disabled?:        boolean
    error?:           string
    showTime?:        boolean
    hourFormat?:      string
    timeOnly?:        boolean
    dateFormat?:      string
    manualInput?:     boolean
    showClear?:       boolean
    updateModelType?: "date" | "string"
    showButtonBar?:   boolean
}

const props = withDefaults(defineProps<Partial<DatePicker>>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
    manualInput: false,
    showClear:   false,
    dateFormat: "yy-mm-dd"
})

const modelValue = defineModel<Date | Date[] | (Date | null)[] | null | undefined>()

const internalModel = computed({
    get() {
        if (!modelValue.value) return null

        if (modelValue.value instanceof Date) {
            return modelValue.value
        }

        if (typeof modelValue.value === "string") {
            return DateTime
                .fromISO(modelValue.value, { zone: "utc" })
                .toLocal()
                .toJSDate()
        }

        return modelValue.value
    },
    set(value) {
        modelValue.value = value ?? null
    }
})
</script>

<template>
    <div class="b-date-picker">
        <prime-date-picker
            v-model="internalModel"
            :name="props.name"
            :disabled="props.disabled"
            :placeholder="props.placeholder"
            :show-time="props.showTime"
            :hour-format="props.hourFormat"
            :time-only="props.timeOnly"
            :date-format="props.dateFormat"
            :manual-input="props.manualInput"
            :show-clear="props.showClear"
            :update-model-type="props.updateModelType"
            :show-button-bar="props.showButtonBar"
            :invalid="!!props.error"
            fluid
            class="date-picker"
        />

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-date-picker {
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
}
</style>
