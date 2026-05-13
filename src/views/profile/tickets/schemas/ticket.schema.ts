import * as z from "zod"
import { maxMessageLength, maxTitleLength } from "@/constants/messages"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"

/** General schema **/

export const PartnerIdSchema = z.number({ message: "Выберите филиал" })

export const MessageSchema = z.string()
    .max(maxMessageLength, { message: "Сообщениеи слишком длиннкое" })
    .optional()

export const RequiredMessageSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(maxMessageLength, { message: "Сообщениеи слишком длиннкое" })

export const UrlSchema = z
    .url({ message: "Укажите правильный формат URL" })

export const UrlSchemaOptional = z.union([
    z.string().url({ message: "Укажите правильный формат URL" }),
    z.literal(""),
    z.undefined(),
])

export const TitleSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(maxTitleLength, { message: `Максимальная длина ${maxTitleLength} символов` })
    .nonempty()

export const DepartmentIdSchema = z.number({ message: "Выберите отдел" })

export const TypeSchema = z.enum(TicketType)
