import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { TicketState, TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { FilesSchema } from "@v/profile/tickets/schemas/ticket.schema"

export const ticketSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        type: z.nativeEnum(TicketType, { message: "Выберите отдел" }),

        partner_id: z.number()
            .nullable(),

        category_id: z.number(),

        state: z.nativeEnum(TicketState, { message: "Выберите статус" }),

        message: z.string()
            .max(500, { message: "Сообщение слишком длинное" })
            .optional(),

        files: FilesSchema
    })
)
