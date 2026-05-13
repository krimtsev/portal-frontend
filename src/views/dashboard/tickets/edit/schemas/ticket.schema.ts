import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { TicketState, TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { maxMessageLength } from "@/constants/messages"

export const TicketSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        type: z.enum(TicketType, { message: "Выберите тип заявки" }),

        partner_id: z.number()
            .nullable(),

        department_id: z.number({ message: "Выберите отдел" }),

        state: z.enum(TicketState, { message: "Выберите статус" }),

        message: z.string()
            .max(maxMessageLength, { message: "Сообщение слишком длинное" })
            .optional(),

        files: FilesSchema,
    }),
)
