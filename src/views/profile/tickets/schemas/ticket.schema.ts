import * as z from "zod"
import { messageLength } from "@v/profile/tickets/list/definitions/tickets-list"

/** General schema **/

export const PartnerIdSchema =  z.number({ message: "Выберите филиал" })

export const MessageSchema = z.string()
    .max(messageLength, { message: "Сообщениеи слишком длиннкое" })
    .optional()

export const RequiredMessageSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(messageLength, { message: "Сообщениеи слишком длиннкое" })

export const UrlSchema = z
    .url({ message: "Укажите правильный формат URL" })

export const UrlSchemaOptional = z.union([
    z.string().url({ message: "Укажите правильный формат URL" }),
    z.literal(""),
    z.undefined()
])
