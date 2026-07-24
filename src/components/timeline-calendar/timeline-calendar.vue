<script setup lang="ts">
import { computed, ref } from "vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDialogInfo from "@c/common/b-dialog/b-dialog-info.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"

export interface TimelineEvent {
    id:           string | number
    title:        string
    description?: string
    start_at:     string
    end_at:       string
    colorTheme?:  "green" | "orange"
}

export interface ProcessedTimelineEvent extends TimelineEvent {
    startCol:     number
    endCol:       number
    durationDays: number
    gridRow:      number // Новое свойство для управления строкой события
}

const props = defineProps<{
    events: TimelineEvent[]
}>()

const currentDate = ref(new Date())
const isExpanded = ref(false) // Состояние раскрытия календаря
const MAX_VISIBLE_ROWS = 1

const changeMonth = (offset: number) => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + offset,
        1,
    )
    //isExpanded.value = false // Сбрасываем раскрытие при смене месяца
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

    // 1. Фильтруем и подготавливаем колонки
    const filteredEvents = props.events.map(event => {
        const start = new Date(event.start_at)
        const end = new Date(event.end_at)

        // Фильтруем то, что вообще не попадает в текущий месяц
        if (end < monthStart || start > monthEnd) return null

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

        return {
            ...event,
            startCol,
            endCol,
            durationDays: durationDays || 1,
            gridRow:      0, // Заполнитель, вычислим ниже
        }
    }).filter((event): event is ProcessedTimelineEvent => event !== null)

    // 2. Сортируем события для корректного расчета строк (по началу, затем по длине)
    filteredEvents.sort((a, b) => a.startCol - b.startCol || (b.endCol - a.endCol))

    // 3. Вычисляем строку (grid-row) для каждого события
    const rowsEndCols: number[] = []

    filteredEvents.forEach(event => {
        let placed = false
        for (let i = 0; i < rowsEndCols.length; i++) {
            // Если предыдущее событие на этой строке закончилось до начала текущего
            if (rowsEndCols[i] < event.startCol) {
                event.gridRow = i + 2 // +2 т.к. 1-я строка занята шапкой дней
                rowsEndCols[i] = event.endCol
                placed = true
                break
            }
        }
        // Если подходящая строка не найдена, создаем новую
        if (!placed) {
            event.gridRow = rowsEndCols.length + 2
            rowsEndCols.push(event.endCol)
        }
    })

    return filteredEvents
})

// Отображаемые события (учитывают лимит строк, если календарь свернут)
const visibleEvents = computed(() => {
    if (isExpanded.value) return processedEvents.value
    return processedEvents.value.filter(e => e.gridRow <= MAX_VISIBLE_ROWS + 1)
})

// Флаг: есть ли скрытые события (чтобы показать кнопку)
const hasHiddenEvents = computed(() => {
    return processedEvents.value.some(e => e.gridRow > MAX_VISIBLE_ROWS + 1)
})

// --- Состояние модального окна ---
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
        <div class="timeline-widget-wrapper">
            <div class="timeline-header">
                <b-button-icon
                    icon="pi pi-chevron-left"
                    severity="secondary"
                    @click="changeMonth(-1)"
                />

                <h4 class="month-title">{{ formattedMonth }}</h4>

                <b-button-icon
                    icon="pi pi-chevron-right"
                    severity="secondary"
                    @click="changeMonth(1)"
                />
            </div>

            <!-- Сетка календаря отображается всегда -->
            <div class="timeline-grid-wrapper">
                <div class="timeline-grid">
                    <!-- Шапка с днями -->
                    <div
                        v-for="day in daysInMonth"
                        :key="'header-day-' + day"
                        class="day-header"
                        :style="{ gridColumn: day, gridRow: 1 }"
                    >
                        {{ day }}
                    </div>

                    <!-- Разделительная линия под днями -->
                    <div
                        class="header-divider"
                        :style="{ gridColumn: `1 / span 31`, gridRow: 1 }"
                    />

                    <!-- Текст, если нет событий (занимает 2-ю строку сетки) -->
                    <div
                        v-if="processedEvents.length === 0"
                        class="empty-state"
                        :style="{ gridColumn: '1 / span 31', gridRow: 2 }"
                    >
                        В этом месяце нет запланированных событий
                    </div>

                    <!-- События -->
                    <template v-else>
                        <div
                            v-for="event in visibleEvents"
                            :key="event.id"
                            class="timeline-event"
                            :class="['event-' + (event.colorTheme || 'green')]"
                            :style="{ gridColumn: `${event.startCol} / ${event.endCol}`, gridRow: event.gridRow }"
                            @click="onEventClick(event)"
                        >
                            <b-table-text class="event-text" :text="event.title" />
                        </div>
                    </template>
                </div>
            </div>

            <!-- Кнопка Показать все / Свернуть -->
            <div
                v-if="hasHiddenEvents"
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
            @confirm="isDialogVisible = false"
        >
            <div v-if="selectedEvent?.description" class="event-description">
                {{ selectedEvent.description }}
            </div>
            <div v-else class="event-description empty">
                Описание отсутствует
            </div>
        </b-dialog-info>
    </div>
</template>

<style scoped lang="scss">
.timeline-widget {
    width: 100%;
    background: var(--p-portal-card-background);
    border-radius: $indent-x4;
    padding: $indent-x1 $indent-x2;

    .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $indent-x1;

        .month-title {
            @include h5();
            text-transform: capitalize;
        }
    }

    .empty-state {
        text-align: center;
        margin: 0 4px;
        padding: 4px 8px 32px;
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
        padding: 4px 8px;
        border-radius: $indent-x1;
        display: flex;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        transition: opacity 0.2s;

        &:hover {
            opacity: 0.9;
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

        &.event-green {
            background-color: #4a8f3c;
        }

        &.event-orange {
            background-color: #d9822b;
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
