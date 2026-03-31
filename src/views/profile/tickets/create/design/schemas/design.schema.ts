import * as z from "zod"
import { reg } from "@/lib/validator"
import {
    PartnerIdSchema,
    MessageSchema,
    UrlSchema,
    UrlSchemaOptional
} from "@v/profile/tickets/schemas/ticket.schema"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import { messageLengthShort } from "@v/profile/tickets/list/definitions/tickets-list"

const AttributesSchema = z.object({
    name: z.string()
        .min(3, { message: "Минимальная длина 3 символа" })
        .max(125, { message: "Максимальная длина 125 символов" })
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
    format:       z.string().max(messageLengthShort, { message: "Сообщение слишком длинное" }),
    promotion:    z.string().max(messageLengthShort, { message: "Сообщение слишком длинное" }),
})

export const FormSchema = z.object({
    attributes:  AttributesSchema,
    message:     MessageSchema,
    partner_id:  PartnerIdSchema,
    files:       FilesSchema,
})

export type FormSchemaType = z.infer<typeof FormSchema>
