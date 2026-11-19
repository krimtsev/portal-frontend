<script setup lang="ts">
import {
    type Component,
    computed,
    defineAsyncComponent,
    onBeforeUnmount,
    ref,
    watch,
} from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import { HttpError } from "@/api"
import type { PromoDialog } from "@/api/modules/promo-dialog/definitions/promo-dialog"
import * as promoDialogAPI from "@/api/modules/promo-dialog/promo-dialog"
import BDialog from "@c/common/b-dialog/b-dialog.vue"
import BImagePreview from "@c/common/b-image-preview/b-image-preview.vue"
import { promoDialogTemplates } from "@c/promo-dialog/templates"
import { $sanitizeHtml } from "@/lib/sanitize-html"

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

const imageSrc = ref<string | null>(null)
const imageError = ref(false)

watch(
    () => props.dialog.id,
    async (id) => {
        if (imageSrc.value) {
            URL.revokeObjectURL(imageSrc.value)
            imageSrc.value = null
        }
        imageError.value = false

        if (!props.dialog.image) return

        const blob = await promoDialogAPI.getImage(id)
        if (blob instanceof HttpError) {
            imageError.value = true
            return
        }

        imageSrc.value = URL.createObjectURL(blob)
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
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
            <b-image-preview
                v-if="dialog.image && !imageError"
                :key="dialog.id"
                :src="imageSrc"
                :alt="dialog.title || ''"
                class="promo-dialog-image"
            />


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

            <!-- Fallback: неизвестный template -->
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

<style lang="scss" scoped>
.promo-dialog {
    &-image {
        margin-bottom: $indent-x2;
        overflow: hidden;
    }
}
</style>
