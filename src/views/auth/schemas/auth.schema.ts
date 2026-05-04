import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const AuthSchema = toTypedSchema(
    z.object({
        login: z.string()
            .min(1, { message: "Введите логин." }),

        password: z.string()
            .min(1, { message: "Введите пароль." }),
    }),
)
