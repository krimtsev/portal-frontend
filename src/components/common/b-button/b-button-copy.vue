<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useNotify } from "@/composables/notify/use-notify"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = withDefaults(defineProps<{
    disabled?: boolean
    text:      string
    onlyIcon?: boolean
}>(), {
    disabled: false,
    text:     "",
    onlyIcon: false,
})

const { t } = useI18n()
const notify = useNotify()

const success = ref(false)
const copyTimer = ref<number | null>(null)

const notifyCopySuccess = async () => {
    try {
        emit("click")

        notify.success(t("mc.notify.copy.success"))
        success.value = true

        if (copyTimer.value !== null) {
            window.clearTimeout(copyTimer.value)
        }

        copyTimer.value = window.setTimeout(() => {
            success.value = false
        }, 5000)

        await navigator.clipboard.writeText(props.text)
    } catch {
        notify.error("mc.notify.copy.error")
    }
}

const label = computed(() => {
    if (props.onlyIcon) return ""
    if (success.value) return t("mc.common.button.copied")
    return t("mc.common.button.copy")
})
</script>

<template>
    <b-button-secondary
        :label="label"
        :disabled="props.disabled"
        :icon="success
            ? 'pi pi-check'
            : 'pi pi-clone'
        "
        class="b-button-copy"
        :class="{ 'only-icon': !label }"
        @click="notifyCopySuccess"
    />
</template>

<style scoped lang="scss">
.b-button-copy {
    white-space: nowrap;
    min-width: 104px;

    &.only-icon {
        min-width: 40px;
    }
}
</style>
