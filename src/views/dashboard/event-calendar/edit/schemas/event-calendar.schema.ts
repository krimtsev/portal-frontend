import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import {
    maxDescriptionLength,
    maxTitleLength,
} from "@/constants/messages"

export const EventCalendarSchema = toTypedSchema(
    z.object({
        title: z.string()
            .min(1, { message: "Поле обязательно для заполнения" })
            .max(maxTitleLength, { message: "Сообщение слишком длинное" }),

        description: z.string()
            .max(maxDescriptionLength, { message: "Сообщение слишком длинное" })
            .optional(),

        start_at: z
            .string()
            .min(1, "Укажите дату начала"),

        end_at: z.string()
            .min(1, "Укажите дату окончания"),

        department_id: z.number({ message: "Выберите отдел" })
            .nullable()
            .optional(),

        responsible_user_ids: z.array(z.number())
            .optional(),
    }).refine(
        (data) => {
            if (!data.start_at || !data.end_at) return true
            return new Date(data.end_at) >= new Date(data.start_at)
        },
        {
            message: "Дата окончания не может быть раньше даты начала",
            path:    ["end_at"],
        },
    ),
)
