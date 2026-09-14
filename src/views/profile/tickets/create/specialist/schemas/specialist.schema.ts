import * as z from "zod"
import { reg } from "@/lib/validator"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import {
    DepartmentIdSchema,
    MessageSchema,
    PartnerIdSchema,
    TitleSchema,
    TypeSchema,
    UrlSchemaOptional,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"
import type { Partner } from "@/definitions/partner"
import { getActiveQualifications } from "@v/profile/tickets/create/specialist/utils/specialist-utils"


export function createFormSchema(partner: Partner) {
    const activeQualifications = getActiveQualifications(partner)

    const AttributesSchema = z.object({
        qualification: z.enum(activeQualifications),

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

    return toTypedSchema(
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
}
