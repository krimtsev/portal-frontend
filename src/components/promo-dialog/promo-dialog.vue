<script setup lang="ts">
import { type Component, computed, defineAsyncComponent, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import type { PromoDialog } from "@/api/modules/promo-dialog/definitions/promo-dialog"
import BDialog from "@c/common/b-dialog/b-dialog.vue"
import { $sanitizeHtml } from "@/lib/sanitize-html"
import { promoDialogTemplates } from "./templates"

const emit = defineEmits<{ acknowledge: [] }>()

const props = defineProps<{
    dialog: PromoDialog
}>()

const { t } = useI18n()

const visible = ref(true)

const templateComponent = computed<Component | null>(() => {
    if (!props.dialog.template) return null
    const loader = promoDialogTemplates[props.dialog.template]
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
        class="promo-dialog"
        @hide="onHide"
    >
        <template #body>
            <!-- Зарегистрированный: компонент по template -->

            <div v-if="templateComponent">
                <component
                    :is="templateComponent"
                    :dialog="dialog"
                />

                <div
                    v-if="dialog.description"
                    class="pre-wrap mt-x2"
                >
                    <div v-html="$sanitizeHtml(dialog.description)" />
                </div>
            </div>


            <!-- Fallback: неизвестный code -->
            <div v-else>
                <div class="content pre-wrap">
                    <div v-html="$sanitizeHtml(dialog.description)" />
                </div>
            </div>
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
