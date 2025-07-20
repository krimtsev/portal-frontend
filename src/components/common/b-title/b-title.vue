<script setup lang="ts">
type Variants = "sm" | "md" | "lg" | "xl"

const props = withDefaults(defineProps<{
    title: string,
    variant?: Variants
}>(), {
    variant: "md"
})
</script>

<template>
    <div
        class="b-title"
        :class="{
            'variant-sm': props.variant === 'sm',
            'variant-md': props.variant === 'md',
            'variant-lg': props.variant === 'lg',
            'variant-xl': props.variant === 'xl'
        }"
    >
        {{ props.title }}
    </div>
</template>

<style scoped lang="scss">
.b-title {
    &.variant-sm {
        @include h4();
    }

    &.variant-md {
        @include h3();
    }

    &.variant-lg {
        @include h2();
    }

    &.variant-xl {
        @include h1();
    }
}
</style>
