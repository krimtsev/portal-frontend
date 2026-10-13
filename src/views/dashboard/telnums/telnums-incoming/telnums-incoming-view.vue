<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import type { DataTableSortEvent } from "primevue/datatable"
import PrimeDataTable from "primevue/datatable"
import { useTelnumsIncomingStore } from "@s/dashboard/telnums/telnums-incoming"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as telnumsIncomingAPI from "@/api/modules/dashboard/telnums/telnums-incomgin"
import CallsPeriodChart from "@c/charts/calls-period-chart/calls-period-chart.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { MangoCallsData } from "@v/dashboard/panel/definitions/panel.ts"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { TelnumsIncomingItem } from "@v/dashboard/telnums/telnums-incoming/definitions/telnums-incoming"
import {
    formatJSDateToStringDate,
    formatStringDateToJSDate,
} from "@/lib/date-helpers"
import { formatTelnum } from "@/lib/format-phone"
import { formatNumber } from "@/lib/utils"


const notify = useNotify()
const { t, n } = useI18n()

const telnumsIncomingStore = useTelnumsIncomingStore()

const telnumsIncoming = ref<TelnumsIncomingItem[]>([])
const partners = ref<PartnerOptionItem[]>([])

const expandedRows = ref<Record<number, boolean>>({})
const chartDataMap = ref<Record<number, MangoCallsData[]>>({})
const chartLoadingMap = ref<Record<number, boolean>>({})

const dateRange = ref<Array<Date | null>>(committedRange())

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(telnumsIncomingStore.pagination.from),
            to:    n(telnumsIncomingStore.pagination.to),
            total: n(telnumsIncomingStore.pagination.total),
        },
        Number(telnumsIncomingStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (telnumsIncomingStore.filter.page - 1) * telnumsIncomingStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!telnumsIncoming.value.length && telnumsIncomingStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (telnumsIncomingStore.isLoading) return

    telnumsIncomingStore.setPage(page + 1)
    refreshPage()
}

onMounted(async () => {
    telnumsIncomingStore.setIsLoading(true)

    const [
        telnumsIncomingData,
        partnersData,
    ] = await Promise.all([
        telnumsIncomingAPI.list(telnumsIncomingStore.filter),
        partnersAPI.options(),
    ])

    if (
        telnumsIncomingData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    telnumsIncoming.value = telnumsIncomingData.list
    partners.value = partnersData.list

    telnumsIncomingStore.setPagination(telnumsIncomingData.page)
    telnumsIncomingStore.setIsLoading(false)
})

async function refreshPage() {
    telnumsIncomingStore.setIsLoading(true)

    const telnumsIncomingData = await telnumsIncomingAPI.list(telnumsIncomingStore.filter)

    if (telnumsIncomingData instanceof HttpError) {
        notify.error()
        telnumsIncomingStore.setIsLoading(false)
        return
    }

    expandedRows.value = {}
    chartDataMap.value = {}
    chartLoadingMap.value = {}

    telnumsIncoming.value = telnumsIncomingData.list
    telnumsIncomingStore.setPagination(telnumsIncomingData.page)
    telnumsIncomingStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!telnumsIncomingStore.isChanged) return

    telnumsIncomingStore.resetPage()
    telnumsIncomingStore.commitFilter()

    refreshPage()
}

async function onRowExpand(event: { data: TelnumsIncomingItem }) {
    const partner_id = event.data.id
    const { date_from, date_to } = telnumsIncomingStore.filter.filters

    if (
        chartDataMap.value[partner_id] ||
        chartLoadingMap.value[partner_id] ||
        !date_from ||
        !date_to
    ) return

    chartLoadingMap.value[partner_id] = true

    const response = await telnumsIncomingAPI.partnerPeriod(partner_id, { date_from, date_to })

    if (response instanceof HttpError) {
        notify.error()
        chartLoadingMap.value[partner_id] = false
        return
    }

    chartDataMap.value[partner_id] = response.data
    chartLoadingMap.value[partner_id] = false
}

