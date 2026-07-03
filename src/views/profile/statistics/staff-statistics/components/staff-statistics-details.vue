<script setup lang="ts">
import MonthsBarChart from "@c/charts/months-bar-chart.vue"
import BImage from "@c/common/b-image/b-image.vue"
import type { StaffDetails } from "@v/profile/statistics/staff-statistics/definitions/statistic-staff"
import {
    clearName,
    clearSpecialization,
} from "@v/profile/statistics/staff-statistics/utils/staff-statistics"

interface Props {
    details: StaffDetails
}

defineProps<Props>()
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

        <div class="grid-item">
            <div class="title"> Дополнительные услуги </div>

            <months-bar-chart
                :data="{}"
                :has-partner="true"
                :limit="4"
            />
        </div>

        <div class="grid-item">
            <div class="title"> Средний чек </div>

            <months-bar-chart
                :data="{}"
                :has-partner="true"
                :limit="4"
            />
        </div>

        <div class="grid-item">
            <div class="title"> Продаж за месяц </div>

            <months-bar-chart
                :data="{}"
                :has-partner="true"
                :limit="4"
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

        .title {
            font-size: 1.2857rem;
            color: var(--p-surface-500);
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
