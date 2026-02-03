import * as z from "zod"
import {
    FilesSchema,
    MessageSchema,
    PartnerIdSchema
} from "@v/profile/tickets/schemas/ticket.schema"

export const AttributesSchema = z.object({
    returnRate: z.coerce
        .string()
        .min(1, { message: "Поле обязательно для заполнения" })
        .max(50, { message: "Максимальное значение 50" }),

    auditScore: z.coerce
        .string()
        .min(1, { message: "Поле обязательно для заполнения" })
        .max(50, { message: "Максимальное значение 50" }),

    mastersCount: z.coerce
        .string()
        .min(1, { message: "Поле обязательно для заполнения" })
        .max(50, { message: "Максимальное значение 50" }),

    cosmeticBrands: z.string()
        .min(1, { message: "Поле обязательно для заполнения" }),

    yandexMap: z.string()
        .url({ message: "Укажите правильный формат URL" }),

    twoGisMap: z.string()
        .url({ message: "Укажите правильный формат URL" }),

    openingDate: z.date({ message: "Укажите дату" })
        .transform((date) => {
            const d = new Date(date)
            d.setHours(0, 0, 0, 0)
            return d
        }),

    missedReports: z.string()
        .min(2, { message: "Опишите ситуацию с отчетами" })
})

export const FormSchema = z.object({
    attributes:  AttributesSchema,
    message:     MessageSchema,
    partner_id:  PartnerIdSchema,
    files:       FilesSchema,
})

export type FormSchemaType = z.infer<typeof FormSchema>
