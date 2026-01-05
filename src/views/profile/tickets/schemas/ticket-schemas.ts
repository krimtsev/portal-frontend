import * as z from "zod"
import { reg } from "@/lib/validator"

export const titleSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(125, { message: "Максимальная длина 100 символов" })
    .nonempty()

export const nameSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(125, { message: "Максимальная длина 100 символов" })
    .nonempty()

export const messageSchema = z.string()
    .max(500, { message: "Сообщениеи слишком длиннкое" })
    .optional()

export const requiredMessageSchema = z.string()
    .min(3, { message: "Минимальная длина 3 символа" })
    .max(500, { message: "Сообщениеи слишком длиннкое" })

export const partnerIdSchema =  z.number({ message: "Выберите филиал" })

export const categoryIdSchema = z.number({ message: "Выберите отдел" })

export const employeeNameSchema = z.string()
    .min(1, { message: "Введите имя сотрудника" })

export const employmentDurationSchema = z.string()
    .min(1, { message: "Укажите стаж работы в филиале" })

export const employmentStatisticsSchema = z.string()
    .min(1, { message: "Укажите статистику" })

export const urlSchema = z.url({ message: "Укажите правильный формат URL" }).optional()

export const phoneSchema = z.string()
    .regex(reg.mobileTelnum, "Некорректный номер телефона")
    .optional()

export const codeSchema =  z.number({ message: "Укажите код сертификата" })

export const paymentDateSchema =  z.number({ message: "Укажите дату списания" })

export const sumSchema =  z.number({ message: "Укажите сумму списания" })
