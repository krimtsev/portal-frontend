<script setup lang="ts">
import { computed } from "vue"
import PrimeTextarea from "primevue/textarea"
import PrimeMessage from "primevue/message"

interface Textarea {
    name: string
    label: string
    error: string
    rows: number
    cols: number
    fullWidth: boolean
    placeholder: string
    disabled: boolean
    hint?: string | string[]
}

const props = withDefaults(defineProps<Partial<Textarea>>(), {
    rows: 5,
    cols: 30,
})

const model = defineModel<string>()

const hint = computed(() => {
    if (!props.hint) return []
    if (Array.isArray(props.hint)) return props.hint
    return [props.hint]
})

</script>

<template>
    <div class="b-textarea">
        <label
            v-if="props.label"
            :for="props.name"
            class="label"
        >
            {{ props.label }}
        </label>

        <prime-textarea
            v-model="model"
            :name="name"
            :rows="props.rows"
            :cols="props.cols"
            :fluid="props.fullWidth"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            style="resize: none"
            class="textarea"
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

    :deep(.p-textarea)  {
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

    .hint {
        padding-top: $indent-x1;
        color: var(--p-surface-500);
    }
}
</style>
