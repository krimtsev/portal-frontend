import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { telegramMessageLength } from "@/constants/messages"
import {
    DEFAULT_TELEGRAM_MAX_SIZE_MB,
    megabytesToBytes,
} from "@c/common/b-upload-file/utils/b-file-upload"

const MAX_FILE_SIZE = megabytesToBytes(DEFAULT_TELEGRAM_MAX_SIZE_MB)

export const BroadcastNotificationSchema = toTypedSchema(
    z.object({
        partner_ids: z.array(z.union([z.string(), z.number()]))
            .min(1, "Выберите хотя бы один филиал"),

        message: z.string()
            .trim()
            .min(1, "Введите текст сообщения")
            .max(telegramMessageLength, { message: "Сообщение слишком длинное" }),

        file: z.instanceof(File)
            .superRefine((file, ctx) => {
                if (file.size > MAX_FILE_SIZE) {
                    ctx.addIssue({
                        code:    "custom",
                        message: `Файл "${file.name}" слишком большой. Максимум ${DEFAULT_TELEGRAM_MAX_SIZE_MB}MB`,
                    })
                }
            })
            .nullable()
            .optional(),
    }),
)
