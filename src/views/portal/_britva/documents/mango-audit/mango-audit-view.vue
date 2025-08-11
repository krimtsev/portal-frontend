<script setup lang="ts">
import BTitle from "@c/common/b-title/b-title.vue"
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import { mangoAuditData } from "@v/portal/_britva/documents/mango-audit/data/mango-audit-data"
import PortalContent from "@c/portal/portal-content/portal-content.vue"
import ButtonNavigation from "@v/portal/_britva/documents/components/button-navigation/button-navigation.vue"
import FinesRightSection from "@v/portal/_britva/documents/components/fines-right-section/fines-right-section.vue";
</script>

<template>
    <div class="mango-audit-view">
        <b-title
            title="Бальная система по манго-аудиту"
            variant="xl"
            class="mb-x2"
        />

        <button-navigation />

        <div class="grid">
            <div class="col-8">
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

                <div class="content mt-x2">
                    <p>В случае набора филиалом от 5 и более баллов, штрафные санкции применяются после повторной проверки. На исправление ошибок даётся 14 календарных дней.</p>
                    <p class="mb-x0">Отчеты по манго аудированию высылает Екатерина (+79067019944)</p>
                    <p>За остальными разборами Вы так же можете обращаться к ней.</p>
                </div>
            </div>

            <div class="col-4">
                <fines-right-section />
            </div>
        </div>
    </div>
</template>
