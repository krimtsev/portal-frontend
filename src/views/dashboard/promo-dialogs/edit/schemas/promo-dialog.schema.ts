import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { maxMessageLength, maxTitleLength } from "@/constants/messages"

export const PromoDialogSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(3, { message: "Сообщение слишком короткое" })
            .max(maxTitleLength, { message: "Сообщение слишком длинное" }),

        description: z.string()
            .max(maxMessageLength, { message: "Сообщение слишком длинное" })
            .optional()
            .nullable(),

        disabled: z.boolean(),

        template: z.string().nullable(),
    }),
)


