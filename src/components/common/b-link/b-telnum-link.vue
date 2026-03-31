<script setup lang="ts">
import { computed } from "vue"
import { formatTelnum } from "@/lib/format-phone.ts"
import BSvg from "@c/common/b-svg/b-svg.vue"

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
    color: var(--p-primary-color);
    text-decoration: none;
    cursor: pointer;

    .icon {
        margin-right: $indent-x1;
        padding-top: calc($indent-x1 / 4);
    }

    :deep(.b-svg) {
        color: var(--p-primary-color);
    }

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
</style>
