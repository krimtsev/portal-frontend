<script setup lang="ts">
import BSvg from "@c/common/b-svg/b-svg.vue"

defineProps<{
    value: boolean
}>()
</script>

<template>
    <b-svg
        :name="value ? 'pi-check' : 'pi-minus'"
        class="state-icon"
    />
</template>

