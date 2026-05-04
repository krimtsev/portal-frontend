<script setup lang="ts">
import { computed } from "vue"
import { imageSrc } from "@h/images/images"
import PrimeAvatar from "primevue/avatar"


const props = withDefaults(defineProps<{
    src?:   string
    size?:  "normal" | "large" | "xlarge"
    shape?: "square" | "circle"
}>(), {
    src:   "avatars/default.png",
    shape: "circle",
    size:  "normal",
})

const src = computed(() => imageSrc(props.src))
</script>

<template>
    <prime-avatar
        :image="src"
        class="b-avatar"
        :shape="props.shape"
        :size="props.size"
    />
</template>

<style scoped lang="scss">
.b-avatar {
    &.pointer {
        cursor: pointer;
    }
}
</style>
