import * as z from "zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import {
    MessageSchema,
    PartnerIdSchema,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"

const AttributesSchema = z.object({
    name: z.string()
        .min(1, { message: "Введите имя сотрудника" }),

    sum: z.number({ message: "Укажите сумму списания" }),

    paymentDate: z.date({ message: "Укажите дату списания" })
        .transform((date) => {
            const d = new Date(date)
            d.setHours(0, 0, 0, 0)
            return d
        }),

    code: z.string({ message: "Укажите код сертификата" }),
})

export const FormSchema = toTypedSchema(
    z.object({
        attributes: AttributesSchema,
        message:    MessageSchema,
        partner_id: PartnerIdSchema,
        files:      FilesSchema,
    }),
)
