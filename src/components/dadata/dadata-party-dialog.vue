<script setup lang="ts">
import { computed, ref, watch } from "vue"
import RadioButton from "primevue/radiobutton"
import RadioButtonGroup from "primevue/radiobuttongroup"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as dadataAPI from "@/api/modules/dadata/dadata"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDialogConfirm from "@c/common/b-dialog/b-dialog-confirm.vue"
import BDialogItem from "@c/common/b-dialog/b-dialog-item.vue"
import BDialogSection from "@c/common/b-dialog/b-dialog-section.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import type { PartyData } from "@c/dadata/definitions/dadata"

const model = defineModel<boolean>()

const emit = defineEmits<{
    (e: "select", data: PartyData): void
}>()

const notify = useNotify()

const query = ref("")
const isLoading = ref(false)
const isFirstLoaded = ref(false)
const results = ref<PartyData[]>([])
const selected = ref<PartyData | null>(null)

watch(model, (visible) => {
    if (visible) {
        query.value = ""
        results.value = []
        selected.value = null
    }
})

async function onSearch() {
    const value = query.value.trim()

    if (!value || isLoading.value) return

    isLoading.value = true
    const response = await dadataAPI.suggestParty({ query: value })
    isLoading.value = false

    if (response instanceof HttpError) {
        notify.error()
        return
    }

    results.value = response.data
    selected.value = results.value[0] ?? null
    isFirstLoaded.value = true
}

function onConfirm() {
    if (!selected.value) {
        model.value = false
        return
    }

    emit("select", selected.value)
    model.value = false
}

function onCancel() {
    model.value = false
}

const emptyText = computed(() => {
    if (isFirstLoaded.value) return "Ничего не найдено"
    return "Введите запрос и нажмите «Найти»"
})
</script>

<template>
    <b-dialog-confirm
        v-model="model"
        title="Поиск компании"
        class="dadata-party-dialog"
        @confirm="onConfirm"
        @cancel="onCancel"
    >
        <b-dialog-section>
            <b-dialog-item
                label="ИП, ИНН, КПП, ОГРН"
                required
            >
                <b-input-text
                    v-model="query"
                    :disabled="isLoading"
                    class="full-width mr-x2"
                    @keydown.enter="onSearch"
                />

                <b-button-icon
                    label="Найти"
                    icon="pi pi-search"
                    :is-loading="isLoading"
                    variant="outlined"
                    @click="onSearch"
                />
            </b-dialog-item>
        </b-dialog-section>

        <b-dialog-section
            v-if="results.length"
            class="dadata-results"
        >
            <b-dialog-item hide-label>
                <RadioButtonGroup
                    v-model="selected"
                    class="radio-button-group"
                >
                    <label
                        v-for="item in results"
                        :key="item.inn"
                        class="dadata-result"
                    >
                        <RadioButton :value="item" />

                        <div class="dadata-result-body">
                            <div class="dadata-result-name">
                                {{ item.name }}
                            </div>

                            <div class="dadata-result-inn">
                                ИНН: {{ item.inn }}
                            </div>

                            <div class="dadata-result-ogrn">
                                ОГРН: {{ item.ogrn }}
                            </div>

                            <div class="dadata-result-address">
                                {{ item.address }}
                            </div>
                        </div>
                    </label>
                </RadioButtonGroup>
            </b-dialog-item>
        </b-dialog-section>

        <b-dialog-section v-else>
            <b-dialog-item hide-label>
                <div class="dadata-empty">
                    {{ emptyText }}
                </div>
            </b-dialog-item>
        </b-dialog-section>
    </b-dialog-confirm>
</template>

<style scoped lang="scss">
.dadata-party-dialog {
    .radio-button-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: $indent-x1;
    }

    .dadata-result {
        width: 100%;
        display: flex;
        gap: $indent-x2;
        align-items: flex-start;
        padding: $indent-x2;
        border-radius: var(--p-form-field-border-radius);
        border: 1px solid var(--p-radiobutton-border-color);
        cursor: pointer;

        &:hover {
            border: 1px solid var(--p-radiobutton-hover-border-color);
            background: var(--p-radiobutton-background);
        }
    }

    .dadata-empty {
        padding: $indent-x3;
        color: var(--p-surface-500);
        text-align: center;
        width: 100%;
    }
}
</style>
