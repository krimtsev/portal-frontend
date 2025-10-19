<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/_britva/contacts/data/button-navigation.ts"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import * as contactsAPI from "@/api/modules/contacts/contacts"
import { HttpError } from "@/api"
import type { FranchiseeItem } from "@v/portal/contacts/franchisee/definitions/franchisee"
import { useNotify } from "@h/notify/notify"
import PrimeDataTable from "primevue/datatable"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import PrimeColumn from "primevue/column"
import {
    defaultPaginationFilter,
    defaultPaginationPage
} from "@/shared/pagination/pagination"
import { useI18n } from "vue-i18n"
import { normalizeData } from "@v/portal/contacts/franchisee/utils/franchisee.ts"
import BTelnum from "@c/common/b-telnum/b-telnum.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"

const notify = useNotify()
const { t, n } = useI18n()

const isLoading = ref(true)
const franchisee = ref<FranchiseeItem[]>([])
const paginationFilter = ref(defaultPaginationFilter())
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
            from: n(paginationPage.value.from),
            to: n(paginationPage.value.to),
            total: n(paginationPage.value.total),
        },
        Number(paginationPage.value.total),
    )
})

const showPaginator = computed(() => {
    return !!franchisee.value.length
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

                <template #loading></template>

                <template #empty>
                    <b-empty-result />
                </template>

                <prime-column field="filial" header="Филиал" class="filial">
                    <template #body="slotProps">
                        <div v-if="!isLoading"> {{ slotProps.data.filial }} </div>
                        <b-skeleton
                            v-else
                            width="75%"
                        />
                    </template>
                </prime-column>

                <prime-column field="names" header="Имя" class="names">
                    <template #body="slotProps">
                        <div v-if="!isLoading">
                            <template v-if="slotProps.data.names.length">
                                <div v-for="(name, index) in slotProps.data.names" :key="`${slotProps.data.id}_${index}`">
                                    <div class="cell-value"> {{ name || "—" }} </div>
                                </div>
                            </template>
                            <div v-else class="cell-value"> — </div>
                        </div>
                        <b-skeleton
                            v-else
                            width="45%"
                        />
                    </template>
                </prime-column>

                <prime-column field="telnums" header="Контакт" class="telnums">
                    <template #body="slotProps">
                        <span v-if="!isLoading">
                            <template v-if="slotProps.data.telnums.length">
                                <div v-for="(telnum, index) in slotProps.data.telnums" :key="`${slotProps.data.id}_${index}`">
                                    <b-telnum
                                        :value="telnum || '—'"
                                        class="cell-value"
                                    />
                                </div>
                            </template>
                            <div v-else class="cell-value"> — </div>
                        </span>
                        <b-skeleton
                            v-else
                            width="45%"
                        />
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

        .filial, .names, .telnums {
            width: calc(100% / 3);
        }

        .cell-value {
            min-height: $indent-x3;
            display: flex;
            align-items: center;
        }
    }
}
</style>
