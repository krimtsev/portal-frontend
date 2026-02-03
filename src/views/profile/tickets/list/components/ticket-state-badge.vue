<script setup lang="ts">
import PrimeTag from "primevue/tag"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import { computed } from "vue"
import { stateName } from "@v/profile/tickets/list/utils/ticket"

const props = defineProps<{
    isLoading?: boolean
    value?: string
    rounded?: boolean
}>()

const ticketValue = computed(() => stateName(props.value || ""))

const ticketSeverity = computed(() => {
    if (!props.value) return "disabled"

    switch (props.value) {
        case "new":
            return "info"
        case "in_progress":
            return "warn"
        case "waiting":
            return "active"
        case "success":
            return "success"
        case "closed":
            return "disabled"
        case "cancel":
            return "danger"
        default:
            return "disabled"
    }
})
</script>

<template>
    <div class="ticket-state-badge">
        <b-skeleton
            v-if="isLoading"
            width="100px"
        />
        <prime-tag
            v-else
            :value="ticketValue"
            :severity="ticketSeverity"
            :rounded="props.rounded"
        />
    </div>
</template>

<style scoped lang="scss">
.ticket-state-badge {
    :deep(.p-tag[data-p*="disabled"]) {
        background: var(--p-tag-disabled-background);
        color: var(--p-tag-disabled-color);
    }

    :deep(.p-tag[data-p*="active"]) {
        background: var(--p-tag-active-background);
        color: var(--p-tag-active-color);
    }
}
</style>
