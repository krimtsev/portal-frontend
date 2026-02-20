<script setup lang="ts">
import { computed } from "vue"
import PrimeTextarea from "primevue/textarea"
import BInputError from "@c/common/b-input/b-input-error.vue"

const model = defineModel<string>()

const props = withDefaults(defineProps<{
    name?:        string,
    placeholder?: string
    disabled?:    boolean
    error?:       string
    rows?:        number | string
    cols?:        number | string
    hint?:        string | string[]
}>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
    rows:        5,
    cols:        30,
})

const hint = computed(() => {
    if (!props.hint) return []
    if (Array.isArray(props.hint)) return props.hint
    return [props.hint]
})

</script>

<template>
    <div class="b-textarea">
        <prime-textarea
            v-model="model"
            :name="name"
            :rows="props.rows"
            :cols="props.cols"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            style="resize: none"
            class="textarea"
        />

        <b-input-error :error="props.error" />

        <div
            v-if="hint.length"
            class="hint"
        >
            <p
                v-for="(text, index) in hint"
                :key="index"
            >
                {{ text }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-textarea {
    display: flex;
    flex-direction: column;
    width: $input-width;

    &.full-width {
        width: 100%;
    }

    :deep(.p-textarea)  {
        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }

    .hint {
        padding-top: $indent-x1;
        color: var(--p-surface-500);
    }
}
</style>
