<script setup lang="ts">
import BLink from "@c/common/b-link/b-link.vue"
import BTelnumLink from "@c/common/b-link/b-telnum-link.vue"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { partnersData } from "@v/portal/trademarks/_soda/nail-service/data/nail-service-data"
import { buttonNavigation } from "@v/portal/trademarks/definitions/trademarks"
</script>

<template>
    <portal-page
        class="nail-service-view"
        title="Стилисты: контакты партнеров"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <portal-card
            v-for="partner in partnersData"
            :key="partner.name"
            :title="partner.name"
        >
            <div class="content">
                <div class="services">
                    <div class="service-row">
                        <span class="service-label">Менеджер:</span>
                        <span class="service-value manager-info">
                            <span v-if="partner.manager">{{ partner.manager }}</span>
                            <b-telnum-link :value="partner.phone" />
                        </span>
                    </div>

                    <div
                        v-for="detail in partner.details"
                        :key="detail.label"
                        class="service-row"
                    >
                        <span class="service-label">{{ detail.label }}:</span>
                        <span class="service-value">{{ detail.value }}</span>
                    </div>

                    <div
                        v-if="partner.site"
                        class="service-row"
                    >
                        <span class="service-label">Сайт:</span>
                        <b-link :label="partner.site.label" :href="partner.site.href" />
                    </div>
                </div>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.nail-service-view {
    .content {
        @include text-content;
    }

    .services {
        display: flex;
        flex-direction: column;
        gap: $indent-x1;
    }

    .service-row {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: $indent-x1;
        align-items: baseline;

        @media (max-width: $breakpoints-sm) {
            grid-template-columns: 1fr;
            gap: $indent-x1;
        }
    }

    .service-label {
        @include p-bold;
    }

    .service-value {
        @include p;

        white-space: pre-line;
    }

    .manager-info {
        display: flex;
        flex-wrap: wrap;
        gap: $indent-x1;
    }
}
</style>
