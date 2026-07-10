<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { usePartnerStatisticsStore } from "@s/dashboard/statistics/partner-statistics.ts"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as statisticsAPI from "@/api/modules/dashboard/statistics/statistics"
import type { MonthsBarChartData } from "@c/charts/definitions/charts"
import MonthsBarChart from "@c/charts/months-bar-chart.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import {
    formatJSDateToStartDate,
    getAnalyticsStartDate,
    getPreviousMonth,
    parseStringToDate,
} from "@/lib/date-helpers"


const notify = useNotify()
const { t } = useI18n()

const partnerStatisticsStore = usePartnerStatisticsStore()
const minDate = ref(getAnalyticsStartDate())
const maxDate = ref(getPreviousMonth())

const partnerStatistics = ref<MonthsBarChartData>({})
const partners = ref<PartnerOptionItem[]>([])

const filterDate = computed({
    get: () => parseStringToDate(partnerStatisticsStore.filter.filters.date),
    set: (value: Date | null) => {
        partnerStatisticsStore.filter.filters.date = formatJSDateToStartDate(value, true)
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
        partnerStatisticsData,
        partnersData,
    ] = await Promise.all([
        isSelectedPartner
            ? statisticsAPI.getPartnerIncome(partnerStatisticsStore.filter)
            : null,
        partnersAPI.options(),
    ])

    if (
        partnerStatisticsData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (partnerStatisticsData) {
        partnerStatistics.value = partnerStatisticsData.list
    }

    partners.value = partnersData.list
    partnerStatisticsStore.setIsLoading(false)
})

async function refreshStatisticsStaff() {
    const { partner_id, date } = partnerStatisticsStore.filter.filters

    if (!partner_id || !date) return

    partnerStatisticsStore.setIsLoading(true)

    const partnerStatisticsData = await statisticsAPI.getPartnerIncome(partnerStatisticsStore.filter)

    if (partnerStatisticsData instanceof HttpError) {
        notify.error()
        partnerStatisticsStore.setIsLoading(false)
        return
    }

    partnerStatistics.value = partnerStatisticsData.list
    partnerStatisticsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnerStatisticsStore.isChanged) return

    partnerStatisticsStore.commitFilter()
    refreshStatisticsStaff()
}

const hasPartnerStatistics = computed(() => Object.keys(partnerStatistics.value).length)
</script>

<template>
    <div class="partner-statistics-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="filterDate"
                    :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
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

        <div class="chart-wrapper">
            <list-loading-state v-if="partnerStatisticsStore.isLoading" />

            <b-empty-result
                v-else-if="!filterPartner"
                title="Необходимо выбрать филиал"
            />

            <b-empty-result
                v-else-if="!partnerStatisticsStore.isLoading && !hasPartnerStatistics"
                title="Нет данных"
            />

            <months-bar-chart
                v-else
                :data="partnerStatistics"
                :is-loading="false"
                :has-partner="true"
                :limit="6"
                class="month-bar-chart"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.partner-statistics-view {
    @include list-view;

    padding-top: $indent-x2;

    .chart-wrapper {
        margin-top: $indent-x2;

        .month-bar-chart {
            min-height: 400px;
            padding: $indent-x1 $indent-x3 0;
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
