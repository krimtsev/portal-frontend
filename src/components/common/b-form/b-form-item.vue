<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    hideLabel?: boolean
    label?: string
    required?: boolean
    columnContent?: boolean
}>()

const labelText = computed(() => {
    return `${props.label} `
})
</script>

<template>
    <div class="b-form-item">
        <div
            v-show="!props.hideLabel"
            class="form-item-label"
        >
            <div
                v-if="label"
                class="label"
                :class="{ required: props.required }"
            >
                <div :class="{ 'label-content': required }" >
                    {{ labelText }}
                </div>
            </div>
        </div>

        <div
            class="form-item-content"
            :class="{ 'flex-column': columnContent }"
        >
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-form-item {
    @include flex-start;

    min-height: 40px;

    & ~ .b-form-item,
    & ~ * > .b-form-item {
        margin-top: $indent-x3;
    }

    &.label-align-top {
        align-items: flex-start;

        > .form-item-label {
            margin-top: 0;
        }
    }

    &.label-align-center {
        align-items: center;

        > .form-item-label {
            margin-top: 0;
        }
    }

    .form-item-label {
        flex-shrink: 0;
        width: $left-part-width;
        margin-top: calc($indent-x1 + 4px);
        margin-right: $indent-x2;

        .label {
            display: block;
            color: var(--p-surface-400);

            &-content {
                display: inline;
            }

            &.required::after {
                content: "*";
            }
        }
    }

    .form-item-content {
        @include flex-start;

        width: 100%;
        max-width: calc($input-width * 2);

        &.flex-column {
            align-items: flex-start;
        }

        .flex-row {
            width: 100%;
        }
    }
}
</style>
