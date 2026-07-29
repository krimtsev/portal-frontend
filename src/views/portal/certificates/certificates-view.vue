<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as sheetAPI from "@/api/modules/sheet/sheet"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PortalUserCard from "@c/portal/portal-user-card/portal-user-card.vue"
import type { CertificateItem } from "@v/portal/certificates/definitions/certificates"
import { defaultPaginationFilter, defaultPaginationPage } from "@/definitions/pagination"

const notify = useNotify()
const { t, n } = useI18n()

const paginationFilter = ref(defaultPaginationFilter())
const paginationPage = ref(defaultPaginationPage())
const isLoading = ref(true)
const certificates = ref<CertificateItem[]>([])

const setInitialData = () => {
    certificates.value = new Array(paginationPage.value.perPage).fill({
        price:      "",
        identifier: "",
        partner:    "",
    })
}

async function getData() {
    isLoading.value = true
    setInitialData()

    const data = await sheetAPI.get(paginationFilter.value)

    if (data instanceof HttpError) {
        notify.error()
        return false
    }

    certificates.value = data.list
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
    return !!certificates.value.length &&
        paginationPage.value.total > paginationPage.value.perPage
})

const firstPage = computed(() => {
    return (paginationFilter.value.page - 1) * paginationPage.value.perPage
})

</script>

<template>
    <portal-page
        class="certificates-view"
        title="Поиск по сертификатам"
    >
        <div class="content">
            <div class="mb-x2 description">
                <p>В данной таблице представлена информация по отгрузке (куда и какой пластик поехал).</p>
                <p><b>Не пытайтесь искать здесь сертификаты проданные через сайт.</b></p>
            </div>

            <b-input-search
                :value="paginationFilter.search"
                :disabled="isLoading"
                placeholder="Поиск по номеру и филиалу"
                name="search"
                class="mb-x4 search"
                @change="onSearchChange"
            />

            <prime-data-table
                :value="certificates"
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
                    header="Номинал"
                    field="price"
                    class="table-price"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.price" />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Номер"
                    field="identifier"
                    class="table-identifier"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.identifier" />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Филиал"
                    field="partner"
                    class="table-partner"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.partner" />
                        </b-skeleton>
                    </template>
                </prime-column>
            </prime-data-table>
        </div>

        <template #right-side>
            <div class="users-info">
                <portal-user-card
                    avatar="employees/krimtsev.jpg"
                    telnum="79994845317"
                    v-glow="{ position: 'bottom-left' }"
                >
                    <div class="text-center">
                        <p class="mb-x0">
                            Не можете найти физический сертификат?
                            Пишите Диме Крымцеву, он посмотрит где продавался по Yclients.
                        </p>
                    </div>
                </portal-user-card>

                <portal-user-card
                    avatar="employees/osipov.png"
                    telnum="79652914902"
                >
                    <div class="text-center">
                        <p class="mb-x0">
                            Не можете найти электронный сертификат?
                            Пишите Артему Осипову, он что-нибудь придумает.
                        </p>
                    </div>
                </portal-user-card>
            </div>
        </template>
    </portal-page>
</template>

<style scoped lang="scss">
.certificates-view {
    .search {
        max-width: 550px;
    }

    :deep(.p-datatable) {
        @include table-outer-header;

        .table {
            &-price,
            &-identifier,
            &-partner {
                width: calc(100% / 3);
            }
        }
    }

    .users-info {
        display: flex;
        flex-direction: column;
        gap: $indent-x1;
        max-width: 350px;
    }
}
</style>
