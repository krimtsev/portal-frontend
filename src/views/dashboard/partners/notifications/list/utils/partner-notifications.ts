import { Status } from "@/definitions/status"
import i18n from "@/plugins/i18n"

export const receiveMessagesStateOptions: { id: string, name: string }[] = [
    {
        id:   Status.ACTIVE,
        name: i18n.global.t("mc.dashboard.partnerNotification.state.active"),
    },
    {
        id:   Status.DISABLED,
        name: i18n.global.t("mc.dashboard.partnerNotification.state.disabled"),
    },
]
