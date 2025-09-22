<script setup lang="ts">
import { ref } from "vue"
import PrimeInputText from "primevue/inputtext"
import PrimeButton from "primevue/button"

const model = defineModel<string>()
const showButton = ref(false)

const emit = defineEmits(["change"])

const props = withDefaults(defineProps<{
    placeholder?: string
}>(), {
    placeholder: "",
})

function onChange() {
    const trimmed = model.value?.trim() ?? ""
    model.value = trimmed
    emit("change", trimmed)
    showButton.value = !!trimmed
}

function onClear() {
    model.value = ""
    emit("change", "")
    showButton.value = false
}
</script>

<template>
    <div class="b-input-search">
        <prime-input-text
            v-model="model"
            :placeholder="props.placeholder"
            type="text"
            class="input"
            @change="onChange"
        />
        <prime-button
            v-if="showButton"
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
