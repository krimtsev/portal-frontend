<script lang="ts" setup>
import { useSlots } from "@/composables/slots/use-slots"

defineProps<{
    title: string
}>()

const { slots } = useSlots()

</script>

<template>
    <section class="settings-section">
        <h2 class="section-title">
            {{ title }}
        </h2>
        <div
            v-if="slots.label"
            class="section-label"
        >
            <slot name="label" />
        </div>
        <div class="section-cards">
            <slot />
        </div>
    </section>
</template>
