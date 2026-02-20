import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { Roles } from "@/shared/roles/roles"

const passwordSchema = z.string().min(8, { message: "Минимум 8 символов" })

export const userSchema = (isNew: boolean) => toTypedSchema(
    z.object({
        name: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        login: z.string()
            .min(3, { message: "Минимум 3 символов" })
            .regex(/^[a-zA-Z0-9]+$/, {
                message: "Логин может содержать только латинские буквы и цифры"
            }),

        password: isNew
            ? passwordSchema
            : passwordSchema.or(z.literal("")),

        role: z.nativeEnum(Roles, { message: "Выберите роль" }),

        email: z.string()
            .email({ message: "Неверный формат" })
            .or(z.literal("")),

        partner_id: z.number()
            .nullable(),

        disabled:   z.boolean(),
    })
)
