import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { maxTitleLength } from "@v/profile/tickets/list/definitions/tickets-list"
import {
    PartnerIdSchema,
    RequiredMessageSchema,
} from "@v/profile/tickets/schemas/ticket.schema"
import { DepartmentType } from "@/shared/department/department"

export const FormSchema = toTypedSchema(
    z.object({
        partner_id: PartnerIdSchema,
        message:    RequiredMessageSchema,
        files:      FilesSchema,

        title: z.string()
            .min(3, { message: "Минимальная длина 3 символа" })
            .max(maxTitleLength, { message: `Максимальная длина ${maxTitleLength} символов` })
            .nonempty(),

        department: z.nativeEnum(DepartmentType, { message: "Выберите отдел" }),

        type: z.enum(TicketType),
    }),
)
