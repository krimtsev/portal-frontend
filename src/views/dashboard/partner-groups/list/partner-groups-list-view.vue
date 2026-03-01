<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PrimeDataTable from "primevue/datatable"
import PrimeColumn from "primevue/column"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import { useI18n } from "vue-i18n"
import * as partnerGroupsAPI from "@/api/modules/dashboard/partners/partner-groups"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouter } from "vue-router"
import BText from "@c/common/b-text/b-text.vue"
import { DashboardRouteName } from "@r/dashboard/route-names"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import { usePartnerGroupsStore } from "@s/dashboard/partners/partner-groups"
import type { PartnerGroupsListItem } from "@v/dashboard/partner-groups/list/definitions/partner-groups"
import { useOpenRoute } from "@/composables/route/use-open-route"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { openRoute } = useOpenRoute()

const partnerGroupsStore = usePartnerGroupsStore()

const partnerGroups = ref<PartnerGroupsListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from: n(partnerGroupsStore.pagination.from),
            to: n(partnerGroupsStore.pagination.to),
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
        partnerGroupsData
    ] = await Promise.all([
        partnerGroupsAPI.list(partnerGroupsStore.filter)
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
            name: DashboardRouteName.DashboardPartnerGroup,
            params: { id }
        },
        event
    )
}

function goToNew() {
    router.push({
        name: DashboardRouteName.DashboardPartnerGroup,
        params: { id: "!new" }
    })
}
</script>

<template>
    <div class="partner-groups-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item
                v-if="!partnerGroupsStore.isLoading"
            >
                <b-button-secondary
                    label="Добавить группу"
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
            <prime-data-table
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

                <template v-if="partnerGroupsStore.isLoading">
                    <list-loading-state />
                </template>

                <template v-else-if="!partnerGroupsStore.isLoading && !partnerGroups.length">
                    <b-empty-result title="Группы отсутствуют" />
                </template>

                <template v-else>
                    <prime-column
                        field="title"
                        header="Название группы"
                        class="table-title"
                    >
                        <template #body="slotProps">
                            <b-text
                                :value="slotProps.data?.title"
                                class="link-text"
                                @click="(e: MouseEvent) => onClick(slotProps.data.id, e)"
                            />
                        </template>
                    </prime-column>

                    <prime-column
                        field="total"
                        header="В группе"
                        class="table-total"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.total" />
                        </template>
                    </prime-column>
                </template>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.partner-groups-list-view {
    @include list-view;

    padding-top: $indent-x2;

    :deep(.p-datatable) {
        @include table;

        .table-title {
            @include col-width(350px);
        }
    }

    .table-wrapper {
        margin-top: $indent-x2;
    }
}
</style>
