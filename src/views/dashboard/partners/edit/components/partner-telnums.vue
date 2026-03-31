<script setup lang="ts">
import { ref, computed } from "vue"
import type { PartnerTelnumItem } from "@v/dashboard/partners/edit/definitions/partner"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BTelnumLink from "@c/common/b-link/b-telnum-link.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDialogSection from "@c/common/b-dialog/b-dialog-section.vue"
import BDialogItem from "@c/common/b-dialog/b-dialog-item.vue"
import BInputTelnum from "@c/common/b-input/b-input-telnum.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BDialogConfirm from "@c/common/b-dialog/b-dialog-confirm.vue"
import { useForm } from "vee-validate"
import { PartnerTelnumSchema } from "@v/dashboard/partners/edit/schemas/partner.schema"
import { useConfigValidation } from "@/composables/vee-validate/use-config-validation"


const model = defineModel<PartnerTelnumItem[]>({ default: () => [] })

const props = defineProps<{
    disabled: boolean
}>()

// Состояние модального окна
const isModalOpen = ref(false)
const editingIndex = ref<number | null>(null)
const isEditing = computed(() => editingIndex.value !== null)

const {
    defineField,
    handleSubmit,
    resetForm,
    meta,
    errors,
    submitCount
} = useForm<PartnerTelnumItem>({
    validationSchema: PartnerTelnumSchema,
    initialValues: {
        number: "",
        name:   ""
    }
})

const dynamicConfig = useConfigValidation(submitCount)

const [numberModel] = defineField("number", dynamicConfig)
const [nameModel]   = defineField("name", dynamicConfig)

const openModal = (index: number | null = null) => {
    editingIndex.value = index

    if (index !== null && model.value[index]) {
        resetForm({
            values: {
                name:   model.value[index].name || "",
                number: model.value[index].number || ""
            }
        })
    } else {
        resetForm({
            values: {
                name:   "",
                number: ""
            }
        })
    }
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}

const saveModal = handleSubmit((formValues) => {
    if(!meta.value.dirty) {
        closeModal()
        return
    }

    const newItem: PartnerTelnumItem = formValues

    if (isEditing.value && editingIndex.value !== null) {
        model.value[editingIndex.value] = newItem
    } else {
        model.value.push(newItem)
    }

    model.value = [...model.value]

    closeModal()
})

const deleteItem = (index: number) => {
    const updatedList = [...model.value]
    updatedList.splice(index, 1)
    model.value = updatedList
}
</script>

<template>
    <div class="partner-telnums">
        <div class="telnums-list">
            <div
                v-if="!model.length"
                class="empty"
            >
                <span> Контакты отсутствуют </span>
            </div>

            <template v-else>
                <div
                    v-for="(item, index) in model"
                    :key="index"
                    class="telnum-item"
                >
                    <div>
                        <b-telnum-link :value="item.number" />
                        <span
                            v-if="item.name"
                            class="name"
                        >
                            ({{ item.name }})
                        </span>
                    </div>

                    <div class="actions">
                        <b-button-icon
                            :disabled="props.disabled"
                            icon="pi pi-pencil"
                            severity="contrast"
                            @click="openModal(index)"
                        />

                        <b-button-icon
                            :disabled="props.disabled"
                            icon="pi pi-times"
                            severity="danger"
                            @click="deleteItem(index)"
                        />
                    </div>
                </div>
            </template>
        </div>

        <b-button-secondary
            :disabled="props.disabled"
            label="Добавить контакт"
            @click="openModal"
        />

        <b-dialog-confirm
            v-model:visible="isModalOpen"
            :title="isEditing
                ? 'Редактировать контакт'
                : 'Добавить контакт'"
            @confirm="saveModal"
            @cancel="closeModal"
        >
            <b-dialog-section>
                <b-dialog-item
                    label="Номер"
                    required
                >
                    <b-input-telnum
                        v-model="numberModel"
                        :error="errors.number"
                    />
                </b-dialog-item>

                <b-dialog-item label="Имя">
                    <b-input-text v-model="nameModel" />
                </b-dialog-item>
            </b-dialog-section>
        </b-dialog-confirm>
    </div>
</template>

<style scoped lang="scss">
.partner-telnums {
    .telnums-list {
        display: flex;
        flex-direction: column;
        margin-bottom: $indent-x2;

        .telnum-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: $indent-x1;
        }

        .empty {
            margin-top: $label-indent;
        }

        .name {
            color: var(--p-surface-400);
        }
    }
}
</style>
