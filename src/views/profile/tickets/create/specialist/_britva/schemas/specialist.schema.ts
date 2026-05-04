import * as z from "zod"
import { reg } from "@/lib/validator"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { Qualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import {
    MessageSchema,
    PartnerIdSchema,
    UrlSchemaOptional,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"

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

export const FormSchema = toTypedSchema(
    z.object({
        attributes: AttributesSchema,
        message:    MessageSchema,
        partner_id: PartnerIdSchema,
        files:      FilesSchema,
    }),
)
