<script setup lang="ts">
defineProps<{
    label: string,
    required?: boolean
}>()
</script>

<template>
    <div class="portal-form-item">
        <div class="portal-form-item-label">
            <span class="label">
                {{ label }}
                <span v-if="required" class="required">*</span>
            </span>
        </div>
        <div class="portal-form-item-content">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.portal-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    & ~ .portal-form-item,
    & ~ * > .portal-form-item {
        margin-top: $indent-x2;
    }

    .portal-form-item-label {
        flex-shrink: 0;
        min-width: 208px;
        margin-top: $indent-x1;
        margin-right: $indent-x2;
        color: var(--p-surface-400);

        .label {
            @include p();

            .required {
                margin-left: calc($indent-x1 / 2);
            }
        }
    }

    &.label-align-top {
        align-items: flex-start;

        .portal-form-item-label {
            margin-top: 0;
        }
    }

    .portal-form-item-content {
        @include p();

        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
    }
}
</style>
