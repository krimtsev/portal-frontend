<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from "vue"
import PrimeSelect from "primevue/select"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<any>()

const emit = defineEmits<{
    (e: "change"): void
    (e: "hide"): void
    (e: "clear"): void
}>()

const props = withDefaults(defineProps<{
    options:       any[]
    placeholder?:  string
    disabled?:     boolean
    error?:        string
    filter?:       boolean
    optionLabel?:  string
    optionValue?:  string
    isLoading?:    boolean
    showClear?:    boolean
    checkmark?:    boolean
    appendTo?:     "body" | "self"
    overlayWidth?: string
    fullWidth?:    boolean
}>(), {
    placeholder:  "",
    disabled:     false,
    error:        "",
    optionLabel:  "title",
    optionValue:  "id",
    isLoading:    false,
    showClear:    false,
    filter:       undefined,
    checkmark:    true,
    appendTo:     "body",
    overlayWidth: "296px",
    fullWidth:    false,
})

const selectRef = useTemplateRef<InstanceType<typeof PrimeSelect>>("selectRef")

const onClear = (event: Event, clearCallback: Function) => {
    clearCallback(event)
    emit("clear")
    emit("change")
}

watch(
    () => (selectRef.value as any)?.overlayVisible,
    (isVisible) => {
        if (isVisible && props.filter) {
            nextTick(() => {
                const selectInstance = selectRef.value as any
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
        class="b-select"
        :class="{
            'full-width': props.fullWidth,
        }"
    >
        <prime-select
            ref="selectRef"
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
            :auto-filter-focus="false"
            :append-to="props.appendTo"
            :panel-style="panelStyle"
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
