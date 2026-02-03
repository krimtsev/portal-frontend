import * as z from "zod"

const MAX_FILE_SIZE = 1_000_000
const MAX_FILES = 5

/** General schema **/

export const PartnerIdSchema =  z.number({ message: "Выберите филиал" })

export const MessageSchema = z.string()
    .max(500, { message: "Сообщениеи слишком длиннкое" })
    .optional()

export const RequiredMessageSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(500, { message: "Сообщениеи слишком длиннкое" })

export const FilesSchema = z
    .array(z.instanceof(File))
    .max(MAX_FILES, `Максимум ${MAX_FILES} файлов`)
    .superRefine((files, ctx) => {
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: "custom",
                    message: "Файл больше 1MB",
                })
            }
        }
    })
    .optional()

export const UrlSchema = z
    .url({ message: "Укажите правильный формат URL" })

export const UrlSchemaOptional = z.union([
    z.string().url({ message: "Укажите правильный формат URL" }),
    z.literal(""),
    z.undefined()
])
