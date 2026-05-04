import { type FormOptions, useForm as useBaseForm } from "vee-validate"
import { type Ref } from "vue"

export const useConfigValidation = (submitCount: Ref<number>) => {
    return () => ({
        validateOnModelUpdate: submitCount.value > 0,
        validateOnBlur:        submitCount.value > 0,
        validateOnChange:      submitCount.value > 0,
        validateOnInput:       submitCount.value > 0,
    })
}

export function useVeeForm<TValues extends Record<string, any> = Record<string, any>>(
    options?: FormOptions<TValues>,
) {
    const form = useBaseForm<TValues>(options)
    const dynamicConfigFn = useConfigValidation(form.submitCount)

    const defineLazyField: typeof form.defineField = (path, config) => {
        const mergedConfig = (state: any) => {
            const base = dynamicConfigFn()

            const extra = typeof config === "function"
                ? config(state)
                : config || {}

            return { ...base, ...extra }
        }

        return form.defineField(path, mergedConfig as any)
    }

    return {
        ...form,
        defineLazyField,
    }
}
