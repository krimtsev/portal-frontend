<script setup lang="ts">
import BDialog from "@c/common/b-dialog/b-dialog.vue"
import PrimeButton from "primevue/button"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const emit = defineEmits<{
    (e: "confirm"): void
    (e: "cancel"): void
}>()

const model = defineModel<boolean>()

const props = defineProps<{
    title?: string,
    isLoading?: boolean
}>()
</script>

<template>
    <b-dialog
        v-model:visible="model"
        :title="props.title"
        class="b-dialog-confirm"
    >
        <slot />

        <template #footer>
            <prime-button
                type="button"
                :label="t('mc.dialog.default.confirm')"
                :loading="props.isLoading"
                @click="emit('confirm')"
            />

            <prime-button
                type="button"
                :label="t('mc.dialog.default.cancel')"
                :disabled="props.isLoading"
                severity="secondary"
                @click="emit('cancel')"
            />
        </template>
    </b-dialog>
</template>
