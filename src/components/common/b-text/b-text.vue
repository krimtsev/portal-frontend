<script setup lang="ts">
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import { valueOrDash } from "@/lib/utils"


interface BText {
    isLoading?: boolean
    value?: string | number | null
    preloadWidth?: string
    classes?: string | string[]
    asLink?: boolean
}

const props = withDefaults(defineProps<BText>(), {
    value: "",
    isLoading: false,
    preloadWidth: "25%"
})
</script>

<template>
    <b-skeleton
        v-if="props.isLoading"
        :width="props.preloadWidth"
    />
    <span
        v-else
        class="b-text"
        :class="[
            classes,
            {
                'as-link': props.asLink
            }
        ]"
    >
        {{ valueOrDash(props.value) }}
    </span>
</template>

<style lang="scss" scoped>
.b-text {
    display: inline-block;

    &.as-link {
        cursor: pointer;
        color: var(--p-button-primary-background);

        &:hover,
        &:focus-visible {
            color: var(--p-button-primary-hover-background);
        }

        &:active {
            color: var(--p-button-primary-active-background);
        }
    }
}
</style>
