import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const BroadcastNotificationSchema = toTypedSchema(
    z.object({
        partner_ids: z.array(z.union([z.string(), z.number()]))
            .min(1, "Выберите хотя бы один филиал"),

        message: z.string()
            .trim()
            .min(1, "Введите текст сообщения"),

        file: z.instanceof(File)
            .optional(),
    }),
)
