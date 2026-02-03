import * as z from "zod"
import {
    PartnerIdSchema,
    MessageSchema,
    FilesSchema,
} from "@v/profile/tickets/schemas/ticket.schema"

export const FormSchema = z.object({
    partner_id:  PartnerIdSchema,
    message:     MessageSchema,
    files:       FilesSchema,

    title:       z.string()
        .min(3, { message: "Минимальная длина 3 символа" })
        .max(125, { message: "Максимальная длина 100 символов" })
        .nonempty(),

    category_id: z.number({ message: "Выберите отдел" }),

})

export type FormSchemaType = z.infer<typeof FormSchema>
