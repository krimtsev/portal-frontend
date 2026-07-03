<script setup lang="ts">
import { computed } from "vue"
import { imageSrc } from "@h/images/images"
import PrimeAvatar from "primevue/avatar"

const emit = defineEmits<{
    (e: "click", event: PointerEvent): void
}>()

const props = withDefaults(defineProps<{
    src?:         string
    size?:        "normal" | "large" | "xlarge"
    shape?:       "square" | "circle"
    label?:       string
    defaultIcon?: boolean
}>(), {
    shape:       "circle",
    size:        "normal",
    src:         undefined,
    label:       undefined,
    defaultIcon: false,
})

const src = computed(() => {
    if (props.defaultIcon) {
        return imageSrc("avatars/default.png")
    }
    return props.src
})

const label = computed(() => {
    if (props.src) return undefined
    return props.label
})
</script>

<template>
    <prime-avatar
        :image="src"
        class="b-avatar"
        :shape="props.shape"
        :size="props.size"
        :label="label"
        @click="emit('click', $event)"
    />
</template>

<style scoped lang="scss">
.b-avatar {
    overflow: hidden;

    &.pointer {
        cursor: pointer;
    }
}
</style>
