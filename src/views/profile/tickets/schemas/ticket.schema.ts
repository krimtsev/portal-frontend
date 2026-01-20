import * as z from "zod"
import { reg } from "@/lib/validator"

export const TitleSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(125, { message: "Максимальная длина 100 символов" })
    .nonempty()

export const NameSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(125, { message: "Максимальная длина 100 символов" })
    .nonempty()

export const MessageSchema = z.string()
    .max(500, { message: "Сообщениеи слишком длиннкое" })
    .optional()

export const RequiredMessageSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(500, { message: "Сообщениеи слишком длиннкое" })

export const PartnerIdSchema =  z.number({ message: "Выберите филиал" })

export const CategoryIdSchema = z.number({ message: "Выберите отдел" })

export const EmployeeNameSchema = z.string()
    .min(1, { message: "Введите имя сотрудника" })

export const EmploymentDurationSchema = z.string()
    .min(1, { message: "Укажите стаж работы в филиале" })

export const EmploymentStatisticsSchema = z.string()
    .min(1, { message: "Укажите статистику" })

export const UrlSchema = z
    .url({ message: "Укажите правильный формат URL" })

export const UrlSchemaOptional = z.union([
    z.string().url({ message: "Укажите правильный формат URL" }),
    z.literal(""),
    z.undefined()
])

export const PhoneSchema = z.string()
    .regex(reg.mobileTelnum, "Некорректный номер телефона")
    .optional()

export const CodeSchema =  z.string({ message: "Укажите код сертификата" })

export const PaymentDateSchema = z.date({ message: "Укажите дату списания" })
    .transform((date) => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d
    })

export const SumSchema =  z.number({ message: "Укажите сумму списания" })
