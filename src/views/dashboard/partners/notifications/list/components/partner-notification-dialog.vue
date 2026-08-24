<script setup lang="ts">
import { ref } from "vue"
import { useNotify } from "@/composables/notify/use-notify"
import BDialogConfirm from "@c/common/b-dialog/b-dialog-confirm.vue"
import BDialogItem from "@c/common/b-dialog/b-dialog-item.vue"
import BDialogSection from "@c/common/b-dialog/b-dialog-section.vue"

const isVisible = defineModel<boolean>()

const notify = useNotify()

const isLoading = ref(false)

function onConfirm() {
    notify.success("123")

    isVisible.value = false
}

function onCancel() {
    isVisible.value = false
}
</script>

<template>
    <b-dialog-confirm
        v-model="isVisible"
        title="Рассылка сообщения"
        :is-loading="isLoading"
        @confirm="onConfirm"
        @cancel="onCancel"
    >
        <b-dialog-section>
            <b-dialog-item
                label="Филиал"
                required
            >
                <!--                <b-multi-select-->
                <!--                    v-model="royaltyStore.filter.filters.partner_id"-->
                <!--                    :options="partners"-->
                <!--                    :selected-count="royaltyStore.filter.filters.partner_id.length"-->
                <!--                    :disabled="royaltyStore.isLoading"-->
                <!--                    option-label="name"-->
                <!--                    option-value="id"-->
                <!--                    filter-->
                <!--                    show-clear-->
                <!--                    placeholder="Выберите филиал"-->
                <!--                    class="filter-partner"-->
                <!--                    @submit="onChangeFilter"-->
                <!--                />-->
            </b-dialog-item>
        </b-dialog-section>
    </b-dialog-confirm>
</template>


