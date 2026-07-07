<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { computed, onMounted, ref } from "vue"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import PrimeFloatLabel from "primevue/floatlabel"
import { useAuthStore } from "@s/auth/auth"
import { usePartnerStatisticsStore } from "@s/profile/statistics/partner-statistics"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import type { UserPartnerItem } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import type { TotalCompareStatistics } from "@/api/modules/profile/statistics/definitions/statistics"
import * as statisticsAPI from "@/api/modules/profile/statistics/statistics"
import BAvatar from "@c/common/b-avatar/b-avatar.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import StaffStatisticsDetails from "@v/profile/statistics/staff-statistics/components/staff-statistics-details.vue"
import TableBodyCell from "@v/profile/statistics/staff-statistics/components/table-body-cell.vue"
import type {
    StaffDetails,
    StaffStatisticsItem,
} from "@v/profile/statistics/staff-statistics/definitions/statistic-staff"
import {
    clearName,
    clearSpecialization,
} from "@v/profile/statistics/staff-statistics/utils/staff-statistics"
import {
    formatDateToString,
    getAnalyticsStartDate,
    getPreviousMonth,
    parseStringToDate,
} from "@/lib/date-helpers"
import { $sanitizeHtml } from "@/lib/sanitize-html"


const notify = useNotify()
const authStore = useAuthStore()

const partnerStatisticsStore = usePartnerStatisticsStore()
const minDate = ref(getAnalyticsStartDate())
const maxDate = ref(getPreviousMonth())

const staffStatistics = ref<StaffStatisticsItem[]>([])
const totalCompare = ref<TotalCompareStatistics>({} as TotalCompareStatistics)
const userPartners = ref<UserPartnerItem[]>([])

const staffDetails = ref<Record<number, StaffDetails>>({})
const staffDetailsLoading = ref<Record<number, boolean>>({})
const expandedRows = ref<Record<number, boolean>>({})

const filterDate = computed({
    get: () => parseStringToDate(partnerStatisticsStore.filter.filters.date),
    set: (value: Date | null) => {
        partnerStatisticsStore.filter.filters.date = formatDateToString(value, true)
    },
})

const filterPartner = computed({
    get: () => {
        return partnerStatisticsStore.filter.filters.partner_id
    },
    set: (value: number | null) => {
        partnerStatisticsStore.filter.filters.partner_id = value
    },
})

const isSelectedPartner = computed(() => !!filterPartner.value)

onMounted(async () => {
    partnerStatisticsStore.setIsLoading(true)

    const userPartner = authStore.user.partner
    if (userPartner?.id) {
        filterPartner.value = userPartner.id
        userPartners.value = [{
            partner_id: userPartner.id,
            name:       userPartner.name,
        }]
    }

    const [
        staffStatisticsResponse,
        totalCompareStatisticsResponse,
        partnersResponse,
    ] = await Promise.all([
        isSelectedPartner.value
            ? statisticsAPI.getStaffCompare(partnerStatisticsStore.filter)
            : null,
        isSelectedPartner.value
            ? statisticsAPI.getTotalCompareStats({
                partner_id: partnerStatisticsStore.filter.filters.partner_id,
                date:       partnerStatisticsStore.filter.filters.date,
            })
            : null,
        partnerAPI.userPartners(),
    ])

    if (
        staffStatisticsResponse instanceof HttpError ||
        totalCompareStatisticsResponse instanceof HttpError ||
        partnersResponse instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (staffStatisticsResponse) {
        staffStatistics.value = staffStatisticsResponse.list
    }

    if (totalCompareStatisticsResponse) {
        totalCompare.value = totalCompareStatisticsResponse?.data
    }

    userPartners.value = partnersResponse.partners
    partnerStatisticsStore.setIsLoading(false)
})

async function refreshStaffStatistics() {
    partnerStatisticsStore.setIsLoading(true)

    const [
        staffStatisticsResponse,
        totalCompareStatisticsResponse,
    ] = await Promise.all([
        statisticsAPI.getStaffCompare(partnerStatisticsStore.filter),
        statisticsAPI.getTotalCompareStats({
            partner_id: partnerStatisticsStore.filter.filters.partner_id,
            date:       partnerStatisticsStore.filter.filters.date,
        }),
    ])


    if (
        staffStatisticsResponse instanceof HttpError ||
        totalCompareStatisticsResponse instanceof HttpError
    ) {
        notify.error()
        partnerStatisticsStore.setIsLoading(false)
        return
    }

    staffStatistics.value = staffStatisticsResponse.list
    totalCompare.value = totalCompareStatisticsResponse.data

    staffDetails.value = {}
    staffDetailsLoading.value = {}
    expandedRows.value = {}

    partnerStatisticsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnerStatisticsStore.isChanged) return

    partnerStatisticsStore.commitFilter()
    refreshStaffStatistics()
}

