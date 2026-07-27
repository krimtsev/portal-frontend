<script setup lang="ts">
import Skeleton from "primevue/skeleton"
</script>

<template>
    <div
        class="timeline-event"
        style="grid-area: 2 / 1 / auto / 12"
    >
        <Skeleton height="1rem" style="width: 100%" />
    </div>

    <div
        class="timeline-event"
        style="grid-area: 3 / 8 / auto / 20;"
    >
        <Skeleton height="1rem" style="width: 100%" />
    </div>

    <div
        class="timeline-event"
        style="grid-area: 3 / 22 / auto / 26;"
    >
        <Skeleton height="1rem" style="width: 100%" />
    </div>

    <div
        class="timeline-event"
        style="grid-area: 4 / 15 / auto / 29;"
    >
        <Skeleton height="1rem" style="width: 100%" />
    </div>
</template>
