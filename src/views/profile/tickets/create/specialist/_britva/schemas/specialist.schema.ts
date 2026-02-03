import * as z from "zod"
import { reg } from "@/lib/validator"
import { Qualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import {
    PartnerIdSchema,
    MessageSchema,
    FilesSchema,
    UrlSchemaOptional
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

    statistics: z.string()
        .min(1, { message: "Укажите статистику" }),

    linkToWorks: UrlSchemaOptional,
})

export const FormSchema = z.object({
    attributes:  AttributesSchema,
    message:     MessageSchema,
    partner_id:  PartnerIdSchema,
    files:       FilesSchema,
})

export type FormSchemaType = z.infer<typeof FormSchema>
