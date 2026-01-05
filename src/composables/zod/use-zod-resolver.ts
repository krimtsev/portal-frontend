import { ref, watch } from "vue"
import { z } from "zod"
import type { ZodTypeAny, ZodError } from "zod"
import { debounce } from "lodash"

type ZodErrorTree = {
    errors: string[]
    properties?: Record<string, ZodErrorTree>
    items?: ZodErrorTree[]
}

export type FieldErrors<T> = {
    [K in keyof T]?: T[K] extends readonly (infer U)[]
        ? FieldErrors<U>[]
        : T[K] extends object
            ? FieldErrors<T[K]>
            : string
}

function mapZodTreeToErrors<T>(
    tree: ZodErrorTree
): FieldErrors<T> | string | undefined {
    if (tree.errors.length > 0) {
        return tree.errors[0]
    }

    if (tree.properties) {
        const result: Partial<FieldErrors<T>> = {}

        for (const key in tree.properties) {
            const value = mapZodTreeToErrors(tree.properties[key])
            if (value !== undefined) {
                ;(result as Record<string, unknown>)[key] = value
            }
        }

        return Object.keys(result).length ? result : undefined
    }

    if (tree.items) {
        const result: unknown[] = []

        tree.items.forEach((item, index) => {
            const value = mapZodTreeToErrors(item)
            if (value !== undefined) {
                result[index] = value
            }
        })

        return result.length ? (result as FieldErrors<T>) : undefined
    }

    return undefined
}

export function useZodResolver<T>(schema: ZodTypeAny) {
    const errors = ref<FieldErrors<T>>({})
    const nativeError = ref<ZodError | null>(null)
    const touched = ref(false)

    function validate(values: unknown): boolean {
        const result = schema.safeParse(values)

        if (result.success) {
            errors.value = {}
            nativeError.value = null
            return true
        }

        // TODO: Подумать, возможно лучше flat
        // const fieldErrors: FieldErrors<T> = {}
        // for (const issue of result.error.issues) {
        //     const field = issue.path[0] as keyof T | undefined
        //
        //     if (field && !fieldErrors[field]) {
        //         fieldErrors[field] = issue.message
        //     }
        // }
        // errors.value = fieldErrors

        nativeError.value = result.error

        const tree = z.treeifyError(result.error) as ZodErrorTree
        errors.value = mapZodTreeToErrors<T>(tree) ?? {}

        return false
    }

    function submit(values: unknown): boolean {
        touched.value = true
        return validate(values)
    }

    const debouncedValidate = debounce(validate, 200)

    function watchChanges(valuesRef: any) {
        watch(
            valuesRef,
            (val) => {
                if (touched.value) {
                    debouncedValidate(val)
                }
            },
            { deep: true }
        )
    }

    function reset() {
        errors.value = {}
        touched.value = false
    }

    return {
        errors,
        submit,
        validate,
        touched,
        watchChanges,
        nativeError,
        reset
    }
}
