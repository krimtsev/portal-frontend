<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useStatisticsStaffStore } from "@s/dashboard/statistics/statistics-staff"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as statisticsAPI from "@/api/modules/dashboard/statistics/statistics"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { StatisticsStaffItem } from "@v/dashboard/statistics/statistics-staff/definitions/statistic-staff"
import {
    formatDateToString,
    getAnalyticsStartDate,
    getPreviousMonth,
    parseStringToDate,
} from "@/lib/date-helpers"

const notify = useNotify()
const { t } = useI18n()

const statisticsStaffStore = useStatisticsStaffStore()
const minDate = ref(getAnalyticsStartDate())
const maxDate = ref(getPreviousMonth())

const statisticsStaff = ref<StatisticsStaffItem[]>([])
const partners = ref<PartnerOptionItem[]>([])

const filterDate = computed({
    get: () => parseStringToDate(statisticsStaffStore.filter.filters.date),
    set: (value: Date | null) => {
        statisticsStaffStore.filter.filters.date = formatDateToString(value, true)
    },
})

const filterPartner = computed({
    get: () => statisticsStaffStore.filter.filters.partner_id,
    set: (value: number) => {
        statisticsStaffStore.filter.filters.partner_id = value
    },
})

onMounted(async () => {
    statisticsStaffStore.setIsLoading(true)

    const isSelectedPartner = !!filterPartner.value

    const [
        statisticsStaffData,
        partnersData,
    ] = await Promise.all([
        isSelectedPartner
            ? statisticsAPI.getStaffList(statisticsStaffStore.filter)
            : null,
        partnersAPI.options(),
    ])

    if (
        statisticsStaffData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (statisticsStaffData) {
        statisticsStaff.value = statisticsStaffData.list
    }

    partners.value = partnersData.list
    statisticsStaffStore.setIsLoading(false)
})

async function refreshStatisticsStaff() {
    statisticsStaffStore.setIsLoading(true)


    const statisticsStaffData = await statisticsAPI.getStaffList(statisticsStaffStore.filter)

    if (statisticsStaffData instanceof HttpError) {
        notify.error()
        statisticsStaffStore.setIsLoading(false)
        return
    }

    statisticsStaff.value = statisticsStaffData.list
    statisticsStaffStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!statisticsStaffStore.isChanged) return

    statisticsStaffStore.commitFilter()
    refreshStatisticsStaff()
}

function clearName(data: StatisticsStaffItem) {
    // if (data.firstname) {
    //     return [data.surname, data.firstname].join(" ")
    // }

    //return data.name.replace(/\s*\(.*\)/g, "")
    return data.name
}

function clearSpecialization(text: string) {
    //return text.replace(/\s*\[.*]/g, "")
    return text
}
</script>

<template>
    <div class="statistics-staff-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="filterDate"
                    :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
                    date-format="MM yy"
                    :min-date="minDate"
                    :max-date="maxDate"
                    view="month"
                    :disabled="statisticsStaffStore.isLoading"
                    class="filter-date"
                    @date-select="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-select
                    v-model="filterPartner"
                    :options="partners"
                    :disabled="statisticsStaffStore.isLoading"
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
            <list-loading-state v-if="statisticsStaffStore.isLoading" />

            <b-empty-result
                v-else-if="!filterPartner"
                title="Необходимо выбрать филиал"
            />

            <b-empty-result
                v-else-if="!statisticsStaffStore.isLoading && !statisticsStaff.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                :value="statisticsStaff"
                class="table"
                data-key="id"
                scrollable
                lazy
            >
                <prime-column
                    header="#"
                    field="staff_id"
                    class="table-staff-id"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data.staff_id"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Сотрудник"
                    field="name"
                    class="table-name"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="clearName(data)"
                            :subtext="clearSpecialization(data?.specialization)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Продажи абонементов и сертификатов"
                    field="transaction_loyalty"
                    class="table-transaction-loyalty"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.transaction_loyalty" />
                    </template>
                </prime-column>

                <prime-column
                    header="Валовая выручка"
                    field="income_total"
                    class="table-income-total"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.income_total" />
                    </template>
                </prime-column>

                <prime-column
                    header="Средний чек"
                    field="average_sum"
                    class="table-average_sum"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data.average_sum"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Доп. услуги"
                    field="additional_services"
                    class="table-specialization"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.additional_services" />
                    </template>
                </prime-column>

                <prime-column
                    header="Продажи (без сертов)"
                    field="transaction_sales"
                    class="table-transaction-sales"
                />

                <prime-column
                    header="Сумма доп. услуг и продаж"
                    field="sum"
                    class="table-sum"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.sum" />
                    </template>
                </prime-column>

                <!--                <prime-column-->
                <!--                    header="Возвращаемость"-->
                <!--                    field="specialization"-->
                <!--                    class="table-specialization"-->
                <!--                />-->

                <prime-column
                    header="Всего отзывов"
                    field="rating"
                    class="table-rating"
                >
                    <template #body="{ data }">
                        <b-table-text :text="`${data.rating_total} (${data.rating_best})`" />
                    </template>
                </prime-column>

                <prime-column
                    header="Заполняемость %"
                    field="fullness_percent"
                    class="table-fullness-percent"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.fullness_percent" />
                    </template>
                </prime-column>

                <prime-column
                    header="Новые клиенты"
                    field="client_new"
                    class="table-clien-new"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.client_new" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.statistics-staff-view {
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
}
</style>
