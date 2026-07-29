import { Status } from "@/definitions/status.ts"
import i18n from "@/plugins/i18n.ts"

export const maintenanceStateOptions: { id: string, name: string }[] = [
    {
        id:   Status.ACTIVE,
        name: i18n.global.t("mc.dashboard.maintenance.state.enabled"),
    },
    {
        id:   Status.DISABLED,
        name: i18n.global.t("mc.dashboard.maintenance.state.disabled"),
    },
]
