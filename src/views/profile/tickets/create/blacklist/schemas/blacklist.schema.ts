import * as z from "zod"
import { reg } from "@/lib/validator"
import {
    FilesSchema,
    MessageSchema,
    PartnerIdSchema,
} from "@v/profile/tickets/schemas/ticket.schema"


const AttributesSchema = z.object({
    name: z.string()
        .min(1, { message: "Введите имя сотрудника" }),

    duration: z.string()
        .min(1, { message: "Укажите стаж работы в филиале" }),

    phone: z.string()
        .regex(reg.mobileTelnum, "Некорректный номер телефона")
        .optional(),
})

export const FormSchema = z.object({
    attributes:  AttributesSchema,
    message:     MessageSchema,
    partner_id:  PartnerIdSchema,
    files:       FilesSchema,
})

export type FormSchemaType = z.infer<typeof FormSchema>
