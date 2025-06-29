<script setup lang="ts">
import { computed } from "vue"

import PrimeImage from "primevue/image"

const props = defineProps<{
    src: string,
    width?: string,
    height?: string
}>()

const images = import.meta.glob('@a/images/**/*', {
    eager: true,
    query: '?url',
    import: 'default',
});

const src = computed(() => {
    if (props.src.startsWith('http')) return props.src;

    const matchingEntry = Object.entries(images).find(([key]) =>
        key.endsWith(`/${props.src}`)
    );

    if (!matchingEntry) return ""

    return matchingEntry[1] as string
});
</script>

<template>
    <div class="b-image">
        <prime-image
            :src="src"
            :width="props.width"
            :height="props.height"
        />
    </div>
</template>
