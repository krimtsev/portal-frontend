import * as z from "zod"
import { reg } from "@/lib/validator"
import { Qualification } from "@v/profile/tickets/create/administrator/_britva/definitions/administrator"
import {
    PartnerIdSchema,
    MessageSchema,
    FilesSchema,
} from "@v/profile/tickets/schemas/ticket.schema"


const AttributesSchema = z.object({
    qualification: z.enum(Qualification),

    name: z.string()
        .min(1, { message: "Введите имя сотрудника" }),

    phone: z.string()
        .regex(reg.mobileTelnum, "Некорректный номер телефона")
        .optional(),

    experience: z.string()
        .min(1, { message: "Укажите стаж работы в филиале" }),
})

export const FormSchema = z.object({
    attributes:  AttributesSchema,
    message:     MessageSchema,
    partner_id:  PartnerIdSchema,
    files:       FilesSchema,
})

export type FormSchemaType = z.infer<typeof FormSchema>
