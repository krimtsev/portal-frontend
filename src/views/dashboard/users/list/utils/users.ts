import { Roles } from "@/shared/roles/roles"
import i18n from "@/plugins/i18n"

export const stateList: { id: boolean, name: string }[] = [
    {
        id: false,
        name: i18n.global.t("mc.dashboard.users.state.active"),
    },
    {
        id: true,
        name: i18n.global.t("mc.dashboard.users.state.disabled"),
    },
]

export const rolesList: { id: Roles, name: string }[] = [
    {
        id: Roles.USER,
        name: i18n.global.t("mc.roles.user"),
    },
    {
        id: Roles.ADMIN,
        name: i18n.global.t("mc.roles.admin"),
    },
    {
        id: Roles.SYSADMIN,
        name: i18n.global.t("mc.roles.sysadmin"),
    },
]
