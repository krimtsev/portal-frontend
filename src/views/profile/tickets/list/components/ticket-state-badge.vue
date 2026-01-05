<script setup lang="ts">
import { computed } from "vue"
import { stateName } from "@v/profile/tickets/list/utils/ticket"
import BText from "@c/common/b-text/b-text.vue"

const props = defineProps<{
    isLoading?: boolean,
    value?: string,
}>()

const ticketValue = computed(() => stateName(props.value || ""))
const ticketType = computed(() => {
    if (!props.value) return ""

    const type = props.value?.replace("_", "-")
    return `badge-${type}`
})
</script>

<template>
   <div class="ticket-state-badge">
       <b-text
           :is-loading="isLoading"
           :value="ticketValue"
           :classes="`badge ${ticketType}`"
           preload-width="50%"
       />
   </div>
</template>

<style scoped lang="scss">
.ticket-state-badge {
    .badge {
        padding: calc($indent-x1 / 2) $indent-x1;
        border-radius: $indent-x2;
        background: var(--p-gray-800);
        color: var(--p-surface-0);

        &.badge-new {
            background: var(--p-blue-900);
        }
        &.badge-in-progress {
            background: var(--p-amber-600);
        }
        &.badge-waiting {
            background: var(--p-amber-600);
        }
        &.badge-success {
            background: var(--p-green-600);
        }
        &.badge-closed {
            background: var(--p-neutral-600);
        }
        &.badge-cancel {
            background: var(--p-red-900);
        }
    }
}
</style>
