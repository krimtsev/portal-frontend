<script setup lang="ts">
import { computed } from "vue"
import PrimeIconField from "primevue/iconfield"
import PrimeInputIcon from "primevue/inputicon"
import PrimeInputText from "primevue/inputtext"

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

const isShowClear = computed(() => !!model.value?.trim())

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
    <prime-icon-field class="b-input-search">
        <prime-input-text
            v-model="model"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            class="input"
            @change="onChange"
        />

        <prime-input-icon
            v-if="isShowClear"
            class="pi pi-times close"
            @click="onClear"
        />

        <prime-input-icon
            v-else
            class="pi pi-search search"
        />
    </prime-icon-field>
</template>

<style scoped lang="scss">
.b-input-search {
    .close {
        cursor: pointer;

        &:hover {
            color: var(--p-surface-200);
        }
    }

    .input {
        width: 100%;
    }
}
</style>
