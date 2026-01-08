<script setup lang="ts">
import { useBreadcrumbs } from "@/composables/breadcrumbs/use-breadcrumbs"

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
    <div class="breadcrumbs">
        <span class="breadcrumb-item">Панель администратора</span>
        <span
            v-for="(crumb, i) in breadcrumbs"
            :key="i"
            class="breadcrumb-item"
            :class="{ 'breadcrumb-last': i === breadcrumbs.length - 1 }"
        >
            {{ crumb.label }}
        </span>
    </div>
</template>

<style scoped lang="scss">
.breadcrumbs {
    display: flex;
    align-items: center;
}

.breadcrumb-item {
    position: relative;
    font-size: $font-size-h4;
    font-weight: 500;
    color: var(--p-surface-300);

    &::after {
        content: "/";
        margin: 0 0.5rem;
        color: var(--p-surface-300);
    }

    &.breadcrumb-last::after {
        content: "";
        margin: 0;
    }
}

.breadcrumb-last {
    color: var(--p-surface-0);
}
</style>
