import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { isIsoDate, reg } from "@/lib/validator"

const telnumZodSchema = z.object({
    id: z.number()
        .optional(),

    number: z.string()
        .regex(reg.mobileTelnum, "Некорректный номер телефона"),

    name: z.string()
        .optional(),
})

export const PartnerTelnumSchema = toTypedSchema(telnumZodSchema)

export const PartnerSchema = toTypedSchema(
    z.object({
        group_id: z.number()
            .nullable(),

        organization: z.string()
            .optional()
            .nullable(),

        inn: z.string()
            .optional()
            .nullable(),

        ogrnip: z.string()
            .optional()
            .nullable(),

        name: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        contract_number: z.string()
            .optional()
            .nullable(),

        email: z.preprocess(
            (val) => (val === "" ? null : val),
            z.string()
                .email({ message: "Неверный формат" })
                .nullable()
                .optional(),
        ),

        yclients_id: z.string()
            .optional()
            .nullable(),

        mango_telnum: z.string()
            .optional()
            .nullable(),

        address: z.string()
            .optional()
            .nullable(),

        start_at: z.preprocess(
            (val) => val === "" ? null : val,
            z.string()
                .nullable()
                .optional()
                .refine(
                    (val) => !val || isIsoDate(val),
                    { message: "Неверный формат даты" },
                ),
        ),

        disabled: z.boolean(),

        telnums: z.array(telnumZodSchema),
    }),
)


