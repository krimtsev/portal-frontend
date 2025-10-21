<script setup lang="ts">
import { computed } from "vue"
import { formatTelnum } from "@/lib/format-phone"
import BSvg from "@c/common/b-svg/b-svg.vue"

const props = defineProps<{
    value: string
    icon?: boolean
}>()

const telnum = computed(() => {
    if (!props.value) return ""
    return formatTelnum(props.value, { plus: true })
})

const nonFormated = computed(() => {
    if (!telnum.value) return ""
    return telnum.value.replace(/[^0-9+]/g, "")
})
</script>

<template>
    <a
        class="b-telnum"
        :href="`tel: ${nonFormated}`"
    >
        <span
            v-if="props.icon"
            class="icon"
        >
            <b-svg name="whatsapp-16" />
        </span>
        <span class="number">
            {{ telnum }}
        </span>
    </a>
</template>

<style scoped lang="scss">
.b-telnum {
    color: var(--p-button-primary-background);
    text-decoration: none;
    cursor: pointer;

    .icon {
        margin-right: $indent-x1;
        padding-top: calc($indent-x1 / 4);
    }

    :deep(.b-svg) {
        color: var(--p-button-primary-background);
    }

    &:hover {
        color: var(--p-button-primary-hover-background);

        :deep(.b-svg) {
            color: var(--p-button-primary-hover-background);
        }
    }

    &:active {
        color: var(--p-button-primary-active-background);

        :deep(.b-svg) {
            color: var(--p-button-primary-active-background);
        }
    }
}
</style>
