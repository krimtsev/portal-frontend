<script setup lang="ts">
import BButtonGroup from "@c/common/b-button-groups/b-button-group.vue"

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
        <b-button-group
            v-for="(button, index) in items"
            :key="index"
            :label="button.label"
            :active="props.modelValue === button.value"
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
