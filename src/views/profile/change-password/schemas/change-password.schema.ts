import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { isPassword } from "@/lib/validator"

export const UserPasswordSchema = toTypedSchema(
    z.object({
        password: z.string({ message: "Введите пароль." })
            .min(8, "Пароль должен содержать не менее 8 символов.")
            .refine((val) => isPassword(val), {
                message: "Пароль может состоять из букв, цифр и быть строкой без пробелов.",
            }),

        confirmPassword: z.string({ message: "Введите пароль." }),
    })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Пароли не совпадают.",
            path:    ["confirmPassword"],
        }),
)
