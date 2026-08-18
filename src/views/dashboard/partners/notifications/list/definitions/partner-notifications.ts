export interface PartnerNotificationChannel {
    send_telegram:    boolean
    telegram_chat_id: string
    check_payment:    boolean
    payment_date:     string
    is_active_now:    boolean
}

export interface PartnerReportSettings {
    lost_clients_days:     number
    returned_clients_days: number
    new_clients_days:      number
    send_missed_calls:     boolean
}

export interface PartnerNotificationsListItem {
    id:                   number
    name:                 string
    yclients_id:          string
    status:               boolean
    notification_channel: PartnerNotificationChannel
    report_settings:      PartnerReportSettings
}


