<script setup lang="ts">
import { computed } from "vue"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import { valueOrDash } from "@/lib/utils"

type TextVariant = "link" | "p"

interface BText {
    isLoading?: boolean
    value?: string | number | null
    preloadWidth?: string
    classes?: string | string[]
    variant?: TextVariant
}

const props = withDefaults(defineProps<BText>(), {
    value: "",
    isLoading: false,
    preloadWidth: "25%"
})

const variantClass = computed(() => props.variant ?? "")
</script>

<template>
    <b-skeleton
        v-if="props.isLoading"
        :width="props.preloadWidth"
    />
    <span
        v-else
        class="b-text"
        :class="[classes, variantClass]"
    >
        {{ valueOrDash(props.value) }}
    </span>
</template>

<style lang="scss" scoped>
.b-text {
    display: inline-block;

    &.p {
        @include p();
    }

    &.link {
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
