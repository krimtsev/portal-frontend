<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
    header?:      string
    emptyHeader?: boolean
}>(), {
    header: "",
})

const header = computed(() => {
    if (!props.header && !props.emptyHeader) return null
    return props.header || "\u00A0"
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

    & ~ .b-toolbar-item ,
    & ~ * > .b-toolbar-item  {
        margin-left: $indent-x2;
    }

    .header {
        @include flex-start;

        position: relative;
        align-items: center;
        margin-bottom: $indent-x1;
        color: var(--p-surface-200);
    }
}
</style>
