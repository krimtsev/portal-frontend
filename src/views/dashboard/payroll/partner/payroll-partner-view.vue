<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePayrollPartnerStore } from "@s/dashboard/payroll/payroll-partner"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as payrollAPI from "@/api/modules/dashboard/payroll/payroll"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { PayrollPartnerItem } from "@v/dashboard/payroll/partner/definitions/payroll-partner"
import {
    formatJSDateToStringDate,
    formatStringDateToJSDate,
    getAnalyticsStartJSDate,
    getTodayJSDate,
} from "@/lib/date-helpers"
import { formatNumber } from "@/lib/utils"


const notify = useNotify()
const { t, n } = useI18n()

const payrollPartnerStore = usePayrollPartnerStore()
const minDate = ref(getAnalyticsStartJSDate())
const maxDate = ref(getTodayJSDate())

const payroll = ref<PayrollPartnerItem[]>([])
const partners = ref<PartnerOptionItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(payrollPartnerStore.pagination.from),
            to:    n(payrollPartnerStore.pagination.to),
            total: n(payrollPartnerStore.pagination.total),
        },
        Number(payrollPartnerStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (payrollPartnerStore.filter.page - 1) * payrollPartnerStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!payroll.value.length && payrollPartnerStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (payrollPartnerStore.isLoading) return

    payrollPartnerStore.setPage(page + 1)
    refreshPayroll()
}

const hasFilterDate = computed(() => {
    return !!payrollPartnerStore.filter.filters.start_date &&
        !!payrollPartnerStore.filter.filters.end_date
})

onMounted(async () => {
    payrollPartnerStore.setIsLoading(true)

    const [
        payrollData,
        partnersData,
    ] = await Promise.all([
        hasFilterDate.value
            ? payrollAPI.partnerList(payrollPartnerStore.filter)
            : null,
        partnersAPI.options(),
    ])

    if (
        payrollData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (payrollData) {
        payroll.value = payrollData.list
        payrollPartnerStore.setPagination(payrollData.page)
    }

    partners.value = partnersData.list


    payrollPartnerStore.setIsLoading(false)
})

async function refreshPayroll() {
    if (!hasFilterDate.value) return

    payrollPartnerStore.setIsLoading(true)

    const payrollData = await payrollAPI.partnerList(payrollPartnerStore.filter)

    if (payrollData instanceof HttpError) {
        notify.error()
        payrollPartnerStore.setIsLoading(false)
        return
    }

    payroll.value = payrollData.list
    payrollPartnerStore.setPagination(payrollData.page)
    payrollPartnerStore.setIsLoading(false)
}

async function onChangeFilter() {
    if (!payrollPartnerStore.isChanged || !hasFilterDate.value) return

    payrollPartnerStore.resetPage()
    payrollPartnerStore.commitFilter()

    await refreshPayroll()
}

const filterDate = computed({
    get: () => {
        const start = formatStringDateToJSDate(payrollPartnerStore.filter.filters.start_date)
        const end = formatStringDateToJSDate(payrollPartnerStore.filter.filters.end_date)
        if (!start && !end) return null
        return [start, end]
    },
    set: (value) => {
        const [start, end] = value || [null, null]
        payrollPartnerStore.filter.filters.start_date = start ? formatJSDateToStringDate(start) : null
        payrollPartnerStore.filter.filters.end_date = end ? formatJSDateToStringDate(end) : null
    },
})
</script>

<template>
    <div class="payroll-company-view">
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
                    :disabled="payrollPartnerStore.isLoading"
                    hide-on-range-selection
                    class="filter-date"
                    @date-select="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-multi-select
                    v-model="payrollPartnerStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-count="payrollPartnerStore.filter.filters.partner_id.length"
                    :disabled="payrollPartnerStore.isLoading"
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
            <list-loading-state v-if="payrollPartnerStore.isLoading" />

            <b-empty-result
                v-else-if="!payrollPartnerStore.isLoading && !hasFilterDate && !payroll.length"
                title="Необходимо выбрать период"
            />

            <b-empty-result
                v-else-if="!payrollPartnerStore.isLoading && !payroll.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                :value="payroll"
                :rows="payrollPartnerStore.pagination.perPage"
                :total-records="payrollPartnerStore.pagination.total"
                :first="firstPage"
                :paginator="showPaginator"
                class="table"
                @page="onPageChange"
                data-key="id"
                scrollable
                lazy
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <prime-column
                    header="Филиал"
                    field="partner_name"
                    class="table-name"
                />

                <prime-column
                    header="Выбранный период"
                    field="current_value"
                    class="table-current-value"
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.current_value)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Предыдущий период"
                    field="past_value"
                    class="table-past-value"
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.past_value)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Изменение %"
                    field="percent_difference"
                    class="table-percent-difference"
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatNumber(data?.percent_difference)" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.payroll-company-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;
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
