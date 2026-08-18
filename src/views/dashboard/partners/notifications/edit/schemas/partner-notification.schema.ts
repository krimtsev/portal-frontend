import * as z from "zod"
import { toTypedSchema } from "@vee-validate/zod"

const nullableString = z
    .string()
    .nullable()
    .optional()
    .transform((val) => val ?? "")

export const PartnerNotificationSchema = toTypedSchema(
    z.object({
        name: z.string(),

        notification_channel: z.object({
            send_telegram: z.boolean(),

            telegram_chat_id: nullableString,

            check_payment: z.boolean(),

            payment_date: nullableString,
        })
            .refine(
                (channel) => !channel.send_telegram || Boolean(channel.telegram_chat_id.trim()),
                {
                    message: "Укажите Telegram ID",
                    path:    ["telegram_chat_id"],
                })
            .refine(
                (channel) => !channel.check_payment || Boolean(channel.payment_date.trim()),
                {
                    message: "Укажите дату оплаты",
                    path:    ["payment_date"],
                }),

        report_settings: z.object({
            lost_clients_days: z.number({ message: "Поле обязательно для заполнения" })
                .min(0),

            returned_clients_days: z.number({ message: "Поле обязательно для заполнения" })
                .min(0),

            new_clients_days: z.number({ message: "Поле обязательно для заполнения" })
                .min(0),

            send_missed_calls: z.boolean(),
        }),
    }),
)
