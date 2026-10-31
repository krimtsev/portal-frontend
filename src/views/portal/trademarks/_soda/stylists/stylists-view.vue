<script setup lang="ts">
import BTelnumLink from "@c/common/b-link/b-telnum-link.vue"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { partnersData } from "@v/portal/trademarks/_soda/stylists/data/stylists-data"
import { buttonNavigation } from "@v/portal/trademarks/definitions/trademarks"
</script>

<template>
    <portal-page
        class="stylists-view"
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

                    <div class="service-row">
                        <span class="service-label">Продукция / услуги:</span>
                        <span class="service-value">{{ partner.description }}</span>
                    </div>
                </div>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.stylists-view {
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
