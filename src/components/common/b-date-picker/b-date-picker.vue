<script setup lang="ts">
import PrimeDatePicker from "primevue/datepicker"
import PrimeMessage from "primevue/message"

interface DatePicker {
    name: string
    label: string
    error?: string
    fullWidth: boolean
    placeholder: string
    disabled: boolean
    showTime: boolean
    hourFormat: string
    timeOnly: boolean
    dateFormat: string
    manualInput: boolean
}

const props = withDefaults(defineProps<Partial<DatePicker>>(), {
    manualInput: false,
    dateFormat: "dd-mm-yy"
})

const model = defineModel<Date | Date[] | (Date | null)[] | null | undefined>()
</script>

<template>
    <div class="b-date-picker">
        <label
            v-if="props.label"
            :for="props.name"
            class="label"
        >
            {{ props.label }}
        </label>

        <prime-date-picker
            v-model="model"
            :name="props.name"
            :fluid="props.fullWidth"
            :disabled="props.disabled"
            :placeholder="props.placeholder"
            :show-time="props.showTime"
            :hour-format="props.hourFormat"
            :time-only="props.timeOnly"
            :date-format="props.dateFormat"
            :manual-input="props.manualInput"
        />

        <prime-message
            v-if="props.error"
            severity="error"
            size="small"
            variant="simple"
            class="error"
        >
            {{ props.error }}
        </prime-message>
    </div>
</template>

<style scoped lang="scss">
.b-date-picker {
    display: flex;
    flex-direction: column;

    :deep(.p-inputtext)  {
        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
        }
    }

    .label {
        margin-bottom: $indent-x1;
    }

    .error {
        margin-top: $indent-x1;
    }
}
</style>
