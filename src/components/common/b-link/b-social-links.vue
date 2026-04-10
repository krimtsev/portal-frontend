<script setup lang="ts">
import { computed } from "vue"
import BSvg from "@c/common/b-svg/b-svg.vue"

const props = defineProps<{
    telegram?: string | boolean
    whatsapp?: string | boolean
}>()

const telegramHref = computed(() => {
    if (!props.telegram) return ""

    const value = String(props.telegram).trim()

    if (/^\+?[\d\s\-()]+$/.test(value)) {
        const telnum = value.replace(/[^0-9]/g, "")
        return `https://t.me/+${telnum}`
    }

    return `https://t.me/${value}`
})

const whatsappHref = computed(() => {
    if (!props.whatsapp) return ""

    const value = String(props.telegram).trim()

    if (/^\+?[\d\s\-()]+$/.test(value)) {
        const telnum = value.replace(/[^0-9]/g, "")
        return `https://wa.me/${telnum}`
    }

    return `https://wa.me/${props.whatsapp}`
})

const linkAttr = {
    rel:    "noopener noreferrer",
    target: "_blank",
    class:  "b-social-link",
}
</script>

<template>
    <div class="b-social-links">
        <a
            v-if="props.whatsapp"
            v-bind="linkAttr"
            :href="whatsappHref"
        >
            <b-svg name="whatsapp-16" />
        </a>

        <a
            v-if="props.telegram"
            v-bind="linkAttr"
            :href="telegramHref"
        >
            <b-svg name="telegram-16" />
        </a>
    </div>
</template>

<style scoped lang="scss">
.b-social-links {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    .b-social-link {
        display: inline-flex;
        text-decoration: none;
        color: var(--p-primary-color);
        cursor: pointer;

        &:hover {
            color: var(--p-primary-hover-color);

            :deep(.b-svg) {
                color: var(--p-primary-hover-color);
            }
        }

        &:active {
            color: var(--p-primary-active-color);

            :deep(.b-svg) {
                color: var(--p-primary-active-color);
            }
        }
    }

    :deep(.b-svg) {
        color: var(--p-primary-color);
        display: block;
    }
}
</style>
