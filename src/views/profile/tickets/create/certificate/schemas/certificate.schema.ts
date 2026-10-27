import * as z from "zod"
import { FilesSchema } from "@c/common/b-upload-file/schemas/file-upload.schema"
import {
    DepartmentIdSchema,
    MessageSchema,
    PartnerIdSchema,
    TitleSchema,
    TypeSchema,
} from "@v/profile/tickets/schemas/ticket.schema"
import { toTypedSchema } from "@vee-validate/zod"

const BaseAttributesSchema = z.object({
    name: z.string()
        .min(1, { message: "Введите имя сотрудника" }),

    sum: z.number({ message: "Укажите сумму списания" }),

    paymentDate: z.date({ message: "Укажите дату списания" }),

    code: z.string()
        .min(1, { message: "Укажите код сертификата" }),
})

const BankDetailsSchema = z.object({
    entrepreneurName: z.string()
        .trim()
        .min(1, { message: "Укажите ФИО предпринимателя" }),

    inn: z.string()
        .trim()
        .regex(/^\d{12}$/, { message: "ИНН должен содержать 12 цифр" }),

    checkingAccount: z.string()
        .trim()
        .regex(/^\d{20}$/, { message: "Расчетный счет должен содержать 20 цифр" }),

    bankName: z.string()
        .trim()
        .min(1, { message: "Укажите наименование банка" }),

    bik: z.string()
        .trim()
        .regex(/^\d{9}$/, { message: "БИК должен содержать 9 цифр" }),

    correspondentAccount: z.string()
        .trim()
        .regex(/^\d{20}$/, { message: "Корреспондентский счет должен содержать 20 цифр" }),
})

export const createFormSchema = (isBankRequired: boolean) =>
    toTypedSchema(
        z.object({
            title:         TitleSchema,
            department_id: DepartmentIdSchema,
            type:          TypeSchema,
            attributes:    isBankRequired
                ? BaseAttributesSchema.extend(BankDetailsSchema.shape)
                : BaseAttributesSchema,
            message:    MessageSchema,
            partner_id: PartnerIdSchema,
            files:      FilesSchema,
        }),
    )
