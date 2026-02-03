<script setup lang="ts">
withDefaults(defineProps<{
    noPaddings?: boolean
}>(), {
    noPaddings: false
})
</script>

<template>
    <div
        class="b-toolbar"
        :class="{
            'no-paddings': noPaddings,
        }"
    >
        <div class="b-toolbar-wrapper">
            <slot />

            <div class="right-side">
                <slot name="right-side" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-toolbar {
    width: 100%;
    padding: $indent-x2 $indent-x2 0 $indent-x2;
    border-top-left-radius: $indent-x2;
    border-top-right-radius: $indent-x2;
    background-color: var(--p-dashboard-card-background);

    &.no-paddings {
        padding: 0;
    }

    &-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;

        .right-side {
            @include flex-end;

            flex-grow: 1;
            align-items: center;
            min-height: 40px;
        }
    }
}
</style>
