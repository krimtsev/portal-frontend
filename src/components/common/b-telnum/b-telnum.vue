<script setup lang="ts">
import { computed } from "vue"
import { formatTelnum } from "@/lib/format-phone"

const props = defineProps<{
    value: string
}>()

const telnum = computed(() => {
    if (!props.value) return ""
    return formatTelnum(props.value, { plus: true })
})

const nonFormated = computed(() => {
    if (!telnum.value) return ""
    return telnum.value.replace(/[^0-9+]/g, "")
})
</script>

<template>
    <a
        class="b-telnum"
        :href="`tel: ${nonFormated}`"> {{ telnum }}
    </a>
</template>

<style scoped lang="scss">
.b-telnum {
    color: var(--p-surface-0);
    text-decoration: none;
}
</style>
