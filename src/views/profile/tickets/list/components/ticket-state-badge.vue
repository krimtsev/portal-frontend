<script setup lang="ts">
import { computed } from "vue"
import PrimeTag from "primevue/tag"
import { TicketState } from "@v/profile/tickets/edit/definitions/ticket"
import { stateName } from "@v/profile/tickets/list/utils/ticket"

const props = defineProps<{
    value?:   string
    rounded?: boolean
}>()

const ticketValue = computed(() => stateName(props.value || ""))

const ticketStateMap = {
    [TicketState.New]:        "info",
    [TicketState.InProgress]: "warn",
    [TicketState.Waiting]:    "active",
    [TicketState.Success]:    "success",
    [TicketState.Closed]:     "disabled",
    [TicketState.Cancel]:     "danger",
}

const ticketSeverity = computed(() => {
    if (!props.value) return "disabled"

    const key = props.value as TicketState
    return ticketStateMap[key] || "disabled"
})
</script>

<template>
    <div class="ticket-state-badge">
        <prime-tag
            :value="ticketValue"
            :severity="ticketSeverity"
            :rounded="props.rounded"
        />
    </div>
</template>

<style scoped lang="scss">
.ticket-state-badge {
    white-space: nowrap;

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
