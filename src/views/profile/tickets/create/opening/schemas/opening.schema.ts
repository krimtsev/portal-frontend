import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import {
    DepartmentIdSchema,
    PartnerIdSchema,
    RequiredMessageSchema,
    TitleSchema,
    TypeSchema,
} from "@v/profile/tickets/schemas/ticket.schema"

export const FormSchema = toTypedSchema(
    z.object({
        title:         TitleSchema,
        department_id: DepartmentIdSchema,
        type:          TypeSchema,
        partner_id:    PartnerIdSchema,
        message:       RequiredMessageSchema,
        files:         FilesSchema,
    }),
)
