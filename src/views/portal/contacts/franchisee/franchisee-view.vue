<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/contacts/_britva/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import * as contactsAPI from "@/api/modules/contacts/contacts"
import { HttpError } from "@/api"
import {
    type FranchiseeItem,
    FranchiseeSortBy,
} from "@v/portal/contacts/franchisee/definitions/franchisee"
import { useNotify } from "@/composables/notify/use-notify"
import PrimeDataTable from "primevue/datatable"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import PrimeColumn from "primevue/column"
import {
    defaultPaginationFilter,
    defaultPaginationPage,
} from "@/shared/pagination/pagination"
import { useI18n } from "vue-i18n"
import { normalizeData } from "@v/portal/contacts/franchisee/utils/franchisee"
import BTelnumLink from "@c/common/b-link/b-telnum-link.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BSocialLinks from "@c/common/b-link/b-social-links.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"

const notify = useNotify()
const { t, n } = useI18n()

const isLoading = ref(true)
const franchisee = ref<FranchiseeItem[]>([])
const paginationFilter = ref(defaultPaginationFilter({ sortBy: FranchiseeSortBy.Name }))
const paginationPage = ref(defaultPaginationPage())

const setInitialData = () => {
    franchisee.value = new Array(paginationPage.value.perPage).fill({
        filial:  "",
        names:   [],
        telnums: [],
    })
}

async function getData() {
    isLoading.value = true
    setInitialData()

    const data = await contactsAPI.get(paginationFilter.value)

    if (data instanceof HttpError) {
        notify.error()
        return false
    }

    franchisee.value = normalizeData(data.list)
    paginationPage.value = data.page
    isLoading.value = false
}

onMounted(() => {
    getData()
})

function onPageChange({ page }: { page: number }) {
    paginationFilter.value.page = page + 1
    getData()
}

function onSearchChange(search: string) {
    if (paginationFilter.value.search !== search) {
        paginationFilter.value.search = search
        paginationFilter.value.page = 1
        getData()
    }
}

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(paginationPage.value.from),
            to:    n(paginationPage.value.to),
            total: n(paginationPage.value.total),
        },
        Number(paginationPage.value.total),
    )
})

const showPaginator = computed(() => {
    return !!franchisee.value.length &&
        paginationPage.value.total > paginationPage.value.perPage
})

const firstPage = computed(() => {
    return (paginationFilter.value.page - 1) * paginationPage.value.perPage
})

</script>

<template>
    <portal-page
        class="franchisee-view"
        title="Контакты наших любимых франчайзи"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <div class="content">
            <b-input-search
                :value="paginationFilter.search"
                placeholder="Поиск по филиалу"
                name="search"
                class="mb-x4 search"
                @change="onSearchChange"
            />

            <prime-data-table
                :value="franchisee"
                :rows="paginationPage.perPage"
                :total-records="paginationPage.total"
                :loading="isLoading"
                :first="firstPage"
                :paginator="showPaginator"
                show-gridlines
                lazy
                class="table"
                @page="onPageChange"
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <template #loading />

                <template #empty>
                    <b-empty-result />
                </template>

                <prime-column
                    header="Филиал"
                    field="filial"
                    class="table-filial"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.filial" />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Имя"
                    field="names"
                    class="table-names"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <template v-if="data?.names.length">
                                <div class="cell-value">
                                    <b-table-text
                                        v-for="(name, index) in data.names"
                                        :text="name"
                                        :key="index"
                                    />
                                </div>
                            </template>

                            <div
                                v-else
                                class="cell-value"
                            >
                                —
                            </div>
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Контакт"
                    field="telnums"
                    class="table-telnums"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <template v-if="data?.telnums.length">
                                <div class="cell-value">
                                    <div
                                        v-for="(telnum, index) in data.telnums"
                                        :key="index"
                                    >
                                        <b-social-links
                                            :telegram="telnum"
                                            class="mr-x1"
                                        />
                                        <b-telnum-link :value="telnum" />
                                    </div>
                                </div>
                            </template>

                            <div
                                v-else
                                class="cell-value"
                            >
                                —
                            </div>
                        </b-skeleton>
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.franchisee-view {
    .search {
        max-width: 550px;
    }

    :deep(.p-datatable) {
        @include table-outer-header;

        .table {
            &-filial,
            &-names,
            &-telnums {
                width: calc(100% / 3);
            }
        }

        .cell-value {
            display: flex;
            flex-direction: column;
            gap: $indent-x1;
        }
    }
}
</style>