function onSort(event: DataTableSortEvent) {
    if (telnumsIncomingStore.isLoading || !event.sortField) return

    const field = event.sortField as string
    const isNewField = field !== telnumsIncomingStore.filter.sortBy

    const DESC_FIRST_FIELDS = ["success_count", "failed_count", "failed_percent", "total_count"]

    const order = (isNewField && DESC_FIRST_FIELDS.includes(field)) || event.sortOrder === -1
        ? "desc"
        : "asc"

    telnumsIncomingStore.filter.sortBy = field
    telnumsIncomingStore.filter.sortOrder = order

    onChangeFilter()
}

function committedRange(): Array<Date | null> {
    const { date_from, date_to } = telnumsIncomingStore.filter.filters

    return [
        formatStringDateToJSDate(date_from),
        formatStringDateToJSDate(date_to),
    ]
}

function onDatePickerHide() {
    const [date_from, date_to] = dateRange.value

    if (!date_from) {
        dateRange.value = committedRange()
        return
    }

    const date_end = date_to ?? date_from
    dateRange.value = [date_from, date_end]

    telnumsIncomingStore.filter.filters.date_from = formatJSDateToStringDate(date_from)
    telnumsIncomingStore.filter.filters.date_to = formatJSDateToStringDate(date_end)

    onChangeFilter()
}
</script>

<template>
    <div class="telnums-incoming-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="dateRange"
                    selection-mode="range"
                    hide-on-range-selection
                    :placeholder="t('mc.common.placeholder.period')"
                    :disabled="telnumsIncomingStore.isLoading"
                    :max-range-days="31"
                    class="filter-date"
                    @hide="onDatePickerHide"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-multi-select
                    v-model="telnumsIncomingStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-count="telnumsIncomingStore.filter.filters.partner_id.length"
                    :disabled="telnumsIncomingStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    :placeholder="t('mc.common.placeholder.partner')"
                    class="filter-partner"
                    @submit="onChangeFilter"
                />
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="telnumsIncomingStore.isLoading" />

            <b-empty-result
                v-else-if="!telnumsIncomingStore.isLoading && !telnumsIncoming.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                v-model:expanded-rows="expandedRows"
                :value="telnumsIncoming"
                :rows="telnumsIncomingStore.pagination.perPage"
                :total-records="telnumsIncomingStore.pagination.total"
                :first="firstPage"
                :paginator="showPaginator"
                :sort-field="telnumsIncomingStore.filter.sortBy"
                :sort-order="telnumsIncomingStore.sortOrder"
                class="table"
                @page="onPageChange"
                @row-expand="onRowExpand"
                @sort="onSort"
                data-key="id"
                lazy
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <prime-column
                    field="row-toggler"
                    class="table-row-toggler"
                >
                    <template #body="{ data, rowTogglerCallback }">
                        <b-button-icon
                            :icon="expandedRows[data.id]
                                ? 'pi-chevron-down'
                                : 'pi-chevron-right'
                            "
                            size="small"
                            @click="rowTogglerCallback"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Филиал"
                    field="partner_name"
                    class="table-name"
                    sortable
                    sort-field="name"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.partner_name" />
                    </template>
                </prime-column>

                <prime-column
                    header="Телефон"
                    field="mango_telnum"
                    class="table-mango_telnum"
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatTelnum(data?.mango_telnum)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Итого"
                    field="total_count"
                    class="table-total-count"
                    sortable
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.total_count)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Успешные"
                    field="success_count"
                    class="table-success-count"
                    sortable
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.success_count)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Пропущенные"
                    field="failed_count"
                    class="table-failed-count"
                    sortable
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.failed_count)" />
                    </template>
                </prime-column>

                <prime-column
                    header="% пропущенных"
                    field="failed_percent"
                    class="table-failed-percent"
                    sortable
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data.failed_percent)" />
                    </template>
                </prime-column>

                <prime-column />

                <template #expansion="slotProps">
                    <calls-period-chart
                        title="Динамика звонков за 24 часа"
                        :is-loading="chartLoadingMap[slotProps.data.id]"
                        :data="chartDataMap[slotProps.data.id]"
                    />
                </template>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.telnums-incoming-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .p-datatable-tbody tr.p-datatable-row-expansion:hover  {
            background: transparent;
        }

        .table {
            &-row-toggler {
                @include col-fixed(65px);

                padding: 0.65rem 1rem;
            }

            &-name {
                @include col-fixed(300px);
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
}
</style>
