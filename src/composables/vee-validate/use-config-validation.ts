import { type Ref } from "vue"

export const useConfigValidation = (submitCount: Ref<number>) => {
    return () => ({
        validateOnModelUpdate: submitCount.value > 0,
        validateOnBlur:        submitCount.value > 0,
        validateOnChange:      submitCount.value > 0,
        validateOnInput:       submitCount.value > 0,
    })
}
