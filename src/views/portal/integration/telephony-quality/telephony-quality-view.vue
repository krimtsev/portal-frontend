<script setup lang="ts">
import BDivider from "@c/common/b-divider/b-divider.vue"
import BImage from "@c/common/b-image/b-image.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
</script>

<template>
    <portal-page
        title="Система видеoаналитики IVIDEON"
        class="telephony-quality-view"
    >
        <portal-card>
            <div class="content">
                <b-image src="logos/logo.png" />

                <b-divider />

                <p> Контент скоро появится. </p>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.telephony-quality-view {
    .content {
        @include text-content;
    }
}
</style>
