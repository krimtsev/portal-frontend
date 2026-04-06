<script setup lang="ts">
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"

const emit = defineEmits<{
    (e: "export-xls"): void
    (e: "export-csv"): void
    (e: "export-json"): void
}>()

type ExportTypes = {
    xls?:  boolean
    csv?:  boolean
    json?: boolean
}

withDefaults(defineProps<{
    types:      ExportTypes
    disabled?:  ExportTypes
    loading?:   ExportTypes
}>(), {
    disabled: () => ({}),
})
</script>

<template>
    <div class="b-export">
        <b-button-icon
            v-if="types.xls"
            :disabled="disabled.xls"
            :is-loading="loading?.xls"
            icon="xls-32"
            icon-size="2rem"
            class="button-export-xls"
            @click="emit('export-xls')"
        />

        <b-button-icon
            v-if="types.csv"
            :disabled="disabled.csv"
            :is-loading="loading?.csv"
            icon="csv-32"
            icon-size="2rem"
            class="button-export-csv"
            @click="emit('export-csv')"
        />

        <b-button-icon
            v-if="types.json"
            :disabled="disabled.json"
            :is-loading="loading?.json"
            icon="json-32"
            class="button-export-json"
            @click="emit('export-json')"
        />
    </div>
</template>

<style scoped lang="scss">
.b-export {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>
