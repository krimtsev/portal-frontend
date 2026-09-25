<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
</script>

<template>
    <portal-page
        class="discounts-view"
        title="Корпоративная скидка"
    >
        <portal-card title="Партнерство BRITVA / SODA / LAPKI:">
            <div class="content">
                <ul>
                    <li>франчайзи BRITVA, SODA, LAPKI предоставляется скидка 20% на все услуги в LAPKI</li>
                    <li>всем сотрудникам предоставляется скидка 20% на все услуги в LAPKI</li>
                </ul>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.discounts-view {
    .content {
        @include text-content;
    }
}
</style>
