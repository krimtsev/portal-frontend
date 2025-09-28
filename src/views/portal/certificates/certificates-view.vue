<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { HttpError } from "@/api"
import * as sheetAPI from "@/api/modules/sheet/sheet.ts"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import type { CertificateItem } from "@v/portal/certificates/definitions/certificates"
import { defaultPaginationFilter, defaultPaginationPage } from "@/shared/pagination/pagination"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import BEmptyResult from "@c/common/b-empty-result/b-empty-result.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import { useI18n } from "vue-i18n"
import PortalUserCard from "@c/portal/portal-user-card/portal-user-card.vue"
import { useNotify } from "@h/notify/notify"

const notify = useNotify()
const { t, n } = useI18n()

const paginationFilter = ref(defaultPaginationFilter())
const paginationPage = ref(defaultPaginationPage())
const isLoading = ref(true)
const certificates = ref<CertificateItem[]>([])

const setInitialData = () => {
    certificates.value = new Array(paginationPage.value.perPage).fill({
        price: "",
        identifier: "",
        partner: "",
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
            from: n(paginationPage.value.from),
            to: n(paginationPage.value.to),
            total: n(paginationPage.value.total),
        },
        Number(paginationPage.value.total),
    )
})

const showPaginator = computed(() => {
    return !!certificates.value.length
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
                placeholder="Поиск по номеру и филиалу"
                name="search"
                class="mb-x4 search"
                @change="onSearchChange"
            />

            <data-table
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

                <template #loading></template>

                <template #empty>
                    <b-empty-result />
                </template>

                <column field="price" header="Номинал" class="price">
                    <template #body="slotProps">
                        <span v-if="!isLoading">{{ slotProps.data.price }}</span>
                        <b-skeleton
                            v-else
                            width="25%"
                        />
                    </template>
                </column>

                <column field="identifier" header="Номер" class="identifier">
                    <template #body="slotProps">
                        <span v-if="!isLoading">{{ slotProps.data.identifier }}</span>
                        <b-skeleton
                            v-else
                            width="33%"
                        />
                    </template>
                </column>

                <column field="partner" header="Филиал" class="partner">
                    <template #body="slotProps">
                        <span v-if="!isLoading">{{ slotProps.data.partner }}</span>
                        <b-skeleton
                            v-else
                            width="47%"
                        />
                    </template>
                </column>
            </data-table>
        </div>

        <template #right-side>
            <div class="users-info">
                <portal-user-card
                    avatar="employees/krimtsev.jpg"
                    telnum="79994845317"
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

    //@media (min-width: $layout-mobile-width) {
    //    .table {
    //        max-width: 850px;
    //    }
    //}

    :deep(.p-datatable) {
        @include table-outer-header;

        .price, .identifier, .partner {
            width: calc(100% / 3);
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
