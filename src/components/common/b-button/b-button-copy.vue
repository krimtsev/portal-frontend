<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useNotify } from "@/composables/notify/use-notify"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import i18n from "@/plugins/i18n"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = withDefaults(defineProps<{
    label?:    string
    disabled?: boolean
    text:      string
}>(), {
    label:    () => i18n.global.t("mc.common.button.copy"),
    disabled: false,
    text:     "",
})

const { t } = useI18n()
const notify = useNotify()

const success = ref(false)

const notifyCopySuccess = async () => {
    try {
        emit("click")

        notify.success(t("mc.notify.copy"))
        success.value = true

        window.setTimeout(() => {
            success.value = false
        }, 5000)

        await navigator.clipboard.writeText(props.text)
    } catch (err) {
        console.error("Ошибка при копировании: ", err)
    }
}
</script>

<template>
    <b-button-secondary
        :label="props.label"
        :disabled="props.disabled"
        :icon="success
            ? 'pi pi-check'
            : 'pi pi-clone'
        "
        class="b-button-copy"
        @click="notifyCopySuccess"
    />
</template>

<style scoped lang="scss">
.b-button-copy {
    white-space: nowrap;
    min-width: 104px;
}
</style>
