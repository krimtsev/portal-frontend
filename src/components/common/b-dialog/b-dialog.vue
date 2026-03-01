<script setup lang="ts">
import { computed } from "vue"
import PrimeDialog from "primevue/dialog"
import PrimeButton from "primevue/button"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const visible = defineModel<boolean>("visible", { default: false })

const props = withDefaults(defineProps<{
    title?:     string,
    draggable?: boolean,
    width?:     string,
    style?:     object,
    modal?:     boolean
    closable?:  boolean
}>(), {
    title:     "",
    draggable: false,
    width:     "624px",
    modal:     true,
    closable:  false
})

const dialogStyle = computed(() => ({
    width: props.width,
    ...props.style
}))

const onConfirm = () => {
    emit('confirm')
}

const onCancel = () => {
    visible.value = false
    emit('cancel')
}
</script>

<template>
    <prime-dialog
        v-model:visible="visible"
        :header="props.title"
        :draggable="props.draggable"
        :style="dialogStyle"
        :modal="props.modal"
        :closable="props.closable"
        class="b-dialog"
    >
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>

        <slot name="default" />

        <template #footer>
            <div class="footer">
                <prime-button
                    type="button"
                    :label="t('mc.dialog.default.confirm')"
                    @click="onConfirm"
                />
                <prime-button
                    type="button"
                    :label="t('mc.dialog.default.cancel')"
                    severity="secondary"
                    @click="onCancel"
                />
            </div>
        </template>
    </prime-dialog>
</template>

<style scoped lang="scss">
.b-dialog {
    .footer {
        display: flex;
        justify-content: flex-start;
        gap: $indent-x1;
        width: 100%;
        border-top: 1px solid var(--p-divider-border-color);
        padding-top: $indent-x3;
    }
}
</style>
