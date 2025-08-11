<script setup lang="ts">
import BTitle from "@c/common/b-title/b-title.vue"
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import ButtonNavigation from "@v/portal/_britva/documents/components/button-navigation/button-navigation.vue"
import FinesRightSection from "@v/portal/_britva/documents/components/fines-right-section/fines-right-section.vue"
import { finesAuditData } from "@v/portal/_britva/documents/fines-audit/data/fines-audit-data"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import { useI18n } from "vue-i18n"

const { n } = useI18n()
</script>

<template>
    <div class="fines-audit-view">
        <b-title
            title="Аудит и штрафы"
            variant="xl"
            class="mb-x2"
        />

        <button-navigation />

        <div class="grid">
            <div class="col-8">
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
                                <data-table
                                    :value="data.content"
                                    show-gridlines
                                    class="table"
                                >
                                    <column field="text" header="Причина" />
                                    <column field="price" header="Штраф" class="price">
                                        <template #body="{ data }">
                                            <div class="price">
                                                {{ n(data.price, "currency") }} {{ data.point }}
                                            </div>
                                        </template>
                                    </column>
                                </data-table>
                            </div>
                        </portal-accordion-content>
                    </portal-accordion-panel>
                </portal-accordion>
            </div>

            <div class="col-4">
                <fines-right-section />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.fines-audit-view {
    :deep(.p-datatable) {
        @include remove-table-outer-borders;

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
