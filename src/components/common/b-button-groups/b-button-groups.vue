<script setup lang="ts">
import BButton from "@c/common/b-button/b-button.vue"

interface ButtonGroupItems {
    label: string
    value: string
}

const props = defineProps<{
    modelValue: string
    items: ButtonGroupItems[]
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void
}>()
</script>

<template>
    <div class="b-button-groups">
        <b-button
            v-for="(button, index) in items"
            :key="index"
            :label="button.label"
            :outline="props.modelValue !== button.value"
            :disabled="props.disabled"
            @click="emit('update:modelValue', button.value)"
        />
    </div>
</template>

<style lang="scss" scoped>
.b-button-groups {
    display: flex;
    gap: $indent-x1;
    flex-wrap: wrap;
}
</style>
