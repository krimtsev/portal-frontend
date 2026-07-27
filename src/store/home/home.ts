import { defineStore } from "pinia"
import { ref } from "vue"
import type {
    EventCalendar,
    MessageItem,
    PortalHome,
} from "@/api/modules/app/definitions/app"
import type { MonthsBarChartData } from "@c/charts/definitions/charts"

export const useHomeStore = defineStore("home", () => {
    const isLoading = ref(true)
    const isLoaded = ref(false)

    const messages = ref<MessageItem[]>([])
    const finances = ref<MonthsBarChartData>({})
    const events = ref<EventCalendar[]>([])

    function setLoading(value: boolean) {
        isLoading.value = value
    }

    function setLoaded(value: boolean) {
        isLoaded.value = value
    }

    function setData(data: PortalHome) {
        finances.value = data.finances
        messages.value = data.messages
        events.value = data.events
    }

    return {
        isLoading,
        isLoaded,
        messages,
        finances,
        events,
        setLoading,
        setLoaded,
        setData,
    }
})
