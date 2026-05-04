import { defineStore } from "pinia"
import { ref } from "vue"

export const useFormStore = defineStore("form", () => {
    const isLoading = ref(true)

    function setLoading(value: boolean) {
        isLoading.value = value
    }

    return {
        isLoading,

        setLoading,
    }
})
