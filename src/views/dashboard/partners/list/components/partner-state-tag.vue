<script setup lang="ts">
import PrimeTag from "primevue/tag"
import { useI18n } from "vue-i18n"

const props = defineProps<{
    active: boolean
}>()

const { t } = useI18n()

const tagSeverity = props.active ? "success" : "danger"

const tagValue = props.active
    ? t("mc.dashboard.partners.state.active")
    : t("mc.dashboard.partners.state.disabled")
</script>

<template>
    <prime-tag
        :severity="tagSeverity"
        :value="tagValue"
        class="partner-state"
    />
</template>
