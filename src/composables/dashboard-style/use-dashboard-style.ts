import { onMounted, onUnmounted } from "vue"

export function useDashboardStyle() {
    const DATA_ATTRIBUTE_NAME = "data-layout"
    const DATA_ATTRIBUTE_VALUE = "dashboard"

    const rootElement = document.documentElement

    onMounted(() => {
        rootElement.setAttribute(DATA_ATTRIBUTE_NAME, DATA_ATTRIBUTE_VALUE)
    })

    onUnmounted(() => {
        rootElement.removeAttribute(DATA_ATTRIBUTE_NAME)
    })
}
