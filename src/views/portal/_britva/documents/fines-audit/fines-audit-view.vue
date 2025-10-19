<script setup lang="ts">
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import FinesRightSection from "@v/portal/_britva/documents/components/fines-right-section/fines-right-section.vue"
import { finesAuditData } from "@v/portal/_britva/documents/fines-audit/data/fines-audit-data"
import PrimeDataTable from "primevue/datatable"
import PrimeColumn from "primevue/column"
import { useI18n } from "vue-i18n"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/_britva/documents/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"

const { n } = useI18n()
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
                            <prime-column field="text" header="Причина" />
                            <prime-column field="price" header="Штраф" class="price">
                                <template #body="{ data }">
                                    <div class="price">
                                        {{ n(data.price, "currency") }} {{ data.point }}
                                    </div>
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
    }

    .table {
        :deep(.price) {
            @include col-width(150px)
        }
    }
}
</style>
