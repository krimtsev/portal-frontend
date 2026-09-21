<script setup lang="ts">
import { computed } from "vue"
import PrimeDatePicker from "primevue/datepicker"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

interface DatePicker {
    name?:                 string
    placeholder?:          string
    disabled?:             boolean
    error?:                string
    showTime?:             boolean
    hourFormat?:           string
    timeOnly?:             boolean
    dateFormat?:           string
    manualInput?:          boolean
    showClear?:            boolean
    modelType?:            "date" | "string"
    showButtonBar?:        boolean
    selectionMode?:        "single" | "multiple" | "range"
    minDate?:              Date
    maxDate?:              Date
    showOtherMonths?:      boolean
    view?:                 "date" | "month" | "year"
    hideOnRangeSelection?: boolean
    maxRangeDays?:         number
}

const modelValue = defineModel<Date | Array<Date> | Array<Date | null> | undefined | null>()

const emit = defineEmits<{
    (e: "hide"): void
    (e: "date-select", value: Date | Array<Date | null>): void
}>()

const props = withDefaults(defineProps<Partial<DatePicker>>(), {
    placeholder:     "",
    disabled:        false,
    error:           "",
    manualInput:     false,
    showClear:       false,
    dateFormat:      "yy-mm-dd",
    showOtherMonths: false,
    modelType:       "date",
    view:            "date",
    maxRangeDays:    0,
})

function dateSelect(value: Date | Array<Date | null>) {
    emit("date-select", value)
}

const computedMinDate = computed<Date | undefined>(() => {
    if (
        props.selectionMode === "range" &&
        props.maxRangeDays > 0 &&
        Array.isArray(modelValue.value)
    ) {
        const [startDate, endDate] = modelValue.value

        if (startDate && !endDate) {
            const start = startDate instanceof Date ? startDate : new Date(startDate)
            if (!isNaN(start.getTime())) {
                return props.minDate && props.minDate > start ? props.minDate : start
            }
        }
    }
    return props.minDate
})

const computedMaxDate = computed<Date | undefined>(() => {
    if (
        props.selectionMode === "range" &&
        props.maxRangeDays > 0 &&
        Array.isArray(modelValue.value)
    ) {
        const [startDate, endDate] = modelValue.value

        if (startDate && !endDate && props.maxRangeDays) {
            const start = startDate instanceof Date ? startDate : new Date(startDate)
            if (!isNaN(start.getTime())) {
                const max = new Date(start)
                max.setDate(max.getDate() + (props.maxRangeDays - 1))

                return props.maxDate && props.maxDate < max ? props.maxDate : max
            }
        }
    }
    return props.maxDate
})
</script>

<template>
    <div class="b-date-picker">
        <prime-date-picker
            v-model="modelValue"
            :name="props.name"
            :disabled="props.disabled"
            :placeholder="props.placeholder"
            :show-time="props.showTime"
            :hour-format="props.hourFormat"
            :time-only="props.timeOnly"
            :date-format="props.dateFormat"
            :manual-input="props.manualInput"
            :show-clear="props.showClear"
            :update-model-type="props.modelType"
            :show-button-bar="props.showButtonBar"
            :invalid="!!props.error"
            :selection-mode="props.selectionMode"
            :min-date="computedMinDate"
            :max-date="computedMaxDate"
            :view="props.view"
            :hide-on-range-selection="props.hideOnRangeSelection"
            fluid
            class="date-picker"
            :class="{
                'readonly-input': !props.disabled && !props.manualInput,
            }"
            :readonly="props.disabled"
            :show-other-months="props.showOtherMonths"
            @hide="emit('hide')"
            @date-select="dateSelect"
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

    .readonly-input {
        :deep(.p-inputtext) {
            cursor: pointer;
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }
}
</style>
