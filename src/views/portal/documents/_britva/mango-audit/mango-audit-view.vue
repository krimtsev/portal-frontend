<script setup lang="ts">
import PortalAccordion from "@c/portal/portal-accordion/portal-accordion.vue"
import PortalAccordionPanel from "@c/portal/portal-accordion/portal-accordion-panel.vue"
import PortalAccordionHeader from "@c/portal/portal-accordion/portal-accordion-header.vue"
import PortalAccordionContent from "@c/portal/portal-accordion/portal-accordion-content.vue"
import { mangoAuditData } from "@v/portal/documents/_britva/mango-audit/data/mango-audit-data"
import PortalContent from "@c/portal/portal-content/portal-content.vue"
import FinesRightSection from "@v/portal/documents/_britva/components/fines-right-section/fines-right-section.vue"
import BTelnumLink from "@c/common/b-telnum-link/b-telnum-link.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/documents/_britva/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
</script>

<template>
    <portal-page
        class="mango-audit-view"
        title="Бальная система по манго-аудиту"
    >
        <template #top-side>
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

        <div class="content mt-x2">
            <p>
                В случае набора филиалом от 5 и более баллов, штрафные санкции применяются после
                повторной проверки. На исправление ошибок даётся 14 календарных дней.
            </p>
            <p class="mb-x0">Отчеты по манго аудированию высылает Екатерина <b-telnum-link value="+7 (906) 701-99-44" /></p>
            <p>За остальными разборами Вы так же можете обращаться к ней.</p>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.mango-audit-view {
    .content {
        @include text-content;
    }
}
</style>
