import { defineStore } from "pinia"
import { ref } from "vue"
import type {
    PartnerFinance,
    MessageItem,
    PortalHome,
} from "@/api/modules/app/definitions/app"

export const useHomeStore = defineStore("home", () => {
    const isLoading = ref(true)
    const isLoaded = ref(false)

    const messages = ref<MessageItem[]>([])
    const finances = ref<PartnerFinance>({})

    function setLoading(value: boolean) {
        isLoading.value = value
    }

    function setLoaded(value: boolean) {
        isLoaded.value = value
    }

    function setData(data: PortalHome) {
        finances.value = data.finances
        messages.value = data.messages
    }

    return {
        isLoading,
        isLoaded,
        messages,
        finances,
        setLoading,
        setLoaded,
        setData,
    }
})
