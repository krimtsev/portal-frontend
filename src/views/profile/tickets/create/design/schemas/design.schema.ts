import * as z from "zod"
import { reg } from "@/lib/validator"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { maxMessageLengthShort, maxTitleLength } from "@v/profile/tickets/list/definitions/tickets-list"
import {
    MessageSchema,
    PartnerIdSchema,
    UrlSchema,
    UrlSchemaOptional,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"

const AttributesSchema = z.object({
    name: z.string()
        .min(3, { message: "Минимальная длина 3 символа" })
        .max(maxTitleLength, { message: `Максимальная длина ${maxTitleLength} символов` })
        .nonempty(),

    phone: z.string()
        .regex(reg.mobileTelnum, "Некорректный номер телефона")
        .optional(),

    website:      UrlSchema,
    registration: UrlSchema,
    yandexMap:    UrlSchema,
    twoGisMap:    UrlSchema,
    instagram:    UrlSchemaOptional,
    telegram:     UrlSchemaOptional,
    format:       z.string().max(maxMessageLengthShort, { message: "Сообщение слишком длинное" }),
    promotion:    z.string().max(maxMessageLengthShort, { message: "Сообщение слишком длинное" }),
})

export const FormSchema = toTypedSchema(
    z.object({
        attributes: AttributesSchema,
        message:    MessageSchema,
        partner_id: PartnerIdSchema,
        files:      FilesSchema,
    }),
)
