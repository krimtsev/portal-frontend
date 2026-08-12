<script setup lang="ts">
import { useI18n } from "vue-i18n"
import PrimeTag from "primevue/tag"

const props = defineProps<{
    active: boolean
}>()

const { t } = useI18n()

const tagSeverity = props.active ? "success" : "danger"

const tagValue = props.active
    ? t("mc.dashboard.partnerNotification.state.active")
    : t("mc.dashboard.partnerNotification.state.disabled")
</script>

<template>
    <prime-tag
        :severity="tagSeverity"
        :value="tagValue"
        class="notification-state"
    />
</template>
