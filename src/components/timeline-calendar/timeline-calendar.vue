<script setup lang="ts">
import { computed, ref } from "vue"
import Skeleton from "primevue/skeleton"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDialogInfo from "@c/common/b-dialog/b-dialog-info.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import type {
    ProcessedTimelineEvent,
    TimelineEvent,
} from "@c/timeline-calendar/definitions/timeline-calendar"

const props = defineProps<{
    title:      string
    emptyText:  string
    events:     TimelineEvent[]
    isLoading?: boolean
}>()

const currentDate = ref(new Date())
const isExpanded = ref(false)
const MAX_VISIBLE_ROWS = 3

const minEventDate = computed(() => {
    if (!props.events.length) return new Date()
    return new Date(Math.min(...props.events.map(e => new Date(e.start_at).getTime())))
})

const maxEventDate = computed(() => {
    if (!props.events.length) return new Date()
    return new Date(Math.max(...props.events.map(e => new Date(e.end_at).getTime())))
})

const canGoPrev = computed(() => {
    if (!props.events.length) return false
    const currentMonthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const minMonthStart = new Date(minEventDate.value.getFullYear(), minEventDate.value.getMonth(), 1)
    return currentMonthStart > minMonthStart
})

const canGoNext = computed(() => {
    if (!props.events.length) return false
    const currentMonthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const maxMonthStart = new Date(maxEventDate.value.getFullYear(), maxEventDate.value.getMonth(), 1)
    return currentMonthStart < maxMonthStart
})

const changeMonth = (offset: number) => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + offset,
        1,
    )
}

const formattedMonth = computed(() => {
    return currentDate.value.toLocaleString("ru-RU", {
        month: "long",
        year:  "numeric",
    }).replace(" г.", "")
})

const daysInMonth = computed(() => {
    return new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        0,
    ).getDate()
})

const processedEvents = computed<ProcessedTimelineEvent[]>(() => {
    const monthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const monthEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0, 23, 59, 59)

    // Используем reduce для строгой типизации и избавления от ошибок TS
    const filteredEvents = props.events.reduce<ProcessedTimelineEvent[]>((acc, event) => {
        const start = new Date(event.start_at)
        const end = new Date(event.end_at)

        if (end < monthStart || start > monthEnd) return acc

        let startCol = 1
        if (start >= monthStart) {
            startCol = start.getDate()
        }

        let endCol = daysInMonth.value + 1
        if (end <= monthEnd) {
            endCol = end.getDate() + 1
        }

        const diffTime = Math.abs(end.getTime() - start.getTime())
        const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        acc.push({
            ...event,
            startCol,
            endCol,
            durationDays: durationDays || 1,
            gridRow:      0,
            colorVariant: "",
        } as ProcessedTimelineEvent)

        return acc
    }, [])

    filteredEvents.sort((a, b) => a.startCol - b.startCol || (b.endCol - a.endCol))

    const rowsEndCols: number[] = []

    filteredEvents.forEach((event, index) => {
        event.colorVariant = `event-color-${index % 5}`

        let placed = false
        for (let i = 0; i < rowsEndCols.length; i++) {
            if (rowsEndCols[i] < event.startCol) {
                event.gridRow = i + 2
                rowsEndCols[i] = event.endCol
                placed = true
                break
            }
        }

        if (!placed) {
            event.gridRow = rowsEndCols.length + 2
            rowsEndCols.push(event.endCol)
        }
    })

    return filteredEvents
})

const visibleEvents = computed(() => {
    if (isExpanded.value) return processedEvents.value
    return processedEvents.value.filter(e => e.gridRow <= MAX_VISIBLE_ROWS + 1)
})

const hasHiddenEvents = computed(() => {
    return processedEvents.value.some(e => e.gridRow > MAX_VISIBLE_ROWS + 1)
})

const isDialogVisible = ref(false)
const selectedEvent = ref<ProcessedTimelineEvent | null>(null)

const onEventClick = (event: ProcessedTimelineEvent) => {
    selectedEvent.value = event
    isDialogVisible.value = true
}

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
}
</script>

