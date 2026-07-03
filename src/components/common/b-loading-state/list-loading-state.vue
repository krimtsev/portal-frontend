<script setup lang="ts">
import PrimeSkeleton from "primevue/skeleton"

const props = defineProps<{
    widthBorder?: boolean
}>()

</script>

<template>
    <div
        class="list-loading-state"
        :class="{
            'border': props.widthBorder
        }"
    >
        <div class="group">
            <prime-skeleton width="14.2857rem" height="1.1429rem" />
            <prime-skeleton width="8.5714rem" height="1.1429rem" />
            <prime-skeleton width="11.4286rem" height="1.1429rem" />
        </div>
        <div class="group">
            <prime-skeleton width="5.7143rem" height="1.1429rem" />
            <prime-skeleton width="11.4286rem" height="1.1429rem" />
            <prime-skeleton width="8.5714rem" height="1.1429rem" />
        </div>
        <div class="group">
            <prime-skeleton width="11.4286rem" height="1.1429rem" />
            <prime-skeleton width="14.2857rem" height="1.1429rem" />
            <prime-skeleton width="8.5714rem" height="1.1429rem" />
        </div>
        <div class="group">
            <prime-skeleton width="8.5714rem" height="1.1429rem" />
            <prime-skeleton width="14.2857rem" height="1.1429rem" />
            <prime-skeleton width="11.4286rem" height="1.1429rem" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.list-loading-state {
    display: flex;
    gap: $indent-x4;
    width: 100%;
    height: 100%;
    min-height: 296px;
    background-color: var(--p-dashboard-card-background);
    padding-top: $indent-x2;

    &.border {
        border: 1px solid var(--p-divider-border-color);
        border-radius: $indent-x2;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: $indent-x4;
    }
}
</style>
