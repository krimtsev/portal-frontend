import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { RequiredMessageSchema } from "@v/profile/tickets/schemas/ticket.schema"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"

export const FormSchema = toTypedSchema(
    z.object({
        message: RequiredMessageSchema,
        files:   FilesSchema,
    }),
)
