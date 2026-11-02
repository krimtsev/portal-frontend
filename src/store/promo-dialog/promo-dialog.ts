import { defineStore } from "pinia"
import { computed, ref } from "vue"
import * as promoDialogAPI from "@/api/modules/promo-dialog/promo-dialog"
import { HttpError } from "@/api"
import type { PromoDialog } from "@/api/modules/promo-dialog/definitions/promo-dialog"

export const usePromoDialogStore = defineStore("promo-dialog", () => {
    const queue = ref<PromoDialog[]>([])
    const isInitialized = ref(false)

    const current = computed<PromoDialog | null>(() => queue.value[0] ?? null)
    const hasPending = computed(() => queue.value.length > 0)

    function setQueue(dialogs: PromoDialog[]) {
        if (isInitialized.value || !dialogs.length) return
        queue.value = [...dialogs]
        isInitialized.value = true
    }

    async function acknowledge() {
        if (!queue.value.length) return
        const data = queue.value.shift()
        if (!data?.id) return

        const response = await promoDialogAPI.read(data.id)

        if (response instanceof HttpError) {
            return false
        }
    }

    function reset() {
        queue.value = []
        isInitialized.value = false
    }

    return {
        queue,
        current,
        hasPending,
        isInitialized,
        setQueue,
        acknowledge,
        reset,
    }
})
