<script setup lang="ts">
import PrimeToggleSwitch from "primevue/toggleswitch"
import BInputError from "@c/common/b-input/b-input-error.vue"

const model = defineModel<boolean>()

const props = withDefaults(defineProps<{
    name?:        string,
    disabled?:    boolean
    error?:       string
}>(), {
    disabled:    false,
    error:       "",
})
</script>

<template>
    <div class="b-toggle-switch">
        <prime-toggle-switch
            v-model="model"
            :disabled="props.disabled"
            :name="props.name"
            :invalid="!!props.error"
            type="text"
            class="input"
        />

        <b-input-error :error="props.error" />
    </div>
</template>
