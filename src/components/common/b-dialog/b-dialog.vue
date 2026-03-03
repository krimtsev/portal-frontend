<script setup lang="ts">
import { computed } from "vue"
import PrimeDialog from "primevue/dialog"
import BSvg from "@c/common/b-svg/b-svg.vue"

const visible = defineModel<boolean>("visible", { default: false })

const props = withDefaults(defineProps<{
    title?:        string,
    draggable?:    boolean,
    width?:        string,
    style?:        object,
    modal?:        boolean
    closable?:     boolean
    iconName?:     string
    showHeader?:   boolean
}>(), {
    draggable:  false,
    width:      "624px",
    modal:      true,
    closable:   false,
    showHeader: true
})

const dialogStyle = computed(() => ({
    width: props.width,
    ...props.style
}))

const contentStyle = computed(() => {
    return !props.showHeader
        ? { padding: 'var(--p-overlay-modal-padding)' }
        : {};
})
</script>

<template>
    <prime-dialog
        v-model:visible="visible"
        :header="props.title"
        :draggable="props.draggable"
        :style="dialogStyle"
        :content-style="contentStyle"
        :modal="props.modal"
        :closable="props.closable"
        :show-header="props.showHeader"
        position="center"
        class="b-dialog"
    >
        <template v-if="$slots.header" #header>
            <div class="dialog-header">
                <slot name="header" />
            </div>
        </template>

        <div class="dialog-body">
            <div
                v-if="props.iconName"
                class="dialog-icon"
            >
                <b-svg
                    :name="props.iconName"
                    size="4rem"
                />
            </div>

            <slot name="body" />
            <slot />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <slot name="footer" />
            </div>
        </template>
    </prime-dialog>
</template>

<style scoped lang="scss">
.b-dialog {
    .dialog-body {
        display: flex;
        gap: $indent-x2;
    }

    .dialog-icon {
        padding: $indent-x2;

        :deep(.b-svg) {
            color: var(--p-surface-500);
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-start;
        gap: $indent-x1;
        width: 100%;
        border-top: 1px solid var(--p-divider-border-color);
        padding-top: $indent-x3;
    }
}
</style>
