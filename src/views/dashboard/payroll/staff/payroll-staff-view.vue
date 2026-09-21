<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePayrollStaffStore } from "@s/dashboard/payroll/payroll-staff"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as payrollAPI from "@/api/modules/dashboard/payroll/payroll"
import BAvatar from "@c/common/b-avatar/b-avatar.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { PayrollStaffItem } from "@v/dashboard/payroll/staff/definitions/payroll-staff"
import {
    formatJSDateToStringDate,
    formatStringDateToJSDate,
    getAnalyticsStartJSDate,
    getTodayJSDate,
} from "@/lib/date-helpers"
import { clearName, clearSpecialization, formatNumber } from "@/lib/utils"

const notify = useNotify()
const { t } = useI18n()

const payrollStaffStore = usePayrollStaffStore()
const minDate = ref(getAnalyticsStartJSDate())
const maxDate = ref(getTodayJSDate())

const payrollStaff = ref<PayrollStaffItem[]>([])
const turnover = ref<number>(0)
const partners = ref<PartnerOptionItem[]>([])

const appliedStartDate = ref<string | null>(null)
const appliedEndDate = ref<string | null>(null)

function updateAppliedDates() {
    appliedStartDate.value = payrollStaffStore.filter.filters.start_date
    appliedEndDate.value = payrollStaffStore.filter.filters.end_date
}

function onPageChange({ page }: { page: number }) {
    if (payrollStaffStore.isLoading) return

    payrollStaffStore.setPage(page + 1)
    refreshPayroll()
}

const hasFilterDate = computed(() => {
    return !!payrollStaffStore.filter.filters.start_date &&
        !!payrollStaffStore.filter.filters.end_date
})

const hasPartner = computed(() => {
    return !!payrollStaffStore.filter.filters.partner_id
})

