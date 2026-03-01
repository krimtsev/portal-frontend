import i18n from "@/plugins/i18n"

export const stateList: { id: boolean, name: string }[] = [
    {
        id:   false,
        name: i18n.global.t("mc.dashboard.partners.state.active"),
    },
    {
        id:   true,
        name: i18n.global.t("mc.dashboard.partners.state.disabled"),
    },
]
