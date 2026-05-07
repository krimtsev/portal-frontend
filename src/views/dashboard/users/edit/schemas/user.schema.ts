import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import { Roles } from "@/shared/roles/roles"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"

const passwordSchema = z.string().min(8, { message: "Минимум 8 символов" })

export const UserSchema = (isNew: boolean) => toTypedSchema(
    z.object({
        name: z.string()
            .min(1, { message: "Поле обязательно для заполнения" }),

        login: z.string()
            .min(3, { message: "Минимум 3 символов" })
            .regex(/^[a-zA-Z0-9]+$/, {
                message: "Логин может содержать только латинские буквы и цифры",
            }),

        password: isNew
            ? passwordSchema
            : passwordSchema.or(z.literal("")),

        role: z.nativeEnum(Roles, { message: "Выберите роль" }),

        email: z.string()
            .email({ message: "Неверный формат" })
            .or(z.literal("")),

        notes: z.string()
            .max(maxMessageLength, { message: "Сообщение слишком длинное" })
            .optional(),

        partner_id: z.number()
            .nullable(),

        disabled: z.boolean(),

        access: z.object({
            location_map: z.boolean(),
        }),
    }),
)
