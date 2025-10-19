<script setup lang="ts">
import { computed } from "vue"
import PrimeInputText from "primevue/inputtext"
import PrimeButton from "primevue/button"

// Это и есть связь с внешним v-model
const model = defineModel<string>()

const emit = defineEmits<{
    (e: "change", value: string): void
}>()

const props = withDefaults(
    defineProps<{
        placeholder?: string
        pattern?: RegExp
        disabled?: boolean
    }>(),
    {
        placeholder: "",
        pattern: undefined,
        disabled: false,
    }
)

const showButton = computed(() => !!model.value?.trim())

function onChange(evt: Event): void {
    const target = evt.target as HTMLInputElement
    const trimmed = target.value?.trim() ?? ""

    if (!props.pattern || props.pattern.test(trimmed)) {
        model.value = trimmed
    } else {
        model.value = ""
    }

    emit("change", model.value)
}

function onClear() {
    model.value = ""
    emit("change", "")
}
</script>

<template>
    <div class="b-input-search">
        <prime-input-text
            v-model="model"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            type="text"
            class="input"
            @change="onChange"
        />

        <prime-button
            v-if="showButton"
            :disabled="props.disabled"
            icon="pi pi-times"
            size="small"
            rounded
            @click="onClear"
        />
    </div>
</template>

<style scoped lang="scss">
.b-input-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: $indent-x1;

    .input {
        width: 100%;
    }
}
</style>
