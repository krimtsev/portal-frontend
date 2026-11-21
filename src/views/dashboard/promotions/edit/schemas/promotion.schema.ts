import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { maxMessageLength, maxTitleLength } from "@/constants/messages"
import { megabytesToBytes } from "@/lib/format-size"
import { IMAGE_ACCEPT } from "@/constants/mime-types"
import { DEFAULT_IMAGE_MAX_SIZE_MB } from "@/constants/files"

const MAX_IMAGE_SIZE = megabytesToBytes(DEFAULT_IMAGE_MAX_SIZE_MB)

export const PromotionSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(3, { message: "Название слишком короткое" })
            .max(maxTitleLength, { message: "Название слишком длинное" }),

        description: z.string()
            .min(3, { message: "Сообщение слишком короткое" })
            .max(maxMessageLength, { message: "Сообщение слишком длинное" }),

        disabled: z.boolean(),

        expires_at: z.string()
            .nullable(),

        image: z.instanceof(File)
            .refine(
                (file) => file.size <= MAX_IMAGE_SIZE,
                { message: `Файл слишком большой (макс. ${DEFAULT_IMAGE_MAX_SIZE_MB} МБ)` },
            )
            .refine(
                (file) => IMAGE_ACCEPT.includes(file.type),
                { message: "Неподдерживаемый формат (JPG, PNG, WEBP, GIF)" },
            )
            .nullable(),

        remove_image: z.boolean(),
    }),
)


