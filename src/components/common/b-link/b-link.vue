<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    label: string
    href?: string
    path?: string
}>()

const isExternal = computed(() => !!props.href && !props.path)

const componentTag = computed(() => {
    if (props.path) return "router-link"
    if (props.href) return "a"
    return "span"
})

const linkProps = computed(() => {
    if (props.path) {
        return { to: props.path }
    }

    if (props.href) {
        return {
            href:   props.href,
            target: "_blank",
            rel:    "noopener noreferrer",
        }
    }

    return {}
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
        color: var(--p-link-color);
        cursor: pointer;
        line-height: 1;

        &.is-external {
            color: var(--p-link-external-color);
        }

        &:hover,
        &:focus-visible {
            color: var(--p-link-hover-color);
        }

        &:active {
            color: var(--p-link-active-color);
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
