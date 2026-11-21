<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePromotionsStore } from "@s/dashboard/promotions/promotions"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouteNavigator } from "@/composables/route/use-route-navigator"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as promotionsAPI from "@/api/modules/dashboard/promotions/promotions"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BExport from "@c/common/b-export/b-export.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import PartnerStateTag from "@v/dashboard/partners/company/list/components/partner-state-tag.vue"
import type { PromotionListItem } from "@v/dashboard/promotions/list/definitions/promotions"
import { exportXLS } from "@v/dashboard/promotions/list/utils/promotions"
import { disabledToStatus, statusToDisabled } from "@/lib/status"
import { controlOptions } from "@/constants/controls"
import { Status } from "@/definitions/status"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { navigate } = useRouteNavigator()

const promotionsStore = usePromotionsStore()

const promotions = ref<PromotionListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(promotionsStore.pagination.from),
            to:    n(promotionsStore.pagination.to),
            total: n(promotionsStore.pagination.total),
        },
        Number(promotionsStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (promotionsStore.filter.page - 1) * promotionsStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!promotions.value.length && promotionsStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (promotionsStore.isLoading) return

    promotionsStore.setPage(page + 1)
    refreshPromotions()
}

onMounted(async () => {
    promotionsStore.setIsLoading(true)

    const [
        promotionsData,
    ] = await Promise.all([
        promotionsAPI.list(promotionsStore.filter),
    ])

    if (promotionsData instanceof HttpError) {
        notify.error()
        return
    }

    promotions.value = promotionsData.list

    promotionsStore.setPagination(promotionsData.page)
    promotionsStore.setIsLoading(false)
})

async function refreshPromotions() {
    promotionsStore.setIsLoading(true)

    const partnersData = await promotionsAPI.list(promotionsStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        promotionsStore.setIsLoading(false)
        return
    }

    promotions.value = partnersData.list
    promotionsStore.setPagination(partnersData.page)
    promotionsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!promotionsStore.isChanged) return

    promotionsStore.resetPage()
    promotionsStore.commitFilter()

    refreshPromotions()
}

function onClick(id: string, event: MouseEvent) {
    navigate(
        {
            name:   DashboardRouteName.DashboardPromotion,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardPromotion,
        params: { id: "!new" },
    })
}

const promotionsState = computed({
    get() {
        return disabledToStatus(promotionsStore.filter.filters.disabled)
    },
    set(newValue: Status) {
        promotionsStore.filter.filters.disabled = statusToDisabled(newValue)
    },
})

async function onExportXLS() {
    if (promotionsStore.isExporting) return

    promotionsStore.setIsExporting(true)

    try {
        const promotionsData = await promotionsAPI.exportData()

        if (promotionsData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(promotionsData)
    } finally {
        promotionsStore.setIsExporting(false)
    }
}
</script>

<template>
    <div class="promotions-list-view">
        <b-toolbar
            no-paddings
            :show-more="!promotionsStore.isLoading"
        >
            <b-toolbar-item header="Статус">
                <b-select
                    v-model="promotionsState"
                    :options="controlOptions"
                    :disabled="promotionsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    show-clear
                    placeholder="Выберите статус"
                    class="filter-state"
                    @change="onChangeFilter"
                />
            </b-toolbar-item>

            <template #more>
                <b-toolbar-item>
                    <b-button-secondary
                        label="Добавить акцию"
                        @click="goToNew"
                    />
                </b-toolbar-item>
            </template>

            <template #right-side>
                <b-toolbar-item>
                    <b-export
                        :types="{ xls: true }"
                        :disabled="{ xls: promotionsStore.isLoading || promotionsStore.isExporting }"
                        :loading="{ xls: promotionsStore.isExporting }"
                        @export-xls="onExportXLS"
                    />
                </b-toolbar-item>

                <b-toolbar-item>
                    <b-input-search
                        v-model="promotionsStore.filter.search"
                        :disabled="promotionsStore.isLoading"
                        placeholder="Найти акцию"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="promotionsStore.isLoading" />

            <b-empty-result
                v-else-if="!promotionsStore.isLoading && !promotions.length"
                title="Нет акций"
            />

            <prime-data-table
                v-else
                :value="promotions"
                :rows="promotionsStore.pagination.perPage"
                :total-records="promotionsStore.pagination.total"
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
                    header="Название"
                    field="title"
                    class="table-title link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.title"
                            @click="(e: MouseEvent) => onClick(data.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Статус"
                    field="disabled"
                    class="table-disabled"
                >
                    <template #body="{ data }">
                        <partner-state-tag :active="!data.disabled" />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата окончания"
                    field="expires_at"
                    class="table-expires-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.expires_at" />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата создания"
                    field="created_at"
                    class="table-created-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.created_at" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.promotions-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table-title {
            @include col-fixed(350px);
        }
    }

    .filter {
        &-state {
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
