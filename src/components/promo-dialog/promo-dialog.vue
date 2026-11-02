<script setup lang="ts">
import { type Component, computed, defineAsyncComponent, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import type { PromoDialog } from "@/api/modules/promo-dialog/definitions/promo-dialog"
import { PromoDialogType } from "@/api/modules/promo-dialog/definitions/promo-dialog"
import BDialog from "@c/common/b-dialog/b-dialog.vue"
import { promoDialogTemplates } from "./templates"

const emit = defineEmits<{ acknowledge: [] }>()

const props = defineProps<{
    dialog: PromoDialog
}>()

const { t } = useI18n()

const visible = ref(true)

const templateComponent = computed<Component | null>(() => {
    if (props.dialog.type !== PromoDialogType.Template) return null
    const loader = promoDialogTemplates[props.dialog.code]
    return loader ? defineAsyncComponent(loader) : null
})

function onAcknowledge() {
    visible.value = false
}

function onHide() {
    emit("acknowledge")
}
</script>

<template>
    <b-dialog
        v-model:visible="visible"
        :title="dialog.title || undefined"
        :show-header="!!dialog.title"
        :closable="false"
        :close-on-escape="false"
        :dismissable-mask="false"
        width="768px"
        min-height="400px"
        append-to="body"
        @hide="onHide"
    >
        <template #body>
            <template v-if="dialog.type === PromoDialogType.Custom">
                <p v-if="dialog.description">{{ dialog.description }}</p>
            </template>

            <!-- Зарегистрированный: компонент по code -->
            <component
                :is="templateComponent"
                v-else-if="templateComponent"
                :dialog="dialog"
            />

            <!-- Fallback: неизвестный code -->
            <p v-else-if="dialog.description">
                {{ dialog.description }}
            </p>
        </template>

        <template #footer>
            <prime-button
                type="button"
                :label="t('mc.dialog.promo.acknowledge')"
                @click="onAcknowledge"
            />
        </template>
    </b-dialog>
</template>
