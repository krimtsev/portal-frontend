<script setup lang="ts">
import BTitle from "@c/common/b-title/b-title.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import { useI18n } from "vue-i18n"
import { finesData } from "@v/portal/_britva/documents/fines/data/fines-data"
import PortalContent from "@c/portal/portal-content/portal-content.vue"
import ButtonNavigation from "@v/portal/_britva/documents/components/button-navigation/button-navigation.vue"
import FinesRightSection from "@v/portal/_britva/documents/components/fines-right-section/fines-right-section.vue";

const { n } = useI18n()
</script>

<template>
    <div class="fines-view">
        <b-title
            title="Штрафы"
            variant="xl"
            class="mb-x2"
        />

        <button-navigation />

        <div class="grid">
            <div class="col-8">
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
            </div>

            <div class="col-4">
                <fines-right-section />
            </div>
        </div>
    </div>
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
