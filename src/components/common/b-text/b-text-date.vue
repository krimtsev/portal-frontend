<script setup lang="ts">
import { computed } from "vue"
import { DateTime } from "luxon"

interface Props {
    value: string | Date | null
    diff?: boolean
    showFormat?: string
}

const props = defineProps<Props>()

const dateTime = computed(() => {
    if (!props.value) {
        return null
    }

    if (props.value instanceof Date) {
        return DateTime.fromJSDate(props.value)
    }

    let dt = DateTime.fromISO(props.value as string)

    if (!dt.isValid) {
        dt = DateTime.fromFormat(props.value as string, "yyyy-MM-dd HH:mm:ss")
    }

    return dt
})

// Вычисляем отображение
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
        const format = props.showFormat ?? "yyyy-MM-dd HH:mm:ss"
        return dateTime.value.toFormat(format)
    }
})
</script>

<template>
    <span class="b-text-date">{{ display }}</span>
</template>
