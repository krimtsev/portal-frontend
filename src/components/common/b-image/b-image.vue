<script setup lang="ts">
import { computed } from "vue"
import PrimeImage from "primevue/image"

const props = defineProps<{
    src: string,
    local?: boolean,
    width?: string,
    height?: string
    rounded?: boolean
    full?: boolean
    imageStyle?: any
}>()

const images = import.meta.glob("@a/images/**/*", {
    eager: true,
    query: "?url",
    import: "default",
})

const src = computed(() => {
    if (props.src.startsWith("http") || props.local) return props.src

    const matchingEntry = Object.entries(images).find(([key]) =>
        key.endsWith(`/${props.src}`)
    )

    if (!matchingEntry) return ""

    return matchingEntry[1] as string
})
</script>

<template>
    <div
        class="b-image"
        :class="{
            'rounded': props.rounded,
            'full': props.full,
        }"
    >
        <prime-image
            :src="src"
            :width="props.width"
            :height="props.height"
            :image-style="props.imageStyle"
        />
    </div>
</template>

<style scoped lang="scss">
.b-image {
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
}
</style>
