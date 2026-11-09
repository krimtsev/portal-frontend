<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useBankDetailsStore } from "@s/dashboard/bank-details/bank-details"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouteNavigator } from "@/composables/route/use-route-navigator"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as bankDetailsAPI from "@/api/modules/dashboard/bank-details/bank-details"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as usersAPI from "@/api/modules/dashboard/users/users"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BExport from "@c/common/b-export/b-export.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { BankDetailListItem } from "@v/dashboard/bank-details/list/definitions/bank-details"
import { exportXLS } from "@v/dashboard/bank-details/list/utils/bank-details"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { UserOptionItem } from "@v/dashboard/users/edit/definitions/user"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { navigate } = useRouteNavigator()

const bankDetailsStore = useBankDetailsStore()

const bankDetails = ref<BankDetailListItem[]>([])
const isExporting = ref(false)

const partnerOptions = ref<PartnerOptionItem[]>([])
const userOptions = ref<UserOptionItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(bankDetailsStore.pagination.from),
            to:    n(bankDetailsStore.pagination.to),
            total: n(bankDetailsStore.pagination.total),
        },
        Number(bankDetailsStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (bankDetailsStore.filter.page - 1) * bankDetailsStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!bankDetails.value.length && bankDetailsStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (bankDetailsStore.isLoading) return

    bankDetailsStore.setPage(page + 1)
    refreshBankDetails()
}

onMounted(async () => {
    bankDetailsStore.setIsLoading(true)

    const [
        bankDetailsData,
        partnersData,
        usersData,
    ] = await Promise.all([
        bankDetailsAPI.list(bankDetailsStore.filter),
        partnersAPI.options(),
        usersAPI.options(),
    ])

    if (
        bankDetailsData instanceof HttpError ||
        partnersData instanceof HttpError ||
        usersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    bankDetails.value = bankDetailsData.list
    partnerOptions.value = partnersData.list
    userOptions.value = usersData.list

    bankDetailsStore.setPagination(bankDetailsData.page)
    bankDetailsStore.setIsLoading(false)
})

async function refreshBankDetails() {
    bankDetailsStore.setIsLoading(true)

    const partnersData = await bankDetailsAPI.list(bankDetailsStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        bankDetailsStore.setIsLoading(false)
        return
    }

    bankDetails.value = partnersData.list
    bankDetailsStore.setPagination(partnersData.page)
    bankDetailsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!bankDetailsStore.isChanged) return

    bankDetailsStore.resetPage()
    bankDetailsStore.commitFilter()

    refreshBankDetails()
}

function onClick(id: string, event: MouseEvent) {
    navigate(
        {
            name:   DashboardRouteName.DashboardBankDetail,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardBankDetail,
        params: { id: "!new" },
    })
}

async function onExportXLS() {
    isExporting.value = true

    try {
        const bankDetailData = await bankDetailsAPI.exportData()

        if (bankDetailData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(bankDetailData)
    } finally {
        isExporting.value = false
    }
}
</script>

<template>
    <div class="bank-details-list-view">
        <b-toolbar
            no-paddings
            :show-more="!bankDetailsStore.isLoading"
        >
            <b-toolbar-item header="Филиал">
                <b-multi-select
                    v-model="bankDetailsStore.filter.filters.partner_id"
                    :options="partnerOptions"
                    :disabled="bankDetailsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    :placeholder="t('mc.common.placeholder.partners')"
                    class="filter-partner"
                    @submit="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Пользователь">
                <b-multi-select
                    v-model="bankDetailsStore.filter.filters.partner_id"
                    :options="userOptions"
                    :disabled="bankDetailsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    :placeholder="t('mc.common.placeholder.users')"
                    class="filter-user"
                    @submit="onChangeFilter"
                />
            </b-toolbar-item>

            <template #more>
                <b-toolbar-item>
                    <b-button-secondary
                        label="Добавить реквизиты"
                        @click="goToNew"
                    />
                </b-toolbar-item>
            </template>

            <template #right-side>
                <b-toolbar-item>
                    <b-export
                        :types="{ xls: true }"
                        :disabled="{ xls: bankDetailsStore.isLoading || isExporting }"
                        :loading="{ xls: isExporting }"
                        @export-xls="onExportXLS"
                    />
                </b-toolbar-item>

                <b-toolbar-item>
                    <b-input-search
                        v-model="bankDetailsStore.filter.search"
                        :disabled="bankDetailsStore.isLoading"
                        placeholder="Найти реквизиты"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="bankDetailsStore.isLoading" />

            <b-empty-result
                v-else-if="!bankDetailsStore.isLoading && !bankDetails.length"
                title="Нет диалогов"
            />

            <prime-data-table
                v-else
                :value="bankDetails"
                :rows="bankDetailsStore.pagination.perPage"
                :total-records="bankDetailsStore.pagination.total"
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
                    header="ФИО предпринимателя"
                    field="entrepreneur_name"
                    class="table-entrepreneur-name link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.entrepreneur_name"
                            @click="(e: MouseEvent) => onClick(data.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="ИНН"
                    field="inn"
                    class="table-inn"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.inn" />
                    </template>
                </prime-column>

                <prime-column
                    header="Расчётный счёт"
                    field="checking_account"
                    class="table-checking-account"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.checking_account" />
                    </template>
                </prime-column>

                <prime-column
                    header="Наименование банка"
                    field="bank_name"
                    class="table-bank-name"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.bank_name" />
                    </template>
                </prime-column>

                <prime-column
                    header="БИК"
                    field="bank_bik"
                    class="table-bik"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.bik" />
                    </template>
                </prime-column>

                <prime-column
                    header="Корреспондентский счёт"
                    field="bank_correspondent_account"
                    class="table-correspondent-account"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.bik" />
                    </template>
                </prime-column>

                <prime-column
                    header="Пользователь"
                    field="user"
                    class="table-user"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.user.name" />
                    </template>
                </prime-column>

                <prime-column
                    header="Филиал"
                    field="partner"
                    class="table-partner"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data.partner.name" />
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
.bank-details-list-view {
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
