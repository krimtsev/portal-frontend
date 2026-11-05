<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePromoDialogsStore } from "@s/dashboard/promo-dialogs/promo-dialogs"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouteNavigator } from "@/composables/route/use-route-navigator"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as promoDialogsAPI from "@/api/modules/dashboard/promo-dialogs/promo-dialogs"
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
import type { PromoDialogListItem } from "@v/dashboard/promo-dialogs/list/definitions/promo-dialogs"
import { exportXLS } from "@v/dashboard/promo-dialogs/list/definitions/utils/promo-dialogs"
import { disabledToStatus, statusToDisabled } from "@/lib/status"
import { controlOptions } from "@/constants/controls"
import { Status } from "@/definitions/status"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { navigate } = useRouteNavigator()

const promoDialogsStore = usePromoDialogsStore()

const promoDialogs = ref<PromoDialogListItem[]>([])
const isExporting = ref<Record<number, boolean>>({})

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(promoDialogsStore.pagination.from),
            to:    n(promoDialogsStore.pagination.to),
            total: n(promoDialogsStore.pagination.total),
        },
        Number(promoDialogsStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (promoDialogsStore.filter.page - 1) * promoDialogsStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!promoDialogs.value.length && promoDialogsStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (promoDialogsStore.isLoading) return

    promoDialogsStore.setPage(page + 1)
    refreshPromoDialogs()
}

onMounted(async () => {
    promoDialogsStore.setIsLoading(true)

    const [
        promoDialogsData,
    ] = await Promise.all([
        promoDialogsAPI.list(promoDialogsStore.filter),
    ])

    if (promoDialogsData instanceof HttpError) {
        notify.error()
        return
    }

    promoDialogs.value = promoDialogsData.list

    promoDialogsStore.setPagination(promoDialogsData.page)
    promoDialogsStore.setIsLoading(false)
})

async function refreshPromoDialogs() {
    promoDialogsStore.setIsLoading(true)

    const partnersData = await promoDialogsAPI.list(promoDialogsStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        promoDialogsStore.setIsLoading(false)
        return
    }

    promoDialogs.value = partnersData.list
    promoDialogsStore.setPagination(partnersData.page)
    promoDialogsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!promoDialogsStore.isChanged) return

    promoDialogsStore.resetPage()
    promoDialogsStore.commitFilter()

    refreshPromoDialogs()
}

function onClick(id: string, event: MouseEvent) {
    navigate(
        {
            name:   DashboardRouteName.DashboardPromoDialog,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardPromoDialog,
        params: { id: "!new" },
    })
}

const promoDialogsState = computed({
    get() {
        return disabledToStatus(promoDialogsStore.filter.filters.disabled)
    },
    set(newValue: Status) {
        promoDialogsStore.filter.filters.disabled = statusToDisabled(newValue)
    },
})

async function onExportXLS(id: number) {
    if (isExporting.value[id]) return

    isExporting.value[id] = true

    try {
        const promoDialogData = await promoDialogsAPI.exportData(id)

        if (promoDialogData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(promoDialogData)
    } finally {
        delete isExporting.value[id]
    }
}
</script>

<template>
    <div class="promo-dialogs-list-view">
        <b-toolbar
            no-paddings
            :show-more="!promoDialogsStore.isLoading"
        >
            <b-toolbar-item header="Статус">
                <b-select
                    v-model="promoDialogsState"
                    :options="controlOptions"
                    :disabled="promoDialogsStore.isLoading"
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
                        label="Добавить диалог"
                        @click="goToNew"
                    />
                </b-toolbar-item>
            </template>

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="promoDialogsStore.filter.search"
                        :disabled="promoDialogsStore.isLoading"
                        placeholder="Найти диалог"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="promoDialogsStore.isLoading" />

            <b-empty-result
                v-else-if="!promoDialogsStore.isLoading && !promoDialogs.length"
                title="Нет диалогов"
            />

            <prime-data-table
                v-else
                :value="promoDialogs"
                :rows="promoDialogsStore.pagination.perPage"
                :total-records="promoDialogsStore.pagination.total"
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
                    header="Шаблон"
                    field="template"
                    class="table-template"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.template" />
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
                    header="Дата создания"
                    field="created_at"
                    class="table-created-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.created_at" />
                    </template>
                </prime-column>

                <prime-column />

                <prime-column class="table-actions">
                    <template #body="{ data }">
                        <b-export
                            :types="{ xls: true }"
                            :disabled="{ xls: isExporting[data.id] }"
                            :loading="{ xls: isExporting[data.id] }"
                            @export-xls="onExportXLS(data.id)"
                        />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.promo-dialogs-list-view {
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

        .table-actions {
            padding-top: 0;
            padding-bottom: 0;

            .b-export {
                justify-content: flex-end;
            }
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
