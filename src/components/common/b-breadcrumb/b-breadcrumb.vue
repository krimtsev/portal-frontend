<script setup lang="ts">
import { useAttrs, useSlots } from "vue"
import PrimeBreadcrumb from "primevue/breadcrumb"

const attrs = useAttrs()
const slots = useSlots()
</script>

<template>
    <prime-breadcrumb
        v-bind="attrs"
        class="b-breadcrumb"
    >
        <template v-for="(_, name) in slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
        </template>
    </prime-breadcrumb>
</template>

<style scoped lang="scss">
.b-breadcrumb {
    background: transparent;
}
</style>
