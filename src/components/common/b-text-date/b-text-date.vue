<script setup lang="ts">
import { computed } from "vue"
import { DateTime } from "luxon"

const props = withDefaults(defineProps<{
    value:       string | null
    diff?:       boolean
    showFormat?: string
}>(), {
    value:      null,
    diff:       true,
    showFormat: "yyyy-MM-dd HH:mm:ss",
})

const dateTime = computed(() => {
    if (!props.value) return null

    return DateTime.fromFormat(props.value, "yyyy-MM-dd HH:mm:ss", { zone: "utc" })
        .setZone()
})

const display = computed(() => {
    if (!dateTime.value || !dateTime.value.isValid) {
        return "—"
    }

    if (props.diff) {
        const now = DateTime.now()
        const diff = now.diff(dateTime.value, ["days", "hours", "minutes"]).toObject()

        const days = Math.floor(diff.days ?? 0)
        const hours = Math.floor(diff.hours ?? 0)
        const minutes = Math.floor(diff.minutes ?? 0)

        const parts = []
        if (days > 0) parts.push(`${days} д.`)
        if (hours > 0) parts.push(`${hours} ч.`)
        if (minutes > 0) parts.push(`${minutes} м.`)

        return parts.length ? parts.join(" ") : "0 м."
    } else {
        return dateTime.value.toFormat(props.showFormat)
    }
})
</script>

<template>
    <span class="b-text-date">{{ display }}</span>
</template>

<style scoped lang="scss">
.b-text-date {
    white-space: nowrap;
}
</style>
