<script setup lang="ts">
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import PortalContent from "@c/portal/portal-content/portal-content.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/documents/_britva/definitions/documents"
import { mangoAuditData } from "@v/portal/documents/_britva/mango-audit/data/mango-audit-data"
import FinesRightSection from "@v/portal/documents/components/fines-right-section/fines-right-section.vue"
</script>

<template>
    <portal-page
        class="mango-audit-view"
        title="Бальная система по mango-аудиту"
    >
        <template
            v-if="buttonNavigation.length > 1"
            #top-side
        >
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <template #right-side>
            <fines-right-section />
        </template>

        <portal-accordion multiple>
            <portal-accordion-panel
                v-for="data in mangoAuditData"
                :key="data.id"
                :value="data.id"
                :disabled="!data.content"
            >
                <portal-accordion-header :disable="!data.content">
                    <div class="header"> {{ data.header }} </div>
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

<style scoped lang="scss">
.mango-audit-view {
    .content {
        @include text-content;
    }
}
</style>
