import { computed, ref, type Ref } from "vue"
import { cloneDeep, isEqual } from "lodash"

export function useQueryState<T extends Record<string, any>>(initialValues: T) {
    const isLoading = ref<boolean>(false)

    const initialFilter = ref(cloneDeep(initialValues)) as Ref<T>
    const currentFilter = ref(cloneDeep(initialValues)) as Ref<T>

    function setIsLoading(value: boolean) {
        isLoading.value = value
    }

    const isChanged = computed(() => {
        return !isEqual(currentFilter.value, initialFilter.value)
    })

    function commitFilter() {
        initialFilter.value = cloneDeep(currentFilter.value)
    }

    function resetFilter() {
        currentFilter.value = cloneDeep(initialFilter.value)
    }

    return {
        filter: currentFilter,
        isLoading,
        isChanged,

        setIsLoading,
        commitFilter,
        resetFilter,
    }
}
