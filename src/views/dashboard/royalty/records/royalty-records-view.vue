<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeColumnGroup from "primevue/columngroup"
import PrimeDataTable from "primevue/datatable"
import PrimeRow from "primevue/row"
import PrimeTag from "primevue/tag"
import { useRoyaltyRecordsStore } from "@s/dashboard/royalty/royalty-records"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as royaltyAPI from "@/api/modules/dashboard/royalty/royalty"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type {
    RoyaltyRecordsData,
} from "@v/dashboard/royalty/records/definitions/royalty-records"
import {
    formatJSDateToStartDate,
    formatStringDateToJSDate,
    getAnalyticsStartJSDate,
    getPreviousMonthJSDate,
} from "@/lib/date-helpers"


const notify = useNotify()
const { t } = useI18n()

const royaltyStore = useRoyaltyRecordsStore()
const minDate = ref(getAnalyticsStartJSDate())
const maxDate = ref(getPreviousMonthJSDate())

const royalty = ref<RoyaltyRecordsData>({
    list:   [],
    totals: [],
})
const partners = ref<PartnerOptionItem[]>([])

onMounted(async () => {
    royaltyStore.setIsLoading(true)

    const { partner_id, date } = royaltyStore.filter.filters
    const hasFilter = !!partner_id && !!date

    const [
        royaltyData,
        partnersData,
    ] = await Promise.all([
        hasFilter
            ? royaltyAPI.recordsList(royaltyStore.filter)
            : null,
        partnersAPI.options(),
    ])

    if (
        royaltyData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (royaltyData) {
        royalty.value = royaltyData
    }

    partners.value = partnersData.list

    royaltyStore.setIsLoading(false)
})

// Формируем список дней на основе количества элементов в totals
const days = computed(() => {
    return Array.from({ length: royalty.value.totals.length }, (_, i) => i + 1)
})

function formatDayHeader(day: number): string {
    return String(day).padStart(2, "0")
}

async function refreshRoyalty() {
    if (
        !royaltyStore.filter.filters.partner_id ||
        !royaltyStore.filter.filters.date
    ) return

    royaltyStore.setIsLoading(true)

    const royaltyData = await royaltyAPI.recordsList(royaltyStore.filter)

    if (royaltyData instanceof HttpError) {
        notify.error()
        royaltyStore.setIsLoading(false)
        return
    }

    royalty.value = royaltyData
    royaltyStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!royaltyStore.isChanged) return

    royaltyStore.resetPage()
    royaltyStore.commitFilter()

    refreshRoyalty()
}

const filterDate = computed({
    get: () => formatStringDateToJSDate(royaltyStore.filter.filters.date),
    set: (value) => {
        royaltyStore.filter.filters.date = formatJSDateToStartDate(value)
    },
})

const weekendDaysMap = computed(() => {
    const map: Record<number, boolean> = {}

    if (!filterDate.value) return map

    // Берем год и месяц из текущей выбранной даты
    const year = filterDate.value.getFullYear()
    const month = filterDate.value.getMonth()

    for (const day of days.value) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay()

        // 0 - Воскресенье, 6 - Суббота
        map[day] = dayOfWeek === 0 || dayOfWeek === 6
    }

    return map
})

const workplacesStats = computed(() => {
    const counts: Record<number, number> = {}

    for (const total of royalty.value.totals) {
        if (total > 0) {
            counts[total] = (counts[total] || 0) + 1
        }
    }

    return Object.entries(counts)
        .map(([value, count]) => ({
            value: Number(value),
            count,
        }))
        .sort((a, b) => b.value - a.value)
})

function tagText(workplace: number, days: number): string {
    return `${t("mc.dashboard.royalty.workplace", workplace)}, ${t("mc.common.days", days)}`
}
</script>

<template>
    <div class="royalty-records-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="filterDate"
                    :placeholder="t('mc.common.placeholder.period')"
                    date-format="MM yy"
                    :min-date="minDate"
                    :max-date="maxDate"
                    view="month"
                    :disabled="royaltyStore.isLoading"
                    class="filter-date"
                    @date-select="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-select
                    v-model="royaltyStore.filter.filters.partner_id"
                    :options="partners"
                    :disabled="royaltyStore.isLoading"
                    option-label="name"
                    option-value="id"
                    :placeholder="t('mc.common.placeholder.partner')"
                    class="filter-partner"
                    @change="onChangeFilter"
                />
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="royaltyStore.isLoading" />

            <b-empty-result
                v-else-if="!royaltyStore.isLoading && !royalty.list.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                :value="royalty.list"
                class="table"
                data-key="staff.staff_id"
                scrollable
                show-gridlines
                lazy
            >
                <prime-column
                    header="Сотрудник"
                    class="table-staff"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data.staff.name"
                            :subtext="data.staff.specialization"
                            small-subtext
                        />
                    </template>
                </prime-column>

                <prime-column
                    v-for="(day, index) in days"
                    :key="day"
                    :header="formatDayHeader(day)"
                    class="table-day"
                    :class="{ 'is-weekend': weekendDaysMap[day] }"
                >
                    <template #body="{ data }">
                        <span class="day-value">
                            {{ data.data[index] > 0 ? data.data[index] : '\u00A0' }}
                        </span>
                    </template>
                </prime-column>

                <prime-column-group type="footer">
                    <prime-row>
                        <prime-column
                            footer="Итого:"
                            class="table-staff-footer"
                        />
                        <prime-column
                            v-for="(total, index) in royalty.totals"
                            :key="`total-${index}`"
                            :footer="String(total)"
                            class="table-day"
                            :class="{ 'is-weekend': weekendDaysMap[index + 1] }"
                        />
                    </prime-row>
                </prime-column-group>
            </prime-data-table>
        </div>

        <div
            v-if="!royaltyStore.isLoading && workplacesStats.length"
            class="stats-card"
        >
            <span class="stats-title">Рабочих мест в сутки:</span>
            <span class="stats-list">
                <prime-tag
                    v-for="(item) in workplacesStats"
                    :key="item.value"
                    severity="primary"
                >
                    {{ tagText(item.value, item.count) }}
                </prime-tag>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.royalty-records-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        .table {
            &-staff {
                @include col-fixed(200px);
            }

            &-day {
                @include col-fixed(40px);

                padding-left: 0;
                padding-right: 0;
                text-align: center;

                .p-datatable-column-header-content {
                    justify-content: center;
                }

                &.is-weekend {
                    background-color: var(--p-surface-700);
                }
            }
        }
    }

    .filter {
        &-date,
        &-partner {
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }

    .stats-card {
        display: flex;
        flex-direction: row;
        gap: $indent-x1;
        align-items: center;
        margin-top: $indent-x2;
        padding: 0 $indent-x1;

        .stats-list {
            display: flex;
            gap: $indent-x1;
        }
    }
}
</style>
