<script setup lang="ts">
import { computed } from "vue"
import { DateTime } from "luxon"

interface Props {
    value: string | Date
    diff?: boolean
}

const props = defineProps<Props>()

const dateTime = computed(() => {
    if (props.value instanceof Date) {
        return DateTime.fromJSDate(props.value)
    } else {
        // предполагаем формат "yyyy-MM-dd HH:mm:ss"
        return DateTime.fromFormat(props.value, "yyyy-MM-dd HH:mm:ss")
    }
})

// Вычисляем отображение
const display = computed(() => {
    if (!dateTime.value.isValid) return "Invalid date"

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
        return dateTime.value.toFormat("dd.MM.yyyy HH:mm:ss")
    }
})
</script>

<template>
    <span class="b-text-date">{{ display }}</span>
</template>
