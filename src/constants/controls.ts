import { Status } from "@/definitions/status"
import i18n from "@/plugins/i18n"

export const controlOptions: { id: string, name: string }[] = [
    {
        id:   Status.ACTIVE,
        name: i18n.global.t("mc.common.controls.enabled"),
    },
    {
        id:   Status.DISABLED,
        name: i18n.global.t("mc.common.controls.disabled"),
    },
]
