<script setup lang="ts">
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import { useI18n } from "vue-i18n"
import { finesData } from "@v/portal/_britva/documents/fines/data/fines-data"
import PortalContent from "@c/portal/portal-content/portal-content.vue"
import FinesRightSection from "@v/portal/_britva/documents/components/fines-right-section/fines-right-section.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/_britva/documents/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"

const { n } = useI18n()
</script>

<template>
    <portal-page
        class="fines-view"
        title="Штрафы"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <template #right-side>
            <fines-right-section />
        </template>

        <portal-accordion multiple>
            <portal-accordion-panel
                v-for="data in finesData"
                :key="data.id"
                :value="data.id"
                :disabled="!data.content"
            >
                <portal-accordion-header :disable="!data.content">
                    <div class="fines-header">
                        <div class="info">{{ data.header }}</div>
                        <div class="price">{{ n(data.price, "currency") }}</div>
                    </div>
                </portal-accordion-header>

                <portal-accordion-content v-if="data.content">
                    <portal-content
                        :content="data.content"
                        :content-type="data.contentType"
                        class="mx-x1"
                    />
                </portal-accordion-content>
            </portal-accordion-panel>
        </portal-accordion>
    </portal-page>
</template>

<style lang="scss" scoped>
.fines-view {
    .fines-header {
        display: grid;
        grid-template-columns: 4fr 1fr;
        width: 100%;

        .info {
            grid-template-columns: 1fr;
        }
    }
}
</style>
