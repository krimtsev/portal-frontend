<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue"

const props = defineProps<{
    src:         string
    local?:      boolean
    width?:      string
    height?:     string
    rounded?:    boolean
    full?:       boolean
    imageStyle?: any
    lazy?:       boolean
}>()

const loaded = ref(false)
const showImage = ref(!props.lazy)
const resolvedSrc = ref<string>("")
const rootRef = useTemplateRef<HTMLElement | null>("rootRef")

const images = import.meta.glob("@a/images/**/*", {
    query:  "?url",
    import: "default",
})

async function resolveImagePath() {
    if (props.src.startsWith("http") || props.local) {
        resolvedSrc.value = props.src
        return
    }

    const matchingKey = Object.keys(images).find((key) => key.endsWith(`/${props.src}`))

    if (matchingKey) {
        try {
            const res = await images[matchingKey]()
            resolvedSrc.value = res as string
        } catch (e) {
            console.error(`Ошибка загрузки изображения: ${props.src}`, e)
        }
    }
}

function onLoad() {
    loaded.value = true
}

let observer: IntersectionObserver | null = null

watch(showImage, (isShown) => {
    if (isShown) resolveImagePath()
}, { immediate: !props.lazy })

onMounted(() => {
    if (props.lazy && rootRef.value) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        showImage.value = true
                        observer?.disconnect()
                    }
                })
            },
            { rootMargin: "200px", threshold: 0.01 },
        )
        observer.observe(rootRef.value)
    } else {
        resolveImagePath()
    }
})

onBeforeUnmount(() => {
    observer?.disconnect()
})
</script>

<template>
    <div
        ref="rootRef"
        class="b-image"
        :class="{
            'rounded': props.rounded,
            'full': props.full,
            'lazy': props.lazy
        }"
        :style="{
            width: !props.full ? props.width : undefined,
            height: !props.full ? props.height : undefined,
        }"
    >
        <div
            v-if="props.lazy && !loaded"
            class="preload"
        />

        <img
            v-if="showImage && resolvedSrc"
            :src="resolvedSrc"
            :width="props.width"
            :height="props.height"
            :style="props.imageStyle"
            alt=""
            @load="onLoad"
        >
    </div>
</template>

<style scoped lang="scss">
.b-image {
    position: relative;
    overflow: hidden;

    &.rounded {
        :deep(img) {
            border-radius: $indent-x2;
        }
    }
    &.full {
        :deep(img) {
            width: 100%;
            min-width: 100%;
            height: auto;
            object-fit: cover;
        }
    }

    &.lazy {
        width: 100%;
        height:  100%;
    }

    .preload {
        position: absolute;
        inset: 0;
        pointer-events: none;
        transition: opacity 0.35s ease, visibility 0s linear 0.35s;
        background: linear-gradient(
                90deg,
                var(--p-surface-600),
                var(--p-surface-700),
                var(--p-surface-800)
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s linear infinite;
    }
}

@keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
}
</style>
