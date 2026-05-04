<script setup lang="ts">
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import BText from "@c/common/b-text/b-text.vue"
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import FinesRightSection from "@v/portal/documents/_britva/components/fines-right-section/fines-right-section.vue"
import { buttonNavigation } from "@v/portal/documents/_britva/data/button-navigation"
import { finesAuditData } from "@v/portal/documents/_britva/fines-audit/data/fines-audit-data"
import type { FinesAuditContent } from "@v/portal/documents/_britva/fines-audit/definitions/fines-audit"

const { n } = useI18n()

const formatPrice = (item: FinesAuditContent) => {
    const price = n(item.price, "currency")
    const point = item.point ?? ""
    return `${price} ${point}`.trim()
}
</script>

<template>
    <portal-page
        class="fines-audit-view"
        title="Аудит и штрафы"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <template #right-side>
            <fines-right-section />
        </template>

        <portal-accordion multiple>
            <portal-accordion-panel
                v-for="data in finesAuditData"
                :key="data.id"
                :value="data.id"
                :disabled="!data.content"
            >
                <portal-accordion-header :disable="!data.content">
                    <div class="header"> {{ data.header }} </div>
                </portal-accordion-header>

                <portal-accordion-content v-if="data.content">
                    <div class="content mx-x1">
                        <prime-data-table
                            :value="data.content"
                            show-gridlines
                            class="table"
                        >
                            <prime-column
                                header="Причина"
                                field="text"
                                class="table-text"
                            >
                                <template #body="{ data }">
                                    <b-text :value="data?.text" />
                                </template>
                            </prime-column>

                            <prime-column
                                header="Штраф"
                                field="price"
                                class="table-price"
                            >
                                <template #body="{ data }">
                                    <b-text :value="formatPrice(data)" />
                                </template>
                            </prime-column>
                        </prime-data-table>
                    </div>
                </portal-accordion-content>
            </portal-accordion-panel>
        </portal-accordion>
    </portal-page>
</template>

<style scoped lang="scss">
.fines-audit-view {
    :deep(.p-datatable) {
        @include table-outer-borders;

        .p-datatable-header-cell,
        .p-datatable-tbody > tr {
            background: transparent;

        }

        .table {
            &-price {
                @include col-fixed(250px)
            }
        }
    }
}
</style>
