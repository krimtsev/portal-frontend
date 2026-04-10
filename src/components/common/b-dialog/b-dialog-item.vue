<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    hideLabel?:     boolean
    label?:         string
    required?:      boolean
    columnContent?: boolean
}>()

const labelText = computed(() => {
    return `${props.label} `
})
</script>

<template>
    <div class="b-dialog-item">
        <div
            v-show="!props.hideLabel"
            class="dialog-item-label"
        >
            <div
                v-if="label"
                class="label"
                :class="{ required: props.required }"
            >
                <div :class="{ 'label-content': required }">
                    {{ labelText }}
                </div>
            </div>
        </div>

        <div
            class="dialog-item-content"
            :class="{ 'flex-column': columnContent }"
        >
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-dialog-item {
    @include flex-start;

    min-height: 40px;

    & ~ .b-dialog-item,
    & ~ * > .b-dialog-item {
        margin-top: $indent-x3;
    }

    &.short-gap {
        & + .b-dialog-item {
            margin-top: $indent-x1;
        }
    }

    &.label-align-top {
        align-items: flex-start;

        > .dialog-item-label {
            margin-top: 0;
        }
    }

    &.label-align-center {
        align-items: center;

        > .dialog-item-label {
            margin-top: 0;
        }
    }

    .dialog-item-label {
        flex-shrink: 0;
        width: $dialog-left-part-width;
        margin-top: $label-indent;
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

    .dialog-item-content {
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
