<script setup lang="ts">
withDefaults(defineProps<{
    header?: string
}>(), {
    header:   "",
})
</script>

<template>
    <div class="b-toolbar-item">
        <div
            v-if="header"
            class="header"
        >
            <span>{{ header }}</span>
        </div>

        <slot />
    </div>
</template>

<style scoped lang="scss">
.b-toolbar-item {
    @include flex-start;

    flex-direction: column;
    margin-right: $indent-x2;

    .header {
        @include flex-start;

        position: relative;
        align-items: center;
        margin-bottom: $indent-x1;
        color: var(--p-surface-200);
    }
}
</style>