async function onRowExpand(event: { data: StaffStatisticsItem }) {
    const staff_id = event.data.staff_id
    const { partner_id, date } = partnerStatisticsStore.filter.filters

    if (
        staffDetails.value[staff_id] ||
        !date ||
        !partner_id
    ) {
        return
    }

    staffDetailsLoading.value[staff_id] = true

    const response = await statisticsAPI.getStaffDetails({
        staff_id,
        partner_id,
        date,
    })

    if (response instanceof HttpError) {
        notify.error()
    } else {
        staffDetails.value[staff_id] = response.data
    }

    staffDetailsLoading.value[staff_id] = false
}
</script>

<template>
    <portal-page
        title="Аналитика по сотрудникам"
        class="staff-statistics-view"
        without-right-side
    >
        <b-toolbar
            no-paddings
            class="bg-transparent"
        >
            <b-toolbar-item>
                <prime-float-label variant="on">
                    <b-date-picker
                        v-model="filterDate"
                        date-format="MM yy"
                        :min-date="minDate"
                        :max-date="maxDate"
                        view="month"
                        :disabled="partnerStatisticsStore.isLoading"
                        class="filter-date"
                        @date-select="onChangeFilter"
                    />
                    <label for="filter-date">Период</label>
                </prime-float-label>
            </b-toolbar-item>

            <b-toolbar-item>
                <prime-float-label variant="on">
                    <b-select
                        v-model="filterPartner"
                        :options="userPartners"
                        :disabled="partnerStatisticsStore.isLoading"
                        option-label="name"
                        option-value="partner_id"
                        filter
                        class="filter-partner"
                        @change="onChangeFilter"
                    />
                    <label for="filter-date">Филиал</label>
                </prime-float-label>
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state
                v-if="partnerStatisticsStore.isLoading"
                width-border
                class="bg-transparent pa-x2"
            />

            <b-empty-result
                v-else-if="!filterPartner"
                title="Необходимо выбрать филиал"
                width-border
            />

            <b-empty-result
                v-else-if="!partnerStatisticsStore.isLoading && !staffStatistics.length"
                title="Нет данных"
                width-border
            />

            <prime-data-table
                v-else
                v-model:expanded-rows="expandedRows"
                :value="staffStatistics"
                class="table"
                scrollable
                scroll-height="flex"
                data-key="staff_id"
                lazy
                @row-expand="onRowExpand"
            >
                <prime-column
                    field="row-toggler"
                    class="table-row-toggler"
                >
                    <template #body="{ data, rowTogglerCallback }">
                        <table-body-cell>
                            <b-button-icon
                                :icon="expandedRows[data.staff_id]
                                    ? 'pi-chevron-down'
                                    : 'pi-chevron-right'
                                "
                                @click="rowTogglerCallback"
                            />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="avatar"
                    class="table-avatar"
                >
                    <template #body="{ data }">
                        <table-body-cell>
                            <b-avatar
                                :src="data.avatar"
                                shape="square"
                            />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="name"
                    class="table-name"
                >
                    <template #header>
                        <b-table-text text="Имя" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell>
                            <b-table-text
                                :text="clearName(data?.name)"
                                :subtext="clearSpecialization(data?.specialization)"
                                class="table-cell-name"
                            />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <b-table-text text="Итого" />
                    </template>
                </prime-column>

                <prime-column
                    field="work_days_count"
                    class="table-work-days-count"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Кол-во<br>смен')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.work_days_count">
                            <b-table-text :text="data.work_days_count" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell>
                            <b-table-text />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="transaction_loyalty"
                    class="table-transaction-loyalty"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Абонементы и<br>сертификаты')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.transaction_loyalty">
                            <b-table-text :text="data.transaction_loyalty" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.transaction_loyalty">
                            <b-table-text :text="totalCompare.transaction_loyalty" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="income_total"
                    class="table-income-total"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Валовая<br>выручка')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell
                            :growth="data.growth.income_total"
                            highlight
                        >
                            <b-table-text :text="data.income_total" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.income_total">
                            <b-table-text :text="totalCompare.income_total" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="average_sum"
                    class="table-average_sum"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Средний<br>чек')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell
                            :growth="data.growth.average_sum"
                            highlight
                        >
                            <b-table-text :text="data.average_sum" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.average_sum">
                            <b-table-text :text="totalCompare.average_sum" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="additional_services"
                    class="table-additional-services"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Дополнительные<br>услуги')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell
                            :growth="data.growth.additional_services"
                            highlight
                        >
                            <b-table-text :text="data.additional_services" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.additional_services">
                            <b-table-text :text="totalCompare.additional_services" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="transaction_sales"
                    class="table-transaction-sales"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Продажи<br>(без сертификатов)')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.transaction_sales">
                            <b-table-text :text="data.transaction_sales" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.transaction_sales">
                            <b-table-text :text="totalCompare.transaction_sales" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="services_with_transactions"
                    class="table-services-with-transactions"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Дополнительные<br>услуги и продажи')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.services_with_transactions">
                            <b-table-text :text="data.services_with_transactions" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.services_with_transactions">
                            <b-table-text :text="totalCompare.services_with_transactions" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="rating"
                    class="table-rating"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Отзывы<br>(всего/пять)')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.rating_total">
                            <b-table-text :text="`${data.rating_total} / ${data.rating_best}`" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.rating_total">
                            <b-table-text :text="`${totalCompare.rating_total} / ${totalCompare.rating_best}`" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="fullness_percent"
                    class="table-fullness-percent"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Заполняемость')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.fullness_percent">
                            <b-table-text :text="`${data.fullness_percent}%`" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.fullness_percent">
                            <b-table-text :text="`${totalCompare.fullness_percent}%`" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="retention_percent"
                    class="table-retention-percent"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Возвращаемость')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.retention_percent">
                            <b-table-text :text="`${data.retention_percent}%`" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.retention_percent">
                            <b-table-text :text="`${totalCompare.retention_percent}%`" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="client_new"
                    class="table-clien-new"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Новые<br>клиенты')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.client_new">
                            <b-table-text :text="data.client_new" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.client_new">
                            <b-table-text :text="totalCompare.client_new" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="client_new"
                    class="table-clien-return"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('Постоянные<br>клиенты')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.client_return">
                            <b-table-text :text="data.client_return" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <table-body-cell :growth="totalCompare.growth.client_return">
                            <b-table-text :text="totalCompare.client_return" />
                        </table-body-cell>
                    </template>
                </prime-column>

                <prime-column
                    field="services_per_visit"
                    class="table-services-per-visit"
                >
                    <template #header>
                        <div v-html="$sanitizeHtml('KPI')" />
                    </template>

                    <template #body="{ data }">
                        <table-body-cell :growth="data.growth.services_per_visit">
                            <b-table-text :text="data.services_per_visit" />
                        </table-body-cell>
                    </template>

                    <template #footer>
                        <b-table-text />
                    </template>
                </prime-column>

                <template #expansion="slotProps">
                    <list-loading-state
                        v-if="staffDetailsLoading[slotProps.data.staff_id]"
                        class="bg-transparent"
                    />

                    <staff-statistics-details
                        v-else-if="staffDetails[slotProps.data.staff_id]"
                        :details="staffDetails[slotProps.data.staff_id]"
                    />
                </template>
            </prime-data-table>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.staff-statistics-view {
    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        .p-datatable-table {
            border-spacing: 0 $indent-x2;

            .p-datatable-thead {
                background-color: transparent;

                .b-table-text {
                    white-space: pre-line;
                }

                .p-datatable-header-cell {
                    background: transparent;
                    border-width: 0;
                }
            }

            .p-datatable-tbody > tr {
                background: transparent;

                &.p-row-even,
                &.p-row-odd {
                    > td {
                        border-width: 1px 0 1px 0;
                        padding: 0;
                    }

                    > td:first-child {
                        border-width: 1px 0 1px 1px;
                        border-radius: $indent-x2 0 0 $indent-x2;
                    }

                    > td:last-child {
                        border-width: 1px 1px 1px 0;
                        border-radius: 0 $indent-x2 $indent-x2 0;
                    }
                }

                &.p-datatable-row-expansion > td {
                    border-width: 1px;
                    border-color: var(--p-datatable-body-cell-border-color);
                    padding: var(--p-datatable-body-cell-padding);
                    border-radius: $indent-x2;
                }
            }

            .p-datatable-tfoot > tr {
                background: transparent;

                > td {
                    border-width: 1px 0 1px 0;
                    padding: 0;
                    border-color: var(--p-datatable-body-cell-border-color);
                }

                > td:first-child {
                    border-width: 1px 0 1px 1px;
                    border-radius: $indent-x2 0 0 $indent-x2;
                    border-color: var(--p-datatable-body-cell-border-color);
                }

                > td:last-child {
                    border-width: 1px 1px 1px 0;
                    border-radius: 0 $indent-x2 $indent-x2 0;
                    border-color: var(--p-datatable-body-cell-border-color);
                }
            }
        }

        .table {
            border-spacing: 0 $indent-x2;

            &-avatar {
                @include col-fixed(40px);

                .cell-content {
                    padding-right: 0;
                    padding-left: 0;
                }
            }


            &-row-toggler {
                @include col-fixed(65px);
            }

            &-name {
                @include col-fixed(230px);

                .table-cell-name {
                    .text {
                        color: var(--p-primary-500);
                    }
                }
            }

            &-clien-new,
            &-work-days-count,
            &-visits-count,
            &-services-count,
            &-visits-per-service,
            &-services-per-visit {
                @include col-fixed(90px);
            }

            &-rating,
            &-income-total,
            &-average_sum,
            &-clien-return {
                @include col-fixed(110px);
            }

            &-transaction-loyalty {
                @include col-fixed(120px);
            }

            &-fullness-percent, {
                @include col-fixed(130px);
            }

            &-services-with-transactions,
            &-additional-services,
            &-retention-percent {
                @include col-fixed(140px);
            }

            &-transaction-sales {
                @include col-fixed(150px);
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
