import * as z from "zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { maxTitleLength } from "@v/profile/tickets/list/definitions/tickets-list"
import {
    MessageSchema,
    PartnerIdSchema,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"

export const FormSchema = toTypedSchema(
    z.object({
        partner_id: PartnerIdSchema,
        message:    MessageSchema,
        files:      FilesSchema,

        title: z.string()
            .min(3, { message: "Минимальная длина 3 символа" })
            .max(maxTitleLength, { message: `Максимальная длина ${maxTitleLength} символов` })
            .nonempty(),

        category_id: z.number({ message: "Выберите отдел" }),
    }),
)

