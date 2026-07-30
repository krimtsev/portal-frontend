<script setup lang="ts">
import { computed, ref } from "vue"
import { useDepartmentStore } from "@s/department/department"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDialogInfo from "@c/common/b-dialog/b-dialog-info.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import TimelineCalendarLoading from "@c/timeline-calendar/components/timeline-calendar-loading.vue"
import type {
    ProcessedTimelineEvent,
    TimelineEvent,
} from "@c/timeline-calendar/definitions/timeline-calendar"
import { $sanitizeHtml } from "@/lib/sanitize-html"

const props = withDefaults(
    defineProps<{
        title:          string
        emptyText:      string
        events:         TimelineEvent[]
        isLoading?:     boolean
        showDayOfWeek?: boolean
    }>(),
    {
        isLoading:     false,
        showDayOfWeek: false,
    },
)

const departmentStore = useDepartmentStore()

const currentDate = ref(new Date())
const isExpanded = ref(false)
const MAX_VISIBLE_ROWS = 3

const minEventDate = computed(() => {
    const today = new Date()
    if (!props.events.length) return today

    const minEventTime = Math.min(...props.events.map(e => new Date(e.start_at).getTime()))
    return new Date(Math.min(minEventTime, today.getTime()))
})

const maxEventDate = computed(() => {
    const today = new Date()
    if (!props.events.length) return today

    const maxEventTime = Math.max(...props.events.map(e => new Date(e.end_at).getTime()))
    return new Date(Math.max(maxEventTime, today.getTime()))
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

const daysList = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const totalDays = daysInMonth.value

    const today = new Date()
    const isCurrentMonthAndYear = today.getFullYear() === year && today.getMonth() === month

    return Array.from({ length: totalDays }, (_, i) => {
        const dayNumber = i + 1
        const date = new Date(year, month, dayNumber)
        const dayOfWeekIndex = date.getDay() // 0 = Воскресенье, 6 = Суббота
        const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6
        const isToday = isCurrentMonthAndYear && today.getDate() === dayNumber

        const dayOfWeekName = date.toLocaleString("ru-RU", { weekday: "short" })

        return {
            day: dayNumber,
            dayOfWeekName,
            isWeekend,
            isToday,
        }
    })
})

const processedEvents = computed<ProcessedTimelineEvent[]>(() => {
    const monthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const monthEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0, 23, 59, 59)

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

const description = computed(() => {
    const value = selectedEvent.value?.description
    if (!value) return ""
    return $sanitizeHtml(value)
})

const responsibleUsers = computed(() => {
    if (!selectedEvent.value || !selectedEvent.value.responsible_users?.length) return ""
    return selectedEvent.value.responsible_users.join(", ")
})

const department = computed(() => {
    const value = selectedEvent.value?.department_id
    if (!value) return ""
    return departmentStore.getTitleById(value)
})
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
                        v-for="item in daysList"
                        :key="'header-day-' + item.day"
                        class="day-header"
                        :class="{
                            'is-weekend': item.isWeekend,
                            'is-today': item.isToday
                        }"
                        :style="{ gridColumn: item.day, gridRow: 1 }"
                    >
                        <span class="day-number">{{ item.day }}</span>
                        <span
                            v-if="props.showDayOfWeek"
                            class="day-name"
                        >
                            {{ item.dayOfWeekName }}
                        </span>
                    </div>

                    <div
                        class="header-divider"
                        :style="{ gridColumn: `1 / span 31`, gridRow: 1 }"
                    />

                    <template v-if="props.isLoading">
                        <timeline-calendar-loading />
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
            class="dialog-info"
            append-to="self"
            @close="isDialogVisible = false"
        >
            <div class="dialog-content">
                <div class="description">
                    <div v-html="$sanitizeHtml(description)" />
                </div>

                <div
                    v-if="department"
                    class="department"
                >
                    Отдел: {{ department }}
                </div>

                <div
                    v-if="responsibleUsers"
                    class="responsible-users"
                >
                    Ответственные: <span class="responsible-users-list">{{ responsibleUsers }}</span>
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: calc($indent-x1 / 2) 0;
        align-self: end;
        font-size: 0.857rem;
        border-radius: $indent-x1 $indent-x1 0 0;

        .day-number {
            font-weight: 600;
            line-height: 1;
        }

        .day-name {
            font-size: 0.714rem;
            color: var(--p-surface-400);
            text-transform: lowercase;
            margin-top: 2px;
            line-height: 1;
        }

        &.is-weekend {
            background-color: color-mix(in srgb, var(--p-gray-500) 15%, transparent);

            .day-number,
            .day-name {
                color: var(--p-gray-400);
            }
        }

        &.is-today {
            background-color: var(--p-primary-500);

            .day-number,
            .day-name {
                color: var(--p-surface-900);
            }
        }
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
            font-size: 0.857rem;
        }
    }

    .expand-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding-top: $indent-x1;
        padding-bottom: $indent-x1;
        color: var(--p-surface-300);
        cursor: pointer;
        font-size: 0.929rem;
        transition: color 0.2s;

        &:hover {
            color: var(--p-surface-400);
        }
    }

    .dialog-info {
        .dialog-content {
            display: flex;
            flex-direction: column;
            gap: $indent-x2;

            .description {
                white-space: pre-line;
            }

            .responsible-users-list {
                color: var(--p-primary-500);
            }
        }
    }
}
</style>
