<script setup lang="ts">
import { computed } from "vue"
import PrimeAvatar from "primevue/avatar"
import { imageSrc } from "@h/images/images"


const props = withDefaults(defineProps<{
    src?: string,
    size?: "large" | "xlarge",
    shape?: "square" | "circle",
}>(), {
    src: "avatars/default.png",
    shape: "circle",
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
