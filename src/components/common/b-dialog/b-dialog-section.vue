<script setup lang="ts">
const props = defineProps<{
    counter?: boolean
}>()
</script>

<template>
    <section class="b-dialog-section">
        <div
            v-if="props.counter"
            class="section-ctr"
        >
            <div class="counter" />
        </div>

        <div class="section-body">
            <slot />
        </div>
    </section>
</template>

<style scoped lang="scss">
$section-ctr-width: 40px;
$ctr-size: 24px;

.b-dialog-section {
    display: flex;
    flex-wrap: wrap;
    counter-increment: section;

    .section-ctr {
        @include flex-width($section-ctr-width);

        .counter::before {
            @include p-bold();

            content: counter(section);
            display: inline-block;
            width: $ctr-size;
            height: $ctr-size;
            border-radius: 50%;
            background-color: var(--p-primary-500);
            text-align: center;
        }
    }

    .section-body {
        @include flex-width(calc(100% - #{$section-ctr-width}));

        margin-bottom: $indent-x3;
    }

    &:last-of-type {
        .section-body {
            margin-bottom: 0;
        }
    }
}
</style>
