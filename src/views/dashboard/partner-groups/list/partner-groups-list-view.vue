<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePartnerGroupsStore } from "@s/dashboard/partners/partner-groups"
import { useNotify } from "@/composables/notify/use-notify"
import { useOpenRoute } from "@/composables/route/use-open-route"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnerGroupsAPI from "@/api/modules/dashboard/partners/partner-groups"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerGroupsListItem } from "@v/dashboard/partner-groups/list/definitions/partner-groups"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { openRoute } = useOpenRoute()

const partnerGroupsStore = usePartnerGroupsStore()

const partnerGroups = ref<PartnerGroupsListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(partnerGroupsStore.pagination.from),
            to:    n(partnerGroupsStore.pagination.to),
            total: n(partnerGroupsStore.pagination.total),
        },
        Number(partnerGroupsStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (partnerGroupsStore.filter.page - 1) * partnerGroupsStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!partnerGroups.value.length && partnerGroupsStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (partnerGroupsStore.isLoading) return

    partnerGroupsStore.setPage(page + 1)
    refreshPartnerGroups()
}

onMounted(async () => {
    partnerGroupsStore.setIsLoading(true)

    const [
        partnerGroupsData,
    ] = await Promise.all([
        partnerGroupsAPI.list(partnerGroupsStore.filter),
    ])

    if (partnerGroupsData instanceof HttpError) {
        notify.error()
        return
    }

    partnerGroups.value = partnerGroupsData.list

    partnerGroupsStore.setPagination(partnerGroupsData.page)
    partnerGroupsStore.setIsLoading(false)
})

async function refreshPartnerGroups() {
    partnerGroupsStore.setIsLoading(true)

    const partnersData = await partnerGroupsAPI.list(partnerGroupsStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        partnerGroupsStore.setIsLoading(false)
        return
    }

    partnerGroups.value = partnersData.list
    partnerGroupsStore.setPagination(partnersData.page)
    partnerGroupsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnerGroupsStore.isChanged) return

    partnerGroupsStore.resetPage()
    partnerGroupsStore.commitFilter()

    refreshPartnerGroups()
}

const onClick = (id: string, event: MouseEvent) => {
    openRoute(
        {
            name:   DashboardRouteName.DashboardPartnerGroup,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardPartnerGroup,
        params: { id: "!new" },
    })
}
</script>

<template>
    <div class="partner-groups-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item>
                <b-button-secondary
                    label="Добавить группу"
                    :disabled="partnerGroupsStore.isLoading"
                    @click="goToNew"
                />
            </b-toolbar-item>

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="partnerGroupsStore.filter.search"
                        :disabled="partnerGroupsStore.isLoading"
                        placeholder="Найти группу"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="partnerGroupsStore.isLoading" />

            <b-empty-result
                v-else-if="!partnerGroupsStore.isLoading && !partnerGroups.length"
                title="Группы отсутствуют"
            />

            <prime-data-table
                v-else
                :value="partnerGroups"
                :rows="partnerGroupsStore.pagination.perPage"
                :total-records="partnerGroupsStore.pagination.total"
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
                    header="Название группы"
                    field="title"
                    class="table-title link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.title"
                            @click="(e: MouseEvent) => onClick(data?.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="В группе"
                    field="total"
                    class="table-total"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.total" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.partner-groups-list-view {
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
}
</style>
