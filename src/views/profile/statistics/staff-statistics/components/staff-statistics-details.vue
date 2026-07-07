<script setup lang="ts">
import { computed } from "vue"
import MonthsBarChart from "@c/charts/months-bar-chart.vue"
import BImage from "@c/common/b-image/b-image.vue"
import BSvg from "@c/common/b-svg/b-svg.vue"
import type { StaffDetails } from "@v/profile/statistics/staff-statistics/definitions/statistic-staff"
import {
    clearName,
    clearSpecialization,
} from "@v/profile/statistics/staff-statistics/utils/staff-statistics"
import { formatPrice } from "@/lib/utils.ts"


interface Props {
    details: StaffDetails
}

const props = defineProps<Props>()

const additional_services = computed(() => {
    return props.details.history.additional_services[props.details.date].value
})

const average_sum = computed(() => {
    return props.details.history.average_sum[props.details.date].value
})

const income_goods = computed(() => {
    return props.details.history.income_goods[props.details.date].value
})

const additional_services_percent = computed(() => {
    return props.details.history.additional_services[props.details.date].percent ?? 0
})

const average_sum_percent = computed(() => {
    return props.details.history.average_sum[props.details.date].percent ?? 0
})

const income_goods_percent = computed(() => {
    return props.details.history.income_goods[props.details.date].percent ?? 0
})
</script>

<template>
    <div class="staff-statistics-details">
        <div class="staff grid-item">
            <div class="staff-avatar">
                <b-image
                    :src="details.avatar_big"
                    :alt="details.name"
                    width="170px"
                    height="170px"
                    border="circle"
                />
            </div>

            <div class="staff-name">
                {{ clearName(details.name) }}
            </div>

            <div class="staff-specialization">
                {{ clearSpecialization(details.specialization) }}
            </div>
        </div>

        <div
            class="grid-item"
            :class="additional_services_percent < 0 ? 'trend-negative' : 'trend-positive'"
        >
            <div class="title"> Дополнительные услуги </div>

            <div class="sum">
                <span class="currency">₽</span>
                {{ formatPrice(additional_services, 0) }}
                <b-svg
                    :name="additional_services_percent < 0 ? 'pi-arrow-down' : 'pi-arrow-up'"
                    size="1.2rem"
                    class="arrow"
                />
            </div>

            <months-bar-chart
                :data="details.history.additional_services"
                :has-partner="true"
                highlight-last
            />
        </div>

        <div
            class="grid-item"
            :class="average_sum_percent < 0 ? 'trend-negative' : 'trend-positive'"
        >
            <div class="title"> Средний чек </div>

            <div class="sum">
                <span class="currency">₽</span>
                {{ formatPrice(average_sum, 0) }}
                <b-svg
                    :name="average_sum_percent < 0 ? 'pi-arrow-down' : 'pi-arrow-up'"
                    size="1.2rem"
                    class="arrow"
                />
            </div>

            <months-bar-chart
                :data="details.history.average_sum"
                :has-partner="true"
                highlight-last
            />
        </div>

        <div
            class="grid-item"
            :class="income_goods_percent < 0 ? 'trend-negative' : 'trend-positive'"
        >
            <div class="title"> Продаж за месяц </div>

            <div class="sum">
                <span class="currency">₽</span>
                {{ formatPrice(income_goods, 0) }}
                <b-svg
                    :name="income_goods_percent < 0 ? 'pi-arrow-down' : 'pi-arrow-up'"
                    size="1.2rem"
                    class="arrow"
                />
            </div>

            <months-bar-chart
                :data="details.history.income_goods"
                :has-partner="true"
                highlight-last
            />
        </div>

        <div class="grid-item">
            <div class="title"> Заполняемость </div>
            <div class="total"> {{ details.fullness_percent }}% </div>
        </div>

        <div class="grid-item">
            <div class="title"> Всего клиентов </div>
            <div class="total"> {{ details.client_active }} </div>
        </div>

        <div class="grid-item">
            <div class="title"> Постоянные клиенты </div>
            <div class="total"> {{ details.client_return }} </div>
        </div>

        <div class="grid-item">
            <div class="title"> Новые клиенты </div>
            <div class="total"> {{ details.client_new }} </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.staff-statistics-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: $indent-x1;
    padding: $indent-x1;

    .grid-item {
        border: 1px solid var(--p-datatable-body-cell-border-color);
        border-radius: $indent-x2;
        padding: $indent-x3 $indent-x4;

        &.trend-negative {
            background-image: linear-gradient(
                180deg,
                color-mix(in srgb, var(--p-red-700) 55%, transparent) 0%,
                transparent 16%
            );

            .sum .arrow {
                color: var(--p-red-500);
            }
        }

        &.trend-positive {
            background-image: linear-gradient(
                180deg,
                color-mix(in srgb, var(--p-primary-600) 55%, transparent) 0%,
                transparent 16%
            );

            .sum .arrow {
                color: var(--p-primary-500);
            }
        }

        .title {
            font-size: 1.2857rem;
            color: var(--p-surface-400);
        }

        .sum {
            font-size: 3rem;
            padding-top: $indent-x1;
            display: flex;
            align-items: baseline;
            gap: 0.5rem;

            .currency {
                font-size: 2rem;
            }
        }

        .total {
            font-size: 3rem;
            text-align: right;
        }
    }

    .staff {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: $indent-x1;

        &-name {
            @include h2();

            color: var(--p-primary-500);
        }

        &-specialization {
            @include small-text;

            text-align: center;
        }
    }
}
</style>
