export interface PartnerNotificationChannel {
    send_telegram:    boolean
    telegram_chat_id: string
    check_payment:    boolean
    payment_date:     string
}

export interface PartnerReportSettings {
    lost_clients_days:     number
    returned_clients_days: number
    new_clients_days:      number
}

export interface PartnerNotificationData {
    name:                 string
    notification_channel: PartnerNotificationChannel
    report_settings:      PartnerReportSettings
}
