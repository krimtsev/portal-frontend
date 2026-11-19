<script setup lang="ts">
import { computed, ref, watch } from "vue"

const props = withDefaults(defineProps<{
    src:  string | null
    alt?: string
}>(), {
    alt: "",
})

const loaded = ref(false)
const errored = ref(false)

const hasSrc = computed(() => !!props.src)
const showPreload = computed(() => !loaded.value && !errored.value)

watch(
    () => props.src,
    () => {
        loaded.value = false
        errored.value = false
    },
)

function onLoad() {
    loaded.value = true
}

function onError() {
    errored.value = true
}
</script>

<template>
    <div class="b-image-preview">
        <img
            v-if="hasSrc && !errored"
            :src="props.src!"
            :alt="props.alt"
            class="image"
            :class="{ 'image-loaded': loaded }"
            @load="onLoad"
            @error="onError"
        >
        <div
            v-if="showPreload"
            class="preload"
        />
    </div>
</template>

<style scoped lang="scss">
.b-image-preview {
    position: relative;
    width: 100%;

    .image {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto;
        opacity: 0;
        transition: opacity 0.35s ease;

        &-loaded {
            opacity: 1;
        }
    }

    img {
        border-radius: var(--p-border-radius-md);
    }

    .preload {
        width: 50%;
        max-width: 320px;
        height: 200px;
        margin: 0 auto;
        border-radius: var(--p-border-radius-md);
        background: $image-preload-gradient;
        background-size: 200% 100%;
        animation: shimmer 1.5s linear infinite;
    }
}

@keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
}
</style>
