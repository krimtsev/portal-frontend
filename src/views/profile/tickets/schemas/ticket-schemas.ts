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

export const urlSchema = z
    .url({ message: "Укажите правильный формат URL" })

export const urlSchemaOptional = z.union([
    z.string().url({ message: "Укажите правильный формат URL" }),
    z.literal(""),
    z.undefined()
]);

export const phoneSchema = z.string()
    .regex(reg.mobileTelnum, "Некорректный номер телефона")
    .optional()

export const codeSchema =  z.string({ message: "Укажите код сертификата" })

export const paymentDateSchema = z.date({ message: "Укажите дату списания" })
    .transform((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    });

export const sumSchema =  z.number({ message: "Укажите сумму списания" })