onMounted(async () => {
    payrollStaffStore.setIsLoading(true)

    const isLoadData = hasFilterDate.value || hasPartner.value

    const [
        payrollStaffData,
        partnersData,
    ] = await Promise.all([
        isLoadData
            ? payrollAPI.staffList(payrollStaffStore.filter)
            : null,
        partnersAPI.options(),
    ])

    if (
        payrollStaffData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (payrollStaffData) {
        payrollStaff.value = payrollStaffData.data?.staff ?? payrollStaffData.data.staff ?? []
        turnover.value = payrollStaffData.data?.turnover ?? payrollStaffData.data.turnover ?? 0

        updateAppliedDates()
    }

    partners.value = partnersData.list
    payrollStaffStore.setIsLoading(false)
})

async function refreshPayroll() {
    const isLoadData = hasFilterDate.value && hasPartner.value

    if (!isLoadData) return

    payrollStaffStore.setIsLoading(true)

    const payrollData = await payrollAPI.staffList(payrollStaffStore.filter)

    if (payrollData instanceof HttpError) {
        notify.error()
        payrollStaffStore.setIsLoading(false)
        return
    }

    payrollStaff.value = payrollData.data?.staff ?? payrollData.data.staff ?? []
    turnover.value = payrollData.data?.turnover ?? payrollData.data.turnover ?? 0

    updateAppliedDates()
    payrollStaffStore.setIsLoading(false)
}

async function onChangeFilter() {
    if (!payrollStaffStore.isChanged || !hasFilterDate.value) return

    payrollStaffStore.resetPage()
    payrollStaffStore.commitFilter()

    await refreshPayroll()
}

const filterDate = computed({
    get: () => {
        const start = formatStringDateToJSDate(payrollStaffStore.filter.filters.start_date)
        const end = formatStringDateToJSDate(payrollStaffStore.filter.filters.end_date)
        if (!start && !end) return null
        return [start, end]
    },
    set: (value) => {
        const [start, end] = value || [null, null]
        payrollStaffStore.filter.filters.start_date = start ? formatJSDateToStringDate(start) : null
        payrollStaffStore.filter.filters.end_date = end ? formatJSDateToStringDate(end) : null
    },
})

const totalSum = computed((): number => {
    return payrollStaff.value.reduce((acc, item) => acc + Number(item.sum || 0), 0)
})

const dateColumns = computed(() => {
    const startStr = appliedStartDate.value
    const endStr = appliedEndDate.value
    if (!startStr || !endStr) return []

    const start = new Date(startStr)
    const end = new Date(endStr)
    const dates = []

    const current = new Date(start)
    while (current <= end) {
        dates.push(current.toISOString().split("T")[0])
        current.setDate(current.getDate() + 1)
    }
    return dates
})

const dailyTotals = computed(() => {
    const totals: Record<string, number> = {}
    dateColumns.value.forEach(date => {
        totals[date] = payrollStaff.value.reduce((acc, item) => acc + Number(item.daily_sums?.[date] || 0), 0)
    })
    return totals
})

const profitValue = computed((): number => {
    if (!turnover.value) return 0

    return turnover.value - totalSum.value
})

const profitPercent = computed((): string => {
    if (!turnover.value) return "0%"

    const percent = (profitValue.value / turnover.value) * 100
    return `${percent.toFixed(2)}%`
})

const idealProfitValue = computed((): number => {
    if (!turnover.value) return 0

    return turnover.value * 0.64
})
</script>

<template>
    <div class="payroll-staff-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="filterDate"
                    :placeholder="t('mc.common.placeholder.period')"
                    date-format="yy-mm-dd"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :max-range-days="7"
                    selection-mode="range"
                    view="date"
                    :disabled="payrollStaffStore.isLoading"
                    hide-on-range-selection
                    class="filter-date"
                    @date-select="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-select
                    v-model="payrollStaffStore.filter.filters.partner_id"
                    :options="partners"
                    :disabled="payrollStaffStore.isLoading"
                    option-label="name"
                    option-value="id"
                    :placeholder="t('mc.common.placeholder.partner')"
                    class="filter-partner"
                    @change="onChangeFilter"
                />
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="payrollStaffStore.isLoading" />

            <b-empty-result
                v-else-if="!payrollStaffStore.isLoading && !hasFilterDate && !hasPartner && !payrollStaff.length"
                title="Необходимо выбрать период и филиал"
            />

            <b-empty-result
                v-else-if="!payrollStaffStore.isLoading && !payrollStaff.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                :value="payrollStaff"
                class="table"
                data-key="id"
                @page="onPageChange"
            >
                <prime-column
                    field="avatar"
                    class="table-avatar"
                >
                    <template #body="{ data }">
                        <b-avatar
                            :src="data.avatar"
                            shape="square"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="name"
                    class="table-name"
                >
                    <template #header>
                        <b-table-text text="Сотрудник" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text
                            :text="clearName(data.name)"
                            :subtext="clearSpecialization(data.specialization)"
                            small-subtext
                        />
                    </template>

                    <template #footer>
                        <b-table-text text="Итого" />
                    </template>
                </prime-column>

                <prime-column
                    v-for="date in dateColumns"
                    :key="date"
                    :field="'daily_sums.' + date"
                    class="table-daily-sums"
                >
                    <template #header>
                        <b-table-text :text="date" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data.daily_sums?.[date] || 0)" />
                    </template>

                    <template #footer>
                        <b-table-text :text="formatNumber(dailyTotals[date])" />
                    </template>
                </prime-column>

                <prime-column
                    field="sum"
                    class="table-sum"
                >
                    <template #header>
                        <b-table-text text="Итого" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.sum)" />
                    </template>

                    <template #footer>
                        <b-table-text :text="formatNumber(totalSum)" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>

        <div v-if="!payrollStaffStore.isLoading && profitValue > 0">
            <div>
                Чистая прибыль:
                {{ formatNumber(turnover) }} -
                {{ formatNumber(totalSum) }} =
                {{ formatNumber(profitValue) }} ({{ profitPercent }})
            </div>
            <div>
                Идеальный показатель:
                {{ formatNumber(turnover) }} -
                34% =
                {{ formatNumber(idealProfitValue) }} (64%)
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.payroll-staff-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table {
            &-avatar {
                @include col-fixed(65px);
            }

            &-name {
                @include col-fixed(230px);
            }
        }

        .p-datatable-tfoot > tr > td {
            border-width: 1px 0 0 0;
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