<template>
    <div class="timeline-widget">
        <div class="timeline-widget-header">
            <div
                v-if="props.title"
                class="timeline-widget-title"
            >
                {{ props.title }}
            </div>

            <div class="timeline-header">
                <div class="timeline-navigate">
                    <b-button-icon
                        v-show="canGoPrev"
                        icon="pi pi-chevron-left"
                        severity="secondary"
                        :disabled="props.isLoading"
                        @click="changeMonth(-1)"
                    />
                </div>

                <h4 class="month-title">{{ formattedMonth }}</h4>

                <div class="timeline-navigate">
                    <b-button-icon
                        v-show="canGoNext"
                        icon="pi pi-chevron-right"
                        severity="secondary"
                        :disabled="props.isLoading"
                        @click="changeMonth(1)"
                    />
                </div>
            </div>
        </div>

        <div class="timeline-widget-wrapper">
            <div class="timeline-grid-wrapper">
                <div class="timeline-grid">
                    <div
                        v-for="day in daysInMonth"
                        :key="'header-day-' + day"
                        class="day-header"
                        :style="{ gridColumn: day, gridRow: 1 }"
                    >
                        {{ day }}
                    </div>

                    <div
                        class="header-divider"
                        :style="{ gridColumn: `1 / span 31`, gridRow: 1 }"
                    />

                    <template v-if="props.isLoading">
                        <div
                            class="timeline-event"
                            style="grid-area: 2 / 1 / auto / 12"
                        >
                            <Skeleton height="1rem" style="width: 100%" />
                        </div>

                        <div
                            class="timeline-event"
                            style="grid-area: 3 / 8 / auto / 20;"
                        >
                            <Skeleton height="1rem" style="width: 100%" />
                        </div>

                        <div
                            class="timeline-event"
                            style="grid-area: 3 / 22 / auto / 26;"
                        >
                            <Skeleton height="1rem" style="width: 100%" />
                        </div>

                        <div
                            class="timeline-event"
                            style="grid-area: 4 / 15 / auto / 29;"
                        >
                            <Skeleton height="1rem" style="width: 100%" />
                        </div>
                    </template>

                    <div
                        v-else-if="processedEvents.length === 0"
                        class="empty-state"
                        :style="{ gridColumn: '1 / span 31', gridRow: 2 }"
                    >
                        {{ props.emptyText }}
                    </div>

                    <template v-else>
                        <div
                            v-for="event in visibleEvents"
                            :key="event.id"
                            class="timeline-event"
                            :class="event.colorVariant"
                            :style="{ gridColumn: `${event.startCol} / ${event.endCol}`, gridRow: event.gridRow }"
                            @click="onEventClick(event)"
                        >
                            <b-table-text class="event-text" :text="event.title" />
                        </div>
                    </template>
                </div>
            </div>

            <div
                v-if="hasHiddenEvents && !props.isLoading"
                class="expand-wrapper"
                @click="toggleExpand"
            >
                <span>{{ isExpanded ? 'Свернуть' : 'Показать все' }}</span>
                <i :class="isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" />
            </div>
        </div>

        <b-dialog-info
            v-model="isDialogVisible"
            :title="selectedEvent?.title"
            @close="isDialogVisible = false"
        >
            <div>
                <div v-if="selectedEvent?.description"> {{ selectedEvent.description }} </div>
                <div v-else> Описание отсутствует </div>

                <div
                    v-if="selectedEvent?.responsible_users"
                    class="mt-x2"
                >
                    Ответственные: {{ selectedEvent.responsible_users.join(", ") }}
                </div>
            </div>
        </b-dialog-info>
    </div>
</template>

<style scoped lang="scss">
.timeline-widget {
    @include portal-card();

    height: 100%;
    min-height: 242px;
    flex-direction: column;

    &-wrapper {
        height: 100%;
    }

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $indent-x2;
    }

    &-title {
        @include card-title(rgba(255, 255, 255, 0.9));

        padding-left: $indent-x2;
        margin-bottom: 0;
    }

    .timeline-header {
        display: flex;
        align-items: center;
        gap: $indent-x1;

        .month-title {
            @include h5();

            text-align: center;
            text-transform: capitalize;
            margin: 0;
            width: 100px;
        }
    }

    .timeline-navigate {
        width: 35px;
        height: 35px;
    }

    .timeline-loading {
        padding: $indent-x2;
        display: flex;
        flex-direction: column;
        gap: $indent-x1;

        .loading-skeleton {
            border-radius: $indent-x1;
        }
    }

    .empty-state {
        text-align: center;
        padding: calc($indent-x3 - 1px);
        color: var(--p-surface-400);
        align-self: center;
    }

    .timeline-grid-wrapper {
        width: 100%;
        overflow-x: auto;
    }

    .timeline-grid {
        display: grid;
        grid-template-columns: repeat(31, minmax(30px, 1fr));
        grid-template-rows: repeat(1, minmax(30px, 1fr));
        gap: $indent-x1 0;
        position: relative;
        padding-bottom: $indent-x1;

        &-wrapper {
            height: 100%;
        }
    }

    .day-header {
        text-align: center;
        padding-bottom: $indent-x1;
        align-self: end;
        font-size: 12px;
    }

    .header-divider {
        border-bottom: 1px solid var(--p-divider-border-color);
        align-self: end;
        transform: translateY(1px);
    }

    .timeline-event {
        margin: 0 4px;
        padding: 4px 8px 4px 12px;
        border-radius: $indent-x1;
        display: flex;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        transition: opacity 0.2s;
        position: relative;

        &:hover {
            opacity: 0.9;
        }

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
        }

        &.event-color-0 {
            background-color: color-mix(in srgb, var(--p-green-500) 50%, transparent);
            &::before { background-color: var(--p-green-500); }
        }
        &.event-color-1 {
            background-color: color-mix(in srgb, var(--p-orange-500) 50%, transparent);
            &::before { background-color: var(--p-orange-500); }
        }
        &.event-color-2 {
            background-color: color-mix(in srgb, var(--p-blue-500) 50%, transparent);
            &::before { background-color: var(--p-blue-500); }
        }
        &.event-color-3 {
            background-color: color-mix(in srgb, var(--p-purple-500) 50%, transparent);
            &::before { background-color: var(--p-purple-500); }
        }
        &.event-color-4 {
            background-color: color-mix(in srgb, var(--p-red-500) 50%, transparent);
            &::before { background-color: var(--p-red-500); }
        }

        .event-text {
            color: var(--p-surface-0);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            user-select: none;
            font-size: 12px;
        }
    }

    .expand-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding-top: $indent-x1;
        padding-bottom: $indent-x1;
        color: var(--p-text-color-secondary, #999);
        cursor: pointer;
        font-size: 13px;
        transition: color 0.2s;

        &:hover {
            color: var(--p-text-color, #fff);
        }
    }
}
</style>
