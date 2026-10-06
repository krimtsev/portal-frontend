<script setup lang="ts">
import { computed } from "vue"
import BSvg from "@c/common/b-svg/b-svg.vue"
import { formatTelnum } from "@/lib/format-phone"

const props = defineProps<{
    value: string
    icon?: boolean
}>()

const telnum = computed(() => {
    if (!props.value) return ""
    return formatTelnum(props.value, { plus: true })
})

const pureNumber = computed(() => {
    if (!telnum.value) return ""
    return telnum.value.replace(/[^0-9+]/g, "")
})
</script>

<template>
    <a
        :href="`tel:${pureNumber}`"
        class="b-telnum-link"
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
.b-telnum-link {
    display: inline-flex;
    align-items: center;
    color: var(--p-link-color);
    text-decoration: none;
    cursor: pointer;

    .icon {
        margin-right: $indent-x1;
        padding-top: calc($indent-x1 / 4);
    }

    :deep(.b-svg) {
        color: var(--p-link-color);
    }

    &:hover {
        color: var(--p-link-hover-color);

        :deep(.b-svg) {
            color: var(--p-link-hover-color);
        }
    }

    &:active {
        color: var(--p-link-active-color);

        :deep(.b-svg) {
            color: var(--p-link-active-color);
        }
    }
}
</style>
