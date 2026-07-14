<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePartnerStatisticsStore } from "@s/dashboard/statistics/partner-statistics"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as statisticsAPI from "@/api/modules/dashboard/statistics/statistics"
import BAvatar from "@c/common/b-avatar/b-avatar.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { StaffStatisticsItem } from "@v/dashboard/statistics/staff-statistics/definitions/statistic-staff"
import {
    formatJSDateToStartDate,
    getAnalyticsStartDate,
    getPreviousMonth,
    parseStringToDate,
} from "@/lib/date-helpers"

const notify = useNotify()

const partnerStatisticsStore = usePartnerStatisticsStore()
const minDate = ref(getAnalyticsStartDate())
const maxDate = ref(getPreviousMonth())

const staffStatistics = ref<StaffStatisticsItem[]>([])
const partners = ref<PartnerOptionItem[]>([])

const filterDate = computed({
    get: () => parseStringToDate(partnerStatisticsStore.filter.filters.date),
    set: (value: Date | null) => {
        partnerStatisticsStore.filter.filters.date = formatJSDateToStartDate(value)
    },
})

const filterPartner = computed({
    get: () => partnerStatisticsStore.filter.filters.partner_id,
    set: (value: number) => {
        partnerStatisticsStore.filter.filters.partner_id = value
    },
})

onMounted(async () => {
    partnerStatisticsStore.setIsLoading(true)

    const isSelectedPartner = !!filterPartner.value

    const [
        staffStatisticsData,
        partnersData,
    ] = await Promise.all([
        isSelectedPartner
            ? statisticsAPI.getStaffList(partnerStatisticsStore.filter)
            : null,
        partnersAPI.options(),
    ])

    if (
        staffStatisticsData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (staffStatisticsData) {
        staffStatistics.value = staffStatisticsData.list
    }

    partners.value = partnersData.list
    partnerStatisticsStore.setIsLoading(false)
})

async function refreshStaffStatistics() {
    const { partner_id, date } = partnerStatisticsStore.filter.filters

    if (!partner_id || !date) return

    partnerStatisticsStore.setIsLoading(true)

    const staffStatisticsData = await statisticsAPI.getStaffList(partnerStatisticsStore.filter)

    if (staffStatisticsData instanceof HttpError) {
        notify.error()
        partnerStatisticsStore.setIsLoading(false)
        return
    }

    staffStatistics.value = staffStatisticsData.list
    partnerStatisticsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnerStatisticsStore.isChanged) return

    partnerStatisticsStore.commitFilter()
    refreshStaffStatistics()
}

function clearName(data: StaffStatisticsItem) {
    return data.name || ""
}

function clearSpecialization(text: string) {
    if (!text) return ""
    return text.replace(/\s*\[.*]/g, "")
}
</script>

<template>
    <div class="staff-statistics-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="filterDate"
                    placeholder="Выберите период"
                    date-format="MM yy"
                    :min-date="minDate"
                    :max-date="maxDate"
                    view="month"
                    :disabled="partnerStatisticsStore.isLoading"
                    class="filter-date"
                    @date-select="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-select
                    v-model="filterPartner"
                    :options="partners"
                    :disabled="partnerStatisticsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    placeholder="Выберите филиал"
                    class="filter-partner"
                    @change="onChangeFilter"
                />
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="partnerStatisticsStore.isLoading" />

            <b-empty-result
                v-else-if="!filterPartner"
                title="Необходимо выбрать филиал"
            />

            <b-empty-result
                v-else-if="!partnerStatisticsStore.isLoading && !staffStatistics.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                :value="staffStatistics"
                class="table"
                data-key="staff_id"
                scrollable
                lazy
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
                            :text="clearName(data)"
                            :subtext="clearSpecialization(data?.specialization)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="work_days_count"
                    class="table-work-days-count"
                >
                    <template #header>
                        <b-table-text text="Кол-во смен" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.work_days_count" />
                    </template>
                </prime-column>

                <prime-column
                    field="transaction_loyalty"
                    class="table-transaction-loyalty"
                >
                    <template #header>
                        <b-table-text text="Абонементы и сертификаты" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.transaction_loyalty" />
                    </template>
                </prime-column>

                <prime-column
                    field="income_total"
                    class="table-income-total"
                >
                    <template #header>
                        <b-table-text text="Валовая выручка" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.income_total" />
                    </template>
                </prime-column>

                <prime-column
                    field="average_sum"
                    class="table-average_sum"
                >
                    <template #header>
                        <b-table-text text="Средний чек" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text
                            :text="data.average_sum"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="additional_services"
                    class="table-additional-services"
                >
                    <template #header>
                        <b-table-text text="Дополнительные услуги" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.additional_services" />
                    </template>
                </prime-column>

                <prime-column
                    field="transaction_sales"
                    class="table-transaction-sales"
                >
                    <template #header>
                        <b-table-text text="Продажи (без сертов)" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.transaction_sales" />
                    </template>
                </prime-column>

                <prime-column
                    field="services_with_transactions"
                    class="table-services-with-transactions"
                >
                    <template #header>
                        <b-table-text text="Дополнительные услуги и продажи" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.services_with_transactions" />
                    </template>
                </prime-column>

                <prime-column
                    field="rating"
                    class="table-rating"
                >
                    <template #header>
                        <b-table-text text="Отзывы (всего/пять)" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="`${data.rating_total} / ${data.rating_best}`" />
                    </template>
                </prime-column>

                <prime-column
                    field="fullness_percent"
                    class="table-fullness-percent"
                >
                    <template #header>
                        <b-table-text text="Заполняемость" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="`${data.fullness_percent}%`" />
                    </template>
                </prime-column>

                <prime-column
                    field="retention_percent"
                    class="table-retention-percent"
                >
                    <template #header>
                        <b-table-text text="Возвращаемость" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="`${data.retention_percent}%`" />
                    </template>
                </prime-column>

                <prime-column
                    field="client_new"
                    class="table-clien-new"
                >
                    <template #header>
                        <b-table-text text="Новые клиенты" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.client_new" />
                    </template>
                </prime-column>

                <prime-column
                    field="client_return"
                    class="table-client-return"
                >
                    <template #header>
                        <b-table-text text="Постоянные клиенты" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.client_return" />
                    </template>
                </prime-column>

                <prime-column
                    field="client_services_per_visit"
                    class="table-services-per-visit"
                >
                    <template #header>
                        <b-table-text text="KPI" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.services_per_visit" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.staff-statistics-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .p-datatable-header-cell {
            text-wrap: nowrap;
            overflow: hidden;
        }

        .table {
            &-avatar {
                @include col-fixed(65px);
            }

            &-name {
                @include col-fixed(230px);
            }

            &-transaction-loyalty,
            &-income-total,
            &-average_sum,
            &-additional-services,
            &-transaction-sales,
            &-services-with-transactions,
            &-rating,
            &-fullness-percent,
            &-retention-percent,
            &-clien-new,
            &-client-return,
            &-work-days-count,
            &-services-per-visit {
                @include col-fixed(110px);
            }
        }
    }

    .filter {
        &-date,
        &-partner {
            @include col-width(250px);
        }
    }
}
</style>
