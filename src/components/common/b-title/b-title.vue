<script setup lang="ts">
enum Variants {
    Sm = "sm",
    Md = "md",
    Lg = "lg"
}

const props = withDefaults(defineProps<{
    title: string,
    variant?: Variants
}>(), {
    variant: Variants.Md
})
</script>

<template>
    <div
        class="b-title"
        :class="{
            'variant-sm': props.variant === Variants.Sm,
            'variant-md': props.variant === Variants.Md,
            'variant-lg': props.variant === Variants.Lg
        }"
    >
        {{ props.title }}
    </div>
</template>

<style scoped lang="scss">
.b-title {
    &.variant-sm {
        font-weight: 500;
        font-size: 1.2857rem; // 18px
        line-height: 1.7143rem; // 24px
    }

    &.variant-md {
        font-weight: 500;
        font-size: 1.7143rem; // 24px
        line-height: 2.2857rem; // 32px
    }

    &.variant-lg {
        font-weight: 500;
        font-size: 2.2857rem; // 32px
        line-height: 2.8571rem; // 40px
    }
}
</style>
