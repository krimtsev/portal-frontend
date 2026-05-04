<script setup lang="ts">
import PrimeToggleSwitch from "primevue/toggleswitch"

const model = defineModel<boolean>()

const props = withDefaults(defineProps<{
    name?:     string
    disabled?: boolean
    error?:    string | boolean
}>(), {
    name:     undefined,
    disabled: false,
    error:    "",
})
</script>

<template>
    <div class="b-switch">
        <prime-toggle-switch
            v-model="model"
            :disabled="props.disabled"
            :name="props.name"
            :invalid="!!props.error"
            type="text"
            class="input"
        />
    </div>
</template>
