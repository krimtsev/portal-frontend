import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { isValidFileName } from "@/lib/validator"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"

export const CloudSchema = (isRoot: boolean) => {
    return toTypedSchema(
        z.object({
            name: z.string()
                .min(1, { message: "Поле обязательно для заполнения" }),

            slug: isRoot
                ? z.string().optional().nullable()
                : z.string().min(1, { message: "Поле обязательно для заполнения" }),

            category_id: isRoot
                ? z.number().optional().nullable()
                : z.number({ message: "Поле обязательно для заполнения" }),
        })
    )
}

export const CloudFileSchema = toTypedSchema(
    z.object({
        files: FilesSchema
    })
)


export const CloudFileUpdateSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(1, { message: "Поле обязательно для заполнения" })
            .refine(isValidFileName, {
                message: "Недопустимое имя файла"
            })
    })
)
