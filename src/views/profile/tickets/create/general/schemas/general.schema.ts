import * as z from "zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import {
    CategoryIdSchema,
    MessageSchema,
    PartnerIdSchema,
    TitleSchema,
    TypeSchema,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"

export const FormSchema = toTypedSchema(
    z.object({
        title:       TitleSchema,
        category_id: CategoryIdSchema,
        type:        TypeSchema,
        partner_id:  PartnerIdSchema,
        message:     MessageSchema,
        files:       FilesSchema,
    }),
)

