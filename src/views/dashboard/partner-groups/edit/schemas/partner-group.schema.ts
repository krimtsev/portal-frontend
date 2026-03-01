import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const PartnerGroupSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        partners: z.array(z.number())
    })
)


