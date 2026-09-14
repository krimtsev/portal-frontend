import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { reg } from "@/lib/validator"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { AdminQualification } from "@v/profile/tickets/create/administrator/definitions/administrator"
import {
    DepartmentIdSchema,
    MessageSchema,
    PartnerIdSchema,
    TitleSchema,
    TypeSchema,
} from "@v/profile/tickets/schemas/ticket.schema"

const AttributesSchema = z.object({
    qualification: z.enum(AdminQualification),

    name: z.string()
        .min(1, { message: "Введите имя сотрудника" }),

    phone: z.string()
        .regex(reg.mobileTelnum, "Некорректный номер телефона")
        .optional(),

    experience: z.string()
        .min(1, { message: "Укажите стаж работы в филиале" }),
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
