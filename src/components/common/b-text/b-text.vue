<script setup lang="ts">
import { computed } from "vue"
import { valueOrDash } from "@/lib/utils"

const props = withDefaults(defineProps<{
    value?:  string | number | null
}>(), {
    value: "",
})

const text = computed(() => valueOrDash(props.value))
</script>

<template>
    <span class="b-text">
        {{ text }}
    </span>
</template>

<style lang="scss" scoped>
.b-text {
    display: inline-block;
}
</style>
