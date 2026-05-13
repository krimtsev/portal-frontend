import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { reg } from "@/lib/validator"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import {
    DepartmentIdSchema,
    MessageSchema,
    PartnerIdSchema,
    TitleSchema,
    TypeSchema,
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

export const FormSchema = toTypedSchema(
    z.object({
        title:         TitleSchema,
        department_id: DepartmentIdSchema,
        type:          TypeSchema,
        attributes:    AttributesSchema,
        message:       MessageSchema,
        partner_id:    PartnerIdSchema,
        files:         FilesSchema,
    }),
)
