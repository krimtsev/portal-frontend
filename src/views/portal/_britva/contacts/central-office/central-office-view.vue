<script setup lang="ts">
import { centralOfficeData } from "@v/portal/_britva/contacts/central-office/data/central-office-data"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import CentralOfficeUser from "@v/portal/_britva/contacts/central-office/components/central-office-user.vue"
import { buttonNavigation } from "@v/portal/_britva/contacts/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
</script>

<template>
    <portal-page
        class="central-office-view"
        title="Контакты сотрудников центрального офиса"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <central-office-user
            v-for="data in centralOfficeData"
            :key="data.id"
            :user="data"
            class="mb-x3"
        />
    </portal-page>
</template>
