import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const BankDetailSchema = toTypedSchema(
    z.object({
        entrepreneur_name: z.string()
            .trim()
            .min(1, { message: "Укажите ФИО предпринимателя" }),

        inn: z.string()
            .trim()
            .refine(
                (val) => val === "" || /^\d{12}$/.test(val),
                { message: "ИНН должен содержать 12 цифр" },
            ),

        checking_account: z.string()
            .trim()
            .refine(
                (val) => val === "" || /^\d{20}$/.test(val),
                { message: "Расчетный счет должен содержать 20 цифр" },
            ),

        bank_name: z.string()
            .trim()
            .min(1, { message: "Укажите наименование банка" }),

        bik: z.string()
            .trim()
            .refine(
                (val) => val === "" || /^\d{9}$/.test(val),
                { message: "БИК должен содержать 9 цифр" },
            ),

        correspondent_account: z.string()
            .trim()
            .refine(
                (val) => val === "" || /^\d{20}$/.test(val),
                { message: "Корреспондентский счет должен содержать 20 цифр" },
            ),

        user_id: z.number()
            .nullable(),

        partner_id: z.number()
            .nullable(),
    }),
)


