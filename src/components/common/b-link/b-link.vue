<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    label:       string
    href?:       string
    asInternal?: boolean
}>()

const isExternal = computed(() => !!props.href && !props.asInternal)

const componentTag = computed(() => {
    if (!props.href) return "span"
    return props.asInternal ? "router-link" : "a"
})

const linkProps = computed(() => {
    if (!props.href) return {}

    if (props.asInternal) {
        return { to: props.href }
    }

    return {
        href:   props.href,
        target: "_blank",
        rel:    "noopener noreferrer",
    }
})
</script>

<template>
    <div class="b-link">
        <component
            :is="componentTag"
            v-bind="linkProps"
            class="button-link"
            :class="{ 'is-external': isExternal }"
        >
            <span class="label">{{ props.label }}</span>

            <i
                v-if="isExternal"
                class="pi pi-arrow-up-right external-icon"
            />
        </component>
    </div>
</template>

<style scoped lang="scss">
.b-link {
    display: inline-block;
    align-items: flex-end;

    .button-link {
        display: inline-flex;
        align-items: flex-end;
        text-decoration: none;
        color: var(--p-surface-0);
        cursor: pointer;
        line-height: 1;

        &.is-external {
            color: var(--p-primary-600);
        }

        &:hover,
        &:focus-visible {
            color: var(--p-primary-hover-color);
        }

        &:active {
            color: var(--p-primary-active-color);
        }
    }

    .label {
        white-space: nowrap;
    }

    .external-icon {
        margin-left: 4px;
        font-size: 0.75rem;
        padding-bottom: 2px;
    }
}
</style>
