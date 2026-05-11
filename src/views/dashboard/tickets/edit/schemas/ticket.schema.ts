import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { TicketState, TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"
import { DepartmentType } from "@/shared/department/department"

export const TicketSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        type: z.nativeEnum(TicketType, { message: "Выберите тип заявки" }),

        partner_id: z.number()
            .nullable(),

        department: z.nativeEnum(DepartmentType, { message: "Выберите отдел" }),

        state: z.nativeEnum(TicketState, { message: "Выберите статус" }),

        message: z.string()
            .max(maxMessageLength, { message: "Сообщение слишком длинное" })
            .optional(),

        files: FilesSchema,
    }),
)
