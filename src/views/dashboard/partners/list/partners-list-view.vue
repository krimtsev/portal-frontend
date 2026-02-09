<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BText from "@c/common/b-text/b-text.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import PrimeDataTable, { type DataTableRowSelectEvent } from "primevue/datatable"
import PrimeMultiSelect from "primevue/multiselect"
import PrimeColumn from "primevue/column"
import { useNotify } from "@/composables/notify/use-notify"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { usePartnersStore } from "@s/dashboard/partners/partners"
import { HttpError } from "@/api"
import { DashboardRouteName } from "@r/dashboard/route-names"
import type { PartnerListItem } from "@v/dashboard/partners/list/definitions/partners"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import BTextDate from "@c/common/b-text/b-text-date.vue";


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const partnersStore = usePartnersStore()

const partners = ref<PartnerListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from: n(partnersStore.pagination.from),
            to: n(partnersStore.pagination.to),
            total: n(partnersStore.pagination.total),
        },
        Number(partnersStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (partnersStore.filter.page - 1) * partnersStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!partners.value.length && partnersStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (partnersStore.isLoading) return

    partnersStore.setPage(page + 1)
    refreshTickets()
}

onMounted(async () => {
    partnersStore.setIsLoading(true)

    const [
        partnersData
    ] = await Promise.all([
        partnersAPI.list(partnersStore.filter)
    ])

    if (partnersData instanceof HttpError) {
        notify.error()
        return
    }

    partners.value = partnersData.list

    partnersStore.setPagination(partnersData.page)
    partnersStore.setIsLoading(false)
})

async function refreshTickets() {
    partnersStore.setIsLoading(true)

    const partnersData = await partnersAPI.list(partnersStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        partnersStore.setIsLoading(false)
        return
    }

    partnersStore.setPagination(partnersData.page)
    partnersStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnersStore.isChanged) return

    partnersStore.resetPage()
    partnersStore.commitFilter()

    refreshTickets()
}

const onRowClick = (event: DataTableRowSelectEvent) => {
    const mouseEvent = event.originalEvent as MouseEvent
    const { id } = event.data

    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
        const route = router.resolve({
            name:   DashboardRouteName.DashboardPartner,
            params: { id }
        })

        window.open(route.href, "_blank")
        return
    }

    router.push({ name: DashboardRouteName.DashboardPartner, params: { id } })
}
</script>

<template>
    <div class="partners-list-view">
        <b-toolbar no-paddings>
<!--            <b-toolbar-item header="Статус">-->
<!--                <prime-multi-select-->
<!--                    v-model="partnersStore.filter.filters.disabled"-->
<!--                    :options="statesList"-->
<!--                    :selected-items-label="t('mc.select.elements', partnersStore.filter.filters.disabled.length)"-->
<!--                    :max-selected-labels="1"-->
<!--                    :disabled="partnersStore.isLoading"-->
<!--                    option-label="name"-->
<!--                    option-value="id"-->
<!--                    filter-->
<!--                    placeholder="Выберите статус"-->
<!--                    class="state"-->
<!--                    @hide="onChangeFilter"-->
<!--                />-->
<!--            </b-toolbar-item>-->

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="partnersStore.filter.search"
                        :disabled="partnersStore.isLoading"
                        placeholder="Найти филиал"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <prime-data-table
                :value="partners"
                :rows="partnersStore.pagination.perPage"
                :total-records="partnersStore.pagination.total"
                :first="firstPage"
                :paginator="showPaginator"
                class="table"
                @page="onPageChange"
                @row-select="onRowClick"
                selection-mode="single"
                data-key="id"
                scrollable
                lazy
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <template v-if="partnersStore.isLoading">
                    <list-loading-state />
                </template>

                <template v-else-if="!partnersStore.isLoading && !partners.length">
                    <b-empty-result title="Нет филиалов" />
                </template>

                <template v-else>
                    <prime-column
                        field="name"
                        header="Филиал"
                        class="table-name"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data.name" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="organization"
                        header="Организация"
                        class="table-organization"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.organization" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="inn"
                        header="ИНН"
                        class="table-inn"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.inn" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="contract_number"
                        header="Номер договора"
                        class="table-contract-number"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.contract_number" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="mango_telnum"
                        header="Телефон"
                        class="table-mango-telnum"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.mango_telnum" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="yclients_id"
                        header="Yclients"
                        class="table-yclients-id"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.yclients_id" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="disabled"
                        header="Статус"
                        class="table-disabled"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.disabled" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="start_at"
                        header="Дата открытия"
                        class="table-start-at"
                    >
                        <template #body="slotProps">
                            <b-text-date
                                :value="slotProps.data?.start_at"
                                show-format="yyyy-MM-dd"
                            />
                        </template>
                    </prime-column>
                </template>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.partners-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .state {
        @include col-width(250px);
    }

    .search {
        @include col-width(210px);
    }

    .table-wrapper {
        margin-top: $indent-x2;
    }
}
</style>
