<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import PrimeFloatLabel from "primevue/floatlabel"
import PrimeMultiSelect from "primevue/multiselect"
import { useBankDetailsStore } from "@s/profile/bank-details/bank-details"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouteNavigator } from "@/composables/route/use-route-navigator"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import * as bankDetailsAPI from "@/api/modules/bank-details/bank-details"
import type { UserPartners } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { BankDetailListItem } from "@v/profile/bank-details/list/definitions/bank-details"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { navigate } = useRouteNavigator()

const bankDetailsStore = useBankDetailsStore()

const bankDetails = ref<BankDetailListItem[]>([])

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
})

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
    ] = await Promise.all([
        bankDetailsAPI.list(bankDetailsStore.filter),
        partnerAPI.userPartners(),
    ])

    if (
        bankDetailsData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    bankDetails.value = bankDetailsData.list
    userPartners.value = partnersData

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
            name:   ProfileRouteName.ProfileBankDetail,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   ProfileRouteName.ProfileBankDetail,
        params: { id: "!new" },
    })
}
</script>

<template>
    <portal-page
        title="Реквизиты банка"
        class="bank-details-list-view"
    >
        <div class="filter">
            <prime-float-label variant="on">
                <prime-multi-select
                    v-model="bankDetailsStore.filter.filters.partner_id"
                    :options="userPartners.partners"
                    filter
                    :disabled="bankDetailsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    :max-selected-labels="1"
                    selected-items-label="{0} выбрано"
                    append-to="self"
                    input-id="partner"
                    class="filter-partner"
                    @hide="onChangeFilter"
                />
                <label for="partner">Филиал</label>
            </prime-float-label>

            <b-button-secondary
                label="Добавить реквизиты"
                :disabled="bankDetailsStore.isLoading"
                @click="goToNew"
            />
        </div>

        <div class="table-wrapper">
            <list-loading-state v-if="bankDetailsStore.isLoading" />

            <b-empty-result
                v-else-if="!bankDetailsStore.isLoading && !bankDetails.length"
                title="Нет реквизитов"
                width-border
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
                    field="entrepreneur_name"
                    class="table-entrepreneur-name link-text"
                >
                    <template #header>
                        <b-table-text text="ФИО предпринимателя" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.entrepreneur_name"
                            @click="(e: MouseEvent) => onClick(data.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="inn"
                    class="table-inn"
                >
                    <template #header>
                        <b-table-text text="ИНН" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.inn" />
                    </template>
                </prime-column>

                <prime-column
                    field="checking_account"
                    class="table-checking-account"
                >
                    <template #header>
                        <b-table-text text="Расчётный счёт" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.checking_account" />
                    </template>
                </prime-column>

                <prime-column
                    field="bank_name"
                    class="table-bank-name"
                >
                    <template #header>
                        <b-table-text text="Наименование банка" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.bank_name" />
                    </template>
                </prime-column>

                <prime-column
                    field="bik"
                    class="table-bik"
                >
                    <template #header>
                        <b-table-text text="БИК" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.bik" />
                    </template>
                </prime-column>

                <prime-column
                    field="correspondent_account"
                    class="table-correspondent-account"
                >
                    <template #header>
                        <b-table-text text="Корреспондентский счёт" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.correspondent_account" />
                    </template>
                </prime-column>

                <prime-column
                    field="partner"
                    class="table-partner"
                >
                    <template #header>
                        <b-table-text text="Филиал" />
                    </template>

                    <template #body="{ data }">
                        <b-table-text :text="data.partner?.name" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.bank-details-list-view {
    .filter {
        margin-bottom: $indent-x2;
        display: flex;
        gap: $indent-x2;

        &-partner {
            @include col-width(250px);
        }

        .search {
            @include col-width(210px);
        }
    }

    @include table-wrapper;

    :deep(.p-datatable) {
        @include table;

        .table {
            &-entrepreneur-name {
                @include col-fixed(250px);
            }
        }
    }
}
</style>
