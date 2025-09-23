<script setup lang="ts">
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/_britva/contacts/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
</script>

<template>
    <portal-page
        class="franchisee-view"
        title="Контакты наших любимых франчайзи"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>
    </portal-page>
</template>
