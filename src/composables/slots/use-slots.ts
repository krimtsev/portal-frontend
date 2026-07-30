import { shallowRef, watch, getCurrentInstance, type Slots } from "vue"

export function useSlots() {
    const instance = getCurrentInstance()
    const slots = shallowRef<Slots>({})

    const updateSlots = () => {
        queueMicrotask(() => {
            if (instance?.proxy?.$slots) {
                slots.value = { ...instance.proxy.$slots }
            }
        })
    }

    watch(
        () => instance?.proxy?.$slots,
        updateSlots,
        { immediate: true, deep: true },
    )

    return {
        slots,
        updateSlots,
    }
}
